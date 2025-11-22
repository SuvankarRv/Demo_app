# Deployment Guide - Inventory App to Free Domain

## 🚀 Deploy to Vercel (Free & Recommended)

### Step 1: Build the Web Version

```bash
# In your project directory
npm run web -- --no-dev --minify
```

Or build for production:
```bash
npx expo export:web
```

This creates a `web-build` folder with your production-ready app.

---

### Step 2: Install Vercel CLI

```bash
npm install -g vercel
```

---

### Step 3: Deploy to Vercel

```bash
# Login to Vercel (free account)
vercel login

# Deploy from project root
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? inventory-app (or your choice)
# - Directory? ./web-build
# - Override settings? No
```

You'll get a URL like: `https://inventory-app-xyz.vercel.app`

---

### Step 4: Production Deployment

```bash
vercel --prod
```

This gives you a permanent production URL!

---

## Alternative: Netlify (Also Free)

### Option 1: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build your app
npx expo export:web

# Deploy
netlify deploy

# Follow prompts, then deploy to production
netlify deploy --prod
```

### Option 2: Netlify Drag & Drop

1. Build: `npx expo export:web`
2. Go to https://app.netlify.com/drop
3. Drag the `web-build` folder
4. Get instant URL!

---

## Free Domain Options

### 1. **Use Free Subdomain** (Easiest)
- Vercel: `your-app.vercel.app`
- Netlify: `your-app.netlify.app`

### 2. **Free Domains**
- **Freenom** - .tk, .ml, .ga, .cf, .gq domains
- **InfinityFree** - Free subdomain with hosting

### 3. **Connect Custom Domain** (If you have one)
Both Vercel and Netlify support custom domains for free!

---

## Quick Start (Fastest Method)

```bash
# 1. Build web version
npx expo export:web

# 2. Install and login to Vercel
npm install -g vercel
vercel login

# 3. Deploy
cd web-build
vercel --prod
```

**Done!** Your app is live in ~2 minutes! 🎉

---

## Important Notes

⚠️ **Database/Storage:**
- AsyncStorage works in browser (localStorage)
- Data is client-side only
- Consider adding Firebase/Supabase for multi-user access

🔐 **Security:**
- Add proper authentication for production
- Use environment variables for sensitive data
- Enable HTTPS (Vercel/Netlify provide this automatically)

📱 **Mobile App:**
- For mobile deployment (iOS/Android), use Expo EAS:
  ```bash
  eas build --platform ios
  eas build --platform android
  ```

---

## Continuous Deployment

### Connect to GitHub (Auto-deploy on push)

1. Push your code to GitHub
2. Import project in Vercel/Netlify dashboard
3. Auto-deploy on every git push!

**Vercel:**
```bash
# Connect to Git
vercel --prod
# Select GitHub repo when prompted
```

---

## Custom Domain Setup (Optional)

### On Vercel:
1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Update DNS records as shown

### On Netlify:
1. Site settings → Domain management
2. Add custom domain
3. Configure DNS

---

## Testing Your Deployment

Once deployed, test:
- ✅ Login functionality
- ✅ Inventory CRUD operations
- ✅ AI Chatbot
- ✅ Admin panel
- ✅ Settings persistence
- ✅ Search functionality

---

## Cost

**Everything is FREE:**
- Vercel: Unlimited personal projects
- Netlify: 100GB bandwidth/month
- Hosting: Free forever
- SSL: Included
- Subdomain: Included

---

## Support

If you encounter issues:
1. Check Vercel/Netlify build logs
2. Ensure all dependencies are in `package.json`
3. Test locally with `npm run web` first
4. Check browser console for errors

---

## Example URLs

After deployment, you'll get URLs like:
- `https://inventory-pro.vercel.app`
- `https://demo-inventory.netlify.app`

Share these with your users! 🌐
