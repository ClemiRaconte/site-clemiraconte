/**
 * Liens de paiement Stripe : une seule source, une entrée par formule.
 * Clément les crée dans son tableau de bord Stripe (Liens de paiement) et colle ici l'adresse
 * (https://buy.stripe.com/...). Lien vide = le bouton garde l'ancien formulaire de réservation.
 * Ces liens sont publics : aucune clé secrète ici.
 * Dans Stripe, chaque prix porte une « clé de recherche » égale à l'identifiant ci-dessous,
 * et le lien a pour page de confirmation https://clemiraconte.fr/bienvenue.html
 * CSE et devis : pas de lien Stripe, facture Indy via le formulaire.
 */
export const liensStripe: Record<string, string> = {
  'famille-2-adaptations': 'https://buy.stripe.com/test_8x29ATada6gp3mi27OeME00',  // 60 € / an
  'famille-mois': 'https://buy.stripe.com/test_eVq9AT996cEN3mi7s8eME01',           // 8 € / mois (abonnement)
  'famille-2-acces': 'https://buy.stripe.com/test_bJeaEXfxu7kte0Wh2IeME02',        // 100 € / an
  'famille-3-acces': 'https://buy.stripe.com/test_5kQ7sLcligV3g945k0eME03',        // 120 € / an
  'famille-5-acces': 'https://buy.stripe.com/test_4gM3cvfxu0W52iedQweME04',        // 150 € / an
  'enseignant': 'https://buy.stripe.com/test_28E9ATgBy48haOK3bSeME05',             // 60 € / an
  'ecole': '',                  // 100 € / an
  'professionnel': 'https://buy.stripe.com/test_14A6oH0CA9sBg94dQweME06',          // 60 € / an
  'association': '',            // 100 € / an
};

/** Mention à afficher près des prix (franchise en base de TVA). */
export const mentionTva = 'Prix nets, TVA non applicable (franchise en base)';

/** Adresse du bouton d'une formule : Stripe si le lien existe, sinon la réservation. */
// Les liens de test (buy.stripe.com/test_…) ne servent que sur les versions d'essai Netlify.
// Sur le site en ligne (CONTEXT=production), ils sont ignorés : le bouton garde la réservation
// tant que les liens du mode réel ne sont pas collés ici.
const enLigne = process.env.CONTEXT === 'production';
export const lienFormule = (id: string, reservation: string) => {
  const lien = liensStripe[id];
  return lien && !(enLigne && lien.includes('/test_')) ? lien : reservation;
};
