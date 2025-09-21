# Genius Software Core (GSC) - Project Setup

## Overview
GSC is a full-stack TypeScript application built with Vite, React, Express, and PostgreSQL. It's a comprehensive business platform featuring services management, CRM functionality, authentication, and more.

## Architecture
- **Frontend**: React 18, Vite, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Express.js, TypeScript  
- **Database**: PostgreSQL with Drizzle ORM
- **Development**: Unified dev server on port 5000
- **Routing**: Wouter for SPA routing

## Project Structure
```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components 
│   │   ├── pages/          # Route components
│   │   ├── lib/            # Utilities and configurations
│   │   └── i18n/           # Internationalization
├── server/                 # Express backend
│   ├── index.ts           # Entry point
│   ├── routes.ts          # API routes
│   ├── db.ts              # Database configuration
│   └── vite.ts            # Vite dev server setup
├── shared/                 # Shared types and schemas
└── attached_assets/        # Project assets and uploads
```

## Key Features
- 🌐 Multi-language support (Arabic/English) with RTL/LTR
- 🔐 Authentication system with role-based access control
- 📊 CRM dashboard with customer management
- 💼 Services portfolio with detailed pages
- 📱 Responsive design with dark mode support
- 🎨 Modern UI with animations and transitions
- 📊 Real-time notifications and websocket support

## Development Setup

### Current Configuration
- **Port**: 5000 (configured for Replit environment)
- **Host**: 0.0.0.0 (allows external access)
- **Database**: PostgreSQL with fallback to in-memory storage
- **Dev Server**: Vite with HMR enabled
- **Proxy Configuration**: `allowedHosts: true` for Replit compatibility

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production server
- `npm run db:push` - Sync database schema

### Environment Variables
See `.env.example` for complete configuration. Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Authentication secret
- `SESSION_SECRET` - Session security
- `VITE_*` - Frontend environment variables

## Replit Integration
✅ **Configured for Replit**:
- Workflow: "Start application" running on port 5000
- Frontend properly configured with `allowedHosts: true`
- Server binds to `0.0.0.0:5000` for external access
- Deployment configured for autoscale with build/start scripts

## Database Configuration
- **Production**: Requires PostgreSQL with `DATABASE_URL`
- **Development**: Falls back to in-memory storage if no database
- **Schema**: Auto-synced with Drizzle ORM
- **Seeding**: Automatic data seeding on startup

## Recent Changes (September 21, 2025)
- ✅ Project successfully imported from GitHub and configured for Replit environment
- ✅ Workflow "Start application" configured with webview output on port 5000
- ✅ Database connection established and verified (PostgreSQL with Drizzle ORM)
- ✅ Frontend/backend integration tested and working
- ✅ Vite dev server properly configured with `allowedHosts: true` for Replit proxy
- ✅ Server correctly binds to `0.0.0.0:5000` for external access
- ✅ Deployment configuration set up for autoscale with build/start scripts
- ✅ Application successfully running with all features operational
- ✅ API endpoints tested and responding correctly (/api/services, /api/testimonials)
- ✅ Database seeding completed with initial data

## User Preferences
- Modern TypeScript/React development patterns
- Component-based architecture with shadcn/ui
- Comprehensive feature set with attention to UX
- Multi-language support with proper RTL handling
- Professional business application design