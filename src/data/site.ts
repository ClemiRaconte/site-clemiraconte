/**
 * Réglages et contenus partagés du site.
 * Pour basculer au lancement : passer `prelancement` à false.
 */
export const site = {
  nom: 'Clémi Raconte',
  email: 'contact@clemiraconte.fr',
  lieu: 'Saint-Bonnet-en-Champsaur (05)',
  conteur: 'Clément Joubert',
  prelancement: true,
  lancement: 'le samedi 12 décembre',
  /** Date et heure de la première histoire (heure de Paris), pour le compte à rebours */
  lancementISO: '2026-12-12T09:00:00',
  /** Logo retenu : le livre-sapin */
  logo: 'livre' as 'luciole' | 'livre' | 'bulle',
};

/**
 * Saisons du site. Dates de début (mois-jour) :
 * été 15 juin → 31 août · automne 1er septembre → 30 novembre · hiver 1er décembre → 31 mars · printemps 1er avril → 14 juin.
 * `forcer` : '' (automatique), 'automne', 'hiver', 'printemps' ou 'ete'.
 * Pour prévisualiser une page : ajouter ?saison=hiver, ?moment=nuit ou ?evt=noel à son adresse.
 */
export const saisons = {
  actives: true,
  forcer: '' as '' | 'automne' | 'hiver' | 'printemps' | 'ete',
  debuts: { printemps: '04-01', ete: '06-15', automne: '09-01', hiver: '12-01' },
  /** Le soir commence à 19h et finit à 7h */
  soir: { debut: 19, fin: 7 },
  /** Rendez-vous : Noël et la rentrée (mois-jour inclus) ; le samedi de 9h à midi après le lancement */
  noel: { du: '12-01', au: '12-31' },
  rentree: { du: '08-20', au: '09-10' },
  /** Lumière tamisée : douce à partir de 19h, veilleuse à partir de 21h, jusqu'à 6h. Le bouton lune vaut pour la soirée */
  lumiere: { douce: 19, veilleuse: 21, matin: 6 },
};

export const navigation = [
  { label: 'Histoires', href: '/histoires' },
  {
    label: 'Pour qui ?',
    href: '/familles',
    enfants: [
      { label: 'Familles', href: '/familles' },
      { label: 'Enseignants', href: '/enseignants' },
      { label: 'Travailleurs sociaux', href: '/travailleurs-sociaux' },
      { label: 'CSE', href: '/cse' },
    ],
  },
  { label: 'Formules', href: '/abonnement' },
  { label: 'La démarche', href: '/demarche' },
  { label: 'Contact', href: '/contact' },
];

export const formats = [
  { photo: 'lire', icone: 'livre', titre: 'À lire', texte: 'L’adulte lit à voix haute, l’enfant écoute et imagine', note: 'zéro écran !' },
  { photo: 'ecouter', icone: 'casque', titre: 'À écouter', texte: 'Le podcast, pour la voiture ou les yeux fermés', note: 'en route' },
  { photo: 'regarder', icone: 'lecture', titre: 'À regarder', texte: 'La vidéo, racontée dans la forêt conteuse', note: 'tous ensemble' },
  { photo: 'papote', icone: 'bulle', titre: 'La fiche papote', texte: 'Des questions pour en discuter, sans faire la leçon', note: 'on en parle' },
  { photo: 'activites', icone: 'ciseaux', titre: '12 activités', texte: 'À imprimer : jeux, coloriages, théâtre d’ombres…', note: 'à garder' },
] as const;

export const publics = [
  {
    slug: 'familles',
    titre: 'Familles',
    accroche: 'Rien à préparer, juste à raconter',
    texte: 'Le soir, en voiture, ou quand un sujet du quotidien a besoin d’un coup de pouce',
    prix: 'dès 8 € / mois',
    photo: 'familles',
  },
  {
    slug: 'enseignants',
    titre: 'Enseignants',
    accroche: 'L’EMC clé en main, en 45 minutes',
    texte: 'Une histoire, sa fiche papote et 12 activités. De la grande section au CM1',
    prix: '60 € / an',
    photo: 'enseignants',
  },
  {
    slug: 'travailleurs-sociaux',
    titre: 'Travailleurs sociaux',
    accroche: 'Le récit comme support de médiation',
    texte: 'Estime de soi, émotions, lien, différence. En individuel ou en petit groupe',
    prix: '60 € / an',
    photo: 'travailleurs-sociaux',
  },
  {
    slug: 'cse',
    titre: 'CSE',
    accroche: 'Un cadeau sans aucune logistique',
    texte: 'Un an d’histoires pour les enfants du personnel. Je m’occupe de tout',
    prix: 'dès 40 € / famille / an',
    photo: 'cse',
  },
] as const;

export const chiffres = [
  { valeur: '52', unite: 'histoires par an', texte: 'Une nouvelle chaque samedi à 9h, toute l’année. La bibliothèque de la maison grandit semaine après semaine' },
  { valeur: '3', unite: 'formats par histoire', texte: 'À lire, à écouter, à regarder. Les trois arrivent en même temps : vous choisissez selon le moment' },
  { valeur: '2', unite: 'versions', texte: 'Le même récit écrit pour les 4-6 ans et pour les 7-9 ans. Chaque enfant de la fratrie a sa version' },
  { valeur: '12', unite: 'activités + 1 fiche papote', texte: 'Pour prolonger l’histoire après la lecture : jeux, coloriages, ateliers d’expression, questions graduées' },
  { valeur: '45', unite: 'minutes en classe', texte: 'Une séance d’EMC complète : 15 min d’histoire, 15 min d’échange, 15 min d’activité' },
  { valeur: '0', unite: 'méchant à vaincre', texte: 'La fin ne vient jamais d’un combat, mais d’une surprise ou d’un regard qui change. Et aucune morale imposée' },
];
