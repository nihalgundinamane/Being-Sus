# 🚀 Hosting Guide — Sus Game

Step-by-step instructions to push to GitHub and host on Render (free).

---

## Step 1 — Set Up Git Locally

If you haven't already, install Git: https://git-scm.com/downloads

```bash
# Navigate into the project folder
cd sus-game

# Initialize a git repository
git init

# Add all files
git add .

# Make your first commit
git commit -m "Initial commit — Sus Game 🕵️"
```

---

## Step 2 — Create a GitHub Repository

1. Go to https://github.com and sign in (or create an account)
2. Click the **+** icon → **New repository**
3. Name it `sus-game`
4. Set it to **Public** (required for free Render hosting)
5. **Do NOT** add a README, .gitignore, or license (you already have them)
6. Click **Create repository**

---

## Step 3 — Push to GitHub

Copy the commands GitHub shows you, or use these (replace `YOUR_USERNAME`):

```bash
# Link your local repo to GitHub
git remote add origin https://github.com/YOUR_USERNAME/sus-game.git

# Rename the default branch to main
git branch -M main

# Push your code
git push -u origin main
```

Refresh your GitHub page — you should see all your files.

---

## Step 4 — Deploy on Render

### 4a. Sign Up / Log In

Go to https://render.com and sign in with your GitHub account.

### 4b. Create a New Static Site

1. From the Render dashboard, click **New +** → **Static Site**
2. Click **Connect a repository**
3. Find and select your `sus-game` repository
4. Click **Connect**

### 4c. Configure Build Settings

Fill in the fields exactly as shown:

| Field | Value |
|---|---|
| **Name** | `sus-game` (or any name you like) |
| **Branch** | `main` |
| **Root Directory** | *(leave blank)* |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `build` |

### 4d. Deploy

1. Click **Create Static Site**
2. Render will install dependencies and build your app (takes ~2 minutes)
3. Once done, you'll see a green **Live** badge
4. Your site is live at `https://sus-game.onrender.com` (or similar URL)

---

## Step 5 — Update Your Site

Whenever you make changes, just push to GitHub and Render auto-deploys:

```bash
# After making changes locally:
git add .
git commit -m "Update: describe your change"
git push
```

Render detects the push and redeploys automatically within ~1–2 minutes.

---

## Alternative: Deploy to Vercel (Even Easier)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project folder
vercel

# Follow prompts — it auto-detects React
# Your site goes live instantly
```

Or visit https://vercel.com → Import Project → Connect GitHub repo → Deploy.

---

## Alternative: Deploy to Netlify

1. Run `npm run build` locally
2. Go to https://netlify.com → **Deploy manually**
3. Drag and drop the `build/` folder onto the page
4. Done — your site is live instantly with a free URL

Or connect your GitHub repo for auto-deploys just like Render.

---

## Custom Domain (Optional)

On Render:
1. Go to your Static Site → **Settings** → **Custom Domains**
2. Add your domain (e.g., `susgame.com`)
3. Update your domain's DNS to point to Render's servers
4. Render handles HTTPS automatically (free SSL)

---

## Troubleshooting

**Build fails on Render?**
- Check the build logs in Render dashboard
- Make sure `package.json` has the correct `build` script
- Ensure Node version is compatible: add `"engines": { "node": "18.x" }` to `package.json`

**Site shows blank page?**
- Confirm **Publish Directory** is set to `build` (not `dist` or `public`)

**Changes not showing after push?**
- Check Render dashboard for a new deploy being triggered
- Clear browser cache with Ctrl+Shift+R

---

_Estimated total time: 10–15 minutes from zero to live site._
