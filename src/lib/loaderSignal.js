/**
 * Loader → hero handshake.
 *
 * The PageLoader covers the page for its first ~2 s. Building the particle
 * cloud (7 k–31 k samples + WebGL buffer upload) during that window burns
 * the main thread right before FCP/LCP. The hero therefore waits on this
 * signal before its first build — which also means the assembly animation
 * plays in view instead of hidden under the loader.
 *
 * The signal resolves even when PageLoader unmounts early (fallback timer
 * in ParticleHero keeps the hero alive if the loader never finishes).
 */

let release = () => {}
const done = new Promise((resolve) => {
  release = resolve
})

export function signalLoaderDone() {
  try {
    release()
  } catch {
    /* resolving twice is a no-op */
  }
}

export function loaderDone() {
  return done
}
