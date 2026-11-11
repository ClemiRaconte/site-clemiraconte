/**
 * Lien interne : ajoute la base du site et l'extension .html (adresses du site actuel).
 * u('/familles') → /familles.html · u('/abonnement?formule=cse#reserver') → /abonnement.html?formule=cse#reserver
 */
export function u(chemin = '/'): string {
  if (/^(https?:|mailto:|tel:|#)/.test(chemin)) return chemin;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const m = chemin.match(/^([^?#]*)(.*)$/)!;
  let p = m[1].startsWith('/') ? m[1] : `/${m[1]}`;
  if (p !== '/' && !/\.[a-z0-9]+$/i.test(p)) p = `${p.replace(/\/$/, '')}.html`;
  return `${base}${p}${m[2]}` || '/';
}

/** Chemin de la page courante sans base ni extension, pour marquer le lien actif. */
export function cheminCourant(url: URL): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const p = url.pathname.replace(base, '').replace(/\.html$/, '').replace(/\/index$/, '/') || '/';
  return p;
}
