# MASTER PRODUCTION PROMPT — AXION TECHNOLOGIES
## Complete IT, Software Engineering, AI & Cybersecurity Enterprise Platform

---

### ACT AS
A world-class Creative Director, Brand Strategist, Senior Frontend Architect, Backend Systems Engineer, Database Architect, Application Security Specialist, and DX Engineer.

---

### 1. BRAND IDENTITY & CREATIVE DIRECTION
- **Company Name:** AXION TECHNOLOGIES
- **Tagline:** WE BUILD WHAT'S NEXT.
- **Company Mission:** Transform complex ideas into useful, intelligent, scalable, and secure digital products.
- **Location:** India (Bengaluru & Global Remote).
- **Core Divisions:**
  1. Software Engineering
  2. Artificial Intelligence & Machine Learning
  3. Web Development
  4. Mobile & Desktop Systems
  5. Cybersecurity & VAPT
  6. Cloud Computing & IT Infrastructure
  7. Proprietary SaaS & AI Products
- **Visual Design Concept:** Experimental Swiss Editorial + Modern Technology + Minimal Brutalism (Inspired by Artemii Lebedev Studio).
- **Palette:**
  - Primary Background: `#101010`
  - Secondary / Surface: `#181818`
  - Text Primary: `#F5F3EF`
  - Text Secondary: `#A5A5A5`
  - Brand Accent: `#B6FF5C` (Acid Lime)
  - Grid / Border: `#303030`
- **Typography:** Display Monospace / Space Grotesk + Inter high-density typography.

---

### 2. HERO INTERACTION & AMBIENT RUNNER ARCHITECTURE
1. **Top Header Bar:**
   - Central Company Tagline (`WE BUILD WHAT'S NEXT.`).
   - Right: Real-time ticking 24-hour clock in IST (`HH:mm:ss IST`) + Location (`INDIA, BENGALURU & GLOBAL`).
2. **Top-Left Solid White Floating Dossier Card:**
   - Left: Company wordmark + Studio classification.
   - Middle: Vertical site navigation (`WORK`, `SERVICES`, `PRODUCTS`, `INSIGHTS`, `ABOUT`, `CAREERS`, `CONTACT`).
   - Right: `EXPAND` anchor link scrolling directly to the full technical dossier (`#full-dossier`).
   - Bottom-Left: Inverted black counter badge `[ 7 ] ONGOING DIVISIONS`.
   - Bottom-Right: Commissions & client brief email (`contact@axiontech.in`).
3. **`[ SELECTED WORK ]` Action Pill:**
   - Positioned beneath the dossier card with instant hover response and smooth anchor scroll.
4. **Multi-Video Background Runner & Sequencer:**
   - Dual-buffer video slot architecture (`Slot A` & `Slot B`) with 1000ms CSS opacity crossfades eliminating black screen flashes during clip transitions.
   - 5 Video Streams:
     1. Hardware Switch Logic (`/videos/clip1-hardware.mp4`)
     2. Neural Tensor Graph (`/videos/clip2-neural.mp4`)
     3. Mainframe Cloud Cluster (`/videos/clip3-server.mp4`)
     4. Distributed Pipeline (`/videos/clip4-code.mp4`)
     5. Telemetry Core (`/videos/hero.mp4`)
   - Interactive Scrubber HUD: Visual progress bar, remaining time countdown, time-span duration selectors (`4s`, `6s`, `8s`, `12s`), direct clip jump pills (`[1] [2] [3] [4] [5]`), prev/next navigation, and play/pause toggle.
5. **Procedural 60fps Mechanical Keyboard Canvas Runner:**
   - Procedural HTML5 canvas operating continuously beneath video layers rendering glowing mechanical switches, simulated keypresses with red/orange LEDs, and an oscillating data stream sine wave.
6. **Center-Right Work Index Table:**
   - Monospaced table featuring high-contrast inverted white highlight bar on hover with micro-acoustic sound feedback.
7. **Bottom Controls & Sensory Telemetry:**
   - `PRESS ESC FOR EFFECTS (?)`: Toggles live shader contrast/invert filter matrices.
   - Social directory links (`GITHUB`, `LINKEDIN`, `X (TWITTER)`, `ADMIN`).
   - `CLICK AND HOLD ···`: Interactive button with Web Audio API synthesizer tone generator emitting a 520Hz-1040Hz sine wave tone on hold.

---

### 3. COMPLETE SITEMAP & ROUTE HIERARCHY
#### Public Routes (20 Pages):
1. `/` — Signature Artemii Lebedev Editorial Hero + Full Enterprise Dossier
2. `/about` — Philosophy, Mission, Team, Capabilities, Execution Model
3. `/services` — All 7 Technology Divisions Overview
4. `/services/software` — Custom Software, Enterprise ERP, API Systems
5. `/services/ai-ml` — LLM Assistants, Autonomous Agents, RAG Pipelines
6. `/services/web-development` — High-Concurrency Web Platforms & Dashboards
7. `/services/mobile-development` — Native iOS/Android & Cross-Platform Utilities
8. `/services/cybersecurity` — Authorized VAPT, AppSec, Zero-Trust Auditing
9. `/services/cloud` — Linux Server Administration, Kubernetes, CI/CD
10. `/work` — Filterable Portfolio Case Studies
11. `/work/[slug]` — Deep-dive Case Study Analysis (Challenge, Solution, Results)
12. `/products` — Proprietary Software & AI Suite Listing
13. `/products/[slug]` — Product Specifications, Features, Demo & Docs Links
14. `/insights` — Research Articles & Technical Engineering Blog
15. `/insights/[slug]` — In-depth Technical Paper & Reader
16. `/careers` — Open Engineering Roles & Application Submission Portal
17. `/contact` — Project Brief Intake Gate with Anti-Spam Honeypot
18. `/privacy` — Comprehensive Privacy Policy
19. `/terms` — Terms of Service & Technical Engagements
20. `/_not-found` — Custom Swiss Minimal Brutalist 404 Page

#### Admin Control Plane (11 Subsystems):
- `/admin/login` — Cryptographic Session Login (Bcrypt + Jose JWT)
- `/admin/dashboard` — Live Operations Metrics, Recent Inquiries, Audit Logs
- `/admin/projects` — Case Studies CMS (CRUD, Featured Toggles)
- `/admin/services` — Service Division CMS (Taglines, Descriptions)
- `/admin/products` — Software & AI Product Suite CMS (Feature Management)
- `/admin/blog` — Technical Insights & Publishing Engine
- `/admin/inquiries` — Client Brief CRM (Status Workflows, Internal Notes)
- `/admin/careers` — Applicant Tracking System (Resume/Portfolio Review)
- `/admin/media` — Asset Registry & SVG Vector Explorer
- `/admin/settings` — Company Identity, Brand, & Multi-Video Settings
- `/admin/ui-dx` — UI / DX Studio (Theme Tokens, Telemetry, Cache Purging)
- `/admin/users` — Role-Based Access Control (Super Admin, Admin, Editor)

---

### 4. DATA ARCHITECTURE & PRISMA MULTI-ADAPTER
- Multi-engine Prisma 7 architecture supporting:
  - `@prisma/adapter-libsql` for instant zero-config embedded local SQLite execution (`file:./dev.db`).
  - `@prisma/adapter-pg` for high-throughput enterprise PostgreSQL deployments.
- Core Models:
  - `AdminUser`, `Role`
  - `ServiceCategory`, `Service`
  - `ProjectCategory`, `Project`
  - `Product`, `ProductFeature`
  - `BlogCategory`, `BlogPost`
  - `Inquiry`, `CareerApplication`
  - `MediaAsset`, `CompanySetting`, `AuditLog`

---

### 5. SECURITY, VALIDATION & ANTI-SPAM
- Passwords salted and hashed with `bcryptjs` (cost factor 10).
- Session tokens signed with `jose` using HS256 HMAC and HttpOnly Secure cookies.
- All client form submissions strictly parsed with `zod` schemas.
- Anti-spam honeypot verification (`website_trap`) rejecting automated bots silently.
- In-memory rate limiting preventing API abuse.

---

### 6. STEP-BY-STEP VERIFICATION PROCEDURE
1. **Compile & Run Test Suite:**
   ```bash
   npx tsx tests/run-tests.ts
   ```
2. **Execute Full Production Build:**
   ```bash
   npm run build
   ```
3. **Launch Production Server:**
   ```bash
   npm start
   ```
4. **Access Endpoints:**
   - Public Website: `http://localhost:3000`
   - Admin Login: `http://localhost:3000/admin/login` (`admin@axiontech.in` / `Admin@Axion2026!`)
   - UI / DX Studio: `http://localhost:3000/admin/ui-dx`
