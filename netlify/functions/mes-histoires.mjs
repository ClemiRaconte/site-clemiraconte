// GET /.netlify/functions/mes-histoires
// Reçoit le jeton de connexion Supabase de l'abonné, renvoie sa formule
// et les histoires qu'il a le droit de lire, avec des liens de fichiers valables 1 heure.
import { supabaseAdmin, json, adaptationsOuvertes } from './_commun.mjs';

const DUREE_LIEN = 60 * 60; // secondes

export default async (req) => {
  const jeton = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  // Mode ouvert (avant le lancement) : variable Netlify PUBLIC_ESPACE_OUVERT=true.
  // Tout le monde voit les histoires déjà parues ; celles à venir apparaissent fermées, sans contenu.
  const ouvert = process.env.PUBLIC_ESPACE_OUVERT === 'true';
  if (!jeton && !ouvert) return json(401, { erreur: 'non-connecte' });

  let sb;
  try { sb = supabaseAdmin(); } catch { return json(503, { erreur: 'pas-branche' }); }

  let email = null;
  let periodes = [];
  if (jeton) {
    const { data: u, error: eu } = await sb.auth.getUser(jeton);
    if (eu || !u?.user?.email) { if (!ouvert) return json(401, { erreur: 'non-connecte' }); }
    else email = u.user.email.toLowerCase();
  }
  if (email) {
    const { data, error: ep } = await sb.from('periodes').select('formule, adaptations, debut, fin').ilike('email', email).order('debut');
    if (ep) return json(500, { erreur: 'base' });
    periodes = data;
  }

  const { data: histoires, error: eh } = await sb.from('histoires').select('*').order('date_sortie', { ascending: false });
  if (eh) return json(500, { erreur: 'base' });

  const signer = async (chemin) => {
    if (!chemin || chemin.startsWith('/') || chemin.startsWith('http')) return chemin; // fichier public (Ange)
    const { data } = await sb.storage.from('histoires').createSignedUrl(chemin, DUREE_LIEN);
    return data?.signedUrl ?? null;
  };

  const maintenant = new Date();
  const bibliotheque = [];
  for (const h of histoires) {
    const parue = new Date(h.date_sortie) <= maintenant;
    const ages = ouvert && !email ? (parue ? ['4-6', '7-9'] : []) : adaptationsOuvertes(h, periodes, maintenant);
    if (!ages.length) {
      if (ouvert && !parue) bibliotheque.push({ slug: h.slug, titre: h.titre, theme: h.theme, date_sortie: h.date_sortie, a_venir: true, adaptations: {} });
      continue;
    }
    const adaptations = {};
    for (const age of ages) {
      const c = h.contenu?.[age];
      if (!c) continue;
      adaptations[age] = {
        texte: c.texte ?? null,
        histoire: await signer(c.histoire),
        papote: await signer(c.papote),
        activites: await Promise.all((c.activites ?? []).map(async (a) => ({ ...a, pdf: await signer(a.pdf) }))),
        bonus: await Promise.all((c.bonus ?? []).map(async (a) => ({ ...a, pdf: await signer(a.pdf) }))),
      };
    }
    bibliotheque.push({ slug: h.slug, titre: h.titre, theme: h.theme, date_sortie: h.date_sortie, offerte: h.offerte, video: h.contenu?.video ?? null, audio: h.contenu?.audio ?? null, adaptations });
  }

  const actives = periodes.filter((p) => !p.fin || new Date(p.fin) > maintenant);
  return json(200, { email, ouvert, abonne: actives.length > 0, periodes, bibliotheque });
};
