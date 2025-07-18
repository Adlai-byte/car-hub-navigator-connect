# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/3936836e-3e02-46d1-af97-cfa7b827cc1a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3936836e-3e02-46d1-af97-cfa7b827cc1a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Supabase setup

This project uses Supabase for authentication and data storage. Before running
the application, apply the database migrations included in the
`supabase/migrations` directory.

1. Install the Supabase CLI if you haven't already:

   ```sh
   npm install -g supabase
   ```

2. Link the CLI to this project:

   ```sh
   supabase link --project-ref alibdhmgdmfnoohkbykl
   ```

3. Apply the migrations to create the required tables (including `bookings`):

   ```sh
   supabase db push
   ```

If `/rest/v1/bookings` returns a 404 error, it usually means the migrations
haven't been applied yet. Running the command above should resolve it.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/3936836e-3e02-46d1-af97-cfa7b827cc1a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
