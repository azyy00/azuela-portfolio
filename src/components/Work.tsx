import { ExpandableGallery } from './ui/expandable-gallery'
import { projects } from '../content/content'
import laserFlow from '../assets/laser-flow.webm'

export function Work() {
  return (
    <section id="work" className="work-section relative isolate overflow-hidden border-t border-line">
      <video
        className="work-section__laser"
        src={laserFlow}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="work-section__veil" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="mb-14 flex items-end justify-between gap-6">
          <h2 className="display text-4xl md:text-5xl">Selected work</h2>
          <span className="meta hidden sm:inline">{projects.length} projects</span>
        </div>

        <ExpandableGallery projects={projects} />
      </div>
    </section>
  )
}
