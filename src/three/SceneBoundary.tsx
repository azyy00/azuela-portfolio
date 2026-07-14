import { Component, type ReactNode } from 'react'

/**
 * The hero's 3D layer is decorative. If WebGL is unavailable or the context
 * is lost, drop it silently rather than letting the throw unmount the hero.
 */
export class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}
