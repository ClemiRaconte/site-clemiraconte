import type { ImageMetadata } from 'astro';

/** Photos libres de droits (Pexels) en attendant les photos et illustrations de Clémi Raconte. */
const fichiers = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.jpg', { eager: true });

export function photo(nom: string): ImageMetadata {
  const f = fichiers[`../assets/photos/${nom}.jpg`];
  if (!f) throw new Error(`Photo introuvable : ${nom}`);
  return f.default;
}

/** Crédits, affichés dans les mentions légales. */
export const credits = [
  { nom: 'montagnes-brume', auteur: 'Johannes Plenio', url: 'https://www.pexels.com/photo/13534013/' },
  { nom: 'vallee', auteur: 'Pexels', url: 'https://www.pexels.com/photo/707344/' },
  { nom: 'lire', auteur: 'Pavel Danilyuk', url: 'https://www.pexels.com/photo/7938250/' },
  { nom: 'ecouter', auteur: 'jonas mohamadi', url: 'https://www.pexels.com/photo/1490844/' },
  { nom: 'regarder', auteur: 'Pavel Danilyuk', url: 'https://www.pexels.com/photo/9143869/' },
  { nom: 'papote', auteur: 'Kampus Production', url: 'https://www.pexels.com/photo/7078729/' },
  { nom: 'activites', auteur: 'Vlada Karpovich', url: 'https://www.pexels.com/photo/7025515/' },
  { nom: 'familles', auteur: 'Tima Miroshnichenko', url: 'https://www.pexels.com/photo/4908531/' },
  { nom: 'enseignants', auteur: 'Yan Krukau', url: 'https://www.pexels.com/photo/8613089/' },
  { nom: 'travailleurs-sociaux', auteur: 'Anastasia Shuraeva', url: 'https://www.pexels.com/photo/8466772/' },
  { nom: 'cse', auteur: 'Nati', url: 'https://www.pexels.com/photo/19283496/' },
  { nom: 'loup', auteur: 'Caleb Falkenhagen', url: 'https://www.pexels.com/photo/27067812/' },
];
