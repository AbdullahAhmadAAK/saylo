# Saylo Landing Page

Next.js 14 landing page for Saylo — AI meeting intelligence.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

## Deployment

### Option A — Vercel (recommended, fastest)
1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import repo
3. Click Deploy (zero config needed for Next.js)
4. Add your custom domain in Project Settings → Domains

### Option B — Any Node.js server
```bash
npm run build
npm run start   # runs on port 3000 by default
```

Use nginx or Caddy as a reverse proxy in front of port 3000.

### Option C — Static export (if no server needed)
Add to `next.config.js`:
```js
const nextConfig = { output: 'export' }
```
Then run `npm run build` — outputs to `/out` folder. Upload to any static host (S3, Cloudflare Pages, etc.)

## Customisation

- **Brand name / copy** — edit `app/page.tsx`
- **Colors / fonts** — edit `app/globals.css` (CSS variables at top)
- **Waitlist form** — connect the `handleSubmit` function in `page.tsx` to your email provider (Mailchimp, ConvertKit, etc.)
- **SEO metadata** — edit `app/layout.tsx`

## Structure

```
saylo-landing/
├── app/
│   ├── layout.tsx      # Root layout + metadata + fonts
│   ├── page.tsx        # Full landing page component
│   └── globals.css     # All styles
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```
