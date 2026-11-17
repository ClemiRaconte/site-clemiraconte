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
  'famille-1-adaptation': '',   // 50 € / an (champ personnalisé « adaptation » : 4-6 ans ou 7-9 ans)
  'famille-2-adaptations': '',  // 60 € / an
  'famille-mois': '',           // 8 € / mois (abonnement)
  'famille-2-acces': '',        // 100 € / an
  'famille-3-acces': '',        // 120 € / an
  'famille-5-acces': '',        // 150 € / an
  'enseignant': '',             // 60 € / an
  'ecole': '',                  // 100 € / an
  'professionnel': '',          // 60 € / an
  'association': '',            // 100 € / an
};

/** Mention à afficher près des prix (franchise en base de TVA). */
export const mentionTva = 'Prix nets, TVA non applicable (franchise en base)';

/** Adresse du bouton d'une formule : Stripe si le lien existe, sinon la réservation. */
export const lienFormule = (id: string, reservation: string) => liensStripe[id] || reservation;
