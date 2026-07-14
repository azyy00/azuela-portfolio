import {
  Atom,
  Braces,
  Brush,
  Cloud,
  Code2,
  Component,
  Database,
  Hexagon,
  Megaphone,
  Move,
  Palette,
  PenTool,
  Route,
  Sparkles,
  Triangle,
  Wind,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import {
  siChakraui,
  siExpress,
  siFigma,
  siFramer,
  siGooglegemini,
  siNextdotjs,
  siNodedotjs,
  siReact,
  siServerless,
  siSupabase,
  siTailwindcss,
  siTidb,
  siTypescript,
  siVercel,
  siVite,
  type SimpleIcon,
} from 'simple-icons'

/**
 * Maps each skill string in content.ts to a lucide icon. Keep the keys exactly
 * matching the strings in `skills.groups`. Anything unmapped falls back to a
 * generic code glyph rather than rendering nothing.
 */
const ICONS: Record<string, LucideIcon> = {
  React: Atom,
  'Next.js': Triangle,
  TypeScript: Braces,
  Tailwind: Wind,
  Motion: Move,
  'Chakra UI': Component,
  Node: Hexagon,
  Express: Route,
  Supabase: Database,
  'MySQL / TiDB': Database,
  Vite: Zap,
  Vercel: Triangle,
  'Serverless functions': Cloud,
  'Gemini API': Sparkles,
  'UI/UX design': PenTool,
  Canva: Palette,
  'Graphic design': Brush,
  'Social media management': Megaphone,
}

const BRAND_ICONS: Record<string, SimpleIcon> = {
  React: siReact,
  'Next.js': siNextdotjs,
  TypeScript: siTypescript,
  Tailwind: siTailwindcss,
  Motion: siFramer,
  'Chakra UI': siChakraui,
  Node: siNodedotjs,
  Express: siExpress,
  Supabase: siSupabase,
  'MySQL / TiDB': siTidb,
  Vite: siVite,
  Vercel: siVercel,
  'Serverless functions': siServerless,
  'Gemini API': siGooglegemini,
  'UI/UX design': siFigma,
}

const SUPPORTING_COLORS: Record<string, string> = {
  Canva: '#00C4CC',
  'Graphic design': '#FF6B35',
  'Social media management': '#E4405F',
}

export function skillIcon(name: string): LucideIcon {
  return ICONS[name] ?? Code2
}

export function brandIcon(name: string): SimpleIcon | undefined {
  return BRAND_ICONS[name]
}

export function skillColor(name: string): string {
  const icon = brandIcon(name)
  if (icon) {
    // Next.js and Vercel publish black marks. Lift them on the dark surface
    // so the official shape remains visible without inventing a new hue.
    return icon.hex === '000000' ? '#F4F4F5' : `#${icon.hex}`
  }

  return SUPPORTING_COLORS[name] ?? '#9A918F'
}

export function BrandIcon({ icon }: { icon: SimpleIcon }) {
  return (
    <svg
      aria-hidden="true"
      className="h-[1.1em] w-[1.1em] shrink-0"
      fill="currentColor"
      viewBox="0 0 24 24"
      style={{ color: icon.hex === '000000' ? '#F4F4F5' : `#${icon.hex}` }}
    >
      <path d={icon.path} />
    </svg>
  )
}
