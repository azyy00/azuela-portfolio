import type { FormEvent, SVGProps } from 'react'

import { GlassButton } from './glass-button'

type ContactFormProps = {
  /** Where the mailto submit is addressed. */
  email: string
  eyebrow?: string
  heading?: string
}

/** Inline, dependency-free icons (lucide paths) that inherit `currentColor`. */
function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

/**
 * Adapted from a light shadcn-style contact form into this site's dark theme:
 * near-black surfaces, red accent, Geist type. No backend — submitting opens
 * the visitor's mail client pre-filled, so it works on a static deploy.
 */
export default function ContactForm({
  email,
  eyebrow = 'Contact',
  heading = 'Let’s get in touch.',
}: ContactFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const from = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    const subject = encodeURIComponent(`Portfolio enquiry${name ? ` from ${name}` : ''}`)
    const body = encodeURIComponent(
      `${message}\n\n— ${name || 'A visitor'}${from ? ` (${from})` : ''}`,
    )
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center text-sm text-ink">
      <p className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
        {eyebrow}
      </p>
      <h2 className="display py-4 text-center text-4xl md:text-5xl">{heading}</h2>
      <p className="max-w-md pb-10 text-center text-ink-soft max-md:text-sm">
        Or reach me directly at{' '}
        <a href={`mailto:${email}`} className="text-accent hover:underline">
          {email}
        </a>
      </p>

      <div className="w-full max-w-md px-4">
        <label htmlFor="name" className="font-medium text-ink-soft">
          Full name
        </label>
        <div className="mt-2 mb-4 flex h-11 items-center overflow-hidden rounded-full border border-line bg-surface pl-3 transition-all focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/40">
          <UserIcon className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Enter your full name"
            className="h-full w-full bg-transparent px-2 text-ink outline-none placeholder:text-muted"
          />
        </div>

        <label htmlFor="email" className="font-medium text-ink-soft">
          Email address
        </label>
        <div className="mb-4 mt-2 flex h-11 items-center overflow-hidden rounded-full border border-line bg-surface pl-3 transition-all focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/40">
          <MailIcon className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Enter your email address"
            className="h-full w-full bg-transparent px-2 text-ink outline-none placeholder:text-muted"
          />
        </div>

        <label htmlFor="message" className="font-medium text-ink-soft">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Enter your message"
          className="mt-2 w-full resize-none rounded-lg border border-line bg-surface p-3 text-ink outline-none transition-all placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/40"
        />

        <GlassButton
          type="submit"
          className="mt-5 w-full"
          variant="accent"
          contentClassName="flex w-full items-center justify-center gap-1.5"
        >
          Send message
          <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
        </GlassButton>
      </div>
    </form>
  )
}
