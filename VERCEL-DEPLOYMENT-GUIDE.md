# Vercel Deployment Guide for Gallery App

## Current Status
✅ **Working on Replit**: 101 galleries loading successfully  
🔧 **Vercel Issue**: FUNCTION_INVOCATION_FAILED error fixed with new API structure  

## Fixed Issues

### 1. Serverless Function Structure
- **Old**: Single `api/index.js` file handling all routes
- **New**: Separate API files for better reliability:
  - `api/gallery-data.js` - Main gallery data endpoint
  - `api/galleries/trending.js` - Trending galleries endpoint

### 2. Import Method
- **Old**: Using `fs.readFileSync()` which can fail in serverless
- **New**: Direct JSON imports with `assert { type: 'json' }`

### 3. Error Handling
- Added CORS headers
- Proper method validation
- Better error responses

## Deployment Steps

1. **Build Data**: Run `node vercel-build.js` (builds 103 posts)
2. **Push to GitHub**: Commit all changes 
3. **Deploy on Vercel**: Import repository
4. **Automatic Build**: Vercel runs build command automatically

## API Endpoints (Vercel)
- `https://your-app.vercel.app/api/gallery-data` - All 103 galleries
- `https://your-app.vercel.app/api/galleries/trending` - Top 5 trending

## Testing Vercel Deployment
```bash
# Test gallery data
curl https://your-app.vercel.app/api/gallery-data

# Test trending
curl https://your-app.vercel.app/api/galleries/trending
```

## Key Features Working
✅ All 103 galleries from markdown files  
✅ Photo redirects to https://redirect01.vercel.app/  
✅ Video widget with https://shinyvideos.vercel.app/ redirect  
✅ Responsive design with dark/light themes  
✅ Clean, fast loading homepage  

The app now uses a more reliable serverless architecture that should work consistently on Vercel.