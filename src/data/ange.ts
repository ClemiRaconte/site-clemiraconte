/** Ange, le loup qui chantait avec le vent : la séance vitrine, reprise du site actuel. */
export type Activite = { titre: string; type: string; duree: string; qui: string; materiel: string; pdf: string };

const pdf = (age: string, nom: string) => `/assets/pdf/ange/ange-${age}-${nom}.pdf`;

export const adaptations = [
  {
    age: '4-6',
    histoire: pdf('4-6', 'histoire'),
    papote: pdf('4-6', 'fiche-papote'),
    activites: [
      { titre: 'Le péglandque, le vrai', type: 'jeu de lancer', duree: '15 min', qui: 'seul(e) ou à plusieurs', materiel: 'des glands', pdf: pdf('4-6', '01-peglandque') },
      { titre: 'La voix dans la tempête', type: 'jeu signature', duree: '15 min', qui: 'à deux ou à plusieurs', materiel: 'des coussins', pdf: pdf('4-6', '02-jeu-signature') },
      { titre: 'Le concert de la forêt', type: 'jeu musical', duree: '15 min', qui: 'seul(e) ou à plusieurs', materiel: 'une feuille de papier', pdf: pdf('4-6', '03-concert-de-la-foret') },
      { titre: 'Le théâtre d’ombres du loup', type: 'théâtre d’ombres', duree: '20 min', qui: 'avec un adulte', materiel: 'lampe, drap, ciseaux, bâtonnets', pdf: pdf('4-6', '04-theatre-ombres') },
      { titre: 'Le chemin des AOUUU', type: 'labyrinthe', duree: '5 min', qui: 'en autonomie', materiel: 'un crayon', pdf: pdf('4-6', '05-labyrinthe') },
      { titre: 'Ange caché, Ange qui chante', type: 'coloriage', duree: '15 min', qui: 'en autonomie', materiel: 'des feutres', pdf: pdf('4-6', '06-coloriage') },
      { titre: 'La fête de Daillon', type: 'cherche et trouve', duree: '10 min', qui: 'en autonomie', materiel: 'un crayon', pdf: pdf('4-6', '07-cherche-et-trouve') },
      { titre: 'Mon cri à moi', type: 'jeu d’écoute', duree: '15 min', qui: 'à plusieurs', materiel: 'rien du tout', pdf: pdf('4-6', '08-mon-cri-a-moi') },
      { titre: 'Ma carte force', type: 'ma force cachée', duree: '10 min', qui: 'en autonomie', materiel: 'feutres, ciseaux', pdf: pdf('4-6', '09-ma-force-cachee') },
      { titre: 'Le permis de hurler', type: 'diplôme', duree: '10 min', qui: 'en autonomie', materiel: 'crayons, ciseaux, encre ou peinture', pdf: pdf('4-6', '10-diplome') },
      { titre: 'Le cri de la forêt', type: 'rituel', duree: '10 min', qui: 'seul(e) ou à plusieurs', materiel: 'juste après l’histoire', pdf: pdf('4-6', '11-cri-de-la-foret') },
      { titre: 'Le tri des émotions', type: 'tri des émotions', duree: '15 min', qui: 'avec un adulte', materiel: 'ciseaux, colle', pdf: pdf('4-6', '12-tri-des-emotions') },
    ],
    bonusIntro: 'Quatre activités en plus, rien que pour Ange',
    bonus: [
      { titre: 'Les mots de la forêt', type: 'mots mêlés', duree: '10 min', qui: 'en autonomie', materiel: 'un crayon', pdf: pdf('4-6', 'bonus-1-mots-meles') },
      { titre: 'Cherche les 7 différences', type: 'jeu des différences', duree: '10 min', qui: 'en autonomie', materiel: 'un crayon', pdf: pdf('4-6', 'bonus-2-jeu-des-differences') },
      { titre: 'L’histoire dans l’ordre', type: 'vignettes', duree: '15 min', qui: 'avec un adulte', materiel: 'ciseaux, colle', pdf: pdf('4-6', 'bonus-3-vignettes') },
      { titre: 'L’interview d’Ange', type: 'interview', duree: '10 min', qui: 'à deux ou à plusieurs', materiel: 'un micro pour de faux', pdf: pdf('4-6', 'bonus-4-interview') },
    ],
  },
  {
    age: '7-9',
    histoire: pdf('7-9', 'histoire'),
    papote: pdf('7-9', 'fiche-papote'),
    activites: [
      { titre: 'Le labyrinthe de la tempête', type: 'labyrinthe', duree: '5 min', qui: 'en autonomie', materiel: 'un crayon', pdf: pdf('7-9', '01-labyrinthe') },
      { titre: 'Les bruits de Daillon', type: 'mots mêlés', duree: '10 min', qui: 'en autonomie', materiel: 'un crayon', pdf: pdf('7-9', '02-mots-meles') },
      { titre: 'La nuit de la tempête', type: 'coloriage', duree: '20 min', qui: 'en autonomie', materiel: 'des feutres ou des crayons', pdf: pdf('7-9', '03-coloriage') },
      { titre: 'La fête de Daillon', type: 'cherche et trouve', duree: '15 min', qui: 'en autonomie', materiel: 'un crayon', pdf: pdf('7-9', '04-cherche-et-trouve') },
      { titre: 'Le péglandque, le vrai', type: 'jeu de lancer', duree: '20 min', qui: 'seul(e) ou à plusieurs', materiel: 'des glands', pdf: pdf('7-9', '05-peglandque') },
      { titre: 'La voix dans la tempête', type: 'jeu signature', duree: '20 min', qui: 'à deux ou à plusieurs', materiel: 'des coussins', pdf: pdf('7-9', '06-jeu-signature') },
      { titre: 'Le concert de la forêt', type: 'jeu musical', duree: '15 min', qui: 'seul(e) ou à plusieurs', materiel: 'une feuille de papier', pdf: pdf('7-9', '07-concert-de-la-foret') },
      { titre: 'Ma carte force', type: 'ma force cachée', duree: '10 min', qui: 'en autonomie', materiel: 'feutres, ciseaux', pdf: pdf('7-9', '08-ma-force-cachee') },
      { titre: 'Le théâtre d’ombres du loup', type: 'théâtre d’ombres', duree: '25 min', qui: 'avec un adulte', materiel: 'lampe, drap, ciseaux, bâtonnets', pdf: pdf('7-9', '09-theatre-ombres') },
      { titre: 'Radio Daillon', type: 'interview', duree: '15 min', qui: 'à deux ou à plusieurs', materiel: 'un micro pour de faux', pdf: pdf('7-9', '10-interview') },
      { titre: 'Le baromètre du courage', type: 'baromètre', duree: '15 min', qui: 'en autonomie', materiel: 'ciseaux, colle', pdf: pdf('7-9', '11-barometre') },
      { titre: 'Le permis de hurler', type: 'diplôme', duree: '10 min', qui: 'en autonomie', materiel: 'crayons, ciseaux, encre ou peinture', pdf: pdf('7-9', '12-diplome') },
    ],
    bonusIntro: 'Trois activités en plus, rien que pour Ange',
    bonus: [
      { titre: 'Cherche les 12 différences', type: 'jeu des différences', duree: '15 min', qui: 'en autonomie', materiel: 'un crayon', pdf: pdf('7-9', 'bonus-1-jeu-des-differences') },
      { titre: 'L’histoire dans l’ordre', type: 'vignettes', duree: '15 min', qui: 'en autonomie', materiel: 'ciseaux, colle', pdf: pdf('7-9', 'bonus-2-vignettes') },
      { titre: 'Le cri de la forêt', type: 'respiration', duree: '10 min', qui: 'seul(e) ou à plusieurs', materiel: 'rien du tout', pdf: pdf('7-9', 'bonus-3-cri-de-la-foret') },
    ],
  },
];

export const videoAnge = 'https://www.youtube-nocookie.com/embed/n7nQT0v49cU';
