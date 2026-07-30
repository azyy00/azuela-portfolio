import { ExpandableGallery } from './ui/expandable-gallery'
import { projects } from '../content/content'
import { SectionHeading } from './ui/section-heading'

export function Work() {
  return (
    <section id="work" className="brand-section brand-section--work">
      <div className="brand-shell">
        <SectionHeading
          signal="Selected systems"
          heading={
            <>
              Real World <em className="work-heading__accent">Project</em>
            </>
          }
          note="Production tools, experiments, and client work built around real local needs."
          aside={<span className="meta">{projects.length} live case files</span>}
        />

        <ExpandableGallery projects={projects} />
      </div>
    </section>
  )
}
