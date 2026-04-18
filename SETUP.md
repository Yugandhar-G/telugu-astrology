# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your Vercel Blob token (see `.env.example` for instructions)

3. **Add App Icons**
   - Create `public/icons/` directory
   - Add these icon files:
     - `icon-192x192.png` (192x192 pixels)
     - `icon-512x512.png` (512x512 pixels)
     - `favicon.ico` (standard favicon)

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   - Navigate to `http://localhost:3000`

## Required Icons

You need to create app icons for the PWA. Place them in `public/icons/`:

- `icon-192x192.png` - 192x192 pixels, PNG format
- `icon-512x512.png` - 512x512 pixels, PNG format
- `favicon.ico` - Standard favicon

You can use online tools like:
- [Favicon Generator](https://favicon.io/)
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)

## Testing Checklist

- [ ] Panchang page loads and displays data
- [ ] Kundali generation works
- [ ] Matchmaking calculation works
- [ ] Charts can be saved as PDFs to Vercel Blob
- [ ] Saved charts page lists PDFs and opens them on tap
- [ ] PDF generation works
- [ ] PWA installs on mobile

## Common Issues

### Save / Upload Errors
- Verify `BLOB_READ_WRITE_TOKEN` is set in `.env.local` (and in Vercel project env vars for production)
- Confirm a Blob store is created in the Vercel dashboard for the project
- Check the browser console and `/api/drive/upload-pdf` response for the exact error

### Build Errors
- Run `npm install` again
- Delete `node_modules` and `.next` folders
- Clear npm cache: `npm cache clean --force`

## Next Steps

1. Customize the UI colors and styling
2. Add more Telugu translations
3. Implement additional features
4. Deploy to Vercel (see DEPLOY.md)
5. Convert to Android app using PWABuilder
