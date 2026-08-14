import ContactForm from '@/components/ui/form-1'
import { contact, site } from '../content/content'
import { SectionHeading } from './ui/section-heading'

export function Contact() {
  return (
    <section id="contact" className="brand-section brand-section--contact">
      <div className="brand-shell">
        <SectionHeading
          index="07"
          heading="Contact"
          signal={site.availability}
          note={contact.body}
        />

        <div className="contact-layout">
          <div className="contact-copy">
            <a className="contact-email" href={`mailto:${site.email}`}>
              {site.email}
            </a>

            <nav className="contact-profiles" aria-label="Social profiles">
              {contact.links
                .filter((link) => link.label !== 'Email')
                .map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span>{link.label}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
            </nav>
          </div>

          <div className="contact-panel">
            <div className="brand-panel-bar">
              <span>new-message.txt</span>
              <span>mailto / secure handoff</span>
            </div>
            <ContactForm email={site.email} />
          </div>
        </div>

        <footer className="contact-footer">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span className="contact-footer__mark" aria-label="Azzy">
            AZZY
          </span>
          <span>{site.location}</span>
        </footer>
      </div>
    </section>
  )
}
