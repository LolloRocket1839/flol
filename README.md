# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/ef9655a3-a9a4-4169-b5b8-6a59c3203859

## Features

### Thoughts of the Week

The project includes a "Thoughts of the Week" section in the Financial Literacy Library where you can:

- Share weekly thoughts about financial literacy
- Add links to inspiring newsletters you've found
- Easily update the content on a weekly basis

To access this feature:
1. Navigate to the "Biblioteca" section in the navigation bar
2. The page allows you to add new thoughts and newsletter links
3. All previously added thoughts are displayed in chronological order

#### How to Update Weekly Thoughts

1. Click the "Add New Thought" button
2. Enter a title and your thoughts for the week
3. Add links to any inspiring newsletters using the "Add Link" button
4. Click "Save Thought" to publish your update

### Database Setup

The application uses Supabase for data storage. To set up the required tables:

1. Make sure you have the Supabase CLI installed:
   ```sh
   npm install -g supabase
   ```

2. Run the migration script:
   - On Windows: `.\supabase\run_migrations.ps1`
   - On Linux/macOS: `bash ./supabase/run_migrations.sh`

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ef9655a3-a9a4-4169-b5b8-6a59c3203859) and start prompting.

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
- Supabase (for database)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ef9655a3-a9a4-4169-b5b8-6a59c3203859) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
