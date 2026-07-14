import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'

import { useReducedMotion } from '../lib/motion'
import { FocalObject } from './FocalObject'

/**
 * The hero's 3D accent. Purely decorative, so it is hidden from assistive
 * tech and never blocks pointer events on the copy layered over it.
 */
export function Scene() {
  const reduced = useReducedMotion()

  // On narrow screens the knot gets its own band above the headline — layered
  // behind it, the pale ceramic destroys the muted serif line's legibility.
  // From md up it returns to a full-bleed layer beside the type.
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-16 h-[38svh] md:inset-0 md:top-0 md:h-full"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 30 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.12} />
          <directionalLight position={[4, 6, 3]} intensity={0.5} />

          <FocalObject reduced={reduced} />

          {/* A studio built from emissive planes — no HDRI fetch, no CDN.
              A warm key and a cool rim, so the chrome has two colours to
              catch and the silhouette separates from the near-black canvas. */}
          <Environment resolution={256}>
            <Lightformer
              form="rect"
              intensity={3.2}
              position={[3.5, 3, 2]}
              scale={[6, 6, 1]}
              color="#e5484d"
            />
            <Lightformer
              form="rect"
              intensity={1.8}
              position={[-4.5, 0.5, 1]}
              scale={[5, 8, 1]}
              color="#7fa8d9"
            />
            <Lightformer form="ring" intensity={1.1} position={[0, -3, -3]} scale={5} color="#ffffff" />
            <Lightformer form="rect" intensity={0.5} position={[0, 4, -4]} scale={[10, 3, 1]} />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  )
}
