# VP Peter House - Custom Domain Deployment Guide

## 🌐 Option 1: Netlify Deployment (RECOMMENDED - 5 minutes)

### Step 1: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub/Google
3. Click "Add new site" → "Deploy manually"
4. Drag your entire `peterhouse` folder into Netlify
5. ✅ Your site is live! You'll get a URL like: `amazing-name-123.netlify.app`

### Step 2: Add Custom Domain
1. In Netlify dashboard → "Domain settings"
2. Click "Add custom domain"
3. Enter your domain: `vpeterhouse.com` (example)
4. Netlify will show you DNS records to add

### Step 3: Configure DNS (At your domain provider)
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME  
Name: www
Value: amazing-name-123.netlify.app
```

---

## 🚀 Option 2: GitHub Pages + Custom Domain

### Step 1: Create GitHub Repository
1. Go to [github.com](https://github.com) → Create new repository
2. Name it: `vpeterhouse-booking` 
3. Upload your `index.html` and all WhatsApp images
4. Commit changes

### Step 2: Enable GitHub Pages
1. Repository → Settings → Pages
2. Source: "Deploy from a branch" 
3. Branch: `main` 
4. Folder: `/ (root)`
5. Save

### Step 3: Add Custom Domain
1. In Pages settings → Custom domain
2. Enter: `www.vpeterhouse.com`
3. Save (GitHub will create CNAME file)

### Step 4: DNS Configuration
```
Type: CNAME
Name: www  
Value: yourusername.github.io

Type: A
Name: @
Value: 185.199.108.153
```

---

## 🔥 Option 3: Firebase Hosting (Continue Setup)

### Fix Firebase Deployment
```bash
# Re-initialize if needed
firebase logout
firebase login
firebase use sunnybeachrent-60bb6

# Deploy with debug
firebase deploy --debug
```

### Add Custom Domain (After successful deployment)
1. Firebase Console → Hosting → Add custom domain
2. Enter domain: `vpeterhouse.com`
3. Follow verification steps
4. Update DNS records as shown

---

## 💡 DOMAIN RECOMMENDATIONS

### Where to Buy Domain:
- **Namecheap**: $8-12/year
- **GoDaddy**: $10-15/year  
- **Google Domains**: $12/year
- **Cloudflare**: $8-10/year

### Suggested Domain Names:
- `vpeterhouse.com`
- `peterhousesunnybeach.com`
- `sunnybeachvilla.com`
- `peterhouserental.com`

---

## ⚡ FASTEST OPTION: Netlify

**Total time: 5 minutes**
1. Drag folder to Netlify (2 min)
2. Buy domain (2 min)  
3. Update DNS (1 min)
4. ✅ Live with custom domain!

**Your site will be accessible at:**
- `https://vpeterhouse.com`
- `https://www.vpeterhouse.com`
- Automatic SSL certificate
- Global CDN (fast worldwide)
- Email notifications working

---

## 🎯 NEXT STEPS

1. **Choose hosting option** (Netlify recommended)
2. **Buy domain name** 
3. **Deploy your site**
4. **Configure DNS**
5. **Test booking system**
6. **Share with customers!**

The booking system is 100% ready for production with:
✅ Professional calendar booking
✅ Email notifications to Nikolai  
✅ Contact information
✅ Beautiful photo gallery
✅ €130/night pricing
✅ Mobile responsive design 