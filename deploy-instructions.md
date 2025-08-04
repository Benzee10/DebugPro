# Deployment Instructions for GitHub + Vercel

## Step 1: Prepare for GitHub

1. **Initialize Git repository** (if not already done):
```bash
git init
```

2. **Add all files to Git**:
```bash
git add .
git commit -m "Initial commit: Shiny Dollop gallery blog"
```

3. **Create GitHub repository**:
   - Go to [github.com](https://github.com) and create a new repository
   - Name it `shiny-dollop` or your preferred name
   - Don't initialize with README (we already have one)

4. **Connect local repo to GitHub**:
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Connect via Vercel Dashboard (Recommended)

1. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**:
   - Click "New Project"
   - Select your GitHub repository
   - Vercel will automatically detect the `vercel.json` configuration

3. **Configure Build Settings** (if needed):
   - Build Command: `npm run vercel-build`
   - Output Directory: `client/dist`
   - Install Command: `npm install`

4. **Deploy**:
   - Click "Deploy"
   - Your site will be live at `https://your-project-name.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login and Deploy**:
```bash
vercel login
vercel --prod
```

## Step 3: Environment Variables (if needed)

If you plan to add environment variables later:

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add variables like `DATABASE_URL`, `API_KEYS`, etc.

## Step 4: Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Navigate to "Domains"
   - Add your custom domain

## Key Files for Deployment

- `vercel.json` - Vercel configuration
- `api/index.ts` - Serverless API functions
- `client/dist/` - Built client files (auto-generated)
- `.gitignore` - Excludes unnecessary files
- `README.md` - Project documentation

## Automatic Deployments

Once connected to GitHub:
- Every push to `main` branch triggers automatic deployment
- Pull request previews are automatically generated
- Build logs are available in Vercel dashboard

## SEO Features Available

After deployment, these URLs will be automatically available:
- `https://your-domain.vercel.app/sitemap.xml`
- `https://your-domain.vercel.app/sitemap-index.xml`
- `https://your-domain.vercel.app/rss.xml`

## Troubleshooting

1. **Build Fails**: Check build logs in Vercel dashboard
2. **API Routes Not Working**: Verify `api/index.ts` structure
3. **Assets Not Loading**: Check build output in `client/dist/`

## Performance Optimizations

The project includes:
- ✅ Static site generation for fast loading
- ✅ Serverless functions for SEO endpoints
- ✅ Optimized images and assets
- ✅ Automatic CDN distribution via Vercel Edge Network