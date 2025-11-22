# Deploy to GitHub Pages - Free Hosting

## 🎯 Get Your Free `username.github.io` Subdomain

GitHub Pages is perfect for hosting your inventory app with a free subdomain!

---

## Quick Setup (5 Minutes)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `inventory-app` (or any name)
3. Make it **Public**
4. Click **Create repository**

---

### Step 2: Push Your Code

```bash
cd /home/rvn/.gemini/antigravity/scratch/inventory-app

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Inventory App with AI & Admin"

# Add your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/inventory-app.git

# Push to GitHub
git push -u origin main
```

---

### Step 3: Install GitHub Pages Package

```bash
npm install --save-dev gh-pages
```

---

### Step 4: Update package.json

Add these scripts to your `package.json`:

```json
"scripts": {
  "predeploy": "npx expo export --platform web --output-dir web-build",
  "deploy": "gh-pages -d web-build"
}
```

---

### Step 5: Deploy!

```bash
npm run deploy
```

**Done!** Your app will be live at:
```
https://YOUR_USERNAME.github.io/inventory-app
```

---

## Alternative: Deploy to Custom Domain

### With Your Own Domain (e.g., `inventory.yourdomain.com`)

1. Deploy to GitHub Pages (steps above)
2. In your repo: **Settings** → **Pages** → **Custom domain**
3. Add your domain name
4. Update DNS records:
   - Type: `CNAME`
   - Name: `inventory` (or `@` for root)
   - Value: `YOUR_USERNAME.github.io`

---

## Automatic Deployment with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npx expo export --platform web --output-dir web-build
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./web-build
```

Now every git push automatically deploys! 🚀

---

## Comparison: GitHub Pages vs Others

| Platform | URL Format | Deployment | Auto-Deploy |
|----------|-----------|------------|-------------|
| **GitHub Pages** | `username.github.io/repo` | `npm run deploy` | ✅ (with Actions) |
| **Vercel** | `app-name.vercel.app` | `vercel --prod` | ✅ (with Git) |
| **Netlify** | `app-name.netlify.app` | Drag & drop | ✅ (with Git) |

---

## Benefits of GitHub Pages

✅ **Free forever** - No limits for public repos  
✅ **Custom domains** - Free SSL included  
✅ **Git-based** - Deploy via git push  
✅ **Professional URL** - `yourname.github.io`  
✅ **No account needed** - Use existing GitHub account  

---

## After Deployment

**Your app URLs:**
- Main: `https://YOUR_USERNAME.github.io/inventory-app`
- Login: `demo@demo.com` / `demo123`

**Share with:**
- Team members
- Clients
- Anyone worldwide!

---

## Troubleshooting

**404 Error?**
- Wait 1-2 minutes after first deploy
- Check GitHub Pages settings in repo

**Blank page?**
- Check browser console for errors
- Ensure `web-build` folder exists

**Need help?**
Check the deployment logs in GitHub Actions tab!
