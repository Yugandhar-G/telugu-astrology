# Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
3. **VedAstro API Key**: Get from [vedastro.org](https://vedastro.org)
4. **GitHub Account**: For version control (optional but recommended)

## Step 1: Set Up Supabase

1. Create a new project in Supabase
2. Go to Settings → API and copy:
   - Project URL
   - Anon/Public Key
   - Service Role Key (keep secret!)
3. Go to SQL Editor and run the migration script (see README.md)
4. Enable Row Level Security (RLS) on all tables

## Step 2: Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
NEXT_PUBLIC_VEDASTRO_API_URL=https://api.vedastro.com
VEDASTRO_API_KEY=your-vedastro-api-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_NAME=Telugu Astrology
NEXT_PUBLIC_SUPPORT_EMAIL=your-email@example.com
```

## Step 3: Deploy to Vercel

### Option A: Via GitHub (Recommended)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/telugu-astrology-app.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) and click "New Project"
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
5. Click "Deploy"

### Option B: Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts and add environment variables when asked.

## Step 4: Configure PWA

1. Ensure `public/manifest.json` is correct
2. Add app icons to `public/icons/`:
   - `icon-192x192.png`
   - `icon-512x512.png`
   - `favicon.ico`
3. Test PWA installation on mobile devices

## Step 5: Convert to Android App (PWABuilder)

1. Ensure your app is live on Vercel (e.g., `https://your-app.vercel.app`)
2. Go to [PWABuilder.com](https://www.pwabuilder.com)
3. Enter your Vercel URL
4. Click "Start" and follow the wizard
5. Download the Android `.aab` file
6. Upload to Google Play Console:
   - Sign up for Google Play Developer account ($25 one-time fee)
   - Create a new app
   - Upload the `.aab` file
   - Add screenshots, description in Telugu
   - Submit for review

## Step 6: Post-Deployment Checklist

- [ ] Test authentication (signup/login)
- [ ] Test Panchang API calls
- [ ] Test Kundali generation
- [ ] Test Matchmaking calculation
- [ ] Test PDF generation
- [ ] Test saved charts functionality
- [ ] Verify PWA installation works
- [ ] Check mobile responsiveness
- [ ] Test offline functionality
- [ ] Monitor error logs in Vercel dashboard

## Troubleshooting

### API Errors

- Check environment variables are set correctly
- Verify Supabase RLS policies are configured
- Check VedAstro API key is valid
- Review Vercel function logs

### Authentication Issues

- Ensure Supabase auth is enabled
- Check redirect URLs in Supabase dashboard
- Verify cookies are being set correctly

### PWA Issues

- Check `manifest.json` is accessible
- Verify service worker is registered
- Test HTTPS (required for PWA)

## Support

For issues, check:
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
