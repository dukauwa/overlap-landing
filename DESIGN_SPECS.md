# Overlap.so Design Specifications
## Extracted from Figma (Node ID: 9-47)

---

## 📝 Text Content

### Hero Headlines
1. **"Connect once."**
2. **"Stay in the loop forever."**

### Description
**"Overlap turns scattered work context into an actionable feed to help you get through work faster and with more clarity."**

### Call-to-Action
**"Get early access"** (appears in both hero section and navigation)

### Additional Elements
- **"Alpha"** - Badge label in top-right corner

---

## 🎨 Typography

### Main Headings ("Connect once." / "Stay in the loop forever.")
- **Font Family:** Perfectly Nineties
- **Weight:** 400 (Regular)
- **Size:** 64px
- **Line Height:** 64px (100%)
- **Letter Spacing:** -1px
- **Text Align:** Center
- **Color:** White (#FFFFFF)

### Description Text
- **Font Family:** Geist
- **Weight:** 400 (Regular)
- **Size:** 21px
- **Line Height:** 31.5px (150%)
- **Letter Spacing:** -0.7px
- **Text Align:** Center
- **Color:** White (#FFFFFF)

### CTA Button Text ("Get early access")
- **Font Family:** Geist
- **Weight:** 500 (Medium)
- **Size:** 14px
- **Line Height:** 21px (150%)
- **Letter Spacing:** -0.28px
- **Text Align:** Center
- **Color:** #6784A6 (Blue-gray)

### Alpha Badge Text
- **Font Family:** Geist
- **Weight:** 400 (Regular)
- **Size:** 14px
- **Line Height:** 20px (~143%)
- **Letter Spacing:** 0px
- **Color:** White (#FFFFFF)

---

## 🌈 Background Gradient

### Radial Gradient Overlay
- **Type:** Radial gradient
- **Center Position:** ~50% horizontal, ~47% vertical
- **Color Stops:**
  1. **Inner (0%):** `rgba(128, 194, 229, 1)` - Light blue
     - Hex: `#80C2E5`
     - RGB: `rgb(128, 194, 229)`
  2. **Outer (100%):** `rgba(255, 255, 255, 0)` - Transparent white

### CSS Implementation
```css
background: radial-gradient(
  circle at 50% 47%,
  rgba(128, 194, 229, 1) 0%,
  rgba(255, 255, 255, 0) 100%
);
```

---

## 🖼️ Logo

### Navigation Logo (Top Left)
- **Dimensions:** 120px × 31.88px
- **Aspect Ratio:** Preserve (120:31.88)
- **Position:** Top-left corner of navigation
- **Margin:** 20px from top and left edges (based on nav spacing)
- **Image Reference:** `d7390ee22c9d5c3844cb4d10fff0d4c8c16358f8`

**Note:** You'll need to export the logo from Figma or use the image reference to fetch it via Figma API.

---

## 🎯 Additional UI Elements

### Alpha Badge
- **Background:** White with 20% opacity (`rgba(250, 250, 250, 0.2)`)
- **Border:** White with 20% opacity, 2px stroke
- **Border Radius:** 14px
- **Backdrop Blur:** 12px (glassmorphism effect)
- **Padding:** 10px horizontal, 9px vertical
- **Position:** Top-right area of content

### CTA Button ("Get early access")
- **Background:** White (#FFFFFF)
- **Border Radius:** 16px
- **Dimensions:** 140px × 48px
- **Effects:** Multiple inner shadows for depth
  1. Top shadow: `rgba(54, 183, 252, 0.2)` offset (0, -2px), blur 2px
  2. Bottom shadow: `rgba(155, 220, 255, 0.25)` offset (0, 2px), blur 2px
  3. Left shadow: `rgba(221, 241, 255, 1.0)` offset (-2px, 0), blur 4px

**CSS Implementation:**
```css
.cta-button {
  background: #FFFFFF;
  border-radius: 16px;
  width: 140px;
  height: 48px;
  box-shadow:
    inset 0 -2px 2px rgba(54, 183, 252, 0.2),
    inset 0 2px 2px rgba(155, 220, 255, 0.25),
    inset -2px 0 4px rgba(221, 241, 255, 1.0);
}
```

---

## 📐 Layout Specifications

### Frame Dimensions
- **Width:** 1440px (desktop)
- **Height:** 900px

### Content Positioning
- **Headlines:** Centered horizontally, positioned ~289px from top
- **Description:** Centered horizontally, ~464px from top
- **CTA Button:** Centered horizontally, ~565px from top
- **Alpha Badge:** Top-right corner area

### Navigation Bar
- **Height:** 112px (includes padding)
- **Background:** White (#FFFFFF)
- **Fixed Position:** Stays at top on scroll
- **Logo Position:** Left side, vertically centered
- **CTA Position:** Right side, vertically centered

---

## 🎨 Font Resources

### Required Font Files

1. **Perfectly Nineties**
   - Download from: [Google Fonts](https://fonts.google.com/) or custom source
   - Required weight: Regular (400)

2. **Geist**
   - Download from: [Vercel Geist](https://vercel.com/font)
   - Required weights: Regular (400), Medium (500)

### Next.js Font Implementation
```typescript
// app/layout.tsx
import localFont from 'next/font/local'

const perfectlyNineties = localFont({
  src: './fonts/PerfectlyNineties-Regular.woff2',
  variable: '--font-perfectly-nineties',
})

const geist = localFont({
  src: [
    {
      path: './fonts/Geist-Regular.woff2',
      weight: '400',
    },
    {
      path: './fonts/Geist-Medium.woff2',
      weight: '500',
    },
  ],
  variable: '--font-geist',
})
```

---

## 🔍 Additional Notes

- The design uses a **background image** behind the gradient overlay (imageRef: `c15e3f22d62942d6b130d1da2bdbfca3cc1dfeba`)
- All text uses **white color** except the CTA button text which uses the blue-gray color
- The design implements **glassmorphism** effects on the Alpha badge
- **Responsive considerations:** This is the 1440px desktop design; you may need to adjust spacing and font sizes for mobile

---

## 📦 Assets to Export from Figma

1. **Logo image** (120×32px, SVG or PNG @2x)
2. **Background image** (optional, if not using the cloud animation)
3. **Alpha badge icon** (if any)

Use the Figma API or manually export these assets for implementation.
