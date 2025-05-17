# Frontend 📱

## Setup 🔩

1. Installer les packages

   ```bash
   npm install
   ```

2. Crée votre .env

   Copier le contenu suivant dans un fichier .env :

   ```env
   NEXT_PUBLIC_BACKEND_API=http://localhost:3001
   NEXT_PUBLIC_KEY_STRIPE=votre_clé_stripe_publique
   UMAMI_URL=http://localhost:3002
   UMAMI_WEBSITE_ID=votre_id_umami
   ```

3. Configurer Stripe

   Rendez-vous sur [dashboard.stripe.com](https://dashboard.stripe.com) et créez un compte si ce n'est pas déjà fait.

   Récupérez votre clé publique dans les paramètres et ajoutez-la dans le fichier .env.

4. Lancer le serveur en dev

   ```bash
   npm run dev
   ```

   L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## Commits 🚀

Mêmes conventions que le backend :

- `feat(scope)`: nouvelles fonctionnalités
- `fix(scope)`: corrections de bugs
- `chore(scope)`: changements d'infrastructure
- `docs(scope)`: documentation
- `style(scope)`: style
- `refactor(scope)`: refactoring

Exemples :

- `feat(cart): add cart feature`
- `fix(auth): fix auth bug`
- `style(products): refactor product styles`
