# AXION TECHNOLOGIES — DEVELOPMENT GUIDE

## Architecture Overview

Axion Technologies is built on Next.js App Router (React 19, TypeScript), Prisma ORM, and Tailwind CSS v4.

```
src/
├── app/                  # Next.js App Router routes & layouts
│   ├── about/            # Company story, philosophy & capabilities
│   ├── admin/            # Secure CMS Dashboard & management panels
│   ├── api/              # Route Handlers (Auth, Inquiries, Admin CRUD)
│   ├── careers/          # Open engineering vacancies & candidate gate
│   ├── contact/          # Commercial inquiry form & channels
│   ├── insights/         # Technical publications & research
│   ├── products/         # Proprietary software & AI assets
│   ├── services/         # 7 technology divisions & dynamic slugs
│   ├── work/             # Portfolio case studies with filters
│   ├── layout.tsx        # Root layout with dynamic company metadata
│   ├── page.tsx          # Master editorial homepage
│   └── globals.css       # Swiss Minimal Brutalist design system tokens
├── components/
│   ├── forms/            # Contact & inquiry form components
│   ├── layout/           # Header, Footer, Admin Sidebar
│   ├── sections/         # HeroVisual canvas graph, metrics
│   └── ui/               # Button, Badge, FaqAccordion primitives
├── lib/
│   ├── auth.ts           # JWT session signing & cookie verification (jose)
│   ├── prisma.ts         # Resilient multi-database adapter (LibSQL / PG)
│   └── settings.ts       # Dynamic company settings & fallbacks
└── generated/            # Prisma Client artifacts
```

---

## Design System Guidelines

- **Concept**: Experimental Swiss Editorial + Modern Technology + Minimal Brutalism.
- **Palette**:
  - Primary Background: `#101010`
  - Secondary Background: `#181818` / `#141414`
  - Text Primary: `#F5F3EF`
  - Text Secondary: `#A5A5A5`
  - Brand Accent: `#B6FF5C` (Electric Lime / Acid Green)
  - Technical Borders: `#262626` / `#303030`
- **Typography**:
  - Display & Headings: Bold, uppercase, tracking-tight, high-contrast.
  - Technical Markers: Monospaced uppercase with `//` prefixes.
  - Body: Highly readable, generous line height.

---

## Running Automated Tests

Run the test suite:
```bash
npx tsx tests/run-tests.ts
```

Tests verify:
1. Bcrypt password hashing and salt verification.
2. Cryptographic JWT session issuance and expiration checks.
3. Zod schema validation and honeypot anti-spam bot traps.
4. Database configuration fallbacks and company setting synchronization.

---

## Code Quality & Linting

```bash
npm run lint
```
