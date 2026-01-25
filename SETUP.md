# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase and VedAstro API credentials

3. **Set Up Supabase Database**
   - Go to Supabase SQL Editor
   - Run the SQL migrations from `SQL_MIGRATIONS.sql`

4. **Add App Icons**
   - Create `public/icons/` directory
   - Add these icon files:
     - `icon-192x192.png` (192x192 pixels)
     - `icon-512x512.png` (512x512 pixels)
     - `favicon.ico` (standard favicon)

5. **Run Development Server**
   ```bash
   npm run dev
   ```

6. **Open Browser**
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

- [ ] User can sign up
- [ ] User can log in
- [ ] Panchang page loads and displays data
- [ ] Kundali generation works
- [ ] Matchmaking calculation works
- [ ] Charts can be saved
- [ ] Saved charts can be viewed
- [ ] PDF generation works
- [ ] PWA installs on mobile

## Common Issues

### API Errors
- Check environment variables are set correctly
- Verify Supabase RLS policies are configured
- Ensure VedAstro API key is valid

### Authentication Issues
- Clear browser cookies and localStorage
- Check Supabase auth settings
- Verify redirect URLs in Supabase dashboard

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
