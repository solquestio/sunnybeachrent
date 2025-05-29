# VP Peter House - Production Deployment Guide

## 🚀 Production Setup Steps

### 1. EmailJS Setup (Free Email Service)

1. **Create Account:**
   - Go to [https://emailjs.com](https://emailjs.com)
   - Sign up for a free account (allows 200 emails/month)

2. **Create Email Service:**
   - Go to "Email Services" → Add Service
   - Choose your email provider (Gmail recommended)
   - Follow setup instructions to connect your Gmail account

3. **Create Email Template:**
   - Go to "Email Templates" → Create Template
   - Use this template content:

   ```
   Subject: 🏨 New Booking Request - VP Peter House

   Hello {{to_name}},

   You have received a new booking request for VP Peter House!

   {{booking_details}}

   Best regards,
   VP Peter House Booking System
   ```

4. **Get Your Keys:**
   - Public Key: Found in "Account" → "General"
   - Service ID: Found in your email service settings
   - Template ID: Found in your email template settings

5. **Update index.html:**
   Replace these placeholders in the code:
   ```javascript
   const EMAILJS_CONFIG = {
       serviceID: 'service_YOUR_SERVICE_ID', // Replace with your service ID
       templateID: 'template_YOUR_TEMPLATE_ID', // Replace with your template ID
       publicKey: 'user_YOUR_PUBLIC_KEY' // Replace with your public key
   };
   ```

### 2. Hosting Options

#### Option A: GitHub Pages (Free)
1. Create GitHub repository
2. Upload your files
3. Enable GitHub Pages in repository settings
4. Your site will be available at: `https://yourusername.github.io/repository-name`

#### Option B: Netlify (Free)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Get instant live URL

#### Option C: Vercel (Free)
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Auto-deploy on every commit

### 3. Domain Setup (Optional)

If you want a custom domain like `vpeterhouse.com`:
1. Buy domain from provider (GoDaddy, Namecheap, etc.)
2. Point domain to your hosting service
3. Update hosting settings to use custom domain

### 4. Testing Production Setup

1. **Test Email Functionality:**
   - Make a test booking
   - Check if Nikolai receives email at `tonevnikolai13@gmail.com`

2. **Test All Features:**
   - Gallery lightbox
   - Calendar booking system
   - Contact information display
   - Mobile responsiveness

### 5. Analytics Setup (Optional)

Add Google Analytics to track visitors:
1. Create Google Analytics account
2. Add tracking code to `<head>` section of index.html

### 6. Security Considerations

- EmailJS keys are safe to expose (public keys only)
- No server-side code needed
- All processing happens in browser
- Contact details are already public on site

### 7. Maintenance

- Monitor EmailJS usage (200 emails/month on free plan)
- Check booking requests regularly
- Update contact information as needed

## 📞 Contact Information Currently Set

- **Owner:** Nikolai (VP Peter House Management)
- **Email:** tonevnikolai13@gmail.com
- **Phone:** +353 858 103 131 (Ireland)
- **Phone:** +359 887 658 222 (Bulgaria)
- **Property:** VP Peter House, Sunny Beach, Bulgaria

## 🎯 Production Checklist

- [ ] EmailJS account created
- [ ] Email service configured
- [ ] Email template created
- [ ] Keys updated in index.html
- [ ] Hosting service chosen
- [ ] Site deployed
- [ ] Email functionality tested
- [ ] Custom domain configured (optional)
- [ ] Analytics added (optional)

---

**Ready for Production!** 🎉

Your VP Peter House booking system is now production-ready with:
- Real email notifications
- Professional booking calendar
- Complete contact information
- Mobile-responsive design
- Image gallery with local photos 