# Clémi Raconte — site internet

Nouvelle version du site [clemiraconte.fr](https://clemiraconte.fr) : des histoires pour les 4-9 ans, écrites dans les Hautes-Alpes.

Site statique construit avec [Astro](https://astro.build). Aucun serveur ni base de données à maintenir.

## Lancer le site sur son ordinateur

Il faut Node.js 22 ou plus.

```bash
npm install
npm run dev
```

puis ouvrir http://localhost:4321

## Mise en ligne (Netlify)

Le fichier `netlify.toml` dit à Netlify comment construire le site : rien à régler à la main.
À chaque modification envoyée sur la branche `main`, Netlify reconstruit et publie le site.

Les adresses des pages sont les mêmes que sur l'ancien site (`familles.html`, `contact.html`…),
et les formulaires `reservation` et `contact` gardent les mêmes champs : les envois continuent
d'arriver dans Netlify, au même endroit qu'avant.

## Modifier les contenus

| Je veux changer… | Fichier |
| --- | --- |
| Passer du pré-lancement au lancement | `src/data/site.ts` → `prelancement: false` |
| Les formules et les prix | `src/data/formules.ts` |
| Les 3 formats, les 4 publics, les chiffres de l'accueil | `src/data/site.ts` |
| Les activités d'Ange (titres, durées, PDF) | `src/data/ange.ts` |
| Le texte d'Ange dans la liseuse (téléphone) | `src/data/textes/` |
| Les photos | `src/assets/photos/` (même nom de fichier = remplacement direct) |
| Les couleurs et les polices | `src/styles/global.css` |
| Une page | `src/pages/<nom-de-la-page>.astro` |

## Les PDF d'Ange

Les PDF sont dans `public/assets/pdf/`. Les pages d'Ange attendent aussi, par âge,
les fichiers `public/assets/pdf/ange/ange-4-6-….pdf` et `ange-7-9-….pdf`
(l'histoire, la fiche papote et chaque activité) : la liste exacte des noms est dans `src/data/ange.ts`.
Ces fichiers ne sont pas encore en ligne, ni sur l'ancien site ni sur celui-ci.

## La visionneuse

`public/js/visionneuse.js` (repris tel quel de l'ancien site) affiche les PDF page par page,
sans bouton de téléchargement, et ouvre l'histoire en liseuse sur téléphone. Elle utilise pdf.js.

## Charte

| Rôle | Couleur |
| --- | --- |
| Sapin (marque) | `#2D6A4F` |
| Crème (fond) | `#FBF3E3` |
| Beige (bandeaux) | `#EFE4CC` |
| Soleil (accent) | `#F4C430` |
| Encre (texte) | `#243B32` |

Polices : Fraunces (titres), Source Sans 3 (texte), Nunito Sans (boutons et étiquettes),
Caveat (notes manuscrites). Elles sont hébergées avec le site.

## Photos

Les photos actuelles sont provisoires, issues de Pexels (licence gratuite, usage commercial autorisé).
Les crédits sont dans la page Mentions légales. Elles seront remplacées par les photos de Clément
et les illustrations de l'illustratrice.

## Structure

```
src/
  data/               réglages, formules, contenus d'Ange
  styles/             charte graphique et visionneuse
  layouts/Base.astro  gabarit commun (en-tête, pied de page, référencement)
  components/         en-tête, pied de page, logo, bulles, crêtes, illustrations
  components/blocs/   blocs réutilisables (bandeaux, tuiles photo, formules, étapes…)
  pages/              une page = un fichier
public/               PDF, visionneuse, favicon, robots.txt, sitemap.xml, _headers
netlify.toml          réglages de construction pour Netlify
```

© Clémi Raconte. Tous droits réservés.
