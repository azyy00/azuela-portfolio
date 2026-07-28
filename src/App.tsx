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
import { Contact } from './components/Contact'
import HeroScrollAnimation from './components/ui/hero-scroll-animation'

export default function App() {
  useSmoothScroll()

  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <Cursor />

      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Nav />

      <main id="main-content">
        <HeroScrollAnimation>
          <Hero />
          <HeroMarquee />
        </HeroScrollAnimation>
        <HeroScrollAnimation direction="left">
          <Work />
        </HeroScrollAnimation>
        <HeroScrollAnimation>
          <Skills />
        </HeroScrollAnimation>
        <HeroScrollAnimation direction="left">
          <Contributions />
        </HeroScrollAnimation>
        <HeroScrollAnimation>
          <Experience />
        </HeroScrollAnimation>
        <About />
        <HeroScrollAnimation direction="left">
          <Certificates />
        </HeroScrollAnimation>
        <HeroScrollAnimation>
          <Contact />
        </HeroScrollAnimation>
      </main>
    </>
  )
}
