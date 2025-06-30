# VisionCraft Labs - Product Photography Platform

## Overview

VisionCraft Labs is a modern web application for a product photography service business. It serves as a marketing website showcasing professional product photography services, with features for client engagement and contact management. The platform transforms ordinary product images into high-end visual stories for brands and e-commerce businesses.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful endpoints for contact form and data management

### Development Architecture
- **Monorepo Structure**: Shared code between client and server
- **Hot Reload**: Vite development server with HMR
- **Type Safety**: Full TypeScript coverage across the stack
- **Development Tools**: Replit integration for cloud development

## Key Components

### Client Application (`client/`)
- **Pages**: Home, Portfolio, Services, About, Contact, Preview (image upload), and 404 error page
- **Components**: Reusable UI components including navigation, footer, scroll animations, image galleries, and image upload tool
- **Forms**: Contact form and image upload with validation using React Hook Form and Zod
- **File Upload**: Drag-and-drop image upload with preview functionality and client information capture
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints

### Server Application (`server/`)
- **Routes**: Contact form submission, image upload, and admin endpoints
- **File Upload**: Multer integration for handling image uploads with validation
- **Storage**: Abstract storage interface with in-memory implementation for contacts and image uploads
- **Middleware**: Request logging, JSON parsing, error handling, file upload processing
- **Development**: Vite integration for SSR-like development experience

### Shared Code (`shared/`)
- **Database Schema**: Drizzle ORM table definitions and TypeScript types
- **Validation**: Zod schemas for form validation and API contracts
- **Type Definitions**: Shared TypeScript interfaces between client and server

## Data Flow

### Contact Form Submission
1. User fills out contact form on frontend
2. Form data validated using Zod schema on client-side
3. POST request sent to `/api/contact` endpoint
4. Server validates data again and stores in database
5. Success/error response sent back to client
6. Toast notification displayed to user

### Portfolio Display
1. Static portfolio data loaded from component definitions
2. Before/after image comparisons rendered with custom components
3. Filter functionality for different photography categories
4. Responsive image galleries with lazy loading

### Navigation & Routing
1. Client-side routing with Wouter
2. Active page highlighting in navigation
3. Mobile-responsive navigation with hamburger menu
4. Fixed sticky CTA button for conversion optimization

## External Dependencies

### UI & Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Google Fonts**: Inter and Open Sans typography

### Data Management
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation library
- **Drizzle ORM**: Type-safe database ORM

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **ESLint**: Code linting (implied by TypeScript setup)
- **PostCSS**: CSS processing with Autoprefixer

### Database & Hosting
- **Neon Database**: Serverless PostgreSQL provider
- **Replit**: Cloud development environment

## Deployment Strategy

### Production Build
- Client built with Vite to static assets
- Server bundled with esbuild for Node.js runtime
- Output directory: `dist/` with separate client and server builds

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Production/development mode switching via `NODE_ENV`
- Replit-specific development features conditionally loaded

### Database Management
- Schema migrations handled via Drizzle Kit
- Push-based deployment with `db:push` command
- PostgreSQL dialect with connection pooling via Neon

### Development Workflow
- Local development with hot reload via Vite
- Shared TypeScript configuration across client/server
- Path aliases for clean imports (`@/` for client, `@shared/` for shared code)

## Changelog

Changelog:
- June 29, 2025. Initial setup
- June 29, 2025. Updated background color to dark navy (#0B0E1C) and added professional logo component with camera icon design
- June 29, 2025. Transformed to luxury brand aesthetic with gradient colors from new neon cube logo
- June 29, 2025. Updated logo to neon cube design, fixed button consistency, improved process section visualization, updated copyright to 2025
- June 29, 2025. Implemented image upload tool for client previews with drag-and-drop functionality, file validation, and upload tracking
- June 29, 2025. Updated contact information: changed name to Rayan Faisal, updated email to visioncraftlabs@gmail.com, added phone +92-300-8443779, and integrated social media links
- June 30, 2025. Integrated SendGrid email notifications - contact form submissions and image uploads now send professional emails to visioncraftlabs@gmail.com with client details
- June 30, 2025. Added phone field to contact form and database schema, fixed Netlify deployment configuration to use correct output directory (dist/public)

## User Preferences

Preferred communication style: Simple, everyday language.