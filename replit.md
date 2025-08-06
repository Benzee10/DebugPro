# Shiny Dollop - Premium Photo Gallery

## Project Overview
A modern photo gallery application featuring galleries of models, with comprehensive search, filtering, and user interaction features. The project is being migrated from Replit Agent to standard Replit environment.

## Recent Changes
- **2025-08-06**: Successfully completed migration from Replit Agent to standard Replit environment
- **2025-08-06**: Implemented infinite scroll functionality on homepage for better UX
- **2025-08-06**: Fixed trending section to show actual galleries with simulated view counts
- **2025-08-06**: Enhanced homepage to load 12 galleries initially with infinite scroll loading
- **2025-08-06**: Created custom useInfiniteScroll hook for scroll pagination
- **2025-08-06**: Fixed search results navigation to use proper routing instead of window.location
- **2025-08-06**: Updated gallery cards to open lightbox when clicking images
- **2025-08-06**: Implemented full-size images in masonry grid layout on homepage
- **2025-08-06**: Fixed TypeScript errors for nullable tags in gallery components
- **2025-08-06**: Improved "Trending Now" section alignment and layout
- **2025-08-05**: Removed PostgreSQL database per user request - now using JSON/markdown data source
- **2025-08-05**: Implemented photo redirect functionality to https://redirect01.vercel.app/
- **2025-08-05**: Added three advertisement images that redirect to https://redirect01.vercel.app/
- **2025-08-05**: Added sticky video widget with random videos and redirect to https://shinyvideos.vercel.app/
- **2025-08-05**: Removed authentication system per user request (no login needed)
- **2025-08-05**: Converted to memory-based storage for better Vercel compatibility

## User Preferences
- Redirect all photo clicks to: https://redirect01.vercel.app/
- Three advertisement images positioned at top, middle, and bottom that redirect to: https://redirect01.vercel.app/
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
- **Data Source**: JSON files + Markdown content (no database)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: None (removed per user request)
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
- [x] Removed database and switched to JSON/markdown data source
- [x] Implemented memory-based storage for better performance
- [x] Implemented trending galleries functionality
- [x] Added photo redirect functionality
- [x] Created sticky video widget with random videos
- [x] Removed authentication system per user request
- [x] Homepage displays galleries in responsive grid layout (1/2/3 columns)
- [x] Fixed Models and Archive pages with proper API endpoints
- [x] Ready for deployment to Vercel or other platforms
- [x] Post creation system documented and template provided

## Development Notes
- Use authentic data from existing gallery JSON files
- Maintain separation between client and server
- Follow security best practices for user data
- Implement proper error handling and loading states