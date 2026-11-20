# MenuLens — Project Blueprint & Execution Plan

> **Mobile-first PWA for health-conscious dining in India**  
> Analyzes restaurant menu photos to recommend dishes aligned with dietary goals, health metrics, and cultural preferences.

---

## 1. Architecture & Tech Stack

### Core Technologies
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS with custom design tokens, CSS variables, and Dark Mode (`next-themes` / class-based)
- **Animation**: Framer Motion (page transitions, laser scan beam, sheet gestures, score ring SVG animations)
- **State Management**: Zustand (persisted user profile, active scan results, group mode state)
- **Icons**: Lucide React
- **PWA Integration**: Web App Manifest, Service Worker, iOS safe-area handling, viewport meta configuration
- **Future AI Integration**: Next.js Route Handlers (`/api/analyze-menu`) hooking into Google Gemini 1.5 Pro / Flash Vision

---

## 2. Project File Structure

```
MenuLens/
├── PLAN.md                               # This master blueprint
├── package.json
├── tsconfig.json
├── tailwind.config.ts                    # Design tokens & color system
├── postcss.config.js
├── next.config.mjs                       # PWA headers & image domains
├── public/
│   ├── manifest.webmanifest              # PWA manifest
│   ├── sw.js                             # Service worker for offline caching
│   ├── icons/                            # PWA app icons (192x192, 512x512, apple-touch-icon)
│   └── samples/                          # Sample Indian restaurant menu images
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout with font imports, theme provider, PWA meta
│   │   ├── page.tsx                      # Root director (redirects to /welcome or /home)
│   │   ├── welcome/
│   │   │   └── page.tsx                  # Welcome / Value proposition screen
│   │   ├── onboarding/
│   │   │   └── page.tsx                  # 3-step stepper (Goal -> Diet -> Allergies)
│   │   ├── home/
│   │   │   └── page.tsx                  # Main home feed with prominent "Scan Menu" action
│   │   ├── scan/
│   │   │   └── page.tsx                  # Camera capture & Scanning radar/laser animation
│   │   ├── results/
│   │   │   └── page.tsx                  # Scored recommendations, filter chips, dish list
│   │   ├── group/
│   │   │   └── page.tsx                  # Group dining mode (multi-profile constraint solver)
│   │   └── api/
│   │       └── analyze-menu/
│   │           └── route.ts              # Mocked route (ready for Gemini Vision API prompt)
│   ├── components/
│   │   ├── common/
│   │   │   ├── MobileContainer.tsx       # Constrains layout to 430px max on desktop, 100% on mobile
│   │   │   ├── BottomNav.tsx             # Fixed bottom navigation (Home, History, Group, Profile)
│   │   │   ├── Header.tsx                # Context-aware top bar with back navigation & title
│   │   │   └── ThemeToggle.tsx           # Light / Dark mode toggle button
│   │   ├── ui/
│   │   │   ├── Button.tsx                # Tap-friendly buttons (sizes: sm, md, lg; primary, secondary, ghost)
│   │   │   ├── Card.tsx                  # Rounded-20px container with soft shadows
│   │   │   ├── Badge.tsx                 # Green / Amber / Red dietary tags
│   │   │   ├── ScoreRing.tsx             # Animated circular progress ring (0-100) with color grading
│   │   │   ├── BottomSheet.tsx           # Framer motion drag-to-dismiss bottom sheet
│   │   │   ├── StepperProgress.tsx       # Multi-step progress bar for onboarding
│   │   │   ├── SkeletonLoader.tsx        # Shimmering cards for scan & analysis states
│   │   │   └── FilterChip.tsx            # Filter pills (Veg, High Protein, Low Cal, Jain, etc.)
│   │   ├── screens/
│   │   │   ├── onboarding/
│   │   │   │   ├── StepGoal.tsx          # Fat loss, Muscle gain, Diabetes-friendly, Clean eating
│   │   │   │   ├── StepDiet.tsx          # Pure Veg, Non-Veg, Jain, Eggetarian, Vegan, Sattvic
│   │   │   │   └── StepAllergies.tsx     # Dairy/Lactose, Gluten/Maida, Nuts/Peanuts, Soy
│   │   │   ├── home/
│   │   │   │   ├── ScanHeroCard.tsx      # Huge prominent Scan button with camera/gallery picker
│   │   │   │   ├── QuickDietBadge.tsx    # Active user profile summary
│   │   │   │   └── RecentScansList.tsx   # History of analyzed menus
│   │   │   ├── scan/
│   │   │   │   ├── ScanLaserAnimation.tsx# Shimmering green scanning laser with particle pulse
│   │   │   │   └── ScanStatusTicker.tsx  # Dynamic status: "Detecting dishes...", "Calculating scores..."
│   │   │   ├── results/
│   │   │   │   ├── TopPicksCarousel.tsx  # Horizontal swipeable cards for top 3 matching dishes
│   │   │   │   ├── DishCard.tsx          # Dish item card with ScoreRing, tags, macro summary
│   │   │   │   └── DishDetailSheet.tsx   # Detailed bottom sheet with macro breakdown & waiter script
│   │   │   └── group/
│   │   │       ├── MemberPill.tsx        # Group member chip with avatar & dietary preference
│   │   │       ├── AddMemberModal.tsx    # Modal to add friend's constraints
│   │   │       └── ConsensusCard.tsx     # Dishes that suit every member in the group
│   ├── context/
│   │   └── ThemeProvider.tsx             # Dark/Light theme provider
│   ├── store/
│   │   ├── useUserStore.ts               # User profile state (goals, diet, allergies, target macros)
│   │   ├── useScanStore.ts               # Active scan result, filtered list, selected dish
│   │   └── useGroupStore.ts              # Group dining profiles & combined constraints
│   ├── types/
│   │   ├── profile.ts                    # User goal, diet types, allergy enums
│   │   ├── dish.ts                       # Dish data model (macros, score, tags, swap, waiter script)
│   │   └── menu.ts                       # Menu category, raw OCR output, parsed menu structure
│   ├── lib/
│   │   ├── constants.ts                  # Design tokens, default preferences, sample diets
│   │   ├── mock-data.ts                  # Realistic North/South Indian menu items with deep metadata
│   │   ├── score-calculator.ts           # Health score algorithm (0-100) based on user goals
│   │   └── utils.ts                      # Classnames merger (`clsx` + `tailwind-merge`), formatting
│   └── styles/
│       └── globals.css                   # Custom utilities, CSS variables, font definitions
```

---

## 3. Design Tokens & Visual Specs

### Color Palette

| Token Name | Light Value | Dark Value | Purpose |
|---|---|---|---|
| `--color-primary` | `#1F8A4C` | `#2ECC71` | Primary brand green, CTA buttons, active state |
| `--color-primary-hover` | `#176B3B` | `#27AE60` | Interactive hover/pressed state |
| `--color-primary-subtle`| `#EBF6EE` | `#11281A` | Selected chips, icon backgrounds, score tints |
| `--color-bg-app` | `#F7FAF5` | `#0E1712` | Warm off-white background (Light) / Deep organic dark (Dark) |
| `--color-surface` | `#FFFFFF` | `#16231C` | Cards, bottom sheet, navigation bar |
| `--color-surface-hover` | `#F2F6F3` | `#1D2D24` | Card pressed state, list highlights |
| `--color-text-main` | `#14261A` | `#F1F7F3` | Headings, primary titles |
| `--color-text-muted` | `#5A7162` | `#90A597` | Descriptions, captions, subtitles |
| `--color-border` | `#E4EDE6` | `#223328` | Subtle card dividers and borders |
| `--tag-green` (Safe/Top Pick) | `#1F8A4C` (Bg: `#EAF7EE`) | `#2ECC71` (Bg: `#13301D`) | High health match (>80 score) |
| `--tag-amber` (Moderate) | `#D97706` (Bg: `#FEF3C7`) | `#F59E0B` (Bg: `#382705`) | Moderate match (50-79 score) |
| `--tag-red` (Avoid/Warning) | `#DC2626` (Bg: `#FEE2E2`) | `#EF4444` (Bg: `#3B1111`) | High calorie / contains user allergen (<50 score) |

### Typography

- **Headings Font**: `Plus Jakarta Sans` (weights: `600` SemiBold, `700` Bold, `800` ExtraBold)
- **Body Font**: `Inter` (weights: `400` Regular, `500` Medium, `600` SemiBold)

| Type Style | Size / Line Height | Tracking | Weight | Usage |
|---|---|---|---|---|
| **Display** | 32px / 38px | -0.02em | 800 | Welcome headline, score big ring |
| **Title 1** | 24px / 30px | -0.01em | 700 | Screen titles, bottom sheet headings |
| **Title 2** | 20px / 26px | -0.01em | 600 | Card titles, dish names |
| **Subhead** | 16px / 22px | 0em | 600 | Filter chips, button text |
| **Body** | 15px / 22px | 0em | 400 / 500 | Explanations, health reasons, waiter scripts |
| **Caption** | 13px / 18px | +0.01em | 500 | Macro numbers, secondary badges |
| **Micro** | 11px / 14px | +0.02em | 600 | Upper-case category tags, diet flags |

### Radii, Shadows & Dimensions

- **Card Border Radius**: `20px` (`rounded-[20px]`)
- **Action Button Radius**: `16px` (`rounded-2xl`) or `9999px` (`rounded-full`)
- **Bottom Sheet Radius**: `28px` top-left and top-right (`rounded-t-[28px]`)
- **Filter Chip Radius**: `12px` (`rounded-xl`)
- **Shadows**:
  - `shadow-card`: `0 6px 20px -2px rgba(20, 38, 26, 0.05), 0 2px 6px -1px rgba(20, 38, 26, 0.02)`
  - `shadow-glow-green`: `0 8px 24px -4px rgba(31, 138, 76, 0.35)`
  - `shadow-sheet`: `0 -10px 40px rgba(0, 0, 0, 0.12)`
- **Minimum Tap Targets**: 48px × 48px for all actionable elements
- **Mobile Container**: Centered column, max width `430px` (iPhone Pro Max spec), full height with safe area insets (`env(safe-area-inset-bottom)`)

---

## 4. Screens & Detailed Specifications

### 1. Welcome Screen (`/welcome`)
- **Visuals**: Clean gradient background with subtle organic leaf/lens watermarks, app logo with green glowing ring.
- **Copy**: *"Dine out without derailing your health."*
- **Features**:
  - 3 quick value highlights (Instant menu OCR, tailor-made scores for your diet, custom waiter scripts).
  - Primary CTA: *"Get Started"* (`rounded-2xl`, height 56px, `shadow-glow-green`).
  - Secondary CTA: *"Take a Tour with Sample Menu"*.

### 2. Onboarding Stepper (`/onboarding`)
- **Progress Bar**: Smooth 3-segment progress indicator (33% → 66% → 100%).
- **Step 1 — Primary Health Goal**:
  - Options: Weight Loss / Calorie Deficit, Muscle Gain / High Protein, Diabetic / Low Glycemic, Heart Health / Low Sodium, Clean Balanced Dining.
- **Step 2 — Dietary Lifestyle (Indian Context)**:
  - Options: Pure Vegetarian (No egg), Eggetarian, Non-Vegetarian, Jain (No onion/garlic/root veg), Vegan, Sattvic.
- **Step 3 — Allergens & Dislikes**:
  - Options: Lactose / Dairy (Butter, Ghee, Cream, Paneer), Gluten (Maida, Atta), Peanuts / Tree Nuts (Cashew gravies), Soy, Deep Fried avoidance.
- **Storage**: Persisted to `localStorage` via Zustand store.

### 3. Home Screen (`/home`)
- **Top Bar**: Profile avatar with active diet pill (e.g. `Pure Veg • High Protein`), Dark Mode toggle.
- **Hero Scanner Card**:
  - Large rounded-20px card featuring an illustrated viewfinder and glowing primary green button: **"Scan Menu"**.
  - Dual action trigger: Camera capture or Upload photo from device.
- **Quick Switcher / Presets**: One-tap toggle between "Strict Mode" and "Cheat Day / Relaxed".
- **Recent Scans**: Horizontal card carousel showing previously scanned restaurants (e.g. *"Punjab Grill"*, *"Saravana Bhavan"*).

### 4. Scanning & Analysis Screen (`/scan`)
- **Visual Animation**:
  - Full-screen or modal camera viewfinder.
  - Framer Motion green laser bar sliding vertically across the captured menu photo.
  - Subtle radar pulse rings radiating from the center.
- **Live Status Ticker** (sequential text transitions with checkmarks):
  - 1. *"Detecting menu text & sections..."*
  - 2. *"Identifying hidden oils, gravies & ingredients..."*
  - 3. *"Matching against your Pure Veg & High Protein goals..."*
  - 4. *"Ready! 18 dishes scored."*

### 5. Results Screen (`/results`)
- **Header**: Restaurant name / Scan summary + quick re-scan button.
- **Filter Chips**: All, Top Picks (Score > 80), High Protein, Low Calorie, Pure Veg, Jain Friendly.
- **Section 1 — Top 3 Picks**:
  - Horizontal swipe cards with green glowing borders, large score ring (e.g. `94/100`), calorie badge, and "Best Match" ribbon.
- **Section 2 — All Dishes List**:
  - Sorted by score (descending) by default.
  - Each `DishCard` has:
    - Veg/Non-Veg icon (Indian green square with circle / brown square with triangle standard).
    - Dish name in Plus Jakarta Sans.
    - Category (e.g., Tandoor, Curries, Breads).
    - Health Score Ring (color graded: Green 80-100, Amber 50-79, Red <50).
    - Quick macro pills (Est. kcal, Protein g).
    - Tapping opens the Dish Detail Bottom Sheet.

### 6. Dish Detail Bottom Sheet (`/results#dish-detail`)
- **Header**: Large dish title, Veg/Non-veg icon, overall score with animated circular progress bar.
- **Macro Breakdown**:
  - Visual horizontal progress bars: Calories (kcal), Protein (g), Carbs (g), Fats (g).
- **The "Why" Section**:
  - Explanatory bullet points: *"High protein from roasted paneer, no heavy cashew cream base, moderate sodium."*
- **Healthier Swap Recommendation**:
  - e.g. For Butter Naan → *"Swap with Tandoori Roti (no butter) to save 180 kcal & 12g fat."*
- **"What to Tell the Waiter" Card (Copyable Prompt)**:
  - Specially formulated for Indian restaurant kitchens:
    > *"Bhaiya, Paneer Tikka mein butter upar se mat lagana, aur pudina chutney extra dena please."*
  - One-tap "Copy Instruction" button with visual feedback (checkmark & toast).

### 7. Group Mode (`/group`)
- **Concept**: Solves the common Indian dining dilemma: ordering dishes that work for everyone at the table (e.g., 1 Jain, 1 Keto, 1 Calorie Deficit).
- **Features**:
  - Add members with names and individual diet/allergy presets.
  - **Consensus Scoring**: Calculates dishes with the lowest conflict score.
  - **Conflict Warnings**: Shows tags like: *"⚠️ Contains onion/garlic (Violates Amit's Jain diet)"* or *"✅ Safe for everyone"*.

---

## 5. Phased Build Plan

### Phase 1: Project Setup & Design Token Foundation
1. Initialize Next.js project with App Router, TypeScript, and Tailwind CSS.
2. Configure fonts (`Plus Jakarta Sans` and `Inter` via `next/font/google`).
3. Set up custom Tailwind colors, radius (`20px`), shadows, and Dark Mode CSS variables in `globals.css`.
4. Configure PWA manifest (`manifest.webmanifest`), meta tags (theme-color, apple-mobile-web-app-capable), and mobile container viewport shell.

### Phase 2: Core Reusable UI Component Library
1. Build `MobileContainer`, `Header`, and `BottomNav`.
2. Build interactive `Button`, `Card`, and `Badge` with tap animations (`whileTap={{ scale: 0.97 }}`).
3. Build `ScoreRing` SVG component with Framer Motion animated circumference and green/amber/red color interpolations.
4. Build `BottomSheet` with drag-to-dismiss gestures using Framer Motion.
5. Build `FilterChip` and `SkeletonLoader`.

### Phase 3: State Management & Onboarding Flow
1. Set up Zustand stores: `useUserStore` (with `persist` middleware for `localStorage`) and `useScanStore`.
2. Implement `/welcome` screen with feature highlights and onboarding launch.
3. Build `/onboarding` 3-step stepper with animated progress bar and selection state.

### Phase 4: Home Screen & Camera Scanning Animation
1. Build `/home` dashboard with `ScanHeroCard`, active diet badge, and recent scans.
2. Build `/scan` interface supporting file selection or camera input.
3. Implement `ScanLaserAnimation` (glowing laser beam, pulse waves, and animated status text ticker).
4. Connect mock OCR parsing pipeline that simulates processing a menu and navigating to `/results`.

### Phase 5: Results Screen & Dish Detail Bottom Sheet
1. Populate rich mock data for realistic Indian menus (Starters, Tandoor, Curries, Dals, Breads, Rice).
2. Build `/results` with filter chips (Veg only, High Protein, Low Cal, Jain).
3. Implement `TopPicksCarousel` and `DishCard` list with dynamic score calculations.
4. Implement `DishDetailSheet` with macro bars, health reasoning, healthier swaps, and the copyable "What to tell the waiter" card.

### Phase 6: Group Dining Mode
1. Build `/group` interface allowing users to add/manage dining companions.
2. Implement consensus calculation logic (safe for all vs. dietary conflicts).
3. Display shared recommendations and conflict badges.

### Phase 7: Polish, Dark Mode, PWA & Gemini Route Preparation
1. Validate light and dark mode contrasts across all screens.
2. Test touch targets, safe-area padding on iOS Safari and Android Chrome.
3. Stub `/api/analyze-menu` route handler with the exact JSON schema ready for Gemini Vision integration.
4. Final QA walkthrough.
