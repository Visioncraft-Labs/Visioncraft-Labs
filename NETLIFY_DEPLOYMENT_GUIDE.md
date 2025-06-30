# VisionCraft Labs - Netlify Deployment Guide

## Overview
This guide will help you deploy your VisionCraft Labs website to Netlify, a modern hosting platform that supports React applications with serverless functions.

## Prerequisites
- GitHub account
- Netlify account (free tier available)
- Your project code pushed to a GitHub repository

## Step 1: Prepare Your Code for Deployment

### 1.1 Required Files (Already Created)
The following files have been created for your deployment:

- `netlify.toml` - Netlify configuration file
- `netlify/functions/server.js` - Serverless function for API endpoints

### 1.2 Build Configuration
Your project is configured to build the client-side React application to the `dist/client` directory.

## Step 2: Push Code to GitHub

1. Create a new repository on GitHub
2. Push your local code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit - VisionCraft Labs website"
git branch -M main
git remote add origin https://github.com/yourusername/visioncraft-labs.git
git push -u origin main
```

## Step 3: Deploy to Netlify

### 3.1 Connect GitHub Repository
1. Go to [netlify.com](https://netlify.com) and sign up/log in
2. Click "New site from Git"
3. Choose "GitHub" as your Git provider
4. Authorize Netlify to access your GitHub account
5. Select your VisionCraft Labs repository

### 3.2 Configure Build Settings
Netlify will automatically detect the build settings from your `netlify.toml` file:

- **Build command**: `npm run build`
- **Publish directory**: `dist/client`
- **Functions directory**: `netlify/functions`

### 3.3 Deploy
1. Click "Deploy site"
2. Netlify will assign a random subdomain (e.g., `amazing-site-123456.netlify.app`)
3. Wait for the build to complete (usually 2-3 minutes)

## Step 4: Configure Custom Domain (Optional)

### 4.1 Using Netlify Subdomain
Your site will be available at: `https://your-site-name.netlify.app`

### 4.2 Using Custom Domain
1. In your Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain name (e.g., `visioncraftlabs.com`)
4. Follow DNS configuration instructions
5. Netlify will provide SSL certificate automatically

## Step 5: Environment Variables (If Needed)

If you plan to add external services later (database, email, etc.):

1. Go to your site dashboard in Netlify
2. Navigate to "Site settings" → "Environment variables"
3. Add required variables:
   - `NODE_ENV` = `production`
   - Add any API keys or database URLs as needed

## Step 6: Verify Deployment

### 6.1 Test Website Functionality
Visit your deployed site and test:
- ✅ Home page loads correctly
- ✅ Navigation between pages works
- ✅ Contact form submission
- ✅ Image upload functionality
- ✅ Responsive design on mobile/desktop
- ✅ Social media links work

### 6.2 Check API Endpoints
Your API endpoints will be available at:
- `https://your-site.netlify.app/api/contact`
- `https://your-site.netlify.app/api/upload-image`
- `https://your-site.netlify.app/api/uploads`

## Important Notes

### Data Persistence
⚠️ **Important**: The current setup uses in-memory storage, which means:
- Contact form submissions and uploaded images are reset when the serverless function restarts
- For production use, consider integrating:
  - **Database**: Airtable, Firebase, or Supabase
  - **File Storage**: Cloudinary, AWS S3, or Uploadcare
  - **Email Service**: EmailJS, Formspree, or Netlify Forms

### Contact Form Alternative
For immediate production use, you can replace the contact form with Netlify Forms:

1. Add `netlify` attribute to your form in `contact.tsx`:
```html
<form name="contact" method="POST" data-netlify="true">
```

2. This will automatically handle form submissions without needing the API endpoint.

## Troubleshooting

### Common Issues

**Build Fails**
- Check build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

**API Functions Don't Work**
- Check function logs in Netlify dashboard
- Verify `netlify.toml` redirects are correct
- Ensure serverless-http is installed

**Images Don't Load**
- Check if image paths are correct
- Verify build output includes all assets
- Check browser console for errors

### Getting Help
- Netlify Support: [support.netlify.com](https://support.netlify.com)
- Netlify Community: [community.netlify.com](https://community.netlify.com)
- GitHub Issues: Create issues in your repository

## Next Steps After Deployment

1. **Set up Analytics**: Add Google Analytics or Netlify Analytics
2. **Configure Email**: Set up contact form to send emails
3. **Add Database**: Integrate persistent storage for uploads and contacts
4. **Optimize Performance**: Enable Netlify's performance features
5. **Set up Monitoring**: Monitor site performance and uptime

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Netlify site created and connected
- [ ] Build completed successfully
- [ ] All pages load correctly
- [ ] Contact form works
- [ ] Image upload functions
- [ ] Social media links are functional
- [ ] Mobile responsive design verified
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active

## Support

If you encounter any issues during deployment, the VisionCraft Labs website is built with modern web standards and should deploy smoothly to Netlify. The configuration files provided handle most common deployment scenarios automatically.

---

**Deployment Time**: Typically 5-10 minutes for first deployment
**Ongoing Updates**: Automatic deployments when you push to GitHub
**Cost**: Free tier includes generous limits for most business websites