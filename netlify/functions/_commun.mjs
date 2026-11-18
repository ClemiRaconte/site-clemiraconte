// Outils partagés par les fonctions de l'espace abonné. Aucune clé ici : tout vient
// des variables d'environnement Netlify (Site configuration > Environment variables).
import { createClient } from '@supabase/supabase-js';

export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const cle = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !cle) throw new Error('SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquante dans Netlify');
  return createClient(url, cle, { auth: { persistSession: false } });
}

export const json = (statut, corps) =>
  new Response(JSON.stringify(corps), { status: statut, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

/** Règle d'accès validée le 06/11/2026 :
 *  une histoire est ouverte si elle est offerte, ou si elle est sortie
 *  pendant une période où l'abonnement était actif (pas de rétroactivité),
 *  et elle reste ouverte après l'arrêt. */
export function adaptationsOuvertes(histoire, periodes, maintenant = new Date()) {
  const sortie = new Date(histoire.date_sortie);
  if (histoire.offerte) return ['4-6', '7-9'];
  if (sortie > maintenant) return [];
  const ages = new Set();
  for (const p of periodes) {
    const debut = new Date(p.debut);
    const fin = p.fin ? new Date(p.fin) : null;
    if (sortie >= debut && (!fin || sortie <= fin)) p.adaptations.forEach((a) => ages.add(a));
  }
  return [...ages];
}
