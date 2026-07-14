/**
 * Single source of truth for every piece of copy on the site.
 * Edit this file; no component holds hard-coded text.
 *
 * Project data below was read from the GitHub API on 2026-07-10.
 * Forks (AI-PROMPT, public-apis) are deliberately excluded.
 */

// Real screenshot of the live OPAC (gcc-library-frontend.vercel.app/opac).
import gccLibraryThumb from '../assets/gcc-library.jpg'
// Screen recording of the AQuiz "champion" end screen, with a poster frame.
import aquizChampionVideo from '../assets/aquiz-champion.mp4'
import aquizChampionPoster from '../assets/aquiz-champion.jpg'

export type Project = {
  slug: string
  title: string
  year: string
  role: string
  summary: string
  /** Rendered as tags. Keep to 2-4 per project. */
  stack: string[]
  /** Drives the bento grid: 'wide' spans two columns, 'tall' spans two rows. */
  span: 'wide' | 'tall' | 'normal'
  /** Any image URL. Swap the picsum seeds for real screenshots. */
  image: string
  /** Optional looping preview video. When set, the card plays it over `image`. */
  video?: string
  /** Omit either link and its button is not rendered. */
  live?: string
  source?: string
}

export const site = {
  name: 'Anthony Azuela',
  role: 'Full-stack Developer',
  location: 'Goa, Camarines Sur, PH',
  initials: 'AA',
  email: 'anthony.azuela.buenaflor@gmail.com',
  availability: 'Open to work',
  /** TODO: drop a PDF in /public and this link works. */
  resume: '/resume.pdf',
  github: 'https://github.com/azyy00',
  githubUser: 'azyy00',
  linkedin: 'https://www.linkedin.com/in/anthony-azuela-443652358/',
}

export const hero = {
  /** Split across lines. The last line is rendered in muted grey. */
  lines: ['I build software', 'for the people', 'around me'],
  intro:
    'Full-stack developer in Camarines Sur. Most of what I ship runs at Goa Community College — a library attendance system, a class scheduler, a quiz platform — plus work for local businesses and research teams. React and TypeScript on the front, Node and Postgres behind it.',
  scrollHint: 'Scroll',
}

export const about = {
  heading: 'About',
  body: [
    'I taught myself to build for the web because the places around me needed software and nobody was going to write it for them. The library was tracking attendance on paper. The registrar was resolving schedule conflicts by hand. So I built the things that fixed those problems, and shipped them.',
    'That has shaped how I work. I care less about which framework is ahead this year and more about whether the person at the kiosk can check in without asking for help. Most of my projects are in production at a community college, which is a very direct kind of feedback.',
  ],
  facts: [
    { label: 'Focus', value: 'Full-stack web applications' },
    { label: 'Tools', value: 'React, TypeScript, Node, Postgres' },
    { label: 'Based in', value: site.location },
    { label: 'Studied', value: 'BS Computer Science, Partido State University' },
  ],
}

export const projects: Project[] = [
  {
    slug: 'gcc-library',
    title: 'GCC Library System',
    year: '2026',
    role: 'Full-stack',
    summary:
      'Took the Goa Community College library from paper to paperless. Real-time attendance, analytics, and an integrated OPAC. Staff run everything from a protected console; students check themselves in and out at a kiosk.',
    stack: ['React', 'Express', 'TiDB'],
    span: 'wide',
    image: gccLibraryThumb,
    live: 'https://gcc-library-frontend.vercel.app',
    source: 'https://github.com/azyy00/2026-Library-App',
  },
  {
    slug: 'aquiz',
    title: 'AQuiz',
    year: '2026',
    role: 'Full-stack',
    summary:
      'A real-time, Kahoot-style quiz game you can host in seconds. Live leaderboard, countdown timers, streaks, and a champion podium. Gemini writes the questions if you would rather it did.',
    stack: ['Next.js', 'Supabase', 'Gemini'],
    span: 'tall',
    image: aquizChampionPoster,
    video: aquizChampionVideo,
    live: 'https://azyquiz.vercel.app',
    source: 'https://github.com/azyy00/quiz-app',
  },
  {
    slug: 'gcc-scheduling',
    title: 'GCC Scheduling',
    year: '2026',
    role: 'Full-stack',
    summary:
      'Conflict-free timetables for Goa Community College. Admins plan classes and manage sections and faculty; every student gets a schedule that is always current.',
    stack: ['React', 'Tailwind'],
    span: 'normal',
    image: 'https://picsum.photos/seed/gcc-schedule/900/900',
    live: 'https://gcc-scheduling-app.vercel.app',
    source: 'https://github.com/azyy00/2026-scheduling-app',
  },
  {
    slug: 'adelphas',
    title: "Adelpha's Burger & Cafe",
    year: '2026',
    role: 'Design & build',
    summary:
      'A single-page site for a homegrown burger cafe in Goa, Camarines Sur. Warm charcoal theme, motion throughout, and a full menu built to make people hungry.',
    stack: ['React', 'Vite', 'Motion'],
    span: 'normal',
    // The code lives in the repo named `Restaurant1`, not `adelphas` (which is empty).
    image: 'https://picsum.photos/seed/adelphas-burger/900/900',
    source: 'https://github.com/azyy00/Restaurant1',
  },
  {
    slug: 'farmer-website',
    title: 'Agricultural Programs Study',
    year: '2025',
    role: 'Lead developer, UI/UX',
    summary:
      'A research site presenting a qualitative study on communication challenges in agricultural programs run by the Local Agricultural Office in Goa, Partido.',
    stack: ['React', 'Chakra UI'],
    span: 'normal',
    image: 'https://picsum.photos/seed/farmer-research/900/900',
    live: 'https://bacom-researchs-site.vercel.app',
    source: 'https://github.com/azyy00/farmer-website',
  },
]

export const skills = {
  heading: 'What I work in',
  note: 'Drawn from what is actually in my repositories, not a wish list.',
  groups: [
    {
      label: 'Interface',
      items: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Motion', 'Chakra UI'],
    },
    {
      label: 'Backend',
      items: ['Node', 'Express', 'Supabase', 'MySQL / TiDB'],
    },
    {
      label: 'Platform',
      items: ['Vite', 'Vercel', 'Serverless functions', 'Gemini API'],
    },
    {
      label: 'Design & content',
      items: ['UI/UX design', 'Canva', 'Graphic design', 'Social media management'],
    },
  ],
}

export const experience = {
  heading: 'Experience',
  roles: [
    {
      period: 'Dec 2025 — Present',
      title: 'Social Media Manager',
      org: 'Bucketlist Company',
      body: 'Own the end-to-end Instagram strategy for the client account. I design the carousels and assets in Canva, write the hooks and CTAs across Reels and Stories that turn engagement into inbound DMs, run approvals through Slack, and handle daily comments and replies to keep reach up.',
    },
    {
      period: 'Aug 2025 — Present',
      title: 'IT Support Staff',
      org: 'Goa Community College',
      body: 'Manage the computer laboratory and handle student records and office documentation.',
    },
    {
      period: 'Mar 2025 — Present',
      title: 'Full-stack Developer',
      org: 'Goa Community College',
      body: 'Built the library system that took the college from paper to paperless: attendance tracking, analytics, and an integrated OPAC. It runs in production and the people using it did not choose to be beta testers.',
    },
    {
      period: 'Jul 2024',
      title: 'Intern',
      org: 'Business Permit and Licensing Office',
      body: 'One-month placement.',
    },
  ],
  education: {
    label: 'Education',
    degree: 'BS Computer Science',
    school: 'Partido State University',
    year: 'Finished 2025',
  },
}

export const github = {
  heading: 'Activity',
  note: `Public contributions on @${site.githubUser} over the last year.`,
}

/**
 * DataCamp Statements of Accomplishment. `file` matches the basename of both
 * the PDF in src/certificate/ and the rendered JPG in src/assets/certificates/.
 * The Certificates component resolves those to URLs; edit metadata here.
 */
export const certificates = {
  heading: 'Certifications',
  note: 'Nine DataCamp statements of accomplishment — the groundwork behind the data, SQL, and machine-learning skills.',
  issuer: 'DataCamp',
  items: [
    { file: 'Python Cert', title: 'Introduction to Python', length: '4 hrs', date: 'Apr 2025' },
    { file: 'SQL', title: 'Introduction to SQL', length: '2 hrs', date: 'Mar 2025' },
    { file: 'Intermediate SQL', title: 'Intermediate SQL', length: '4 hrs', date: 'Apr 2025' },
    { file: 'Git', title: 'Introduction to Git', length: '2 hrs', date: 'Apr 2025' },
    { file: 'Data Science', title: 'Understanding Data Topics', length: '10 hrs', date: 'Apr 2025' },
    { file: 'Data Engineer', title: 'Understanding Data Engineering', length: '2 hrs', date: 'Apr 2025' },
    { file: 'Machine Learning', title: 'Understanding Machine Learning', length: '2 hrs', date: 'Feb 2025' },
    { file: 'Data Visualization', title: 'Understanding Data Visualization', length: '2 hrs', date: 'Mar 2025' },
    { file: 'Cloud Computing', title: 'Understanding Cloud Computing', length: '2 hrs', date: 'Apr 2025' },
  ],
}

/**
 * PLACEHOLDER. Invented quotes read as fake to anyone who has seen a real
 * reference. Replace these with things people actually said, or delete the
 * <Testimonials /> element from App.tsx until you have them.
 */
export const testimonials = {
  heading: 'Worked with',
  items: [
    {
      quote:
        'He rebuilt a surface we had shipped three times and never got right. The difference was that he kept asking what the screen was for.',
      name: 'Placeholder Name',
      title: 'Head of Product, Company',
    },
    {
      quote:
        'The kind of engineer who notices that the loading state is doing the wrong thing, and then fixes it without being asked.',
      name: 'Placeholder Name',
      title: 'Engineering Lead, Company',
    },
  ],
}

export const contact = {
  heading: 'Get in touch',
  body: 'If you are working on something where the interface is the product, I would like to hear about it.',
  links: [
    { label: 'Email', href: `mailto:${site.email}`, value: site.email },
    { label: 'GitHub', href: site.github, value: 'github.com/azyy00' },
    { label: 'LinkedIn', href: site.linkedin, value: 'in/anthony-azuela' },
  ],
}

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]
