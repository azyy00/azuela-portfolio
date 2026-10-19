import { certificates } from '../content/content'
import { SectionHeading } from './ui/section-heading'
import { TiltedGridHero, type TiltedGridImage } from './ui/tilted-grid-hero'

// Rendered JPG previews and the source PDFs, keyed by their shared basename.
const images = import.meta.glob('../assets/certificates/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const pdfs = import.meta.glob('../certificate/*.pdf', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

function byBasename(map: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(map).map(([path, url]) => {
      const base = path.split('/').pop()!.replace(/\.[^.]+$/, '')
      return [base, url]
    }),
  )
}

const imageByName = byBasename(images)
const pdfByName = byBasename(pdfs)

// Matches the rendered previews (1440×831), so object-cover never crops a certificate.
const CERT_ASPECT = 1440 / 831

// Built once from static content — a stable reference for the hero's preload effect.
const reel: TiltedGridImage[] = certificates.items
  .filter((item) => imageByName[item.file])
  .map((item) => ({ src: imageByName[item.file]!, alt: `${item.title} certificate` }))

export function Certificates() {
  return (
    <section id="certificates" className="brand-section brand-section--certificates">
      <div className="brand-shell">
        <SectionHeading
          index="06"
          signal="Verified learning"
          heading={
            <>
              Proof of <em className="sh-accent">Skill</em>
            </>
          }
          note={certificates.note}
          aside={<span className="meta">{certificates.items.length} credentials / DataCamp</span>}
        />

        <TiltedGridHero
          images={reel}
          aspectRatio={CERT_ASPECT}
          tileHeight={44}
          axis={57}
          speed={4.5}
          // Full-bleed and unframed, so the reel sits on the page background; the section clips the scrollbar overhang.
          className="ml-[calc(50%-50vw)] h-[460px] w-screen sm:h-[720px]"
        >
          <div className="relative z-10 flex h-full flex-col items-center justify-between py-10 text-center sm:py-12">
            <h3 className="text-balance px-6 text-3xl font-medium tracking-tight text-ink sm:text-5xl">
              Every credential,
              <br />
              brought into <em className="sh-accent">focus.</em>
            </h3>
            <p className="max-w-md text-balance px-6 text-sm text-muted">
              {certificates.items.length} statements of accomplishment from {certificates.issuer}, curving in
              from one edge and fading round the other.
            </p>
          </div>
        </TiltedGridHero>

        {/* The reel is decorative and pointer-free; the PDFs live here. */}
        <ul className="mt-6 grid gap-px overflow-hidden rounded-[0.65rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {certificates.items.map((item, index) => (
            <li key={item.file} className="bg-surface">
              <a
                href={pdfByName[item.file] ?? imageByName[item.file] ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full items-baseline gap-3 px-4 py-3.5 transition-colors hover:bg-surface-alt"
              >
                <span className="meta text-accent">{String(index + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-ink">{item.title}</span>
                  <span className="meta block">
                    {item.length} · {item.date}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="meta transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
