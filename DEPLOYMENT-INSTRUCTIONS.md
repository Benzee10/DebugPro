# Vercel Deployment Instructions

## Quick Start

1. **Push to GitHub**: Make sure all your code is committed and pushed to a GitHub repository

2. **Connect to Vercel**: 
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" 
   - Import your GitHub repository

3. **Deploy**: Vercel will automatically build and deploy your app

## What Happens During Build

1. The `vercel-build.js` script runs first, processing all markdown files in the `data/` directory
2. It generates `api/gallery-data.json` with 103+ gallery posts
3. Vite builds the React frontend 
4. The serverless API functions are set up to serve the gallery data

## API Endpoints (Available on Vercel)

- `/api/gallery-data` - Returns all 103 gallery posts with full metadata
- `/api/galleries/trending` - Returns top 5 trending galleries

## Key Features Working on Vercel

✅ **Data Loading**: All 103 posts from markdown files  
✅ **API Routes**: Serverless functions serve gallery data  
✅ **Photo Redirects**: All images redirect to https://redirect01.vercel.app/  
✅ **Responsive Design**: Works on mobile, tablet, desktop  
✅ **Dark Mode**: Theme switching  
✅ **Video Widget**: Sticky video player with redirect to https://shinyvideos.vercel.app/  

## Troubleshooting

If galleries don't load on Vercel:
1. Check the build logs for any errors
2. Verify the `api/gallery-data.json` file was created during build
3. Test the API endpoints directly: `your-domain.vercel.app/api/gallery-data`

## Development vs Production

- **Development**: Uses markdown files directly via server
- **Production (Vercel)**: Uses pre-built JSON data for faster loading

The app automatically detects the environment and adapts accordingly.