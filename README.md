# Portfolio

Interactive, animated portfolio with a 3D focal object. Dark cinematic direction: near-black canvas, warm off-white grotesk type, a single amber accent, and a dark-chrome knot lit by a warm key and a cool rim.

## Stack

| Concern | Choice |
| --- | --- |
| Build | Vite 6 |
| UI | React 19 + TypeScript (strict) |
| Styling | Tailwind CSS v4 (tokens in `src/index.css` under `@theme`) |
| 3D | Three.js + React Three Fiber + drei |
| Scroll animation | GSAP + ScrollTrigger |
| Component motion | Motion (`motion/react`) |
| Smooth scroll | Lenis, driven from the GSAP ticker |
| Type | Instrument Serif (display), Geist (UI), Geist Mono (meta) |

## Commands

```bash
npm run dev        # dev server on :5173
npm run build      # typecheck + production build to dist/
npm run preview    # serve the build
npm run typecheck  # types only
```

## Editing content

**All copy lives in [`src/content/content.ts`](src/content/content.ts).** No component contains hard-coded text. Change your name, role, projects, and links there and the whole site follows.

Projects drive the bento grid via their `span` field: `wide` takes two columns, `tall` takes two rows, `normal` takes one cell. Swap the `picsum.photos` URLs for real screenshots.

## Things that are load-bearing

- **Lenis runs off the GSAP ticker** (`src/lib/useSmoothScroll.ts`). Don't add a second `requestAnimationFrame` loop for it, or ScrollTrigger and the scroll position will disagree by a frame.
- **`scrollSignal`** (`src/lib/motion.ts`) is a plain mutable object, written once per Lenis frame and read inside `useFrame`. It deliberately does not trigger React renders — the 3D object's rotation is driven from it.
- **Reduced motion is a real path, not a stub.** Lenis is skipped entirely, GSAP scrubs are skipped, the cursor unmounts, and the 3D object stops drifting. Test it.
- **The Three.js chunk is lazy-loaded** from `Hero.tsx` and wrapped in `SceneBoundary`. If WebGL is missing the hero degrades to type only. Keep it that way.
- **No HDRI fetch.** The environment is built from drei `Lightformer` planes, so the scene has no CDN dependency and works offline.
- **The 3D object's horizontal offset is a fraction of the frustum width**, not a fixed world offset — a fixed one falls outside the camera at narrow aspect ratios. Below `md` it moves into its own band above the headline, because layered behind the muted serif line it destroyed legibility.

## Design constraints

Near-black monochrome with **one** accent (`--color-accent`, amber) reserved for active states, links, the focus ring, and the availability line. Tag colours are dim washes, not pastel fills.

Type has two roles and they do not overlap: **Geist carries every heading** (`.display`), and **Instrument Serif italic is only ever a quote voice** (`.quote`, used in testimonials). Putting the serif back into headings collapses the distinction and the page starts reading as the light editorial build this replaced.

Borders are always `1px solid var(--color-line)`. Card lift is a border colour-mix toward the accent, not a drop shadow — shadows are invisible against near-black. The grain overlay uses `mix-blend-mode: screen`; `multiply` is a no-op on this canvas. Section rhythm is `py-24` / `py-32`.

## Known gaps

- **Testimonials are invented.** Replace them or delete `<Testimonials />` from `App.tsx`. Placeholder quotes read as fake.
- **No mobile nav.** Below `md` the section links are hidden and only the mark and Resume button remain. The page is a single scroll so it is survivable, but there is no menu.
- **Project images are `picsum.photos` stand-ins.** Screenshot the five live sites and swap them in.
- `site.email` is `hello@example.com` and `site.resume` points at a `/resume.pdf` that does not exist. Fix both before publishing.

## The contribution graph

`Contributions.tsx` fetches from `github-contributions-api.jogruber.de` at runtime. GitHub's own contribution data needs an authenticated GraphQL call, which a static site cannot make without leaking a token, and their HTML endpoint sends no CORS headers.

That means a **third-party runtime dependency**. If it goes down the section renders a link to the GitHub profile instead of a broken grid — that fallback is deliberate, keep it. To remove the dependency, fetch the same JSON at build time and commit it.

Pad cells at the head of the first column are rendered as invisible spacers rather than filtered out. Filtering them top-aligns that column and every weekday row in it sits one square high.
