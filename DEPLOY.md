# Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel Blob Store**: Created from the Vercel project's Storage tab (provides `BLOB_READ_WRITE_TOKEN`)
3. **GitHub Account**: For version control (optional but recommended)

## Step 1: Set Up Vercel Blob

1. In the Vercel dashboard, open your project
2. Go to **Storage** → **Create Store** → **Blob**
3. Connect the store to the project — Vercel will automatically inject `BLOB_READ_WRITE_TOKEN` into the project's environment variables
4. For local development, copy that token into `.env.local` (see `.env.example`)

## Step 2: Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx
```

That is the only required variable. All astrological calculations (Panchang, Kundali, Matchmaking) run locally via `astronomy-engine` — no external API keys are needed.

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
4. The Blob store created in Step 1 will already have provisioned `BLOB_READ_WRITE_TOKEN` — verify it appears under Project Settings → Environment Variables
5. Click "Deploy"

### Option B: Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts.

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

- [ ] Panchang loads and shows Samvatsara, Masa, Tithi, Nakshatra, etc.
- [ ] Kundali generation works
- [ ] Matchmaking calculation works
- [ ] PDF generation works
- [ ] Saved charts page lists PDFs from Vercel Blob and opens them on tap
- [ ] Verify PWA installation works
- [ ] Check mobile responsiveness
- [ ] Monitor function logs in Vercel dashboard

## Troubleshooting

### Save / Upload Errors

- Verify `BLOB_READ_WRITE_TOKEN` is set in Vercel project env vars
- Check Vercel function logs for `/api/drive/upload-pdf` and `/api/drive/charts`
- Confirm the generated PDF is under Vercel's 4.5 MB request body limit (PDFs are compressed at scale 1.5 / JPEG q=0.85)

### PWA Issues

- Check `manifest.json` is accessible
- Verify service worker is registered
- Test HTTPS (required for PWA)

## Support

For issues, check:
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)
- [Vercel Docs](https://vercel.com/docs)
