import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import type { Group, Mesh } from 'three'
import { MathUtils } from 'three'

import { scrollSignal } from '../lib/motion'

type Props = { reduced: boolean }

/**
 * A single torus knot in pale ceramic. Rotation is driven by scroll progress
 * rather than time, so the object reads as an anchor the page moves past.
 * It sits right of the headline on desktop and recedes behind it on narrow
 * viewports, where there is no room to stand beside the type.
 */
export function FocalObject({ reduced }: Props) {
  const group = useRef<Group>(null)
  const mesh = useRef<Mesh>(null)
  // Must match Tailwind's `md` breakpoint exactly. Scene.tsx switches the
  // canvas from its own band to full-bleed at md; if this threshold drifts
  // above it, there is a window where the canvas is full-bleed but the knot
  // is still centred — straight back behind the headline.
  const narrow = useThree((state) => state.size.width) < 768
  const viewportWidth = useThree((state) => state.viewport.width)

  // Offset in world units, not pixels: at 30% of the frustum width the knot
  // clears the headline on wide screens and bleeds off the right edge on
  // narrow ones, instead of vanishing past the frustum at a fixed offset.
  const scale = narrow ? 0.78 : 0.72
  const offsetX = narrow ? 0 : viewportWidth * 0.42

  useFrame((state, delta) => {
    if (!group.current || !mesh.current) return

    // Scroll maps to just over a full turn across the whole document.
    const target = scrollSignal.progress * Math.PI * 2.2
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, target, 3, delta)

    if (reduced) return

    // Idle drift, and a gentle lean toward the pointer.
    mesh.current.rotation.x += delta * 0.1
    const { x, y } = state.pointer
    group.current.rotation.z = MathUtils.damp(group.current.rotation.z, x * 0.1, 2.5, delta)
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, -y * 0.1, 2.5, delta)
  })

  return (
    <Float
      enabled={!reduced}
      speed={1.1}
      rotationIntensity={0.2}
      floatIntensity={0.5}
      floatingRange={[-0.08, 0.08]}
    >
      <group ref={group} position={[offsetX, 0.1, 0]} scale={scale}>
        <mesh ref={mesh} castShadow>
          <torusKnotGeometry args={[1, 0.28, 220, 40]} />
          {/* Dark chrome: the form reads entirely through what it reflects,
              so the Lightformers are doing the drawing, not the colour. Full
              iridescence turns it oil-slick green and fights the red accent;
              a trace of it just keeps the highlights from going flat grey. */}
          <meshPhysicalMaterial
            color="#17171c"
            metalness={1}
            roughness={0.19}
            iridescence={0.18}
            iridescenceIOR={1.3}
            iridescenceThicknessRange={[100, 260]}
            envMapIntensity={1.5}
          />
        </mesh>
      </group>
    </Float>
  )
}
