# Implementation Plan — Paperglow Homepage

Implement the official **Paperglow Homepage** using the existing theme's layout structure, replacing all agency/portfolio messaging with Paperglow's dual business model: **Digital Business Applications** and **Branding & Customization**.

---

## User Review & Confirmed Direction

- **Brand Primary Color**: **RED** (`#DC2626` / `#E11D48`) on solid neutral white/dark surfaces. No glassmorphism, no gradient blurs, no excessive card roundness.
- **7 Ordered Homepage Sections**:
  1. **Hero**: Paperglow branding, clear dual-engine headline, Primary CTA ("Explore Applications") & Secondary CTA ("Brand Your Business").
  2. **Featured Applications**: Real application cards with Name, Description, Main Benefit, "View Application" button, and "Subscribe" button with working subscription toggle.
  3. **One Paperglow Account**: Architectural explanation of the single unified account for digital apps + branding orders.
  4. **Branding & Customization**: Clean showcase of Graphic Design, Banners, T-Shirts, Hoodies, Uniforms, Caps, Business Cards, and Custom Merchandise.
  5. **How Paperglow Works**: 4-step clear progression (Create account → Explore applications → Subscribe or access an application → Manage everything from Paperglow).
  6. **Why Paperglow**: Clear value pillars (Convenience, One Account, Practical Business Tools, Professional Physical Branding).
  7. **Final CTA**: "Build your business with Paperglow."

---

## 1. Homepage Architecture & Section Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           1. HERO SECTION                                   │
│  Brand: PAPERGLOW (Red Accent)                                              │
│  Headline: "Business Applications & Custom Branding in One Single Platform" │
│  [Explore Applications] (Primary Red)    [Brand Your Business] (Outline)    │
├─────────────────────────────────────────────────────────────────────────────┤
│                     2. FEATURED APPLICATIONS                                │
│  4 Flagship Apps: Paperglow Invoice, CRM, Project Hub, Team Portal          │
│  Card: Name • Description • Main Benefit • [View App] • [Subscribe]         │
├─────────────────────────────────────────────────────────────────────────────┤
│                     3. ONE PAPERGLOW ACCOUNT                                │
│  Single-sign-on (SSO) architecture diagram & explanation                    │
│  Central hub: apps, team permissions, branding orders, and single billing   │
├─────────────────────────────────────────────────────────────────────────────┤
│                  4. BRANDING & CUSTOMIZATION                                │
│  8 Distinct Offerings: Graphic Design, Banners, T-Shirts, Hoodies,          │
│  Uniforms, Caps, Business Cards, Custom Merchandise                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                     5. HOW PAPERGLOW WORKS                                  │
│  Step 1: Create Account                                                     │
│  Step 2: Explore Applications                                               │
│  Step 3: Subscribe or Access an Application                                 │
│  Step 4: Manage Everything from Paperglow                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                       6. WHY PAPERGLOW                                      │
│  • Operational Convenience  • Single Unified Account                        │
│  • Practical Business Tools • High-Standard Professional Branding           │
├─────────────────────────────────────────────────────────────────────────────┤
│                         7. FINAL CTA                                        │
│  "Build your business with Paperglow."                                      │
│  [Create Your Account]                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technical Modifications & Files to Update

1. **`src/index.css`**
   - Configure `--color-primary: #dc2626` (Paperglow Red), `--color-primary-hover: #b91c1c`.
   - Remove legacy theme overrides, neon glows, and glassmorphism.
   - Clean solid surfaces with 1px hairline borders (`border-neutral-200 dark:border-neutral-800`).

2. **`src/types/index.ts`**
   - Add structured types for `BusinessApp` (id, name, tagline, description, benefit, price, isSubscribed, category) and `BrandingProduct` (id, title, category, description, minOrder, turnaround).

3. **`src/data/paperglowData.ts`**
   - Centralize data for the 4 core applications:
     - **Paperglow Invoice**: Automated recurring billing, client payments, and tax-ready ledgers.
     - **Paperglow CRM**: Pipeline tracking, customer interaction logs, and deal stages.
     - **Paperglow Hub**: Sprint task boards, milestone tracking, and shared documents.
     - **Paperglow Team**: Staff directory, role-based permissions, and team announcements.
   - Centralize data for the 8 branding & customization categories: Graphic Design, Banners, T-Shirts, Hoodies, Uniforms, Caps, Business Cards, and Custom Merchandise.

4. **`src/components/Navbar.tsx` & `src/components/Footer.tsx`**
   - Update wordmark to **Paperglow** with clean red square indicator.
   - Update navigation items: **Overview**, **Applications**, **Branding & Print**, **How It Works**, **Account / Dashboard**.
   - Red CTA button for direct account access.

5. **`src/pages/HomePage.tsx`**
   - Implement all 7 requested sections in exact order.
   - Connect active subscription state to application cards (clicking "Subscribe" updates status in real time).
   - "View Application" triggers a clean modal with full specs and pricing.

6. **`src/components/AppDetailModal.tsx`**
   - Reusable modal displaying full feature list, security, pricing breakdown, and subscription action.

7. **`src/App.tsx`**
   - Coordinate global state for user's subscribed applications and active tab navigation.
