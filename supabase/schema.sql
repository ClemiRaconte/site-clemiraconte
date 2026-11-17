-- Espace abonné Clémi Raconte : base Supabase.
-- À coller une seule fois dans Supabase > SQL Editor > New query > Run.

-- Une ligne par période d'abonnement payée (un abonné peut en avoir plusieurs : il arrête puis revient).
create table if not exists public.periodes (
  id bigint generated always as identity primary key,
  email text not null,                       -- l'adresse avec laquelle l'abonné se connecte
  formule text not null,                     -- identifiant de src/data/formules.ts (ex. famille-2-adaptations)
  adaptations text[] not null default '{4-6,7-9}', -- adaptations ouvertes : 4-6, 7-9 ou les deux
  debut timestamptz not null default now(),
  fin timestamptz,                           -- vide = en cours (au mois, jusqu'à la résiliation)
  stripe_session text unique,                -- évite d'enregistrer deux fois le même paiement
  stripe_abonnement text,                    -- abonnement Stripe (formule au mois uniquement)
  note text,                                 -- libre : « ajouté à la main », « accès offert », etc.
  cree_le timestamptz not null default now()
);
create index if not exists periodes_email on public.periodes (lower(email));

-- Une ligne par histoire. Les fichiers privés vont dans le stockage « histoires ».
create table if not exists public.histoires (
  slug text primary key,                     -- ex. ange-le-loup
  titre text not null,
  theme text,
  date_sortie timestamptz not null,          -- samedi 9h, heure de Paris
  offerte boolean not null default false,    -- true = visible par tous les abonnés, quelle que soit la date
  contenu jsonb not null                     -- par adaptation : texte, fichiers, activités (voir ange.sql)
);

-- Personne ne lit ces tables directement depuis le navigateur :
-- seules les fonctions Netlify (clé secrète) y accèdent.
alter table public.periodes enable row level security;
alter table public.histoires enable row level security;

-- Stockage privé des PDF (histoires, fiches papote, activités).
insert into storage.buckets (id, name, public) values ('histoires', 'histoires', false)
on conflict (id) do nothing;
