# URRUTIA WASH & DETAIL — FULL BUILD SPECIFICATION

**Document:** Master Build Spec / Path to 100% Production
**Client:** Urrutia Carwash & Detail (LVAC Henderson, NV)
**Author:** MachineMind LLC
**Version:** 1.0
**Status:** Authoritative reference — every other doc defers to this one
**Last updated:** April 29, 2026

---

## HOW TO READ THIS DOCUMENT

This is the contract between MachineMind and the build. Anything not in this document is **out of scope**. Anything in this document is **required for 100% completion**. The build is not "done" until every Acceptance Criterion in **Part 21** is checked.

The doc is organized so you can read it cover-to-cover (recommended once) or jump to any module/system when you're building it. Each section answers one question: *what specifically must exist for this to be complete?*

---

# PART 0 — STRATEGIC FRAME (READ FIRST, NEVER FORGET)

This is not a notification app. It is a **time-arbitrage operating system** with a car wash as its anchor product. Every architectural decision must protect three blue ocean vectors:

| Vector | What It Means | What Must Be True |
|---|---|---|
| **Data Moat** | The platform accumulates vehicle profiles, condition history, and frequency cycles that compound over time | Every wash creates structured records: plate, vehicle, service, photos, timestamps, customer behavior |
| **Workflow Lock-in** | Members get convenience that's painful to abandon (auto-billing, Apple Wallet, plate recognition, pre-saved vehicle) | Cancellation must require active effort. The product must replace the customer's manual process, not augment it |
| **Distribution Loop** | LVAC is a captive distribution channel; referrals compound it; the model is replicable to any gym lot | Referral mechanic must be built in from Day 1, not retrofitted. Architecture must be tenant-aware (LVAC Henderson is the first tenant of many) |

**If a feature would weaken any of these three vectors, do not build it.** If a feature would strengthen any of them and is not yet specced, add it.

---

# PART 1 — COMPLETION DEFINITION

The build is 100% complete when **all four modules below** are deployed, tested, and operational:

1. **Marketing Website** — public-facing, converts visitors into bookings/members
2. **Customer PWA** — authenticated, lets members book / track / pay / refer
3. **Operator Console** — Urrutia and his crew run the daily operation here
4. **Owner Console** — Urrutia (and MachineMind) see the business metrics here

Plus the supporting infrastructure: database, payments, SMS, auth, monitoring, legal pages, SEO, analytics, backups, and domain/SSL.

Acceptance criteria for the full system are in **Part 21**.

---

# PART 2 — SYSTEM ARCHITECTURE

```
┌───────────────────────────────────────────────────────────────────────────┐
│                          PUBLIC INTERNET                                  │
└────────────────────┬──────────────────────┬───────────────────────────────┘
                     │                      │
                     ▼                      ▼
        ┌────────────────────┐   ┌──────────────────────┐
        │  MARKETING SITE    │   │   CUSTOMER PWA       │
        │  urrutiawash.com   │   │   app.urrutiawash    │
        │  (Next.js, public) │   │   (Next.js, auth)    │
        └─────────┬──────────┘   └──────────┬───────────┘
                  │                          │
                  └──────────┬───────────────┘
                             ▼
                ┌────────────────────────┐
                │  VERCEL EDGE / API     │  ← Next.js API routes + Edge Functions
                │  Server Components      │
                └───────────┬────────────┘
                            │
        ┌───────────────────┼────────────────────┐
        │                   │                    │
        ▼                   ▼                    ▼
┌──────────────┐   ┌────────────────┐   ┌────────────────┐
│  SUPABASE    │   │   STRIPE       │   │   TWILIO       │
│  Postgres    │   │   Payments     │   │   SMS + WA     │
│  Auth        │   │   Subscriptions│   │   Verify (OTP) │
│  Storage     │   │   Webhooks     │   │                │
│  Realtime    │   └────────────────┘   └────────────────┘
│  Edge Funcs  │
└──────┬───────┘
       │
       │  (Realtime channel)
       ▼
┌──────────────────────────────────────────────────────────────┐
│  OPERATOR CONSOLE                                            │
│  ops.urrutiawash.com  (Next.js, role-gated)                  │
│  Live queue, status updates, photos, walk-ins, member lookup │
└──────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  OWNER CONSOLE                                               │
│  ops.urrutiawash.com/admin  (Urrutia + MachineMind)          │
│  Revenue, churn, LTV, referrals, member CRUD, comps          │
└──────────────────────────────────────────────────────────────┘
```

**Single Next.js app, four route groups:**
```
/(marketing)/*     → public site
/(app)/*           → customer PWA (auth required)
/(ops)/*           → operator console (operator role)
/(admin)/*         → owner/admin console (admin role)
```

This is intentional — one codebase, one deploy, role-gated routes. Easier to maintain than four separate apps. Vercel handles all of it.

**Supporting services:**
- **Cloudflare** — DNS, CDN, DDoS protection (free tier is fine to start)
- **Sentry** — error monitoring (free tier covers MVP)
- **PostHog** — product analytics + session replay (free tier: 1M events/mo)
- **Resend** — transactional email (free tier: 3k/mo)

---

# PART 3 — MODULE SPECIFICATIONS

## 3.1 — MARKETING WEBSITE (Module 1)

### 3.1.1 Pages required

| Route | Purpose | Status |
|---|---|---|
| `/` | Hero, services, memberships, gallery, FAQ, CTA | ✅ Built (urrutia-website.html) — needs migration to Next.js |
| `/services` | Detailed breakdown of each service tier | ❌ Build |
| `/memberships` | Membership comparison + signup flow | ❌ Build |
| `/gallery` | Full portfolio (Cullinan, G63, Raptor, F-450, etc.) | ❌ Build |
| `/locations` | LVAC Henderson + future locations | ❌ Build |
| `/mobile` | Mobile detailing service page | ❌ Build |
| `/about` | Story, owner bio, why LVAC | ❌ Build |
| `/contact` | Form, phone, hours, map | ❌ Build |
| `/refer` | Public referral landing (`/refer/[code]`) | ❌ Build |
| `/book` | Full booking flow (also embedded modal on `/`) | ❌ Build |
| `/login` | Member login (redirects to PWA) | ❌ Build |
| `/privacy` | Privacy policy | ❌ Build (legal) |
| `/terms` | Terms of service | ❌ Build (legal) |
| `/refund-policy` | Refund + cancellation | ❌ Build (legal) |
| `/sms-consent` | TCPA-compliant SMS opt-in disclosure | ❌ Build (legal) |
| `/accessibility` | ADA statement | ❌ Build (legal) |
| `/sitemap.xml` | Auto-generated | ❌ Build |
| `/robots.txt` | Auto-generated | ❌ Build |

### 3.1.2 Content requirements

- **Real photography** — minimum 12 hero-quality vehicle photos (Cullinan, G63 AMG, Raptor, F-450, BMW V8, AMG, plus 6 more). Format: WebP, 1920w max, lazy-loaded. Source: Urrutia's IG (@lvacwashndetail).
- **Hero video** — 8–15 second loop of detailing in progress. WebM + MP4. Muted autoplay. Fallback to static hero image. Source: shoot on-site.
- **Real testimonials** — minimum 6 written testimonials with name + vehicle + photo. Pulled from existing customers; get written consent.
- **Owner bio** — Urrutia's story, headshot, 2–3 paragraphs. Trust currency.
- **Before/after gallery** — minimum 8 paired before/after shots demonstrating ceramic, paint correction, interior detail.
- **Spanish version** — full site mirrored at `/es/*` (Vegas Hispanic market is significant; LVAC member base reflects this). Use Next.js i18n routing.

### 3.1.3 Functional requirements

| Function | Requirement |
|---|---|
| Booking modal | Captures: name, phone, email, vehicle make/model/year, plate, service tier, location (LVAC or mobile), preferred date/time, notes. Validates phone format. Anti-spam (hCaptcha invisible). On submit: writes to DB, fires SMS confirmation, sends owner email notification. |
| Membership signup | Tier selector → Stripe Checkout → on success, writes member record, emails welcome, generates Apple Wallet pass, sends SMS with pass link. |
| Live availability | Calendar shows next 7 days; blocks already-booked slots; respects business hours (Mon–Sat 7–4:30); accounts for service duration (express 30min, full wash 60min, detail 4hr, ceramic full day). |
| Search | Press `/` to open search across services, FAQ, gallery |
| Live chat | Optional Phase 1.5 — Crisp.chat free tier or just Twilio WhatsApp deep link |
| Newsletter signup | Footer form → Resend → drip sequence (welcome + 3 educational emails on car care) |
| Loyalty/referral capture | Public `/refer/[code]` route reads referrer code, stores in cookie 30 days, applies $25 credit at signup |

### 3.1.4 Non-functional requirements

- **Performance:** Lighthouse score ≥ 95 on mobile and desktop
- **First Contentful Paint** ≤ 1.2s on 4G
- **Largest Contentful Paint** ≤ 2.5s
- **Cumulative Layout Shift** < 0.1
- **Bundle size** ≤ 150KB gzipped (initial load)
- **Image optimization:** Next.js `<Image>` component with `priority` on hero, `lazy` on rest
- **Fonts:** Self-hosted Outfit + Space Mono via `next/font` (no Google Fonts CDN)
- **Mobile-first:** All breakpoints tested down to 320px width
- **Dark mode:** Default dark (matches Urrutia brand); light mode optional v2

### 3.1.5 SEO requirements

- **Meta tags:** Every page has unique `<title>`, `<meta description>`, OG tags, Twitter cards
- **Schema.org structured data:** `LocalBusiness` + `AutoRepair` + `Service` + `Review` + `FAQPage` JSON-LD on every relevant page
- **Sitemap:** Auto-generated, submitted to Google Search Console + Bing Webmaster
- **robots.txt:** Allow all, point to sitemap
- **Canonical URLs:** Every page has `<link rel="canonical">`
- **Hreflang:** EN/ES versions properly cross-linked
- **Local SEO:** Google Business Profile claimed and synced (NAP consistency: Name, Address, Phone — must match website exactly)
- **Location keywords:** "car wash henderson nv", "auto detailing las vegas", "ceramic coating henderson", "lvac car wash", "mobile detailing las vegas"
- **Breadcrumbs:** On every non-home page, with structured data

### 3.1.6 Conversion infrastructure

- **CTAs:** Sticky bottom-bar CTA on mobile ("Book Now" or "$89/mo SOLO"). Floating "Book" button on desktop scroll.
- **Exit intent:** Modal offers $20 off first detail in exchange for phone (one-time, dismissible, respects "don't show again")
- **Heatmap:** PostHog session recording enabled on all pages (privacy-respecting; ask consent via banner)
- **A/B testing infrastructure:** PostHog flags ready (test pricing display, hero copy, CTA color)
- **Conversion events tracked:** page_view, hero_cta_click, book_modal_open, booking_submitted, membership_view, membership_purchased, referral_link_copied, phone_clicked, email_clicked

### 3.1.7 Trust signals

- Insurance/bonding badge ("Fully insured & bonded")
- Years in business
- Total cars washed counter (live from DB)
- Star rating (pulled from Google Reviews API or Trustpilot)
- "As seen at LVAC Henderson" (with LVAC logo if partnership permits)
- BBB accreditation if applicable
- Payment method icons in footer

---

## 3.2 — CUSTOMER PWA (Module 2)

### 3.2.1 Views required

| Screen | Purpose | Status |
|---|---|---|
| `/login` | Phone OTP login (Twilio Verify) | ❌ Build |
| `/onboarding` | First-time vehicle add + membership offer | ❌ Build |
| `/home` | Greeting, active wash card, quick actions, garage | ✅ Built (prototype) — needs DB wiring |
| `/book` | 4-step booking flow | ✅ Built (prototype) — needs DB wiring |
| `/track/[washId]` | Live status timeline + photos | ✅ Built (prototype) — needs realtime |
| `/track/public/[code]` | Public tracking (share with non-members, no login) | ❌ Build |
| `/member` | Wallet pass, punch card, history | ✅ Built (prototype) — needs DB |
| `/member/manage` | Pause, upgrade, downgrade, cancel | ❌ Build |
| `/refer` | Code, share, stats | ✅ Built (prototype) — needs DB |
| `/profile` | Name, email, phone, password, notification prefs | ❌ Build |
| `/vehicles` | Add/edit/remove vehicles | ❌ Build |
| `/payment-methods` | Stripe-managed cards | ❌ Build |
| `/billing` | Invoices, receipts, subscription status | ❌ Build |
| `/help` | FAQ, contact support, WhatsApp deep link | ❌ Build |
| `/notifications` | In-app notification center | ❌ Build |
| `/settings` | Language, theme, push prefs, privacy | ❌ Build |

### 3.2.2 Auth flow (complete)

```
1. User enters phone number
2. POST /api/auth/send-otp → Twilio Verify sends 6-digit SMS code
3. User enters code
4. POST /api/auth/verify-otp → Twilio confirms
5. Server creates or fetches Supabase user, issues JWT (httpOnly cookie)
6. Redirect:
   - First-time → /onboarding (add vehicle + see membership offer)
   - Returning → /home

Session: 30-day rolling JWT in httpOnly cookie. Refresh on every authed request.
Logout: clears cookie + revokes Supabase session.

Biometric: After first OTP, offer to enable WebAuthn (Touch ID / Face ID)
for re-auth on returning visits (browser support permitting).
```

### 3.2.3 PWA requirements

- **Manifest:** `manifest.json` with app name, icons (192, 256, 512), theme color (#00B4FF water), background (#050810 void), display: standalone
- **Service worker:** Workbox-based, caches shell + assets, offline fallback page
- **Install prompts:** Custom "Add to Home Screen" banner after 2nd visit
- **Push notifications:** Web Push API; users opt-in after first booking; encrypted with VAPID keys
- **Offline mode:** App shell works offline; booking falls back to "queue and sync when online"
- **Apple iOS specifics:** Apple touch icons, splash screens for every iPhone size, status bar style
- **Background sync:** Queue mutations (booking submit, profile update) when offline; flush when back online

### 3.2.4 Apple Wallet pass (PassKit)

- **Pass type:** Store Card (`.pkpass`)
- **Fields:** Member name, tier (SOLO/DUO/FLEET), member since, current punch count, member ID (QR code)
- **Backside:** Phone, address, hours, terms link
- **Assets:** Logo (160x50@2x), strip image (375x144@2x), icon (29x29@2x)
- **Push updates:** When status changes (renewal, punch increment, free wash earned), update pass via Apple's web service
- **Generation:** Server-side via `passkit-generator` Node lib; signed with Apple Developer cert ($99/yr)

### 3.2.5 Google Wallet pass

- Equivalent to Apple Wallet via Google Pay API for Passes
- Loyalty Card object type
- Issuer ID required (free, set up via Google Pay Business Console)

### 3.2.6 Booking flow (complete)

```
Step 1 — Vehicle: Pick from saved or add new (make, model, year, color, plate)
Step 2 — Service: Express / Wash+Interior / Detail / Ceramic
Step 3 — Location: LVAC drop-off OR mobile (address required)
Step 4 — Time: Calendar shows next 7 days; greyed-out unavailable slots; member sees priority slots
Step 5 — Confirm: Summary + price + member discount applied if eligible + Stripe Payment Intent

On confirm:
- Create wash record (status: SCHEDULED)
- If non-member: charge card via Stripe
- If member: deduct from monthly wash credit OR charge for upgrade (e.g. SOLO member adding interior)
- SMS: "Booking confirmed for [date/time]"
- WhatsApp option: identical message via WA API if user prefers
- Email confirmation with calendar invite (.ics)
- Push notification (if granted)
```

### 3.2.7 Live wash tracking

- Customer sees real-time status updates pushed via Supabase Realtime
- 6 stages: QUEUED → STARTED → WASHING → DETAILING → FINISHING → READY
- Each stage shows estimated time remaining
- Photos uploaded by operator appear in real-time (before/after side-by-side once both exist)
- "Notify me when ready" toggle (default on)
- Public share link: `/track/public/[6-char-code]` — no auth required, expires after 24hr

### 3.2.8 Membership management

| Action | Behavior |
|---|---|
| Upgrade | Prorated charge via Stripe; effective immediately |
| Downgrade | Effective at next billing cycle; member retains current tier until then |
| Pause | Stripe `pause_collection`; member retains pass but no washes during pause; max 90 days/year |
| Cancel | Effective at end of current billing period; flow includes "Are you sure?" with retention offer (one free month) |
| Reactivate | Within 30 days of cancellation, resume without paying setup again |
| Add vehicle to FLEET | Up to 4 vehicles; each managed independently |

### 3.2.9 Push notifications matrix

| Event | Channel | Default |
|---|---|---|
| Booking confirmed | SMS + Push + Email | ON |
| Wash started | Push + SMS | ON |
| Almost ready (5 min) | Push + SMS | ON |
| Ready for pickup | Push + SMS | ON (cannot disable) |
| Photos uploaded | Push | OFF |
| Punch milestone (every 3rd) | Push + SMS | ON |
| Free wash earned | Push + SMS + Email | ON (cannot disable) |
| Referral signup | Push + SMS + Email | ON |
| Referral first wash (you earn $25) | Push + SMS + Email | ON |
| Membership renewal upcoming | SMS + Email | ON |
| Membership renewed | Email | ON |
| Payment failed | SMS + Email | ON (cannot disable) |
| Promo (special offer) | Push + Email | OFF |
| Marketing newsletter | Email | OFF |

User can manage all of these from `/settings/notifications`.

### 3.2.10 In-app notification center

- Bell icon top-right
- All notifications (read + unread) visible
- Tap to action (e.g., tap "wash ready" → opens track screen)
- Mark all read
- Stored in `notifications` table; auto-purge older than 90 days

### 3.2.11 Other UX requirements

- **Pull-to-refresh** on all list views
- **Skeleton loaders** while data fetches
- **Error boundaries** wrap all routes; show friendly error + report button
- **Toast notifications** for non-critical events (saved, copied, etc.)
- **Haptic feedback** on iOS (via `navigator.vibrate` fallback)
- **Deep linking:** `urrutiawash://book` opens app to booking flow
- **Universal links:** iOS-specific; configured via `apple-app-site-association`
- **Share API:** Native share sheets where supported

---

## 3.3 — OPERATOR CONSOLE (Module 3)

The crew uses this on a tablet (iPad) at the wash station. **Must work on iPad Safari, must be touch-friendly, must work with one hand while holding a hose.**

### 3.3.1 Views required

| Screen | Purpose |
|---|---|
| `/ops/login` | Email + password OR phone OTP for crew |
| `/ops/queue` | Live queue: today's bookings + walk-ins, sorted by time |
| `/ops/wash/[id]` | Single wash detail: customer, vehicle, service, status controls, photo upload, notes |
| `/ops/walkin` | Walk-in registration: phone (creates account), vehicle, service, payment |
| `/ops/lookup` | Search by plate / phone / name → see customer history |
| `/ops/customers` | Customer list with filters (members, frequency, last visit) |
| `/ops/schedule` | Calendar view of upcoming bookings (week / month) |
| `/ops/photos` | Upload/manage photos for a wash (drag-drop, multi-select, before/after tagging) |
| `/ops/payments` | Process payment, accept tip, send receipt |
| `/ops/shift` | Clock in/out, see shift summary, tip share |
| `/ops/notes` | Internal notes per customer (e.g., "always wants tire shine extra") |

### 3.3.2 Status update flow (the auto-SMS engine)

This is the core of the operator console. **Must take ≤ 2 taps to advance.**

```
QUEUED  → tap [START WASH]   → triggers SMS to customer ("Your wash has started")
STARTED → tap [→ WASHING]    → triggers SMS ("We're washing now")
WASHING → tap [→ DETAILING]  → no SMS
DETAILING → tap [→ FINISHING] → triggers SMS ("Almost ready — 5 min")
FINISHING → tap [→ READY]   → triggers SMS ("Your car is ready! Pickup at [location]")
READY → tap [PICKED UP]      → completes wash, prompts for tip + photo confirm
```

Each transition writes to DB, broadcasts via Supabase Realtime to the customer's app, and triggers the relevant SMS template (Part 6).

### 3.3.3 Walk-in flow

Optimized for speed at the wash station:

```
1. [+ NEW WALK-IN] button on queue screen
2. Phone number input (E.164 format, auto-formatted)
3. Lookup: if existing customer, pre-fills vehicle list; if new, asks name
4. Vehicle: select from saved OR quick-add (year, make, model, color, plate)
5. Service: tap tier (Express / Wash+Int / Detail / Ceramic)
6. Add-ons: tire shine, interior protectant, pet hair removal (optional)
7. Payment: tap or insert card via Stripe Terminal (BBPOS WisePOS E reader)
8. Optional tip prompt
9. Receipt: SMS + email
10. Wash created in QUEUED state
```

Total interaction: ≤ 90 seconds for repeat customer, ≤ 2 minutes for new.

### 3.3.4 Photo workflow

- **Before photo:** Required at STARTED status. Operator taps "Add Before Photo" → camera opens → snap → auto-tagged → uploads to Supabase Storage
- **After photo:** Required at READY status. Same flow.
- **Damage documentation:** Optional. If operator notices pre-existing damage (scratch, dent), mark and photograph. Customer gets notified. Liability protection.
- **Watermark:** Auto-apply Urrutia logo + date + plate (small, bottom-right) for marketing reuse
- **Storage:** Supabase Storage bucket `wash-photos`; signed URLs only; auto-resize to 1080w; original kept for 30 days, compressed thereafter

### 3.3.5 Stripe Terminal integration

- Hardware: BBPOS WisePOS E (~$300, one-time) — Stripe-certified, Bluetooth, supports tap/chip/swipe
- iOS app: Uses Stripe Terminal SDK via React Native bridge OR web (Stripe.js Terminal in browsers that support WebUSB)
- Tip presets: 10% / 15% / 20% / Custom / No tip
- Receipt: SMS or email or printed (BBPOS has built-in printer)
- Splits tip into `tips` table for crew distribution

### 3.3.6 Crew shift management

- Clock in: face photo + GPS verification (within 100m of LVAC)
- Clock out: confirms hours
- Tip pool: aggregates day's tips, shows split based on hours worked
- Owner approves payouts weekly → triggers payouts via Stripe Connect (1099 contractors) or just exported as CSV for manual payroll

### 3.3.7 Operator console UX requirements

- **Optimized for iPad portrait + landscape**
- **Large touch targets:** min 44x44pt per Apple guidelines
- **High contrast:** Works in direct sunlight (max brightness scenarios)
- **No hover states:** Touch-only
- **Persistent header:** Current logged-in user, current shift status, today's count
- **Pull-to-refresh** on queue
- **Audible alerts** (configurable): when new booking arrives, when timer for "almost ready" hits

---

## 3.4 — OWNER / ADMIN CONSOLE (Module 4)

Urrutia (and MachineMind on the management side) sees the business here. Phone or desktop.

### 3.4.1 Views required

| Screen | Purpose |
|---|---|
| `/admin/dashboard` | KPI overview: today's revenue, week, month, MRR, churn, active members, walk-ins |
| `/admin/revenue` | Detailed revenue breakdown: by service, by location, by member tier, daily/weekly/monthly chart |
| `/admin/members` | Member list, filter by tier/status; click → member detail |
| `/admin/members/[id]` | Full member profile: history, vehicles, LTV, referrals brought, churn risk score |
| `/admin/referrals` | Referral leaderboard, total credits issued, conversion rate |
| `/admin/marketing` | Campaign performance, traffic sources, conversion funnel |
| `/admin/operations` | Wash velocity, avg time per service, crew productivity |
| `/admin/payments` | Stripe Connect view: payouts, disputes, refunds |
| `/admin/sms` | SMS log, delivery rates, opt-outs (TCPA audit trail) |
| `/admin/comps` | Issue free wash, refund, credit (with reason logging) |
| `/admin/settings` | Business hours, service prices, membership tiers, holidays |

### 3.4.2 KPI dashboard (must show on Day 1)

- **Revenue today** (vs same day last week, last year)
- **MRR** (monthly recurring from memberships)
- **ARR** (annualized)
- **Active members** by tier
- **New members this month**
- **Churn this month** (members who cancelled)
- **Net revenue retention** (expansion - churn)
- **LTV / CAC ratio** (target: > 3:1)
- **Average wash value** (walk-in vs member)
- **Member wash frequency** (target: 1.5x/week for SOLO, 2.5x for DUO)
- **Referral conversion rate** (signups via referrals / total signups)
- **NPS** (post-wash survey, opt-in)

### 3.4.3 MachineMind admin layer (super-admin)

A super-admin role only Phil/MachineMind has, separate from Urrutia's owner role:

- Multi-tenant view (when LVAC expansion happens, see all locations)
- Platform metrics: total transactions, total fees collected (Urrutia's 4%)
- System health (Supabase usage, Twilio spend, Stripe fees)
- Feature flags (turn experimental features on/off per tenant)
- Audit log (every privileged action)

---

# PART 4 — DATABASE SCHEMA (COMPLETE)

PostgreSQL via Supabase. RLS enabled on every table. Auth handled by Supabase Auth (`auth.users`).

```sql
-- ═══════════════════════════════════════════════════════════════════════════
-- ENUMS
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TYPE user_role AS ENUM ('customer', 'operator', 'owner', 'admin');
CREATE TYPE membership_tier AS ENUM ('none', 'solo', 'duo', 'fleet');
CREATE TYPE membership_status AS ENUM ('active', 'paused', 'cancelled', 'expired');
CREATE TYPE wash_status AS ENUM ('scheduled', 'queued', 'started', 'washing', 'detailing', 'finishing', 'ready', 'picked_up', 'cancelled', 'no_show');
CREATE TYPE service_type AS ENUM ('express', 'wash_interior', 'detail_full', 'ceramic_coating', 'paint_correction', 'mobile_detail');
CREATE TYPE location_type AS ENUM ('lvac_henderson', 'mobile');
CREATE TYPE notification_channel AS ENUM ('sms', 'whatsapp', 'email', 'push', 'in_app');

-- ═══════════════════════════════════════════════════════════════════════════
-- USERS (extends auth.users)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  role user_role DEFAULT 'customer',
  language TEXT DEFAULT 'en' CHECK (language IN ('en','es')),
  notification_prefs JSONB DEFAULT '{"sms":true,"email":true,"push":false,"marketing":false}'::jsonb,
  referral_code TEXT UNIQUE NOT NULL DEFAULT substring(md5(random()::text), 1, 6),
  referred_by UUID REFERENCES profiles(id),
  credit_balance_cents INT DEFAULT 0,
  total_spent_cents INT DEFAULT 0,
  total_washes INT DEFAULT 0,
  first_wash_at TIMESTAMPTZ,
  last_wash_at TIMESTAMPTZ,
  apple_wallet_pass_serial TEXT,
  google_wallet_object_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_profiles_phone ON profiles(phone);
CREATE INDEX idx_profiles_referral_code ON profiles(referral_code);
CREATE INDEX idx_profiles_referred_by ON profiles(referred_by);

-- ═══════════════════════════════════════════════════════════════════════════
-- VEHICLES
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  year INT,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  color TEXT,
  plate TEXT NOT NULL,
  plate_state TEXT DEFAULT 'NV',
  vin TEXT,
  notes TEXT,                          -- "always wants tire shine extra"
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (plate, plate_state)          -- ALPR lookup uniqueness
);
CREATE INDEX idx_vehicles_owner ON vehicles(owner_id);
CREATE INDEX idx_vehicles_plate ON vehicles(plate);  -- ALPR critical

-- ═══════════════════════════════════════════════════════════════════════════
-- MEMBERSHIPS
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tier membership_tier NOT NULL,
  status membership_status DEFAULT 'active',
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  monthly_price_cents INT NOT NULL,
  washes_per_month INT,                -- NULL = unlimited (FLEET)
  washes_used_this_period INT DEFAULT 0,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  paused_until TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  vehicle_ids UUID[] DEFAULT '{}',     -- which vehicles are covered
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_memberships_user ON memberships(user_id);
CREATE INDEX idx_memberships_status ON memberships(status);
CREATE INDEX idx_memberships_stripe ON memberships(stripe_subscription_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- WASHES (the core transaction record)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE washes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  membership_id UUID REFERENCES memberships(id),  -- NULL if walk-in
  service service_type NOT NULL,
  add_ons JSONB DEFAULT '[]',                     -- ["tire_shine", "pet_hair"]
  location location_type NOT NULL,
  mobile_address TEXT,                            -- if location = mobile
  scheduled_for TIMESTAMPTZ NOT NULL,
  status wash_status DEFAULT 'scheduled',
  base_price_cents INT NOT NULL,
  member_discount_cents INT DEFAULT 0,
  add_ons_price_cents INT DEFAULT 0,
  tip_cents INT DEFAULT 0,
  total_charged_cents INT NOT NULL,
  stripe_payment_intent_id TEXT,
  assigned_operator_id UUID REFERENCES profiles(id),
  before_photo_url TEXT,
  after_photo_url TEXT,
  damage_photos TEXT[] DEFAULT '{}',
  notes TEXT,
  customer_rating INT CHECK (customer_rating BETWEEN 1 AND 5),
  customer_feedback TEXT,
  public_track_code TEXT UNIQUE DEFAULT substring(md5(random()::text), 1, 6),
  started_at TIMESTAMPTZ,
  ready_at TIMESTAMPTZ,
  picked_up_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_washes_user ON washes(user_id);
CREATE INDEX idx_washes_vehicle ON washes(vehicle_id);
CREATE INDEX idx_washes_status ON washes(status);
CREATE INDEX idx_washes_scheduled ON washes(scheduled_for);
CREATE INDEX idx_washes_operator ON washes(assigned_operator_id);
CREATE INDEX idx_washes_track_code ON washes(public_track_code);

-- ═══════════════════════════════════════════════════════════════════════════
-- PUNCH CARDS (Nth wash free loyalty)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE punch_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  current_count INT DEFAULT 0,
  goal INT DEFAULT 10,
  total_redeemed INT DEFAULT 0,
  last_punch_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_punch_cards_user ON punch_cards(user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- REFERRALS
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES profiles(id),
  referred_id UUID NOT NULL REFERENCES profiles(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','signed_up','converted','expired')),
  referrer_credit_cents INT DEFAULT 2500,
  referred_credit_cents INT DEFAULT 2500,
  signed_up_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,            -- when referred completed first wash
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (referrer_id, referred_id)
);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_id);
CREATE INDEX idx_referrals_status ON referrals(status);

-- ═══════════════════════════════════════════════════════════════════════════
-- TIPS (for crew distribution)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wash_id UUID NOT NULL REFERENCES washes(id),
  amount_cents INT NOT NULL,
  recipient_id UUID REFERENCES profiles(id),  -- assigned crew member
  shift_id UUID REFERENCES shifts(id),
  paid_out_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- SHIFTS (crew clock in/out)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  clocked_in_at TIMESTAMPTZ NOT NULL,
  clocked_out_at TIMESTAMPTZ,
  clock_in_lat DECIMAL,
  clock_in_lng DECIMAL,
  clock_in_photo_url TEXT,
  hours_worked DECIMAL GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (clocked_out_at - clocked_in_at)) / 3600
  ) STORED,
  total_tips_cents INT DEFAULT 0,
  notes TEXT
);
CREATE INDEX idx_shifts_user ON shifts(user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- NOTIFICATIONS (in-app + audit)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  channel notification_channel NOT NULL,
  template TEXT NOT NULL,              -- "booking_confirmed", "wash_ready", etc.
  payload JSONB,
  rendered_body TEXT,
  delivered BOOLEAN DEFAULT false,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  twilio_sid TEXT,                     -- for SMS audit
  resend_id TEXT,                      -- for email audit
  push_endpoint_id TEXT,               -- for push audit
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ═══════════════════════════════════════════════════════════════════════════
-- SMS CONSENT (TCPA audit trail)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE sms_consent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  phone TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL,
  consent_timestamp TIMESTAMPTZ DEFAULT NOW(),
  consent_method TEXT,                 -- "signup_form", "opt_in_keyword", "verbal_at_pos"
  consent_ip INET,
  consent_user_agent TEXT,
  opt_out_timestamp TIMESTAMPTZ,
  opt_out_method TEXT
);
CREATE INDEX idx_sms_consent_phone ON sms_consent(phone);

-- ═══════════════════════════════════════════════════════════════════════════
-- AUDIT LOG (privileged actions)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,                -- "comp_wash", "refund", "manual_punch", etc.
  target_type TEXT,                    -- "wash", "membership", "user"
  target_id UUID,
  before JSONB,
  after JSONB,
  reason TEXT,
  ip INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_audit_actor ON audit_log(actor_id);
CREATE INDEX idx_audit_target ON audit_log(target_type, target_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- BUSINESS SETTINGS (single row for tenant config)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE business_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),  -- enforces single row for now
  business_name TEXT DEFAULT 'Urrutia Carwash & Detail',
  hours JSONB DEFAULT '{"mon":"7-16:30","tue":"7-16:30","wed":"7-16:30","thu":"7-16:30","fri":"7-16:30","sat":"7-16:30","sun":"closed"}',
  holidays JSONB DEFAULT '[]',
  service_prices JSONB,                -- pricing config
  membership_tiers JSONB,
  service_durations_min JSONB,
  punch_card_goal INT DEFAULT 10,
  referral_credit_cents INT DEFAULT 2500,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- WEBHOOK EVENTS (idempotency for Stripe / Twilio webhooks)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE webhook_events (
  id TEXT PRIMARY KEY,                 -- e.g. Stripe event ID
  source TEXT NOT NULL,                -- "stripe", "twilio"
  event_type TEXT NOT NULL,
  payload JSONB,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY POLICIES (sample — apply to all tables)
-- ═══════════════════════════════════════════════════════════════════════════
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Operators can view all profiles" ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('operator','owner','admin')));

-- (Repeat similar pattern for vehicles, memberships, washes, etc.)
```

---

# PART 5 — API SURFACE (EVERY ENDPOINT)

Next.js API routes (`app/api/*`). All return JSON. All authed routes require valid session JWT.

### 5.1 Auth
- `POST /api/auth/send-otp` — body: `{ phone }` → calls Twilio Verify
- `POST /api/auth/verify-otp` — body: `{ phone, code }` → returns session
- `POST /api/auth/logout` — clears session
- `GET /api/auth/me` — returns current user

### 5.2 Vehicles
- `GET /api/vehicles` — list user's vehicles
- `POST /api/vehicles` — create
- `PATCH /api/vehicles/[id]`
- `DELETE /api/vehicles/[id]`

### 5.3 Bookings / Washes
- `GET /api/washes` — user's washes (paginated, filterable)
- `POST /api/washes` — create new booking
- `GET /api/washes/[id]` — detail
- `GET /api/washes/track/[code]` — public tracking (no auth)
- `PATCH /api/washes/[id]` — operator-only: update status
- `POST /api/washes/[id]/photos` — operator-only: upload photo
- `POST /api/washes/[id]/cancel` — customer or operator
- `POST /api/washes/[id]/rate` — customer rates after pickup

### 5.4 Memberships
- `GET /api/memberships` — current user's membership
- `POST /api/memberships/checkout` — creates Stripe Checkout session
- `POST /api/memberships/upgrade` — change tier
- `POST /api/memberships/pause`
- `POST /api/memberships/resume`
- `POST /api/memberships/cancel`

### 5.5 Payments
- `POST /api/payments/intent` — creates Payment Intent for one-off wash
- `POST /api/payments/methods` — add card
- `DELETE /api/payments/methods/[id]`
- `GET /api/payments/invoices`

### 5.6 Referrals
- `GET /api/referrals/me` — my code, credits, referral list
- `POST /api/referrals/redeem` — at signup, applies referrer's code

### 5.7 Wallet passes
- `GET /api/wallet/apple/[userId]` — generates `.pkpass` (auth required)
- `POST /api/wallet/apple/webhook` — Apple's pass update notifications
- `GET /api/wallet/google/[userId]` — generates Google Wallet save URL

### 5.8 Notifications
- `GET /api/notifications` — in-app feed
- `POST /api/notifications/mark-read`
- `POST /api/notifications/push-subscribe` — registers push endpoint
- `PATCH /api/notifications/preferences`

### 5.9 Webhooks (server → server, no auth, signature-verified)
- `POST /api/webhooks/stripe` — handles all Stripe events
- `POST /api/webhooks/twilio/sms` — inbound SMS (e.g., STOP keyword)
- `POST /api/webhooks/twilio/status` — SMS delivery status
- `POST /api/webhooks/apple-wallet` — Apple's pass registration callbacks

### 5.10 Operator (role-gated)
- `GET /api/ops/queue` — today's queue
- `POST /api/ops/walkin` — register walk-in customer + wash + payment
- `GET /api/ops/lookup` — search by plate/phone/name
- `POST /api/ops/clock-in`
- `POST /api/ops/clock-out`

### 5.11 Admin (role-gated)
- `GET /api/admin/kpis` — dashboard metrics
- `GET /api/admin/revenue?period=...`
- `GET /api/admin/members?filter=...`
- `POST /api/admin/comp-wash` — issue free wash
- `POST /api/admin/refund`
- `PATCH /api/admin/settings`

---

# PART 6 — NOTIFICATIONS MATRIX (EVERY MESSAGE)

Every template is bilingual (EN + ES). Stored in `/lib/notifications/templates/`. Variables in `{{}}`.

### 6.1 SMS templates

| Template ID | Trigger | Body (EN) |
|---|---|---|
| `booking_confirmed` | After booking created | "Urrutia: Wash booked for {{date}} at {{time}}. Reply STOP to opt out." |
| `wash_started` | Status → STARTED | "Your {{vehicle}} is now being washed. Track: {{trackUrl}}" |
| `wash_almost_ready` | Status → FINISHING | "Almost done! {{vehicle}} ready in ~5 min." |
| `wash_ready` | Status → READY | "Your {{vehicle}} is ready for pickup at {{location}}. Thanks!" |
| `punch_milestone` | Punch count = 7, 8, 9 | "Only {{washesLeft}} wash{{plural}} until your free wash!" |
| `free_wash_earned` | Punch count hits goal | "🎉 You earned a FREE wash! Redeem on your next booking." |
| `referral_signup` | Referred user signs up | "{{referredName}} just signed up using your code. They'll wash, you'll earn $25." |
| `referral_credit` | Referred user completes first wash | "$25 credit added! Your code worked. Total credits: ${{balance}}" |
| `member_renewal_reminder` | 3 days before renewal | "Your {{tier}} membership renews {{date}} for ${{price}}. Manage: {{url}}" |
| `member_renewed` | After successful renewal | "Membership renewed. {{washesIncluded}} washes ready this month." |
| `payment_failed` | Stripe payment failure | "Payment for your membership failed. Update card: {{url}}" |
| `member_cancelled` | After cancellation | "Membership ends {{date}}. We're sorry to see you go. Reactivate anytime: {{url}}" |
| `walk_in_receipt` | After walk-in payment | "Receipt: ${{total}} for {{service}}. Tap to view: {{url}}" |
| `birthday` | User's birthday | "🎂 Happy birthday from Urrutia! Free interior on us this month. Code: BDAY{{year}}" |

### 6.2 Email templates (Resend)

Same triggers as SMS where appropriate, plus:
- `welcome_signup` — Day 0
- `welcome_education_1` — Day 3 (paint care basics)
- `welcome_education_2` — Day 7 (when to ceramic coat)
- `welcome_education_3` — Day 14 (membership math)
- `member_welcome` — On membership signup (includes Apple Wallet pass link)
- `monthly_recap` — End of month: washes done, money saved as member, credits earned

### 6.3 Push notifications

Same triggers as SMS where channel is enabled. Web Push API standard payload:
```json
{ "title": "Urrutia", "body": "...", "icon": "/icons/192.png", "badge": "/icons/badge.png", "data": { "url": "/track/[id]" } }
```

### 6.4 TCPA compliance

- Every SMS has "Reply STOP to opt out" on first message of any campaign
- STOP keyword auto-handled: writes to `sms_consent` with opt_out, no further messages
- HELP keyword returns: "Urrutia Carwash. Msg & data rates may apply. Reply STOP to opt out. Help: (XXX) XXX-XXXX"
- Consent captured at signup: explicit checkbox, IP + UA logged
- Quiet hours: no marketing SMS before 8am or after 9pm local time

---

# PART 7 — PAYMENT FLOWS (EVERY STRIPE INTERACTION)

### 7.1 Walk-in payment
1. Operator selects services + add-ons + tip
2. Server creates Payment Intent: `amount`, `customer_id` (or creates), `payment_method_types: ['card_present']`, `capture_method: 'automatic'`
3. Terminal collects payment via BBPOS reader
4. On success: write to `washes`, fire `walk_in_receipt` SMS, increment `total_spent_cents`

### 7.2 Online booking (one-off)
1. Customer confirms booking
2. Server creates Payment Intent: `payment_method_types: ['card']`, `setup_future_usage: 'off_session'` (saves card)
3. Stripe.js confirms client-side
4. On webhook `payment_intent.succeeded`: confirm wash, fire confirmation

### 7.3 Membership signup
1. Customer picks tier
2. Server creates Stripe Checkout Session (subscription mode), `success_url`, `cancel_url`
3. Customer pays
4. Webhook `checkout.session.completed` + `customer.subscription.created`: write `memberships` row, generate Apple Wallet pass, fire `member_welcome`

### 7.4 Member booking (free wash)
1. Customer confirms booking on member tier
2. Server checks `washes_used_this_period < washes_per_month` for that membership
3. If yes: no charge, just create wash record, decrement counter
4. If no: prompt to upgrade or pay one-off

### 7.5 Membership upgrade/downgrade
- Use Stripe `subscriptions.update` with `proration_behavior: 'always_invoice'`
- Webhook `invoice.paid` triggers tier update in DB

### 7.6 Refunds
- Owner triggers from admin console
- Reason required (logged to `audit_log`)
- Stripe `refunds.create`, full or partial
- Customer notified via email + SMS

### 7.7 Tips
- Captured at point of sale OR after-the-fact via PWA
- Stored in `tips` table linked to wash + crew member
- Distributed via Stripe Connect Express accounts (1099 contractors)
- Or, if simpler: aggregated weekly, paid via manual ACH/Zelle from Urrutia

### 7.8 Webhook handling (all Stripe events)
- Endpoint: `/api/webhooks/stripe`
- Verify signature with `STRIPE_WEBHOOK_SECRET`
- Idempotency: insert event ID into `webhook_events`, reject duplicates
- Events to handle:
  - `payment_intent.succeeded` / `payment_intent.payment_failed`
  - `checkout.session.completed`
  - `customer.subscription.created` / `updated` / `deleted`
  - `invoice.paid` / `invoice.payment_failed`
  - `charge.refunded`
  - `charge.dispute.created`

---

# PART 8 — AUTH & AUTHORIZATION

### 8.1 Authentication

- **Method:** Phone OTP via Twilio Verify (primary), email magic link (fallback)
- **Session:** Supabase Auth-issued JWT in httpOnly + secure + SameSite=Lax cookie
- **Lifetime:** 30 days, sliding refresh on each request
- **MFA:** Optional TOTP for owner/admin role (force-required Phase 2)
- **Password:** None for customers (OTP-only). Required for operators (with reset flow).

### 8.2 Authorization (RBAC)

Roles: `customer`, `operator`, `owner`, `admin` (super-admin = MachineMind only).

| Resource | customer | operator | owner | admin |
|---|---|---|---|---|
| Own profile | RW | RW | RW | RW |
| Other profiles | — | R | RW | RW |
| Own vehicles | RW | R | R | R |
| Other vehicles | — | R | R | R |
| Own washes | RW | RW | RW | RW |
| All washes | — | RW | RW | RW |
| Memberships | own RW | other R | RW | RW |
| Payments | own R | own R | RW | RW |
| Settings | — | — | RW | RW |
| Audit log | — | — | R | RW |
| Multi-tenant view | — | — | — | RW |

Enforced at three layers:
1. **DB:** Supabase RLS policies
2. **API:** Middleware checks role on every authed route
3. **UI:** Conditional rendering + route guards

---

# PART 9 — INFRASTRUCTURE & SERVICES (EVERY ACCOUNT)

### 9.1 Required accounts

| Service | Purpose | Cost (start) | Owner |
|---|---|---|---|
| Domain registrar (Cloudflare or Namecheap) | `urrutiawash.com` | $12/yr | Urrutia (or MM holds) |
| Cloudflare | DNS + CDN + DDoS | Free tier | Phil |
| Vercel | Hosting + edge functions | Free → $20/mo Pro when traffic warrants | Phil (MM team) |
| Supabase | DB + Auth + Storage + Realtime | Free → $25/mo Pro at scale | Phil (MM team) |
| Twilio | SMS + WA + Verify | Pay-per-use, ~$0.0079/SMS US | MM (existing acct) |
| Stripe | Payments + Subscriptions + Connect | 2.9% + $0.30 per txn | Urrutia (LLC owner) |
| Apple Developer | Wallet pass signing | $99/yr | MM |
| Google Cloud | Google Wallet + Maps API | Free tier covers MVP | MM |
| Resend | Transactional email | Free → $20/mo | MM |
| Sentry | Error monitoring | Free tier | MM |
| PostHog | Analytics + replay | Free tier | MM |
| GitHub | Code repo (private) | Free | MM |
| 1Password / Bitwarden | Secrets management | Existing | Phil |
| Google Business Profile | Local SEO | Free | Urrutia |
| Mapbox or Google Maps | Geo + autocomplete | Free tier | MM |
| BBPOS WisePOS E | Card reader | $299 one-time | Urrutia |

### 9.2 Domain & DNS plan

```
urrutiawash.com         A     → Vercel
www.urrutiawash.com     CNAME → urrutiawash.com
app.urrutiawash.com     CNAME → cname.vercel-dns.com
ops.urrutiawash.com     CNAME → cname.vercel-dns.com
es.urrutiawash.com      CNAME → urrutiawash.com (i18n via path or subdomain)
mail._domainkey...      TXT   → DKIM (Resend)
_dmarc                  TXT   → v=DMARC1; p=quarantine
@                       TXT   → v=spf1 include:_spf.resend.com -all
@                       MX    → leave default or set up Google Workspace ($6/user/mo) for hello@urrutiawash.com
```

### 9.3 Backups

- Supabase: automatic daily backups (7-day retention on Free, 30-day on Pro)
- Weekly manual snapshot exported to MachineMind's S3 bucket (or Cloudflare R2)
- Code: GitHub is the canonical source; tag every production deploy

### 9.4 Disaster recovery

- **RTO** (recovery time objective): 4 hours
- **RPO** (recovery point objective): 24 hours
- Runbook documented in `/docs/disaster-recovery.md`:
  - Vercel down → static cached site stays up via Cloudflare
  - Supabase down → graceful degraded mode (read-only from cache)
  - Stripe down → defer payments, queue bookings, notify customer
  - Domain hijack → Cloudflare 2FA + registrar lock + transfer lock

---

# PART 10 — ENVIRONMENT VARIABLES (COMPLETE)

`.env.local` (development) / Vercel project env (production):

```bash
# ═══════════════════════════════════════════════════════════════════════════
# APPLICATION
# ═══════════════════════════════════════════════════════════════════════════
NEXT_PUBLIC_SITE_URL=https://urrutiawash.com
NEXT_PUBLIC_APP_URL=https://app.urrutiawash.com
NEXT_PUBLIC_OPS_URL=https://ops.urrutiawash.com
NODE_ENV=production

# ═══════════════════════════════════════════════════════════════════════════
# SUPABASE
# ═══════════════════════════════════════════════════════════════════════════
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=         # SERVER ONLY — never expose
SUPABASE_JWT_SECRET=               # for verifying JWTs server-side

# ═══════════════════════════════════════════════════════════════════════════
# STRIPE
# ═══════════════════════════════════════════════════════════════════════════
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_SOLO=price_xxx
STRIPE_PRICE_DUO=price_xxx
STRIPE_PRICE_FLEET=price_xxx
STRIPE_TERMINAL_LOCATION_ID=

# ═══════════════════════════════════════════════════════════════════════════
# TWILIO
# ═══════════════════════════════════════════════════════════════════════════
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_VERIFY_SERVICE_SID=
TWILIO_MESSAGING_SERVICE_SID=
TWILIO_WA_FROM=whatsapp:+19542790889   # existing MM WABA
TWILIO_SMS_FROM=+1XXXXXXXXXX           # buy dedicated long code or short code

# ═══════════════════════════════════════════════════════════════════════════
# APPLE WALLET (PassKit)
# ═══════════════════════════════════════════════════════════════════════════
APPLE_WALLET_PASS_TYPE_ID=pass.com.machinemind.urrutia.member
APPLE_WALLET_TEAM_ID=
APPLE_WALLET_CERT_PATH=./certs/pass.p12
APPLE_WALLET_CERT_PASSWORD=
APPLE_WALLET_WWDR_PATH=./certs/wwdr.pem

# ═══════════════════════════════════════════════════════════════════════════
# GOOGLE
# ═══════════════════════════════════════════════════════════════════════════
GOOGLE_WALLET_ISSUER_ID=
GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL=
GOOGLE_WALLET_PRIVATE_KEY=
GOOGLE_MAPS_API_KEY=                  # for autocomplete + maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=      # client-only key (HTTP referrer-restricted)

# ═══════════════════════════════════════════════════════════════════════════
# EMAIL
# ═══════════════════════════════════════════════════════════════════════════
RESEND_API_KEY=
RESEND_FROM_EMAIL=hello@urrutiawash.com
RESEND_REPLY_TO=support@urrutiawash.com

# ═══════════════════════════════════════════════════════════════════════════
# OBSERVABILITY
# ═══════════════════════════════════════════════════════════════════════════
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# ═══════════════════════════════════════════════════════════════════════════
# WEB PUSH (VAPID)
# ═══════════════════════════════════════════════════════════════════════════
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:hello@urrutiawash.com

# ═══════════════════════════════════════════════════════════════════════════
# SECURITY
# ═══════════════════════════════════════════════════════════════════════════
HCAPTCHA_SECRET=                      # for booking form anti-spam
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=
CRON_SECRET=                          # for Vercel Cron job auth
ENCRYPTION_KEY=                       # 32-byte hex for any AES needs
```

Store keys in Vercel env (production + preview separate). Never commit `.env*` files. Rotate keys quarterly.

---

# PART 11 — INTEGRATIONS

### 11.1 Stripe Connect (for crew payouts)

- Each 1099 crew member onboards via Express account
- Tips routed via destination charges
- Owner sees aggregate; Stripe handles 1099-K reporting
- Alternative for MVP: skip Connect, manually distribute tips weekly

### 11.2 Google Business Profile

- Claim listing for "Urrutia Carwash & Detail" at LVAC address
- Sync hours from `business_settings`
- Auto-respond to reviews (initially manual, later AI-assisted)
- Post weekly updates (offers, new services)
- Track via GMB Insights API → feed admin dashboard

### 11.3 Instagram Graph API

- Read @lvacwashndetail recent posts
- Auto-display on `/gallery`
- Hashtag tracking for UGC re-share

### 11.4 Mapbox (or Google Maps)

- Geocoding for mobile detail addresses
- Distance check (mobile only within 15-mile radius of LVAC)
- Map embed on `/locations`

### 11.5 hCaptcha

- Invisible challenge on booking form, signup, contact form
- Falls back to interactive on suspicious traffic

### 11.6 OpenAI (Phase 1.5)

- Auto-respond to common SMS questions ("what time do you open", "do you do trucks")
- Classify customer feedback for sentiment
- Generate review responses for owner approval

---

# PART 12 — LEGAL & COMPLIANCE

### 12.1 Required policy pages

- **Privacy Policy** — covers data collection, use, sharing, retention, user rights (CCPA + GDPR-style even if not strictly required); references Stripe + Twilio + Resend as processors
- **Terms of Service** — service definition, payment terms, cancellation, dispute resolution, governing law (Nevada)
- **Refund & Cancellation Policy** — wash refunds (within 24hrs of pickup if quality issue), membership refunds (no refund on used washes; prorated on cancellation if requested within 7 days), no-show policy
- **SMS Consent / TCPA** — explicit consent language, opt-out instructions, message frequency disclosure
- **Membership Agreement** — auto-renewal disclosure, cancellation method, billing terms (Nevada law: auto-renewal must be conspicuous + cancellable in same medium as signup)
- **Liability Waiver** — pre-existing damage acknowledgment, mobile detail property terms
- **Accessibility Statement** — WCAG 2.1 AA target; contact for issues

Drafts are templates — Urrutia must have these reviewed by Nevada-licensed attorney before launch. MachineMind is **not** a law firm; this is operational, not legal advice.

### 12.2 Operational compliance

- **PCI DSS** — handled by Stripe; we never touch card data; ensure no PAN logging
- **TCPA** — consent flow, STOP/HELP keywords, audit trail (Part 6.4)
- **CAN-SPAM** — every marketing email has unsubscribe + physical address + clear sender
- **CCPA / Nevada SB 220** — "Do Not Sell My Personal Information" link in footer; data export + deletion endpoints
- **ADA / WCAG 2.1 AA** — accessibility audit before launch
- **Insurance** — Urrutia must hold general liability + garage keepers + commercial auto for mobile; provide Certificate of Insurance to LVAC

---

# PART 13 — SEO, MARKETING & GROWTH INFRASTRUCTURE

### 13.1 Pre-launch SEO setup

- Domain authority: register early, build backlinks
- Google Business Profile (claimed, photos, hours, services, posts)
- Bing Places for Business
- Apple Maps Connect listing
- Yelp claim
- Local citations: Yellowpages, Foursquare, NextDoor
- Schema markup on every page (LocalBusiness, Service, FAQPage, Review)
- Backlinks: LVAC website partner page, local Henderson directories, NV business journals

### 13.2 Content infrastructure

`/blog` (or subdomain) — for SEO content marketing:
- "How often should you wash your car in Las Vegas?"
- "Ceramic coating vs wax: what's right for desert climate"
- "Why mobile detailing is the future for busy Henderson professionals"
- "The complete LVAC member guide to car care"

Target: 1 post per week at launch, 2/mo sustaining. Each post 1,200+ words, internally linked, schema'd.

### 13.3 Email marketing engine

- Welcome drip (4 emails over 14 days)
- Member onboarding (3 emails over 7 days)
- Monthly recap email
- Seasonal campaigns (summer dust prep, monsoon prep, holiday gift cards)
- Win-back sequence (cancelled members, 30/60/90 days post-cancel)
- Birthday email

### 13.4 SMS marketing engine

- Welcome SMS (right after signup)
- Reactivation SMS (30 days after last wash, "we miss you")
- Member-exclusive flash offers
- Geofenced offer (when user enters LVAC parking radius — Phase 2)

### 13.5 Referral mechanic (already built into product)

- $25 / $25 (give $25, get $25)
- Visible in PWA + email signature + receipts + Apple Wallet pass back
- Automatic credit application
- Leaderboard for power referrers (top 10 monthly, prize)

### 13.6 Paid acquisition (post-launch, optional)

- Meta Ads: lookalike audiences from email list, geo-targeted Henderson + Green Valley
- Google Ads: high-intent keywords ("car wash near me henderson", "auto detailing las vegas")
- Geofence ads at LVAC perimeter (programmatic display)
- Influencer partnerships: local Vegas car enthusiasts, gym influencers

### 13.7 Growth metrics dashboard

- CAC by channel
- LTV by tier
- Payback period (target: < 90 days)
- Viral coefficient (referrals per member)
- Funnel: visitor → booking → repeat → member → advocate

---

# PART 14 — ANALYTICS & OBSERVABILITY

### 14.1 Product analytics (PostHog)

Events tracked on every page:
- `page_view`
- `cta_click` (with element ID)
- `booking_started`
- `booking_step_completed` (with step number)
- `booking_completed`
- `membership_view`
- `membership_purchase_started`
- `membership_purchased`
- `referral_link_copied`
- `referral_shared` (channel)
- `wash_tracked` (by URL)
- `phone_clicked`
- `email_clicked`
- `error_displayed`

Funnels:
- Visitor → Booking
- Visitor → Member
- First wash → Repeat customer
- Customer → Member
- Member → Referrer

Cohorts:
- Members by signup month
- Customers by acquisition channel
- High-LTV vs low-LTV behavior comparison

Session replay enabled (with sensitive field masking).

### 14.2 Error monitoring (Sentry)

- All unhandled exceptions captured (frontend + backend)
- Source maps uploaded on every deploy
- Alerts: > 10 errors/min in production triggers Slack notification
- Performance monitoring: track slow API calls, slow page loads

### 14.3 Uptime monitoring

- BetterStack (or UptimeRobot, free tier)
- Endpoints monitored: home, /api/health, /api/auth/me
- Alert: > 1min downtime → SMS to Phil + Sergio

### 14.4 Logs

- Vercel: structured logs via `console.log` JSON format
- Drain to BetterStack or Datadog (Phase 2 if scale demands)
- Sensitive data filter: never log full card numbers, PII, OTPs, JWT contents

---

# PART 15 — SECURITY

### 15.1 Application security

- Content Security Policy (CSP) headers
- Strict-Transport-Security (HSTS) with preload
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: restrict camera, mic, geolocation to needed routes only
- Rate limiting on all API routes (Vercel Edge or Upstash Redis)
- CSRF tokens on state-changing requests (Next.js handles via SameSite cookies)
- Input sanitization: zod schemas on every API input
- SQL injection: prevented by Supabase parameterized queries; never raw SQL with user input
- XSS: React escapes by default; never `dangerouslySetInnerHTML` with user content

### 15.2 Secret management

- All secrets in Vercel env vars (never in code)
- Production secrets separate from preview/development
- Rotate quarterly
- Apple Wallet cert + private keys stored as base64 in env, never on disk in production

### 15.3 Penetration testing

- Pre-launch: run OWASP ZAP automated scan
- Pre-launch: manual review of all auth flows, payment flows, file uploads
- Post-launch: quarterly automated scans
- If revenue exceeds $250k/yr: schedule pro pen test (~$5k/yr)

### 15.4 Data privacy

- PII encrypted at rest (Supabase handles)
- Phone numbers stored E.164 format
- No SSN, no DOB beyond birthday month/day for marketing
- Data retention: customer data kept while account active + 7 years after for tax/legal; photos pruned after 1 year unless customer downloads

---

# PART 16 — PERFORMANCE TARGETS

| Metric | Target | Measured by |
|---|---|---|
| Lighthouse Performance | ≥ 95 mobile, ≥ 98 desktop | CI pre-deploy |
| FCP | ≤ 1.2s on 4G | Web Vitals |
| LCP | ≤ 2.5s | Web Vitals |
| TTI | ≤ 3.5s | Web Vitals |
| CLS | < 0.1 | Web Vitals |
| Bundle size (initial) | ≤ 150KB gz | Next.js bundle analyzer |
| API p50 latency | ≤ 100ms | Vercel analytics |
| API p95 latency | ≤ 500ms | Vercel analytics |
| API p99 latency | ≤ 1s | Vercel analytics |
| DB query p95 | ≤ 50ms | Supabase logs |
| Image LCP | ≤ 1.5s | Web Vitals |

Optimization techniques required:
- Server Components by default; Client Components only when needed
- Streaming SSR
- `next/image` everywhere
- `next/font` self-hosted
- Route prefetching enabled
- Edge runtime for read-heavy routes
- Static generation for marketing pages (revalidate: 3600)
- CDN caching headers tuned per route

---

# PART 17 — ACCESSIBILITY (WCAG 2.1 AA)

Required for both legal compliance and good UX:

- **Color contrast:** 4.5:1 minimum for body text, 3:1 for large text — currently water-blue on void may fail; verify with contrast checker
- **Keyboard navigation:** Every interactive element reachable + operable via keyboard
- **Focus indicators:** Visible on every focusable element (not removed via `outline: none`)
- **Alt text:** Every image has descriptive alt; decorative images marked `alt=""`
- **ARIA labels:** Where semantic HTML insufficient (icon buttons, custom controls)
- **Form labels:** Every input has associated `<label>` or `aria-label`
- **Error messages:** Linked to inputs via `aria-describedby`; announced to screen readers via `role="alert"`
- **Heading hierarchy:** One `<h1>` per page; logical h2 → h3 → h4 progression
- **Language attribute:** `<html lang="en">` (or `es`)
- **Reduced motion:** `prefers-reduced-motion: reduce` respected (disable parallax, smooth scroll, autoplay video)
- **Skip links:** "Skip to main content" link at top of every page
- **Form errors:** Don't rely on color alone — also use icons and text
- **Touch targets:** 44x44pt minimum on mobile

Test with: axe DevTools, Lighthouse Accessibility audit, screen reader (VoiceOver iOS, NVDA Windows), keyboard-only navigation.

---

# PART 18 — TESTING STRATEGY

### 18.1 Unit tests (Vitest)

- All utility functions (price calculation, punch logic, date helpers)
- All API route handlers (mocked DB)
- Target coverage: ≥ 70% on `/lib/*` and `/app/api/*`

### 18.2 Integration tests (Vitest + Supabase test instance)

- Booking flow end-to-end
- Membership signup → cancellation → reactivation
- Status update → SMS dispatch (mocked Twilio)
- Punch card increment → free wash logic
- Referral code → credit issuance

### 18.3 E2E tests (Playwright)

Critical paths:
- Customer signup → first booking → wash tracking → completion
- Visitor → membership signup → Apple Wallet pass download
- Operator login → walk-in flow → status updates → payment
- Owner login → KPI dashboard renders
- Mobile responsive check on all critical screens

Run on every PR + nightly on main.

### 18.4 Manual QA checklist

Before each release:
- [ ] Booking modal works on iPhone Safari
- [ ] Booking modal works on Android Chrome
- [ ] Apple Wallet pass installs on iOS
- [ ] Google Wallet pass installs on Android
- [ ] Push notifications deliver on iOS 16.4+ and Android
- [ ] SMS deliver in < 5 seconds
- [ ] Stripe Terminal reader pairs and processes
- [ ] Pull-to-refresh works on iOS PWA
- [ ] Spanish version renders all strings (no untranslated keys)
- [ ] Dark mode renders correctly
- [ ] Offline mode shows cached shell + queues mutations

### 18.5 Load testing

Pre-launch: simulate 100 concurrent users via k6 or Artillery; verify < 500ms p95 latency.

---

# PART 19 — DEPLOYMENT PIPELINE

### 19.1 Branching

- `main` — production; protected; requires PR + passing tests
- `staging` — staging; auto-deploys to staging.urrutiawash.com
- `feature/*` — feature branches; preview deploys via Vercel

### 19.2 CI/CD (GitHub Actions + Vercel)

On every PR:
1. Lint (`eslint .`)
2. Typecheck (`tsc --noEmit`)
3. Unit tests (`vitest`)
4. Integration tests (against ephemeral Supabase branch)
5. Build (`next build`)
6. Lighthouse CI (must score ≥ 95)
7. Vercel preview deploy
8. E2E tests against preview

On merge to `main`:
1. All of the above
2. Sentry source map upload
3. Production deploy
4. Post-deploy smoke tests
5. Tag release `v0.X.Y`

### 19.3 Cron jobs (Vercel Cron)

- Daily: aggregate yesterday's metrics into KPI snapshot
- Daily: send membership renewal reminders (3 days before)
- Daily: process expired referrals
- Hourly: check for stuck washes (in DETAILING > 6hrs) and alert
- Weekly: send monthly recap emails on the 1st
- Weekly: clean up old notifications (> 90 days)

### 19.4 Rollback procedure

- Vercel: instant rollback to previous deployment via dashboard
- Database migrations: every migration must have a `down` function
- Feature flags (PostHog) wrap risky features for instant kill switch

---

# PART 20 — DROP-BY-DROP IMPLEMENTATION PLAN

### Drop 001 ✅ COMPLETE
Marketing site (HTML prototype). Customer PWA prototype. Build brief.

### Drop 002 — Foundation (4 hours)
**Goal:** Migrate prototypes into Next.js project; spin up infra.

Files:
- Convert `urrutia-website.html` → Next.js pages under `/(marketing)/`
- Convert `urrutia-app.jsx` → Next.js pages under `/(app)/`
- Set up Supabase project; run schema migration (Part 4)
- Configure Vercel project + custom domain
- Set up Cloudflare DNS
- Wire env vars
- Set up Sentry + PostHog

Acceptance:
- urrutiawash.com loads with HTTPS
- app.urrutiawash.com loads (no auth yet)
- Supabase reachable from Next.js
- Sentry receiving test errors
- Lighthouse ≥ 95

### Drop 003 — Auth + Core Customer Flow (4 hours)
**Goal:** Customers can sign up, add vehicles, book, see status.

Files:
- `/api/auth/*` — Twilio Verify integration
- `/api/vehicles/*`
- `/api/washes/*` (create, list, get, status update)
- `/(app)/login`, `/onboarding`, `/home`, `/book`, `/track/[id]`
- Supabase Realtime subscription for status updates
- SMS templates (booking_confirmed, wash_started, wash_ready)

Acceptance:
- New customer can sign up via OTP
- New customer can add vehicle
- New customer can book wash → receive confirmation SMS
- Operator (manually triggered for now) can advance status → customer's app updates live + customer receives SMS

### Drop 004 — Operator Console (3 hours)
**Goal:** Urrutia and crew can run daily ops.

Files:
- `/(ops)/login`, `/queue`, `/wash/[id]`, `/walkin`, `/lookup`
- Role-gated middleware
- Photo upload to Supabase Storage
- Walk-in flow (creates customer + vehicle + wash + payment)
- Stripe Terminal integration (or skip to Phase 2 if hardware not in hand; use Stripe Checkout for walk-ins as fallback)

Acceptance:
- Crew member can log in via OTP
- Walk-in flow creates new customer + processes payment in < 90 sec
- Status updates trigger correct SMS
- Photos upload and appear on customer track page

### Drop 005 — Memberships + Payments + Wallet (3.5 hours)
**Goal:** Memberships sell, recur, and pass into Apple Wallet.

Files:
- Stripe Checkout integration for memberships
- `/api/webhooks/stripe`
- `/api/memberships/*`
- `/(app)/member`, `/member/manage`
- Apple Wallet pass generation
- Punch card auto-increment logic
- Member discount applied at booking

Acceptance:
- Visitor can buy SOLO/DUO/FLEET via Stripe Checkout
- Welcome SMS + email fire on signup
- Apple Wallet pass downloads + installs on iPhone
- Member books wash → free wash credit decrements
- Member exhausts credits → prompted to pay one-off
- Member can cancel from PWA → effective at period end

### Drop 006 — Referrals + Loyalty + Polish (2 hours)
**Goal:** Referral mechanic live, rough edges sanded.

Files:
- `/api/referrals/*`
- `/refer/[code]` (public landing)
- Referral SMS + email triggers
- Punch card UI in `/member`
- Push notification setup (VAPID + service worker)
- All notification templates wired

Acceptance:
- Member shares code → friend signs up → both receive credit on friend's first wash
- Push notifications work on Android + iOS 16.4+
- All notifications in matrix (Part 6) fire correctly

### Drop 007 — Admin Dashboard (2 hours)
**Goal:** Owner sees the business.

Files:
- `/(admin)/dashboard`, `/revenue`, `/members`, `/referrals`, `/sms`
- KPI aggregation queries (materialized views or scheduled rollups)
- Export to CSV
- Comp wash + refund flows with audit logging

Acceptance:
- Owner sees today/week/month revenue
- Owner sees active member count by tier
- Owner can comp a wash + refund a charge

### Drop 008 — Legal, SEO, Polish (2 hours)
**Goal:** Production-ready, indexed by Google.

Files:
- All policy pages (Part 12.1)
- SEO meta + schema on every page
- Sitemap + robots.txt
- Spanish translations
- Accessibility audit fixes
- Lighthouse 95+ on every route
- Google Business Profile claimed and synced
- E2E test suite green

Acceptance:
- Every page has unique title + meta description
- Schema validates on schema.org validator
- Submitted to Google Search Console
- WCAG 2.1 AA passes axe scan
- Lighthouse ≥ 95 on every route

**Total to 100%: ~22 hours of MachineMind build time across ~7 working days.**

---

# PART 21 — ACCEPTANCE CRITERIA (THE 100% CHECKLIST)

The build is **NOT** complete until every box below is checked.

### Marketing site
- [ ] urrutiawash.com resolves with valid SSL
- [ ] All 17 pages from Part 3.1.1 exist and render
- [ ] Spanish version renders at /es/* with all strings translated
- [ ] Lighthouse ≥ 95 on home, /memberships, /book
- [ ] Schema.org validates on schema.org validator
- [ ] Sitemap submitted to Google Search Console + Bing
- [ ] OG tags render correctly when shared on iMessage, WhatsApp, Twitter
- [ ] Booking modal submits successfully and triggers SMS
- [ ] Newsletter signup writes to email list
- [ ] Real photography in place (no placeholders)
- [ ] Real testimonials in place
- [ ] Owner bio published
- [ ] Google Business Profile synced

### Customer PWA
- [ ] Phone OTP login works on iOS + Android
- [ ] First-time onboarding adds vehicle + offers membership
- [ ] Booking flow completes in ≤ 60 seconds for repeat user
- [ ] Live wash tracking updates in real-time via Supabase
- [ ] Apple Wallet pass downloads + installs + updates on punch
- [ ] Google Wallet pass downloads + installs on Android
- [ ] Push notifications deliver on iOS 16.4+ + Android
- [ ] PWA installable from browser (Add to Home Screen)
- [ ] Offline mode shows cached shell
- [ ] Background sync queues mutations when offline
- [ ] Membership signup → cancellation → reactivation all work
- [ ] Punch card auto-increments + auto-redeems
- [ ] Referral code copy + share + redeem all work
- [ ] Profile, vehicles, payment methods, billing all editable
- [ ] In-app notification center renders + marks read
- [ ] Notification preferences persist
- [ ] Spanish version of every string
- [ ] WCAG 2.1 AA on every screen

### Operator console
- [ ] Crew login via email or OTP
- [ ] Live queue updates in real-time
- [ ] Walk-in flow ≤ 90 seconds for repeat customer
- [ ] Status update triggers correct SMS within 5 seconds
- [ ] Photo upload (before + after) attached to wash record
- [ ] Customer lookup by plate / phone / name returns correct results
- [ ] Stripe Terminal pairs + processes payment
- [ ] Tip flow captures + records
- [ ] Shift clock-in / clock-out works with GPS verify
- [ ] Works on iPad portrait + landscape
- [ ] Touch targets ≥ 44x44pt

### Owner / admin console
- [ ] KPI dashboard shows today/week/month revenue
- [ ] MRR + ARR + active member count by tier
- [ ] Member list filterable + searchable
- [ ] Member detail shows full history + LTV
- [ ] Referral leaderboard accurate
- [ ] SMS audit log searchable + exportable
- [ ] Comp wash flow with reason logging
- [ ] Refund flow with reason logging
- [ ] Settings: hours, prices, tiers editable
- [ ] Audit log records every privileged action

### Infrastructure
- [ ] Custom domain on Cloudflare with valid SSL
- [ ] Vercel production deployment auto-deploys from main
- [ ] Supabase Pro tier (or Free if traffic permits) with daily backups
- [ ] Twilio Verify configured for OTP
- [ ] Twilio SMS configured with messaging service + dedicated number
- [ ] Stripe live mode with all price IDs configured
- [ ] Apple Developer cert + pass type ID configured
- [ ] Resend domain verified + DKIM/SPF/DMARC set
- [ ] Sentry receiving + alerting on errors
- [ ] PostHog tracking events
- [ ] Uptime monitor (BetterStack) checking every 60s

### Legal
- [ ] All 7 policy pages published
- [ ] Privacy Policy reviewed by attorney
- [ ] TCPA consent flow + STOP/HELP keywords working
- [ ] CCPA "Do Not Sell" link in footer
- [ ] Cookie banner with Accept / Reject (GDPR-style)
- [ ] Membership auto-renewal disclosure visible at signup
- [ ] Insurance COI on file from Urrutia

### Security
- [ ] CSP + HSTS + security headers set
- [ ] Rate limiting on every API route
- [ ] All secrets in Vercel env (none in code)
- [ ] OWASP ZAP scan passed
- [ ] No card data ever logged
- [ ] PII encrypted at rest

### Testing
- [ ] Unit test coverage ≥ 70% on /lib + /app/api
- [ ] E2E test suite covers all critical paths
- [ ] All E2E tests green
- [ ] Manual QA checklist (Part 18.4) all checked

### Observability
- [ ] Sentry alerts configured (Slack)
- [ ] PostHog funnels built (visitor → booking → member)
- [ ] Uptime monitor configured
- [ ] All telemetry events firing correctly

### Documentation
- [ ] README in repo with local dev setup
- [ ] /docs/disaster-recovery.md
- [ ] /docs/runbook.md (common ops tasks for Urrutia)
- [ ] /docs/api.md (every endpoint documented)
- [ ] Crew training video recorded (Operator Console walkthrough)

When every box above is checked: the build is 100%.

---

# PART 22 — POST-LAUNCH OPERATIONS

### 22.1 Day 1–7 (active monitoring)

- Phil monitors Sentry every 4 hours
- Daily standup with Urrutia: any issues, any feedback, any surprises
- Hot-fix window: any critical bug shipped in < 4 hours
- Customer feedback collected via in-app survey + SMS

### 22.2 Day 8–30 (stabilization)

- Weekly metrics review with Urrutia
- Retention cohort analysis (signup week → first wash → second wash → membership)
- Iterate on CTAs, pricing display, onboarding flow based on PostHog funnels

### 22.3 Day 31+ (growth)

- Quarterly roadmap review
- Phase 2 features unlocked (Part 23) based on data
- Backlinks campaign for SEO
- Paid acquisition test budget ($500/mo Meta + $500/mo Google) to find efficient CAC

### 22.4 Ongoing maintenance

| Cadence | Task |
|---|---|
| Daily | Check Sentry, check uptime, respond to support |
| Weekly | KPI review with Urrutia, deploy any fixes |
| Monthly | Backup verification, dependency updates, content review |
| Quarterly | Security scan, key rotation, accessibility audit |
| Annually | Apple Developer cert renewal, full pen test (if scale demands) |

---

# PART 23 — PHASE 2 ROADMAP (POST-100%)

These are explicitly **NOT** required for 100% completion of the MVP. They are the next horizon.

### 23.1 ALPR (Automatic License Plate Recognition)

- Hardware: Raspberry Pi 4 + Coral USB Accelerator + IMX477 camera at wash bay entrance (~$250 BOM)
- Software: OpenALPR or PlateRecognizer.com API
- Flow: car arrives → camera reads plate → vehicle + customer auto-pulled → wash auto-created in QUEUED → operator confirms service tier
- Workflow lock-in vector: now the customer literally doesn't have to do anything — pull up, walk in, work out, drive away clean

### 23.2 Geofence + LVAC Integration

- PWA requests geofence permission
- When member enters LVAC parking radius, app pings server
- Server creates pre-emptive wash booking (with cancel grace window)
- LVAC entry sync (if partnership): when member badges in to gym, schedule wash to finish 5 min before estimated workout end

### 23.3 White-label LVAC Platform

- Multi-tenant architecture (already designed in)
- LVAC Corporate licenses platform → "LVAC Member Auto Care"
- MachineMind takes 30% rev share
- Expand to all NV LVAC locations, then nationally
- Sergio leads partnership

### 23.4 Corporate / Fleet Portal

- B2B account type
- HR admin invites employees
- Company pays subscription, employees get washes as benefit
- White-label for HOAs, office buildings

### 23.5 Predictive Recommendations

- 12 months of wash data → ML model identifies frequency cycles
- "Your car is due for a ceramic refresh"
- "Last paint correction was 6 months ago — schedule maintenance?"
- Increases LTV by ~30%

### 23.6 Subscription Add-on Marketplace

- Tire shine: +$5/mo
- Interior protectant: +$8/mo
- Pet hair removal: +$10/mo
- Engine bay quarterly: +$15/mo
- Stack onto base membership

### 23.7 Mobile detail expansion

- HOAs, office parking lots, residential routes
- Optimize routing via Mapbox Optimization API
- Subscription tier: home detailing weekly

### 23.8 Native iOS/Android apps

- React Native via Expo (shares 80% code with PWA)
- Push notifications more reliable than Web Push on iOS
- App Store presence for SEO
- Phase 2 — only when PWA conversion data justifies

### 23.9 Insurance integration

- Partner with insurer (or self-insure) for paint protection guarantee
- $X/mo add-on covers minor scratches, paint corrections at no charge
- Compliance shield vector

### 23.10 OpenAI-powered customer service

- Inbound SMS auto-replied to common questions
- Owner approves uncertain replies via mobile interface
- Reduces support load 80%

---

# PART 24 — APPENDICES

### Appendix A — Service price reference (current)

| Service | Walk-in price | Member benefit | Typical duration |
|---|---|---|---|
| Express wash | $35 | 1 wash credit (SOLO/DUO) | 30 min |
| Wash + Interior | $75 | 2 credits | 60 min |
| Full Detail | $295+ | $50 off member | 4 hr |
| Ceramic Coating | $895+ | $100 off member | 1 day |
| Mobile (any service) | +$50 surcharge | +$25 surcharge for member | varies |

### Appendix B — Membership tiers

| Tier | Monthly | Annual (10% off) | Washes/mo | Vehicles | Other |
|---|---|---|---|---|---|
| SOLO | $89 | $961 | 4 | 1 | 10% off details |
| DUO | $149 | $1,609 | 8 | 2 | 15% off details, priority booking |
| FLEET | $279 | $3,013 | unlimited | 4 | 20% off details, mobile included monthly |

### Appendix C — MachineMind pricing to Urrutia

| Item | Amount |
|---|---|
| Build fee (one-time) | $2,500 |
| Platform fee (monthly) | $295 |
| Transaction fee | 4% of all wash + membership revenue |
| Hosting + infra costs | Pass-through (estimated $100/mo at scale) |

Projected MachineMind revenue at scale (200 active members + 30 walk-ins/day):
- Member revenue: 200 × ~$130 avg = $26,000/mo → 4% = $1,040
- Walk-in revenue: 30 × $50 avg × 30 days = $45,000/mo → 4% = $1,800
- Platform fee: $295
- **Total: ~$3,135/mo recurring** from one Urrutia location

Replicated across 5 LVAC locations = ~$15,675/mo recurring just from gym lots.

---

# PART 25 — DOCUMENT CONTROL

**Owner:** Philip McGill, Technical Co-Founder, MachineMind LLC
**Reviewers:** Sergio Sandoval (CBDO), Todd Rahaim (VP Sales)
**Client sign-off required:** Urrutia (Owner)
**Distribution:** GitHub repo `/docs/BUILD_SPEC.md`
**Update cadence:** Major version on milestone completion; minor on weekly review
**Authority:** This document supersedes any other build doc. Conflicts resolved in favor of this spec.

---

**END OF SPECIFICATION**

*Built to MachineMind apex tier — no scope limiting, no dumbing down. If a requirement here is ignored, the build is incomplete by definition. If a requirement here is exceeded, document the upgrade as v1.1+.*
