# VisionCraft Labs - Quick Deployment Checklist

## For Netlify Free Plan + GoDaddy Domain

### Pre-Deployment (5 minutes)
- [ ] Download all project files from Replit
- [ ] Create GitHub account at github.com
- [ ] Create Netlify account at netlify.com

### GitHub Setup (10 minutes)
- [ ] Create new public repository named `visioncraft-labs`
- [ ] Upload all project files via web interface
- [ ] Verify these key files are included:
  - [ ] `netlify.toml`
  - [ ] `netlify/functions/server.js`
  - [ ] `package.json`
  - [ ] Complete `client/` folder
  - [ ] All other project files

### Netlify Deployment (5 minutes)
- [ ] Connect GitHub account to Netlify
- [ ] Create new site from Git
- [ ] Select your repository
- [ ] Let Netlify auto-configure build settings
- [ ] Deploy site
- [ ] Test temporary URL (ends with .netlify.app)

### Domain Connection (10 minutes)
- [ ] Add custom domain in Netlify settings
- [ ] Log into GoDaddy DNS management
- [ ] Add A record: @ → 75.2.60.5
- [ ] Add CNAME record: www → your-site.netlify.app
- [ ] Save DNS changes

### Final Verification (24-48 hours later)
- [ ] Custom domain loads website
- [ ] SSL certificate is active (https)
- [ ] Contact form works
- [ ] Image upload functions
- [ ] All pages load correctly
- [ ] Mobile responsive design

**Total Active Time: 30 minutes**
**DNS Propagation: 24-48 hours**
**Monthly Cost: $0 (free hosting)**

Your professional website will be live at your GoDaddy domain!