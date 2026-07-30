import { certificates } from '../content/content'
import { SectionHeading } from './ui/section-heading'
import { CertificateSlider, type CertSlide } from './ui/certificate-slider'

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

// A short track label per credential for the minimap.
const CATEGORY: Record<string, string> = {
  'Python Cert': 'Programming',
  SQL: 'Databases',
  'Intermediate SQL': 'Databases',
  Git: 'Tooling',
  'Data Science': 'Data',
  'Data Engineer': 'Data',
  'Machine Learning': 'Machine Learning',
  'Data Visualization': 'Data',
  'Cloud Computing': 'Cloud',
}

// Built once from static content — a stable reference for the slider effect.
const slides: CertSlide[] = certificates.items.map((item, index) => ({
  id: item.file,
  number: String(index + 1).padStart(2, '0'),
  title: item.title,
  category: CATEGORY[item.file] ?? certificates.issuer,
  year: item.date.split(' ').pop() ?? '',
  description: `${item.length} · ${item.date}`,
  image: imageByName[item.file] ?? '',
  href: pdfByName[item.file] ?? imageByName[item.file] ?? '#',
}))

export function Certificates() {
  return (
    <section id="certificates" className="brand-section brand-section--certificates">
      <div className="brand-shell">
        <SectionHeading
          signal="Verified learning"
          heading={certificates.heading}
          note={certificates.note}
          aside={<span className="meta">{certificates.items.length} credentials / DataCamp</span>}
        />

        <CertificateSlider slides={slides} />
      </div>
    </section>
  )
}
