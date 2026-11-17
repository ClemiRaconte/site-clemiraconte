/**
 * Connexion des abonnés (navigateur). Lien de connexion par email, sans mot de passe, via Supabase.
 * Les deux valeurs PUBLIC_ sont publiques par nature (clé « anon ») : elles se règlent dans Netlify.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const cle = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

export const branche = Boolean(url && cle);
export const sb: SupabaseClient | null = branche ? createClient(url!, cle!) : null;

/** Envoie le lien de connexion. L'adresse de retour doit être autorisée dans Supabase (Redirect URLs). */
export async function envoyerLien(email: string, retour: string) {
  if (!sb) return { erreur: 'pas-branche' };
  try {
    const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: retour } });
    return error ? { erreur: `${error.status ?? ''} ${error.message}`.trim() } : {};
  } catch (e) {
    return { erreur: e instanceof Error ? e.message : String(e) };
  }
}

/** Bibliothèque de l'abonné connecté, calculée côté serveur (règle d'accès par dates). */
export async function maBibliotheque() {
  if (!sb) return { erreur: 'pas-branche' as const };
  const { data } = await sb.auth.getSession();
  const jeton = data.session?.access_token;
  if (!jeton) return { erreur: 'non-connecte' as const };
  const r = await fetch('/.netlify/functions/mes-histoires', { headers: { authorization: `Bearer ${jeton}` } });
  if (r.status === 401) return { erreur: 'non-connecte' as const };
  if (!r.ok) return { erreur: 'serveur' as const };
  return { donnees: await r.json() };
}
