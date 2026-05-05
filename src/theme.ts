/**
 * Kami Design System Tokens
 * Based on the official specification at https://kami.tw93.fun/
 */

export const KAMI_THEME = {
  // 1. Color Palette: Warm neutrals + Ink-Blue accent
  colors: {
    // Canvas: The emotional foundation
    parchment: '#f5f4ed',   // Page background (never pure white)
    ivory: '#faf9f5',       // Cards / elevated surfaces
    sand: '#d6d1c1',        // Button default / interactive
    deepDark: '#1a1b1e',    // Dark theme page base (not pure black)

    // Brand: One chromatic accent only
    brand: '#1B365D',       // Ink Blue: CTA / primary accent
    brandLight: '#E4ECF5',  // Ink Light: Lighter variant / tag base
    darkSurface: '#212226', // Dark theme container
    error: '#b91c1c',       // Error state (deep warm red)

    // Warm Neutrals: Yellow-brown undertones
    ink: '#1c1c1c',         // Near Black: Primary text
    darkWarm: '#42413b',    // Dark Warm
    olive: '#716b5a',       // Olive: Secondary text
    stone: '#a39e93',       // Stone: Metadata / disabled

    // Lighting (for 3D scenes)
    warmLight: '#fff9e6'    // Warm ambient light reference
  },

  // 2. Typography: Serif carries hierarchy, sans carries function
  typography: {
    fontStacks: {
      serif: "'Newsreader', 'Charter', 'Source Serif 4', serif",
      sans: "'Inter', sans-serif",
      mono: "'JetBrains Mono', monospace"
    },
    weights: {
      regular: 400,
      medium: 500,  // Headlines strictly at 500
      bold: 600
    },
    lineHeight: {
      tight: 1.2,   // Titles (1.1-1.3)
      dense: 1.42,  // Dense body (1.4-1.45)
      reading: 1.55 // Reading body (1.5-1.55)
    },
    size: {
      base: '10pt',        // 9.5-10pt
      sectionTitle: '15pt' // 15pt
    }
  },

  // 3. Spacing & Shape
  spacing: {
    base: '4pt', // 4pt base unit
    gap: '8pt',
    margin: '16pt'
  },

  shape: {
    radius: {
      button: '8pt',   // 8pt radius
      card: '16pt',    // 16pt radius
      code: '6px'      // 6pt radius
    },
    border: {
      thin: '0.5pt',
      medium: '1pt',
      quote: '2pt'     // left 2pt brand solid
    }
  },

  // 4. Shadows: Avoid traditional hard shadows
  shadows: {
    ring: '0 0 0 1px #1B365D1a',         // 0 0 0 1pt var(--ring-warm)
    whisper: '0 4px 24px rgba(0,0,0,0.05)' // 0 4pt 24pt rgba(0,0,0,0.05)
  }
} as const;
