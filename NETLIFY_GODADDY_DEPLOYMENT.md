# VisionCraft Labs - Netlify Free Plan + GoDaddy Domain Deployment Guide

## Complete Setup Guide for Netlify Free Plan with GoDaddy Domain

### Prerequisites
- GitHub account (free)
- Netlify account (free plan)
- GoDaddy domain (already purchased)
- Project code ready

---

## Phase 1: Prepare Your Code for GitHub

### Step 1: Create GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click "New repository" (green button)
3. Repository name: `visioncraft-labs-website`
4. Description: `Professional product photography website for VisionCraft Labs`
5. Make it **Public** (required for Netlify free plan)
6. Initialize with README: **No** (we already have one)
7. Click "Create repository"

### Step 2: Upload Your Code to GitHub

#### Option A: Using GitHub Web Interface (Easiest)
1. In your new repository, click "uploading an existing file"
2. Drag and drop all your project files OR click "choose your files"
3. Make sure to include ALL files:
   - `netlify.toml`
   - `netlify/functions/server.js`
   - `package.json`
   - `client/` folder
   - `server/` folder
   - `shared/` folder
   - All other project files
4. Scroll down, add commit message: "Initial deployment - VisionCraft Labs website"
5. Click "Commit changes"

#### Option B: Using Git Commands (If you prefer terminal)
```bash
# In your project folder
git init
git add .
git commit -m "Initial deployment - VisionCraft Labs website"
git branch -M main
git remote add origin https://github.com/yourusername/visioncraft-labs-website.git
git push -u origin main
```

---

## Phase 2: Deploy to Netlify

### Step 3: Connect GitHub to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub account (this links them automatically)
3. Click "New site from Git"
4. Choose "GitHub"
5. Find and select your `visioncraft-labs-website` repository
6. Branch: `main`

### Step 4: Configure Build Settings
Netlify will auto-detect these from your `netlify.toml` file:
- **Build command**: `npm run build`
- **Publish directory**: `dist/client`
- **Functions directory**: `netlify/functions`

### Step 5: Deploy
1. Click "Deploy site"
2. Wait 2-3 minutes for build to complete
3. You'll get a temporary URL like: `https://wonderful-name-123456.netlify.app`
4. Test this URL to make sure everything works

---

## Phase 3: Connect Your GoDaddy Domain

### Step 6: Add Custom Domain in Netlify
1. In your Netlify site dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter your GoDaddy domain: `yourdomain.com`
4. Click "Verify" then "Add domain"
5. Netlify will show DNS configuration instructions

### Step 7: Configure DNS in GoDaddy
1. Log into your GoDaddy account
2. Go to "My Products" → "DNS"
3. Find your domain and click "DNS"
4. You need to add these records:

#### For Root Domain (yourdomain.com):
- **Type**: A
- **Name**: @
- **Value**: 75.2.60.5
- **TTL**: 1 Hour

#### For WWW Subdomain (www.yourdomain.com):
- **Type**: CNAME
- **Name**: www
- **Value**: your-site-name.netlify.app
- **TTL**: 1 Hour

### Step 8: Wait for DNS Propagation
- DNS changes can take 24-48 hours to fully propagate
- You can check status at [whatsmydns.net](https://whatsmydns.net)
- Netlify will automatically provision SSL certificate once DNS is active

---

## Phase 4: Verify Everything Works

### Step 9: Test Your Live Website
Once DNS is active, test these features:

#### Core Functionality:
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Contact form submission works
- [ ] Image upload tool functions
- [ ] Social media links open correctly
- [ ] Mobile responsive design works
- [ ] SSL certificate is active (https://)

#### API Endpoints:
- [ ] Contact form: `https://yourdomain.com/api/contact`
- [ ] Image upload: `https://yourdomain.com/api/upload-image`
- [ ] Upload history: `https://yourdomain.com/api/uploads`

---

## Phase 5: Ongoing Management

### Automatic Deployments
- Every time you push changes to GitHub, Netlify automatically rebuilds your site
- No manual deployment needed after initial setup

### Free Plan Limits (Netlify)
- ✅ 100GB bandwidth per month
- ✅ 300 build minutes per month
- ✅ Unlimited sites
- ✅ SSL certificates included
- ✅ Custom domains included

### Monitoring Your Site
1. Netlify dashboard shows:
   - Build status
   - Site analytics
   - Function logs
   - Error reports

---

## Troubleshooting Common Issues

### Build Fails
**Problem**: Build doesn't complete
**Solution**: 
1. Check build logs in Netlify dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version (should be 18+)

### Domain Not Working
**Problem**: Custom domain shows error
**Solution**:
1. Double-check DNS records in GoDaddy
2. Wait 24-48 hours for DNS propagation
3. Use [DNS Checker](https://dnschecker.org) to verify

### Contact Form Not Working
**Problem**: Form submissions fail
**Solution**:
1. Check function logs in Netlify dashboard
2. Verify API redirects in `netlify.toml`
3. Test with browser developer tools

### Images Not Uploading
**Problem**: Image upload fails
**Solution**:
1. Check file size (max 10MB)
2. Verify file type (JPEG, PNG, GIF, WebP only)
3. Check function logs for errors

---

## Free Alternatives for Enhanced Features

Since you're on the free plan, here are cost-effective integrations:

### Contact Form Enhancement
**Netlify Forms** (Free):
1. Replace API contact form with Netlify's built-in forms
2. Automatic spam protection
3. Email notifications included

### Image Storage
**Cloudinary** (Free tier):
- 25GB storage
- 25GB bandwidth
- Perfect for client image uploads

### Email Notifications
**EmailJS** (Free tier):
- 200 emails/month
- Direct client email notifications

---

## Security Best Practices

### SSL Certificate
- Netlify provides free SSL automatically
- Your site will be accessible via https://

### Contact Form Security
- Built-in spam protection
- Input validation included
- CORS protection configured

---

## Quick Reference - DNS Settings

Copy these exact values into GoDaddy DNS:

```
Record Type: A
Name: @
Value: 75.2.60.5
TTL: 1 Hour

Record Type: CNAME  
Name: www
Value: your-site-name.netlify.app
TTL: 1 Hour
```

Replace `your-site-name.netlify.app` with your actual Netlify URL.

---

## Support Contacts

### Netlify Support
- Free plan: Community support
- Documentation: [docs.netlify.com](https://docs.netlify.com)
- Community: [community.netlify.com](https://community.netlify.com)

### GoDaddy Support
- Domain DNS help: Available 24/7
- Phone: 1-480-505-8877

---

## Deployment Checklist

### Pre-deployment:
- [ ] Code uploaded to GitHub
- [ ] All files included in repository
- [ ] Package.json includes all dependencies

### Netlify Setup:
- [ ] Site created and linked to GitHub
- [ ] Build completed successfully
- [ ] Temporary URL works correctly
- [ ] Custom domain added in Netlify

### DNS Configuration:
- [ ] A record added in GoDaddy
- [ ] CNAME record added in GoDaddy
- [ ] DNS propagation completed
- [ ] SSL certificate active

### Final Testing:
- [ ] Custom domain loads website
- [ ] All pages and features work
- [ ] Contact form functional
- [ ] Image upload working
- [ ] Mobile responsive
- [ ] Social media links active

---

**Total Setup Time**: 30 minutes + DNS propagation (24-48 hours)
**Cost**: $0 (using free plans for everything except domain)
**Maintenance**: Automatic updates via GitHub pushes

Your VisionCraft Labs website will be live and professional-grade with this setup!