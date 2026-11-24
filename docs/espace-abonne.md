# Espace abonné : comment ça marche et ce qu'il reste à régler

## Le parcours d'un abonné

1. Il choisit sa formule et paie sur Stripe (liens de paiement, prochaine étape).
2. Stripe prévient le site (fonction `stripe-webhook`). Le site enregistre une « période » dans Supabase : son email, sa formule, ses adaptations, la date de début et la date de fin (ouverte tant que l'abonnement, au mois ou à l'année, est renouvelé ; fermée quand il s'arrête).
3. Stripe lui envoie son reçu. Le site ne fait aucune facture.
4. Il va sur `/connexion`, tape son email et reçoit un lien. Pas de mot de passe.
5. Le lien l'amène sur `/mon-espace` : sa bibliothèque, calculée par la fonction `mes-histoires` selon la règle validée le 06/11 (histoires sorties pendant son abonnement actif, pas de rétroactivité, il les garde après l'arrêt). Ange est offert à tous.
6. Les PDF privés sont donnés avec des liens qui expirent au bout d'une heure : on ne peut pas les partager durablement.
7. « Gérer mon abonnement » ouvre le portail client Stripe (factures, carte, arrêt du mois).

`/espace-abonne` reste la visite de démonstration.

## Ce que Clément fait lui-même (une seule fois)

### Supabase (gratuit)
1. Créer un compte sur supabase.com, puis un projet (région Europe, Paris ou Francfort).
2. SQL Editor > New query : coller `supabase/schema.sql`, Run. Puis `supabase/ange.sql`, Run.
3. Authentication > URL Configuration : Site URL `https://clemiraconte.fr`, et dans Redirect URLs ajouter `https://clemiraconte.fr/mon-espace.html`.
4. Authentication > Emails > Magic Link : remplacer le texte anglais (proposition plus bas).
5. Important : l'envoi d'emails inclus dans Supabase est limité à quelques messages par heure, juste pour tester. Avant le lancement, brancher un envoi d'emails (Authentication > Emails > SMTP), par exemple Brevo (gratuit jusqu'à 300 emails par jour).
6. Project Settings > API : noter `Project URL`, la clé `anon` (publique) et la clé `service_role` (SECRÈTE, ne jamais la mettre dans GitHub).

### Netlify (Site configuration > Environment variables)
| Nom | Valeur | Secrète ? |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | Project URL de Supabase | non |
| `PUBLIC_SUPABASE_ANON_KEY` | clé anon | non |
| `SUPABASE_URL` | Project URL de Supabase | non |
| `SUPABASE_SERVICE_ROLE_KEY` | clé service_role | **oui** |
| `STRIPE_SECRET_KEY` | Stripe > Développeurs > Clés API (sk_...) | **oui** |
| `STRIPE_WEBHOOK_SECRET` | donné à l'étape Stripe ci-dessous (whsec_...) | **oui** |
| `PUBLIC_STRIPE_PORTAIL` | lien du portail client Stripe | non |

Puis relancer un déploiement. Tant que ces valeurs manquent, les pages affichent « l'espace ouvre avec les premières histoires » : rien ne casse.

### Stripe
1. Sur chaque prix, mettre la clé de recherche (lookup key) égale à l'identifiant de la formule : `famille-2-adaptations`, `famille-mois`, `famille-2-acces`, `famille-3-acces`, `famille-5-acces`, `enseignant`, `ecole`, `professionnel`, `association`.
2. Développeurs > Webhooks > Ajouter : adresse `https://clemiraconte.fr/.netlify/functions/stripe-webhook`, événements `checkout.session.completed` et `customer.subscription.deleted`. Copier le secret whsec_ dans Netlify.
3. Paramètres > Portail client : l'activer et copier son lien de connexion dans `PUBLIC_STRIPE_PORTAIL`.

### Tester sans paiement
Dans Supabase > Table Editor > `periodes` > Insert row : son propre email, formule `famille-2-adaptations`, debut aujourd'hui, fin dans un an. Puis se connecter sur `/connexion`.

### Ajouter une histoire
1. Storage > `histoires` : déposer les PDF, par exemple `la-suivante/4-6/histoire.pdf`.
2. Table `histoires` : une ligne avec sa date de sortie (samedi 9h) sur le modèle de `supabase/ange.sql`.

## Texte proposé pour l'email de connexion
Objet : Votre lien pour entrer dans votre espace Clémi Raconte

> Bonjour,
>
> Voici votre lien pour ouvrir votre bibliothèque : <a href="{{ .ConfirmationURL }}">entrer dans mon espace</a>
>
> Il fonctionne une seule fois et pendant une heure. Si vous n'avez rien demandé, ignorez simplement ce message.
>
> À très vite pour une nouvelle histoire,
> Clémi

## Non traité ici
- Famille élargie (2, 3 ou 5 accès) : le paiement ouvre l'accès du payeur. Les autres adresses s'ajoutent pour l'instant à la main dans `periodes`.
- CSE et devis : facture Indy, accès ajouté à la main dans `periodes`.
