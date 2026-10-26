import { ArrowUpRight } from 'lucide-react'

import ContactForm from '@/components/ui/form-1'
import { contact, site } from '../content/content'
import { SectionHeading } from './ui/section-heading'

/**
 * Compact by design: the section ends right after the form so the footer's
 * wordmark sits directly below it and both read as one closing block.
 */
export function Contact() {
  return (
    <section id="contact" className="brand-section brand-section--contact">
      <div className="brand-shell contact-shell">
        <SectionHeading index="07" heading="Contact" signal={site.availability} note={contact.body} />

        <div className="contact-layout">
          <div className="contact-copy">
            <p className="contact-status">
              <span className="contact-status__dot" aria-hidden="true" />
              {site.availability} · {site.location}
            </p>

            <h3 className="contact-title">
              Have a project <em className="sh-accent">in mind?</em>
            </h3>

            <a className="contact-email" href={`mailto:${site.email}`}>
              <span>{site.email}</span>
              <ArrowUpRight aria-hidden="true" />
            </a>

            <nav className="contact-profiles" aria-label="Social profiles">
              {contact.links
                .filter((link) => link.label !== 'Email')
                .map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noreferrer noopener">
                    <span>{link.label}</span>
                    <span className="contact-profiles__value">{link.value}</span>
                    <ArrowUpRight aria-hidden="true" />
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
      </div>
    </section>
  )
}
