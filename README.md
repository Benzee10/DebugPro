# Shiny Dollop - Premium Gallery Blog

A modern React-based photo gallery blog featuring Mila Azul collections from premium studios including Metart, Ultra Films, and Wow Girls.

## Features

- **Real-time Search**: Instant search results with image previews
- **Full-Width Gallery Layout**: Beautiful vertical image display
- **Intelligent Ad Placement**: Strategic ad positioning throughout content
- **SEO Optimized**: Auto-generated sitemaps and RSS feeds
- **Archive System**: Filter by year, studio, and tags
- **Responsive Design**: Mobile-first responsive layout
- **Dark/Light Theme**: Dynamic theme switching
- **Fast Performance**: Optimized loading and transitions

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, Node.js
- **UI Components**: Radix UI, shadcn/ui
- **Search**: Custom client-side search implementation
- **Deployment**: Vercel-ready configuration

## Quick Start

### Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd shiny-dollop
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:5000](http://localhost:5000) in your browser

### Deployment on Vercel

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Connect your GitHub repository to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration from `vercel.json`

3. Your site will be deployed automatically!

## Project Structure

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
│   └── storage.ts        # Data storage layer
├── data/                 # Markdown content files
│   └── mila-azul/        # Gallery content
├── shared/               # Shared types and schemas
└── vercel.json          # Vercel deployment configuration
```

## Content Management

Gallery posts are stored as markdown files in the `data/` directory:

```
data/
└── mila-azul/
    ├── lace-morning/
    │   └── index.md
    ├── candy-kiss/
    │   └── index.md
    └── ...
```

Each gallery includes:
- Title and description
- Publication date
- Studio category
- Tags
- Image URLs
- Cover image

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:client` - Build client only
- `npm run build:server` - Build server only
- `npm run vercel-build` - Vercel build command

## SEO Features

The application automatically generates:
- `/sitemap.xml` - Complete sitemap
- `/sitemap-index.xml` - Sitemap index
- `/rss.xml` - RSS feed

## License

This project is for educational and portfolio purposes.