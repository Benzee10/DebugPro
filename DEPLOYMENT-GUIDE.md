# Vercel Deployment Guide - Fixed Issues

## Problems Fixed

### 1. Module System Conflicts
- **Issue**: The main `package.json` has `"type": "module"` but Vercel functions need CommonJS
- **Solution**: Created separate `api/package.json` with `"type": "commonjs"` and converted API function to pure JavaScript

### 2. Import Path Issues  
- **Issue**: API function was importing from client directory which isn't available during serverless execution
- **Solution**: Inlined all gallery data directly into the API function to avoid external dependencies

### 3. Build Configuration
- **Issue**: Mixed ESM and CommonJS causing compilation errors
- **Solution**: Created `api/index.js` (plain JavaScript) instead of TypeScript to avoid build complexity

### 4. Runtime Version Error
- **Issue**: Vercel error "Function Runtimes must have a valid version"
- **Solution**: Removed explicit functions configuration from vercel.json - Vercel auto-detects API functions

### 5. Output Directory Mismatch
- **Issue**: vercel.json outputDirectory didn't match Vite build output path
- **Solution**: Updated outputDirectory to "dist/public" to match vite.config.ts build.outDir

### 6. File Path Conflicts
- **Issue**: Vercel error "Two or more files have conflicting paths or names" with api/index.js and api/index.ts
- **Solution**: Removed api/index.ts since we're using the JavaScript version for deployment

### 7. Vite Build Entry Module Error
- **Issue**: Vite build error "Could not resolve entry module 'index.html'" during Vercel build
- **Solution**: Updated vercel.json to use production Vite config with proper root and output directory settings

### 8. Vite Config File Resolution Error
- **Issue**: Vercel error "Could not resolve vite.config.production.ts" - config file was being excluded
- **Solution**: Removed vite.config files from .vercelignore and added explicit input path in rollupOptions

## Current Structure

```
api/
├── index.js          # Main serverless function (CommonJS)
├── package.json      # Separate package config for API
vercel.json           # Updated deployment configuration
```

## Key Changes Made

1. **Created `api/index.js`** - Pure JavaScript serverless function using CommonJS
2. **Created `api/package.json`** - Separate package configuration for the API
3. **Updated `vercel.json`** - Fixed routing to use `.js` file instead of `.ts`
4. **Inlined Data** - All gallery data is now embedded directly in the API function

## Routes Handled

The API function handles:
- `/sitemap.xml` - SEO sitemap generation
- `/sitemap-index.xml` - Sitemap index
- `/rss.xml` - RSS feed
- `/api/health` - Health check endpoint
- `/api/galleries` - Gallery data endpoint

## Final Working Configuration

- **Build Command**: `vite build --config vite.config.production.ts`
- **Output Directory**: `dist/public`
- **API Function**: `api/index.js` (auto-detected by Vercel)
- **Root**: `./client` (set in production Vite config)

## Deployment Steps

1. Commit all changes to your repository
2. Connect repository to Vercel
3. Deploy - Vercel will:
   - Run `vite build --config vite.config.production.ts` to build the client
   - Deploy `api/index.js` as a serverless function
   - Serve static files from `dist/public`

## Testing

After deployment, test these endpoints:
- `https://your-domain.vercel.app/api/health`
- `https://your-domain.vercel.app/sitemap.xml`
- `https://your-domain.vercel.app/api/galleries`

The deployment should now work without module system conflicts.