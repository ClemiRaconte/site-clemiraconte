// @ts-check
import { defineConfig } from 'astro/config';

// Site final : https://clemiraconte.fr (Netlify).
// Les pages sont générées en « familles.html », comme sur le site actuel, pour garder les mêmes adresses.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://clemiraconte.fr',
  base: process.env.BASE_PATH ?? '/',
  build: { format: 'file' },
  trailingSlash: 'ignore',
});
