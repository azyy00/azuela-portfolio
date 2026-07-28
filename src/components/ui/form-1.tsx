import type { FormEvent, SVGProps } from 'react'

import { GlassButton } from './glass-button'

type ContactFormProps = {
  email: string
}

function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

export default function ContactForm({ email }: ContactFormProps) {
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
    <form onSubmit={handleSubmit} className="contact-form" aria-label="Send a message">
      <div className="contact-form__field">
        <label htmlFor="name">Full name</label>
        <div className="contact-form__control">
          <UserIcon aria-hidden="true" />
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
          />
        </div>
      </div>

      <div className="contact-form__field">
        <label htmlFor="email">Email address</label>
        <div className="contact-form__control">
          <MailIcon aria-hidden="true" />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="contact-form__field">
        <label htmlFor="message">Project brief</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="What are you building, and where can I help?"
        />
      </div>

      <GlassButton
        type="submit"
        className="contact-form__submit w-full"
        variant="accent"
        contentClassName="flex w-full items-center justify-between gap-3"
      >
        Send message
        <ArrowRightIcon aria-hidden="true" />
      </GlassButton>
    </form>
  )
}
