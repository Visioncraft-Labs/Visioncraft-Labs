# VisionCraft Labs - Professional Product Photography Platform

A modern, luxury-branded website showcasing transformative product photography services with cutting-edge design and interactive visual storytelling.

## 🌟 Features

- **Modern React Architecture**: Built with React 18, TypeScript, and Vite
- **Luxury Brand Design**: Gradient aesthetics with glassmorphism effects
- **Image Upload Tool**: Drag-and-drop client preview functionality
- **Contact Management**: Form submissions with validation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Social Media Integration**: Connected to Instagram, Facebook, and Twitter/X
- **Performance Optimized**: Fast loading with modern build tools

## 🚀 Live Demo

Visit the live website: [Your Netlify URL will go here]

## 🛠 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Wouter for client-side routing
- TanStack Query for state management
- Framer Motion for animations
- Radix UI + shadcn/ui components

### Backend
- Node.js with Express
- Serverless functions (Netlify compatible)
- Multer for file uploads
- In-memory storage (production-ready for database integration)

## 📦 Installation & Development

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/visioncraft-labs.git
cd visioncraft-labs

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

## 🌐 Deployment

### Netlify Deployment (Recommended)

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Netlify will automatically use the `netlify.toml` configuration
4. Your site will be live in minutes!

**For detailed deployment instructions, see [NETLIFY_DEPLOYMENT_GUIDE.md](./NETLIFY_DEPLOYMENT_GUIDE.md)**

### Manual Build
```bash
# Build for production
npm run build

# Files will be generated in dist/client/
```

## 📁 Project Structure

```
visioncraft-labs/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── lib/           # Utilities and configurations
│   │   └── hooks/         # Custom React hooks
├── server/                # Backend Express server
├── shared/                # Shared types and schemas
├── netlify/               # Netlify serverless functions
├── netlify.toml          # Netlify configuration
└── NETLIFY_DEPLOYMENT_GUIDE.md
```

## 🎨 Key Pages

- **Home**: Hero section with brand introduction and CTAs
- **Portfolio**: Before/after image galleries showcasing transformations
- **Services**: Photography packages and service offerings
- **Preview**: Client image upload tool for project previews
- **About**: Company story and team information
- **Contact**: Contact form with social media integration

## 📱 Contact Information

- **Email**: visioncraftlabs@gmail.com
- **Phone**: +92-300-8443779
- **Location**: Lahore, Pakistan

### Social Media
- **Instagram**: [@visioncraft_labs](https://www.instagram.com/visioncraft_labs/)
- **Facebook**: [VisionCraft Labs](https://www.facebook.com/profile.php?viewas=100000686899395&id=61577453503470)
- **Twitter/X**: [@VisioncraftLabs](https://x.com/VisioncraftLabs)

## 🔧 Configuration

### Environment Variables
For production deployment with external services:
```env
NODE_ENV=production
DATABASE_URL=your_database_url
CLOUDINARY_URL=your_cloudinary_url
```

### Customization
- **Brand Colors**: Edit `client/src/index.css` for color scheme
- **Content**: Update page content in `client/src/pages/`
- **Images**: Replace assets in `attached_assets/`

## 🚀 Performance Features

- **Optimized Images**: WebP format with fallbacks
- **Code Splitting**: Automatic bundle optimization
- **Caching**: Aggressive caching for static assets
- **Minification**: CSS and JS minification in production
- **CDN Ready**: Optimized for CDN deployment

## 📈 Production Recommendations

### For Enhanced Functionality
1. **Database Integration**: Add PostgreSQL or MongoDB for persistent storage
2. **File Storage**: Integrate Cloudinary or AWS S3 for image management
3. **Email Service**: Add SendGrid or EmailJS for contact form notifications
4. **Analytics**: Implement Google Analytics or similar
5. **Monitoring**: Add error tracking with Sentry

### Security Features
- **HTTPS**: Automatic SSL via Netlify
- **CORS Protection**: Configured for secure API access
- **Input Validation**: Zod schemas for form validation
- **File Upload Security**: Type and size restrictions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern luxury brand aesthetics
- **UI Components**: Radix UI and shadcn/ui
- **Icons**: Lucide React icon library
- **Hosting**: Netlify platform

---

**Built with ❤️ for VisionCraft Labs**

*Transforming ordinary product images into extraordinary visual stories*