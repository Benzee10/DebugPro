# Shiny Dollop - Premium Photo Gallery

## Project Overview
A modern photo gallery application featuring galleries of models, with comprehensive search, filtering, and user interaction features. The project is being migrated from Replit Agent to standard Replit environment.

## Recent Changes
- **2025-08-05**: Successfully migrated from Replit Agent to Replit environment
- **2025-08-05**: Created PostgreSQL database and migrated all 98 gallery posts
- **2025-08-05**: Implemented photo redirect functionality to https://redirect01.vercel.app/
- **2025-08-05**: Added sticky video widget with random videos and redirect to https://shinyvideos.vercel.app/
- **2025-08-05**: Removed authentication system per user request (no login needed)

## User Preferences
- Redirect all photo clicks to: https://redirect01.vercel.app/
- Sticky video widget with random videos from project1content.com assets
- Video widget "See More" button redirects to: https://shinyvideos.vercel.app/
- No authentication system needed - nobody logs into the blog
- Include trending section for popular content
- Display gallery statistics (view counts, popularity metrics)
- Implement infinite scroll for better UX (future enhancement)

## Project Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Replit Auth (OpenID Connect)
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: Wouter for client-side routing

### Directory Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and data
│   │   └── index.css      # Global styles
│   └── index.html
├── server/                # Backend Express server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage layer
│   ├── db.ts             # Database connection
│   └── replitAuth.ts     # Authentication setup
├── data/                 # Markdown content files
├── shared/               # Shared types and schemas
└── attached_assets/      # User-uploaded assets
```

### Key Features to Implement
1. **Favorites System**: Users can bookmark galleries they like
2. **Rating System**: 5-star rating system for galleries
3. **Trending Section**: Display most popular galleries
4. **Recommendations**: "More like this" based on viewing history
5. **Infinite Scroll**: Load more galleries dynamically
6. **Gallery Statistics**: View counts and popularity metrics
7. **Photo Redirects**: All photo clicks redirect to https://redirect01.vercel.app/

### Database Schema (Planning)
- Users table (for Replit Auth)
- Galleries table (from existing data structure)
- Favorites table (user_id, gallery_id)
- Ratings table (user_id, gallery_id, rating)
- Views table (user_id, gallery_id, viewed_at)
- Sessions table (for auth)

## Current Status
- [x] Successfully migrated to Replit environment
- [x] Set up PostgreSQL database with comprehensive schema
- [x] Migrated all gallery data from JSON to database
- [x] Implemented trending galleries functionality
- [x] Added photo redirect functionality
- [x] Created sticky video widget with random videos
- [x] Removed authentication system per user request
- [ ] Final testing and deployment optimization

## Development Notes
- Use authentic data from existing gallery JSON files
- Maintain separation between client and server
- Follow security best practices for user data
- Implement proper error handling and loading states