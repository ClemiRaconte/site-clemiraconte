/**
 * Formules et tarifs (prix de lancement), repris du site actuel.
 * Les identifiants sont ceux du formulaire de réservation Netlify : ne pas les changer.
 */
export type Formule = {
  id: string;
  public: 'familles' | 'enseignants' | 'sociaux' | 'cse';
  nom: string;
  prix: string;
  periode: string;
  texte: string;
  vedette?: boolean;
};

export const formules: Formule[] = [
  { id: 'famille-1-adaptation', public: 'familles', nom: 'Une adaptation', prix: '50 €', periode: '/ an', texte: 'Les histoires en 4-6 ans ou en 7-9 ans, au choix. Un accès' },
  { id: 'famille-2-adaptations', public: 'familles', nom: 'Les deux adaptations', prix: '60 €', periode: '/ an', texte: '4-6 ans et 7-9 ans : chaque enfant de la fratrie a sa version. Un accès', vedette: true },
  { id: 'famille-mois', public: 'familles', nom: 'Au mois', prix: '8 €', periode: '/ mois', texte: 'Un accès, sans engagement. Les histoires reçues pendant un mois payé restent à vous' },
  { id: 'enseignant', public: 'enseignants', nom: 'Un(e) enseignant(e)', prix: '60 €', periode: '/ an', texte: 'Un accès personnel. L’histoire se lit ou se projette depuis la visionneuse, les activités s’impriment' },
  { id: 'ecole', public: 'enseignants', nom: 'Toute l’école', prix: '100 €', periode: '/ an', texte: 'Toutes les classes de l’école. L’histoire et la fiche papote en PDF imprimables, avec une charte d’usage à signer. Facture au nom de l’école ou de la mairie', vedette: true },
  { id: 'professionnel', public: 'sociaux', nom: 'Un(e) professionnel(le)', prix: '60 €', periode: '/ an', texte: 'Un accès personnel, en individuel, en petit groupe ou en relais famille' },
  { id: 'association', public: 'sociaux', nom: 'Toute l’association', prix: '100 €', periode: '/ an', texte: 'Un accès partagé entre toutes les structures de l’association : foyers, MECS, IME, services', vedette: true },
];

/** Famille élargie : plusieurs foyers (grands-parents, nounou, l'autre maison). */
export const famillesElargies = [
  { id: 'famille-2-acces', nom: '2 accès', prix: '100 €' },
  { id: 'famille-3-acces', nom: '3 accès', prix: '120 €' },
  { id: 'famille-5-acces', nom: '5 accès', prix: '150 €' },
];

/** Barème CSE, prix par famille et par an. */
export const baremeCse = [
  { tranche: '2 à 9 familles', prix: '55 €' },
  { tranche: '10 à 49 familles', prix: '50 €' },
  { tranche: '50 à 99 familles', prix: '45 €' },
  { tranche: '100 familles et plus', prix: '40 €' },
];

export const publicsFormules = [
  { id: 'familles', nom: 'Familles', accroche: 'Rien à préparer, juste à raconter' },
  { id: 'enseignants', nom: 'Enseignants', accroche: 'L’EMC clé en main' },
  { id: 'sociaux', nom: 'Travailleurs sociaux', accroche: 'Un support de médiation clé en main' },
  { id: 'cse', nom: 'CSE', accroche: 'Un cadeau clé en main' },
] as const;

export const dansChaqueAbonnement = [
  'Une nouvelle histoire chaque samedi à 9h, à lire à voix haute depuis la visionneuse',
  'Sa fiche papote, pour en discuter avec l’enfant',
  'Ses 12 activités à explorer, à imprimer',
  'Le podcast et la vidéo de chaque histoire',
];

export const commentCaSePasse = [
  'L’histoire et sa fiche papote se lisent en ligne, dans une visionneuse, depuis votre espace abonné. Elles ne se téléchargent pas',
  'Les 12 activités se téléchargent et s’impriment',
  'Le podcast et la vidéo vous attendent aussi dans votre espace abonné',
];
