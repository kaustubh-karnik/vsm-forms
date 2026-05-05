## VSM Forms Platform — Detailed UI Design Prompt

### Brand Identity & Visual Language

**Color Palette**
- Primary: Deep saffron `#E8640A` — draws from VSM's RSS/Vivekananda spiritual heritage and the saffron flag
- Secondary: Forest green `#2D6A3F` — represents tribal/rural/environment work
- Accent: Warm cream/off-white `#FDF6EC` — page background, feels warm not clinical
- Dark text: `#1A1208` — deep warm black, not cold gray
- Muted text: `#6B5B45` — warm brown-gray for secondary info
- Card background: `#FFFAF3` — slightly warm white
- Border/divider: `#E8DDD0` — warm beige, never cold gray

**Typography**
- Headings: `Tiro Devanagari Marathi` or `Noto Serif Devanagari` — gives cultural rootedness even in English; fallback `Georgia`
- Body/UI: `Inter` — clean, readable, modern
- The combination feels grounded and trustworthy, not corporate-slick

**Visual Motifs**
- Subtle lotus or rangoli-inspired geometric patterns as decorative dividers (SVG, very light opacity ~8%)
- Rounded corners everywhere (12–16px radius) — approachable, not sharp
- Soft warm shadows (`box-shadow: 0 2px 12px rgba(90,50,10,0.08)`) instead of cold gray shadows
- No glassmorphism, no gradients on UI elements — flat, clean, warm

---

### Page 1: Public Homepage (Linktree-style)

**Layout: centered single column, max-width 520px, centered on page**

```
┌─────────────────────────────────────┐
│  [VSM Logo — circular, 72px]        │
│  Vivekanand Seva Mandal             │  ← serif, 22px, saffron
│  Dombivli · Since 1991              │  ← 13px muted warm brown
│                                     │
│  ● ● ● ● ●   (social icons row)     │  ← Instagram, Facebook,
│              spaced 20px apart      │    YouTube, WhatsApp, Website
│─────────────────────────────────────│
│  ── Active Initiatives ──           │  ← decorative divider text
│                                     │
│  ┌─────────────────────────────┐    │
│  │  [Cover Photo — 16:9 ratio] │    │  ← rounded top corners only
│  │  Runmochan 2025             │    │  ← bold serif 16px
│  │  Yuva Chetana · Tribal      │    │  ← team pill badge, green
│  │  Outreach trek to Kasara    │    │  ← description 13px muted
│  │  ⏱ Closes 20 Sept 2025     │    │  ← amber warning if <7 days
│  │  [  Register Now  →  ]      │    │  ← saffron CTA button
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  [Cover Photo]              │    │
│  │  Sneh Bhojan Volunteer Form │    │
│  │  Gram Vikas                 │    │
│  │  Help serve Diwali feast... │    │
│  │  [  Fill Form  →  ]         │    │
│  └─────────────────────────────┘    │
│                                     │
│  ── Closed Forms ──                 │  ← collapsed by default,
│  [Show 3 past forms ▾]              │    expandable
│─────────────────────────────────────│
│  Made with ♥ for VSM                │  ← footer, tiny 11px
└─────────────────────────────────────┘
```

**Form Card Details:**
- Cover photo: full-bleed, 16:9, `object-fit: cover`, top-rounded `12px`
- If no cover photo: gradient placeholder using saffron→deep-orange with VSM initials centered
- Team badge: small pill below title — `Nalanda`, `Gram Vikas`, `MUSE`, `Yuva Chetana`, `SDA` — each with its own color (green for Gram Vikas, blue for Nalanda, pink for MUSE, amber for Yuva Chetana)
- Closing time: shown only if set — green if >7 days, amber if 3–7 days, red pulsing dot if <3 days, gray "Closed" if past
- CTA button: full-width, saffron background, white text, 10px radius
- Card hover: slight lift `translateY(-2px)`, warmer shadow

---

### Page 2: Individual Form Page (Public)

**Layout: centered, max-width 600px**

```
┌─────────────────────────────────────┐
│  ← Back to VSM Forms                │  ← back link, top left
│                                     │
│  [Full cover photo — 16:9]          │
│                                     │
│  Runmochan 2025 Registration        │  ← serif h1, 24px
│  🟢 Yuva Chetana   ⏱ 20 Sept 2025  │
│                                     │
│  About this initiative              │  ← 13px muted, max 3 lines
│  Volunteers will visit tribal...    │    with "read more" expand
│  ─────────────────────────────────  │
│                                     │
│  [  Dynamic Form Fields render  ]   │
│                                     │
│  [ Full Name *              ]       │  ← warm bordered inputs
│  [ Email Address *          ]       │
│  [ City          ▾          ]       │  ← select
│  [●] M  [○] L  [○] XL              │  ← radio group
│  [☑] I agree to volunteer terms    │
│                                     │
│  [      Submit Registration    ]    │  ← saffron, full-width
└─────────────────────────────────────┘
```

**Form field styling:**
- Border: `1.5px solid #E8DDD0`, on focus changes to saffron `#E8640A`
- Label: 13px warm brown above field, not placeholder-as-label
- Error state: red-orange underline + small message below
- Success page: full-screen warm cream with a checkmark in a saffron circle, "Thank you, [Name]! We'll see you at Runmochan 2025." with a share-to-WhatsApp button

---

### Page 3: Admin Dashboard

**Layout: sidebar + main content, full-width desktop, stacked mobile**

```
┌──────────┬──────────────────────────────────────┐
│          │  Good morning, Rahul 🙏              │
│  VSM     │  Team: Gram Vikas                    │
│  [logo]  │──────────────────────────────────────│
│          │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ Dashboard│  │ 12  │ │ 847 │ │  3  │ │  1  │   │
│ My Forms │  │Forms│ │Resp.│ │Open │ │Clos.│   │
│ Analytics│  └─────┘ └─────┘ └─────┘ └─────┘   │
│ Team     │──────────────────────────────────────│
│ Settings │  My Forms                [+ New Form]│
│          │  ┌──────────────────────────────────┐│
│          │  │ Runmochan 2025    🟢 89 responses ││
│          │  │ ⏱ Closes Sept 20  [Edit][Data]   ││
│          │  └──────────────────────────────────┘│
│          │  ┌──────────────────────────────────┐│
│          │  │ Sneh Bhojan       🟡 12 responses ││
│          │  │ Draft — not live   [Edit][Publish]││
│          │  └──────────────────────────────────┘│
└──────────┴──────────────────────────────────────┘
```

**Sidebar:** Warm cream background `#FDF6EC`, saffron left-border on active item, VSM logo at top, team name below it in green badge.

**Stat cards:** White with warm shadow, number in saffron serif, label in small muted text below.

---

### Page 4: Form Builder (Admin)

**Two-panel layout:**
- Left panel (360px): draggable field palette — Text, Email, Number, Select, Radio, Checkbox, Date, File Upload, Section heading — each as a pill you drag to the right
- Right panel: live canvas showing the form as it will appear to the public, reorderable via drag
- Top bar: Form title input (inline editable), Team selector dropdown, Cover photo upload, Public/Private toggle, Save + Publish buttons in saffron

---

### Page 5: Response Viewer (Admin)

- Spreadsheet-style table with form field labels as columns, each submission as a row
- Filter bar at top: filter by date range, by a specific field value
- Export row: `[Export Excel]` `[Export PDF]` buttons in outline style
- Row click → slide-in panel from right showing that single submission in a clean card format

---

### Page 6: Analytics (Admin — Team Lead view)

- Bar chart: responses per form over time (recharts, saffron bars)
- Donut chart: response distribution across teams
- Table: all teams, their form count, response count, last activity
- Team A cannot see Team B's row data — they only see aggregate counts for other teams if they're a super-admin

---

### Micro-interactions & Details

- Page load: cards fade up with `opacity 0→1, translateY 16px→0` staggered 80ms apart
- Form submit: button shows a spinner, then morphs to a checkmark ✓
- Copy link button on each form card (copies public URL for WhatsApp sharing)
- Mobile: all pages are single column, bottom sheet for filters, fixed bottom CTA on form page
- Empty state: warm illustration (SVG of a lotus with "No forms yet — create your first one") instead of cold "No data" text

---

### Design Don'ts for this project

- No cold blues or purples — this is a warm-toned, culturally rooted NGO
- No stock-photo-style hero banners on the homepage — keep it focused like Linktree
- No excessive animations — the audience includes older volunteers and tribal community members on low-end phones
- No dark mode as primary — the warm cream light theme IS the brand; dark mode is optional
- No English-only — admin labels should support Marathi equivalents in tooltips