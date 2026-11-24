// Tâche planifiée Netlify (gratuite) : une petite lecture chaque jour dans Supabase,
// pour que le projet gratuit ne soit pas mis en pause pour inactivité (pause après 7 jours sans activité).
import { supabaseAdmin } from './_commun.mjs';

export default async () => {
  const { error } = await supabaseAdmin().from('histoires').select('slug').limit(1);
  console.log(error ? `Supabase : ${error.message}` : 'Supabase réveillé');
  return new Response(null, { status: error ? 500 : 204 });
};

export const config = { schedule: '@daily' };
