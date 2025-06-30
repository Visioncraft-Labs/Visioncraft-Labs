# VisionCraft Labs - Complete Installation Guide

## Quick Start for Netlify Free Plan + GoDaddy Domain

### What You'll Get
- Professional website at your GoDaddy domain
- Contact form functionality
- Image upload system for client previews
- Social media integration
- Mobile-responsive design
- Free SSL certificate
- Global CDN hosting

---

## Installation Method 1: GitHub Web Upload (Recommended for Beginners)

### Step 1: Create GitHub Account & Repository
1. Go to [github.com](https://github.com) and create free account
2. Click green "New" button to create repository
3. Repository name: `visioncraft-labs`
4. Set to **Public** (required for Netlify free plan)
5. Don't initialize with README
6. Click "Create repository"

### Step 2: Upload Your Project Files
1. Download all your project files from Replit:
   - Click "Files" in left sidebar
   - Select all files (Ctrl+A or Cmd+A)
   - Right-click and "Download as ZIP"
   - Extract ZIP file on your computer

2. Upload to GitHub:
   - In your new GitHub repository, click "uploading an existing file"
   - Drag the extracted project folder contents into the upload area
   - Important files to include:
     - `netlify.toml` (deployment configuration)
     - `netlify/functions/server.js` (API backend)
     - `package.json` (dependencies)
     - `client/` folder (website frontend)
     - All other project files
   - Add commit message: "Initial deployment"
   - Click "Commit changes"

### Step 3: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com) and sign up with GitHub
2. Click "New site from Git"
3. Choose "GitHub" and authorize Netlify
4. Select your `visioncraft-labs` repository
5. Build settings will auto-configure from `netlify.toml`
6. Click "Deploy site"
7. Wait 2-3 minutes for build completion
8. You'll get a temporary URL like `amazing-site-123456.netlify.app`

### Step 4: Test Your Temporary Site
Visit the temporary URL and verify:
- Homepage loads with VisionCraft Labs branding
- Navigation works between pages
- Contact form can be submitted
- Image upload tool functions
- Social media links open correctly
- Site is mobile-responsive

---

## Installation Method 2: Git Command Line (For Advanced Users)

### Prerequisites
- Git installed on your computer
- Command line/terminal access

### Steps
```bash
# Create local copy of your project
mkdir visioncraft-labs
cd visioncraft-labs

# Copy all your project files here, then:
git init
git add .
git commit -m "Initial deployment - VisionCraft Labs"
git branch -M main

# Connect to GitHub (replace 'yourusername' with your GitHub username)
git remote add origin https://github.com/yourusername/visioncraft-labs.git
git push -u origin main
```

Then follow Steps 3-4 from Method 1.

---

## Connecting Your GoDaddy Domain

### Step 5: Add Custom Domain in Netlify
1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter your GoDaddy domain (e.g., `yourdomain.com`)
4. Click "Verify" then "Add domain"

### Step 6: Configure DNS in GoDaddy
1. Log into GoDaddy account
2. Go to "My Products" → find your domain → click "DNS"
3. Add these DNS records:

**A Record for Root Domain:**
- Type: A
- Name: @
- Value: 75.2.60.5
- TTL: 1 Hour

**CNAME Record for WWW:**
- Type: CNAME
- Name: www
- Value: [your-netlify-url].netlify.app
- TTL: 1 Hour

### Step 7: Wait for DNS Propagation
- DNS changes take 24-48 hours to fully activate
- Check progress at [whatsmydns.net](https://whatsmydns.net)
- Netlify will automatically add SSL certificate once DNS is active

---

## Post-Installation Setup

### Verify Everything Works
Once your domain is active, test:
- [ ] Website loads at your custom domain
- [ ] HTTPS/SSL is working (green lock icon)
- [ ] All pages load correctly
- [ ] Contact form submissions work
- [ ] Image upload tool functions
- [ ] Social media links open properly
- [ ] Mobile version displays correctly

### Automatic Updates
- Any changes you push to GitHub will automatically update your live site
- Netlify rebuilds and redeploys within 2-3 minutes
- No manual intervention needed for updates

---

## File Structure Verification

Ensure these key files are in your GitHub repository:

```
visioncraft-labs/
├── netlify.toml                    ← Netlify configuration
├── netlify/functions/server.js     ← API backend
├── package.json                    ← Dependencies
├── client/                         ← Website frontend
│   ├── src/
│   │   ├── pages/                 ← All website pages
│   │   ├── components/            ← UI components
│   │   └── ...
├── server/                         ← Original server code
├── shared/                         ← Shared utilities
└── README.md                       ← Project documentation
```

---

## Troubleshooting Common Issues

### Build Fails on Netlify
**Symptoms:** Red "Failed" status in Netlify dashboard
**Solutions:**
1. Check build logs in Netlify dashboard for specific errors
2. Ensure `package.json` includes all dependencies
3. Verify `netlify.toml` file is present and correctly formatted
4. Make sure Node.js version is compatible (18+)

### Domain Not Working
**Symptoms:** Domain shows error or doesn't load
**Solutions:**
1. Verify DNS records in GoDaddy are exactly as specified
2. Wait full 48 hours for DNS propagation
3. Use DNS checker tools to verify propagation status
4. Clear browser cache and try incognito mode

### Contact Form Not Submitting
**Symptoms:** Form shows error when submitted
**Solutions:**
1. Check Netlify function logs for error details
2. Verify form fields match expected API format
3. Test with browser developer tools (F12) to see network errors

### Images Not Uploading
**Symptoms:** Upload fails or shows error
**Solutions:**
1. Check file size (must be under 10MB)
2. Verify file type (JPEG, PNG, GIF, WebP only)
3. Test with smaller image files first

---

## Free Plan Limitations & Solutions

### Netlify Free Plan Includes:
- 100GB bandwidth per month
- 300 build minutes per month
- Unlimited sites
- SSL certificates
- Custom domains
- Basic form handling

### For Enhanced Features (Optional):
- **Email notifications:** Use EmailJS (free tier: 200 emails/month)
- **Image storage:** Use Cloudinary (free tier: 25GB)
- **Analytics:** Use Google Analytics (free)

---

## Support Resources

### Getting Help
- **Netlify Documentation:** [docs.netlify.com](https://docs.netlify.com)
- **Netlify Community:** [community.netlify.com](https://community.netlify.com)
- **GoDaddy DNS Support:** Available 24/7
- **GitHub Help:** [docs.github.com](https://docs.github.com)

### Monitoring Your Site
- Netlify dashboard shows build status and analytics
- Set up uptime monitoring with UptimeRobot (free)
- Google Search Console for SEO monitoring

---

## Quick Checklist

### Before Starting:
- [ ] GitHub account created
- [ ] GoDaddy domain purchased
- [ ] Project files downloaded from Replit

### During Installation:
- [ ] GitHub repository created and files uploaded
- [ ] Netlify site deployed successfully
- [ ] Temporary URL tested and working
- [ ] Custom domain added in Netlify
- [ ] DNS records configured in GoDaddy

### After Installation:
- [ ] Custom domain loading correctly
- [ ] SSL certificate active (https)
- [ ] All website features tested
- [ ] Social media links verified
- [ ] Mobile responsiveness confirmed

**Total Time:** 30 minutes setup + 24-48 hours DNS propagation
**Cost:** $0 monthly (only domain registration cost)
**Maintenance:** Automatic via GitHub integration

Your professional VisionCraft Labs website will be live with this setup!