import { motion } from 'motion/react'

import ContactForm from '@/components/ui/form-1'
import { contact, site } from '../content/content'
import { rise } from '../lib/motion'

export function Contact() {
  return (
    <section id="contact" className="relative z-10 border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <motion.div
          {...rise}
          className="mx-auto flex max-w-xl flex-col items-center"
        >
          <ContactForm email={site.email} heading={contact.heading} />
        </motion.div>

        {/* The form is the primary path; keep a direct one for anyone without a
            mail client, and the profiles a portfolio should always expose. */}
        <div className="mx-auto mt-16 flex max-w-md flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {contact.links
            .filter((link) => link.label !== 'Email')
            .map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="meta transition-colors duration-200 hover:text-accent"
              >
                {link.label}
              </a>
            ))}
        </div>

        <div className="meta mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span className="text-accent">{site.availability}</span>
          <span>{site.location}</span>
        </div>
      </div>
    </section>
  )
}
