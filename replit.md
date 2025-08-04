# Overview

Shiny Dollop is a modern React-based static gallery blog application featuring Mila Azul photo collections from premium studios. The application follows a gallery-first approach where each collection is organized by model and production studio, with content managed through markdown files. Built as a full-stack application with Express.js backend and React frontend, it provides both static site generation capabilities and dynamic API endpoints for content management.

## Recent Changes (August 2025)
- Replaced sample data with 5 Mila Azul gallery posts from Metart X, Metart, Ultra Films, and Wow Girls
- Updated model structure to focus on single model (Mila Azul) with professional studio content
- Added support for new category types: Metart X, Metart, Ultra Films, Wow Girls
- Updated gallery card styling to handle new model and category color schemes
- Created new markdown file structure under data/mila-azul/ with proper slugs
- **Advanced Features Implementation (August 2025)**:
  - Real-time search with instant results using enhanced Pagefind-style functionality
  - Full-width vertical gallery layout replacing masonry grid
  - Intelligent ad placement with sticky video widget linking to Adsterra SmartLink
  - SEO utilities for automatic sitemap.xml, sitemap-index.xml, and rss.xml generation
  - Archive page with year/category/tag filtering and interactive controls
  - Pagination system for homepage with mid-scroll ad injection
  - Enhanced search panel with live dropdown results and image previews
  - Page transition system for smooth navigation effects
- **Production Deployment Setup (August 2025)**:
  - Vercel deployment configuration with vercel.json
  - Serverless API functions for SEO endpoints (/api/index.ts)
  - GitHub-ready repository structure with .gitignore
  - Production build optimization and static site generation
  - Comprehensive deployment documentation and instructions
- **Vercel Deployment Issues Fixed (August 2025)**:
  - Resolved module system conflicts by creating separate api/package.json with CommonJS
  - Converted api/index.ts to api/index.js to avoid TypeScript compilation issues
  - Inlined gallery data to prevent import path issues during serverless execution
  - Fixed routing configuration in vercel.json for proper function handling
  - Created DEPLOYMENT-GUIDE.md with comprehensive troubleshooting steps

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built with React and Vite, implementing a component-based architecture with modern patterns:

- **Component Structure**: Uses shadcn/ui components for consistent design system implementation
- **Routing**: Implements wouter for lightweight client-side routing with dynamic routes for galleries and models
- **State Management**: Combines local React state with TanStack Query for server state management and localStorage for theme persistence
- **Styling**: Tailwind CSS with CSS custom properties for dynamic theming, including accent hue customization
- **UI Framework**: Radix UI primitives provide accessible component foundations with shadcn/ui styling

## Backend Architecture
Express.js server provides API endpoints and development tooling:

- **API Structure**: RESTful endpoints for gallery data, models, and content management
- **Development Setup**: Vite integration for hot module replacement and development experience
- **Content Management**: File-based content system reading from markdown files in data directory
- **Storage Layer**: Abstracted storage interface supporting both memory storage (development) and database implementations

## Data Architecture
Content-first design using markdown files with frontmatter metadata:

- **File Organization**: Hierarchical structure organized by model and gallery slug (data/model/gallery/index.md)
- **Schema Validation**: Zod schemas for type safety across gallery posts, models, and search filters
- **Image Handling**: Inline markdown images with external URL references for scalability
- **Metadata Management**: YAML frontmatter contains gallery metadata while markdown content includes descriptions and image references

## Key Features
- **Gallery System**: Masonry-style grid layout with lightbox viewing and slideshow functionality
- **Search & Filtering**: Client-side search using Fuse.js with multi-criteria filtering (model, category, tags, date range)
- **Theming**: Dynamic theme switching (light/dark/system) with customizable accent hue
- **Responsive Design**: Mobile-first responsive layout with adaptive sidebar and navigation
- **Performance**: Lazy loading images, optimized rendering, and efficient state management

## Database Integration
While currently using memory storage for development, the application is structured to support:

- **Drizzle ORM**: Configured for PostgreSQL with Neon Database integration
- **Migration System**: Drizzle kit setup for schema management and migrations
- **Environment Configuration**: Database URL configuration through environment variables

# External Dependencies

## Core Framework Dependencies
- **React 18**: Frontend framework with modern hooks and concurrent features
- **Vite**: Build tool and development server for fast development experience
- **Express.js**: Backend server framework for API endpoints and static serving

## Database & ORM
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL integration
- **Neon Database**: Serverless PostgreSQL database platform via @neondatabase/serverless
- **PostgreSQL**: Primary database system (dialect configured in drizzle.config.ts)

## UI & Styling
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Lucide React**: Icon library for consistent iconography

## Content Management
- **Gray Matter**: Frontmatter parser for markdown files
- **Remark/Rehype**: Markdown processing pipeline for content transformation
- **Unified**: Text processing framework for markdown compilation

## Search & Navigation
- **Fuse.js**: Fuzzy search library for client-side content searching
- **Wouter**: Lightweight routing library for single-page application navigation
- **TanStack Query**: Server state management for API data fetching and caching

## Development Tools
- **TypeScript**: Static type checking for improved developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration
- **Date-fns**: Date utility library for formatting and manipulation

## Third-party Integrations
- **Replit Integration**: Development environment support with runtime error overlay and cartographer plugin for enhanced debugging experience