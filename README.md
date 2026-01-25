# Telugu Astrology Web App - Complete Project Guide

## 📋 Project Overview

A free, open-architecture **Telugu astrology web application** featuring daily Panchang, Kundali generation, matchmaking, and PDF downloads. Built with Next.js, deployed on Vercel, with Supabase for user data, and packaged for Android via PWABuilder.

**Target Users**: Telugu-speaking astrology enthusiasts in India and diaspora  
**Monetization**: Ad-supported or freemium (premium Matchmaking reports)  
**Go-to-Market**: Web (Vercel) + Android (Google Play Store)

---

## 🏗️ Architecture Overview

### Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND LAYER                         │
│  Next.js 14 (React) + Tailwind CSS + PWA + TypeScript   │
│  Deployed: Vercel (Global CDN)                          │
└────────────────┬────────────────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼───┐  ┌────▼────┐  ┌────▼────┐
│Supabase│  │VedAstro │  │jsPDF    │
│Auth+DB │  │API      │  │PDF Gen  │
└────────┘  └─────────┘  └─────────┘
    │            │            │
    └────────────┼────────────┘
                 │
        ┌────────▼────────┐
        │  PWABuilder     │
        │  (Android APK)  │
        └─────────────────┘
```

### Free Resource Breakdown

| Service | Free Tier | Limit | Purpose |
|---------|-----------|-------|---------|
| Vercel | 100 GB bandwidth/mo | Deploy Next.js app + serverless functions | Web hosting & API |
| Supabase | 500 MB DB + 2 GB bandwidth | PostgreSQL database | Store user profiles & saved kundalis |
| VedAstro | Public API | Call limits (~1000/day) | Panchang, Kundali, Matchmaking calculations |
| jsPDF | Open source | Unlimited | Generate PDFs client-side (free) |
| PWABuilder | Free tool | Unlimited | Convert web URL to Android APK |
| GitHub | Public repo | Unlimited | Version control + GitHub Actions (free CI/CD) |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (or 20 LTS)
- **npm** or **yarn**
- **Git** for version control
- **Supabase account** (free tier)
- **VedAstro API key** (free API access)
- **Vercel account** (for deployment, free tier)

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your API keys
# Then run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
telugu-astrology-app/
├── public/
│   ├── manifest.json              # PWA manifest
│   ├── serviceWorker.js           # Service worker
│   └── icons/                     # App icons
│
├── src/
│   ├── app/                       # Next.js App Router
│   ├── components/                # React components
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Utilities & API clients
│   ├── context/                   # React contexts
│   ├── types/                     # TypeScript types
│   └── styles/                    # CSS modules
│
├── .env.local                     # Secrets (not committed)
├── .env.example                   # Template
├── next.config.js                 # Next.js config
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

---

## 🔐 Security Checklist

- [x] **Secrets**: Store API keys in `.env.local` (never in code)
- [x] **Auth**: Use Supabase JWT + RLS policies
- [x] **HTTPS**: Vercel auto-enables SSL
- [x] **Input Validation**: Sanitize user inputs
- [ ] **Rate Limiting**: Add rate limits to API routes
- [ ] **GDPR**: Implement data deletion & privacy policy

---

## 🚀 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel deploy
```

Or connect GitHub repo directly in Vercel dashboard.

### Convert to Android App

1. Ensure PWA is live on Vercel
2. Go to [PWABuilder.com](https://www.pwabuilder.com)
3. Enter your URL
4. Download the Android `.aab`
5. Upload to Google Play Console

---

## 📜 License

MIT License - feel free to use, modify, and distribute.

---

**Happy coding! అభినందనలు (Abhinnandanalu - Congratulations)! 🚀**
