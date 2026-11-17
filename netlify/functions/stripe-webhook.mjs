// POST /.netlify/functions/stripe-webhook
// Stripe prévient ici à chaque paiement ou résiliation. La fonction ouvre ou ferme l'accès dans Supabase.
// Le site ne fait AUCUNE facture : c'est Stripe qui les envoie.
//
// Réglages Stripe attendus (voir docs/espace-abonne.md) :
// - chaque prix a une « clé de recherche » (lookup key) égale à l'identifiant de la formule
//   dans src/data/formules.ts, par exemple famille-2-adaptations ;
// - le lien de la formule « Une adaptation » a un champ personnalisé « adaptation » (4-6 ou 7-9).
import Stripe from 'stripe';
import { supabaseAdmin, json } from './_commun.mjs';

const UN_AN = 365 * 24 * 60 * 60 * 1000;

export default async (req) => {
  if (req.method !== 'POST') return json(405, { erreur: 'methode' });
  const cle = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!cle || !secret) return json(503, { erreur: 'pas-branche' });

  const stripe = new Stripe(cle);
  const brut = await req.text();
  let ev;
  try {
    ev = await stripe.webhooks.constructEventAsync(brut, req.headers.get('stripe-signature'), secret);
  } catch {
    return json(400, { erreur: 'signature' });
  }

  const sb = supabaseAdmin();

  if (ev.type === 'checkout.session.completed') {
    const s = await stripe.checkout.sessions.retrieve(ev.data.object.id, { expand: ['line_items.data.price'] });
    if (s.payment_status !== 'paid' && s.payment_status !== 'no_payment_required') return json(200, { ok: 'en-attente' });
    const email = (s.customer_details?.email || '').toLowerCase();
    const formule = s.line_items?.data?.[0]?.price?.lookup_key;
    if (!email || !formule) return json(200, { ok: 'ignore', raison: 'email ou formule manquant' });

    let adaptations = ['4-6', '7-9'];
    if (formule === 'famille-1-adaptation') {
      const champ = (s.custom_fields || []).find((c) => c.key === 'adaptation');
      const v = champ?.dropdown?.value || '';
      adaptations = [v.includes('7') ? '7-9' : '4-6'];
    }
    const debut = new Date();
    const auMois = s.mode === 'subscription';
    const { error } = await sb.from('periodes').upsert({
      email, formule, adaptations,
      debut: debut.toISOString(),
      fin: auMois ? null : new Date(debut.getTime() + UN_AN).toISOString(), // annuel : un an, pas de reconduction tacite
      stripe_session: s.id,
      stripe_abonnement: auMois ? s.subscription : null,
    }, { onConflict: 'stripe_session', ignoreDuplicates: true });
    if (error) return json(500, { erreur: 'base' }); // Stripe réessaiera
    return json(200, { ok: 'ouvert' });
  }

  if (ev.type === 'customer.subscription.deleted') {
    const sub = ev.data.object;
    const fin = new Date((sub.ended_at || sub.canceled_at || Date.now() / 1000) * 1000).toISOString();
    const { error } = await sb.from('periodes').update({ fin }).eq('stripe_abonnement', sub.id).is('fin', null);
    if (error) return json(500, { erreur: 'base' });
    return json(200, { ok: 'ferme' });
  }

  return json(200, { ok: 'ignore' });
};
