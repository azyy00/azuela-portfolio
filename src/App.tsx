import { useSmoothScroll } from './lib/useSmoothScroll'
import { Cursor } from './components/Cursor'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { HeroMarquee } from './components/HeroMarquee'
import { Work } from './components/Work'
import { Skills } from './components/Skills'
import { Contributions } from './components/Contributions'
import { Experience } from './components/Experience'
import { About } from './components/About'
import { Certificates } from './components/Certificates'
import { Testimonials } from './components/Testimonials'
import { Contact } from './components/Contact'

export default function App() {
  useSmoothScroll()

  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <Cursor />

      <Nav />

      <main>
        <Hero />
        <HeroMarquee />
        <Work />
        <Skills />
        <Contributions />
        {/* Placeholder roles — LinkedIn could not be read. Fill in content.ts. */}
        <Experience />
        <About />
        <Certificates />
        {/* Placeholder quotes. Delete this until you have real ones. */}
        <Testimonials />
        <Contact />
      </main>
    </>
  )
}
