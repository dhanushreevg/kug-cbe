import { useEffect, useRef, useState } from "react"
import { getSiteTheme, subscribeTheme } from "@/hooks/useTheme"
import { loaderDone } from "@/lib/loaderSignal"
import KodeeGif, { KODEE_GIFS, KODEE_FRAMES } from "@/components/KodeeGif"

/* ═══════════════════════════════════════════════════════════════════════════
   PARTICLE HERO — constants
   ---------------------------------------------------------------------------
   The hero is a WebGL point cloud. Every point is sampled from the Kotlin
   User Group mark (the PNG already includes the "Kotlin User Group /
   Coimbatore" wordmark). The point keeps the colour of the pixel it came
   from, springs back to its home position, and is pushed by the pointer.
   ═══════════════════════════════════════════════════════════════════════════ */

// Official Kotlin brand colours used by the stray dust layer.
export const PALETTE = [
  { name: "Kotlin purple", hex: "#7F52FF" },
  { name: "Magenta", hex: "#C811E1" },
  { name: "Coral", hex: "#E44857" },
  { name: "Orange", hex: "#F88A00" },
  { name: "Blue", hex: "#0095D5" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Grey", hex: "#8A8A8A" },
]

export const HERO_BG = "#050506"
export const HERO_BG_RGB = [5, 5, 6]
export const PAPER_BG = "#f5f5f5"
export const PAPER_BG_RGB = [245, 245, 245]

/* Hero instrument + canvas scene constants. These are the hero's OWN scene
   values (the WebGL cloud and offline-instrument canvases need literal
   colour strings); they mirror the theme tokens and stay identical across
   colour modes — the only theme coupling is the ON WHITE flip, below. */
export const HERO_INK_LIGHT = "#101012" // instrument fg in ON WHITE (mirrors --color-ink)
export const HERO_INK_DARK = "#ffffff"  // instrument fg in Carbon (mirrors --color-text-primary)
export const HERO_INK_MUTED_LIGHT = "rgba(16,16,18,0.72)"
export const HERO_INK_MUTED_DARK = "#8a8a8a"
export const HERO_INK_FAINT_LIGHT = "rgba(16,16,18,0.62)"
export const HERO_INK_FAINT_DARK = "#7D7D7D"
export const CANVAS_INK_SOFT = "#d4d4d4" // offline wordmark body (mirrors --color-text-body)
export const CANVAS_INK_FAINT = "#8a8a8a" // offline wordmark detail (mirrors --color-text-muted)
export const CANVAS_LINK_INK_LIGHT = "rgba(16,16,18,0.16)" // ON WHITE link ink
export const CANVAS_LINK_INK_DARK = "rgba(255,255,255,0.11)" // Carbon link ink

export const DENSITY_PRESETS = {
  SPARSE: {
    label: "SPARSE",
    // Starting grids. The sampler solves the real step to hit the target.
    sampleStep: { desktop: 3.4, mobile: 4.2 },
    logoTarget: { desktop: 11000, mobile: 7000 },
    strayRatio: 0.2,
  },
  MEDIUM: {
    label: "MEDIUM",
    // Starting grids. The sampler solves the real step to hit the target.
    sampleStep: { desktop: 2.6, mobile: 3.4 },
    logoTarget: { desktop: 18000, mobile: 10000 },
    strayRatio: 0.26,
  },
  DENSE: {
    label: "DENSE",
    // Starting grids. The sampler solves the real step to hit the target.
    sampleStep: { desktop: 2, mobile: 3 },
    // 24k logo + 30% stray ≈ 31k total on desktop.
    logoTarget: { desktop: 24000, mobile: 12000 },
    strayRatio: 0.3,
  },
}

export const SPRING = 0.048
export const GATHER_SPRING = 0.115
export const FRICTION = 0.88
export const REPULSION_RADIUS = 130
export const REPULSION_STRENGTH = 18
export const TRAIL_ALPHA = 0.16
export const ASSEMBLE_MS = 2200
export const MELT_MS = 1500
export const MELT_GRAVITY = 0.16
export const WIND_DRIFT_FACTOR = 0.16
export const DPR_CAP = 2
export const LINKS_LIMIT = 4000

export const MOTION_MODES = ["DRIFT", "SPLASH", "GATHER", "SWARM", "MELT"]
export const COLOR_MODES = ["TRUE", "LIGHT", "NEGATIVE", "ON WHITE"]

/* Touch devices get a lower DPR ceiling (battery + fill rate) and never
   enable the LINKS layer. */
export const DPR_CAP_TOUCH = 1.5

const isTouchDevice = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(pointer: coarse)").matches ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 0))

/* Touch devices start on the lighter presets; the mobile particle targets
   make the hero affordable on phones = SPARSE, tablets = MEDIUM. */
const initialDensity = () => {
  if (typeof window === "undefined" || !isTouchDevice()) return "DENSE"
  return window.innerWidth < 768 ? "SPARSE" : "MEDIUM"
}

/* Hero follows the site theme by default: Paper → ON WHITE, Carbon → TRUE.
   The user can still override it with the Colour control. */
const initialColorMode = () => (getSiteTheme() === "light" ? "ON WHITE" : "TRUE")

const TAU = Math.PI * 2
const PALETTE_RGB = PALETTE.map((item) => hexToRgb(item.hex))

/* Fast sine/cosine for the hot particle loop.
   The idle/orbit motion is strictly periodic, so a 1024-step fundamental
   wave table replaces two Math trig calls per particle per frame. The
   quantisation error is < 0.4% of the amplitude — sub-pixel at every radius
   the simulation uses (2.4 px micro-drift up to 50 px stray orbits). */
const WAVE_N = 1024
const WAVE_MASK = WAVE_N - 1
const WAVE_K = WAVE_N / TAU
const SIN_WAVE = new Float32Array(WAVE_N)
const COS_WAVE = new Float32Array(WAVE_N)
for (let i = 0; i < WAVE_N; i += 1) {
  SIN_WAVE[i] = Math.sin((i / WAVE_N) * TAU)
  COS_WAVE[i] = Math.cos((i / WAVE_N) * TAU)
}
/* Angle → table index; `& MASK` wraps negatives as well. */
const fsin = (a) => SIN_WAVE[((a * WAVE_K) | 0) & WAVE_MASK]
const fcos = (a) => COS_WAVE[((a * WAVE_K) | 0) & WAVE_MASK]

/* ═══════════════════════════════════════════════════════════════════════════
   Small math / colour helpers
   ═══════════════════════════════════════════════════════════════════════════ */

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

function hexToRgb(hex) {
  const value = hex.replace("#", "")
  return [
    parseInt(value.slice(0, 2), 16) / 255,
    parseInt(value.slice(2, 4), 16) / 255,
    parseInt(value.slice(4, 6), 16) / 255,
  ]
}

function rgbCss(r, g, b, alpha = 1) {
  return `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(
    b * 255
  )},${alpha})`
}

/* ═══════════════════════════════════════════════════════════════════════════
   WebGL shaders
   ---------------------------------------------------------------------------
   Points are rendered with gl.POINTS in one draw call. The CPU integrates
   the spring/friction simulation and uploads a position buffer each frame.
   Colour, size and alpha stay static on the GPU, so changing the colour
   mode is a uniform update — not a 30k-element buffer rebuild.
   ═══════════════════════════════════════════════════════════════════════════ */

const POINTS_VERTEX_SHADER = `
precision highp float;

attribute vec2 aPos;       // CSS pixels, top-left origin
attribute float aSize;     // CSS pixels
attribute vec3 aColor;     // straight source colour
attribute float aAlpha;    // 0.25 for stray dust, ~1 for logo dust

uniform vec2 uResolution;  // CSS width / height
uniform float uDpr;        // capped device pixel ratio
uniform float uNegative;
uniform float uWhite;

varying vec3 vColor;
varying float vAlpha;

void main() {
  // CSS pixel space -> clip space. Y is flipped because CSS starts at the top.
  vec2 clip = vec2(
    (aPos.x / uResolution.x) * 2.0 - 1.0,
    1.0 - (aPos.y / uResolution.y) * 2.0
  );
  gl_Position = vec4(clip, 0.0, 1.0);

  // gl_PointSize is in device pixels, so DPR is applied here.
  gl_PointSize = max(1.0, aSize * uDpr);

  vec3 c = aColor;
  if (uNegative > 0.5) {
    c = vec3(1.0) - c;
  }
  if (uWhite > 0.5) {
    // On paper, pull the source colours down so they stay legible.
    c *= 0.56;
  }

  vColor = c;
  vAlpha = aAlpha;
}
`

const POINTS_FRAGMENT_SHADER = `
precision mediump float;

varying vec3 vColor;
varying float vAlpha;

void main() {
  // Soft circular falloff across the point sprite.
  vec2 p = gl_PointCoord - vec2(0.5);
  float d = length(p) * 2.0;
  float falloff = smoothstep(1.0, 0.12, d);
  float a = falloff * vAlpha;

  if (a < 0.01) discard;

  // Slight core boost keeps individual dust motes readable in dense areas.
  gl_FragColor = vec4(vColor * (0.72 + 0.28 * falloff), a);
}
`

const QUAD_VERTEX_SHADER = `
attribute vec2 aClip;
void main() {
  gl_Position = vec4(aClip, 0.0, 1.0);
}
`

const FADE_FRAGMENT_SHADER = `
precision mediump float;
uniform vec4 uFadeColor;
void main() {
  gl_FragColor = uFadeColor;
}
`

const BLIT_VERTEX_SHADER = `
attribute vec2 aClip;
varying vec2 vUv;
void main() {
  vUv = aClip * 0.5 + 0.5;
  gl_Position = vec4(aClip, 0.0, 1.0);
}
`

const BLIT_FRAGMENT_SHADER = `
precision mediump float;
uniform sampler2D uTexture;
varying vec2 vUv;
void main() {
  gl_FragColor = texture2D(uTexture, vUv);
}
`

/* ═══════════════════════════════════════════════════════════════════════════
   WebGL helpers
   ═══════════════════════════════════════════════════════════════════════════ */

function compileShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`Shader compile error: ${message}`)
  }

  return shader
}

function createProgram(gl, vertexSource, fragmentSource) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
  const program = gl.createProgram()

  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  gl.deleteShader(vertex)
  gl.deleteShader(fragment)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error(`Program link error: ${message}`)
  }

  return program
}

function createQuadBuffer(gl) {
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]),
    gl.STATIC_DRAW
  )
  return buffer
}

function createRenderTarget(gl, width, height) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null
  )

  const framebuffer = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  )

  const complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)

  if (!complete) {
    gl.deleteFramebuffer(framebuffer)
    gl.deleteTexture(texture)
    throw new Error("Particle hero: framebuffer is incomplete")
  }

  return { texture, framebuffer, width, height, fresh: true }
}

function disposeRenderTarget(gl, target) {
  if (!target) return
  gl.deleteFramebuffer(target.framebuffer)
  gl.deleteTexture(target.texture)
}

/* ═══════════════════════════════════════════════════════════════════════════
   Composition / sampling helpers
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * The supplied PNG is almost square and contains the wordmark in its lower
 * portion. This tiny thumbnail check decides whether we need to draw the two
 * lines of display type ourselves.
 */
function imageHasWordmark(image) {
  if (!image || !image.naturalWidth) return false

  try {
    const thumb = document.createElement("canvas")
    thumb.width = 64
    thumb.height = 64
    const context = thumb.getContext("2d", { willReadFrequently: true })
    if (!context) return true

    const aspect = image.naturalWidth / image.naturalHeight
    let width = 64
    let height = width / aspect
    if (height > 64) {
      height = 64
      width = height * aspect
    }

    context.drawImage(image, (64 - width) / 2, (64 - height) / 2, width, height)
    const data = context.getImageData(0, 42, 64, 22).data

    let opaque = 0
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 40) opaque += 1
    }

    return opaque / (64 * 22) > 0.02
  } catch {
    // If the thumbnail read fails for any reason, trust the supplied asset.
    return true
  }
}

/** Count opaque samples on a step grid without allocating any arrays. */
function countSamples(data, width, height, step) {
  let count = 0
  for (let y = 0; y < height; y += step) {
    const row = (y | 0) * width
    for (let x = 0; x < width; x += step) {
      if (data[(row + (x | 0)) * 4 + 3] > 36) count += 1
    }
  }
  return count
}

/**
 * Solve the sample grid so the requested density target is actually reached.
 * Count scales with 1 / step², so one or two Newton-ish passes are enough.
 * A lower bound of 1 px prevents spending time sampling the same pixel twice.
 */
function solveSampleStep(data, width, height, baseStep, target) {
  let step = Math.max(1, baseStep)

  for (let pass = 0; pass < 5; pass += 1) {
    const count = countSamples(data, width, height, step)
    if (count === 0) {
      step = Math.max(1, step * 0.72)
      continue
    }

    const ratio = count / target
    if (ratio > 1.12 || ratio < 0.9) {
      step = clamp(step * Math.sqrt(ratio), 1, 14)
    } else {
      break
    }
  }

  return step
}

/* ═══════════════════════════════════════════════════════════════════════════
   Small UI primitives
   ═══════════════════════════════════════════════════════════════════════════ */

function OptionButton({ active, disabled, onClick, children, className = "" }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`hero-option hero-focus ${active ? "is-on" : ""} ${className}`}
    >
      {children}
    </button>
  )
}

function ControlGroup({ label, children }) {
  return (
    <div className="space-y-2.5">
      <div className="hero-muted text-[11px] font-medium uppercase tracking-[0.3em]">
        {label}
      </div>
      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 text-[11px] font-medium uppercase tracking-[0.2em]">
        {children}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   ParticleHero
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ParticleHero() {
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const fpsRef = useRef(null)
  const rebuildRef = useRef(null)
  const simRef = useRef(null)

  const [reducedMotion, setReducedMotion] = useState(false)
  const [engine, setEngine] = useState("pending")
  const [particleCount, setParticleCount] = useState(0)
  // Stays false until the first simulation frame has actually painted, so the
  // canvas never flashes blank or half-sampled while the logo is decoded.
  const [canvasReady, setCanvasReady] = useState(false)

  const [density, setDensity] = useState(initialDensity)
  const [motion, setMotion] = useState("DRIFT")
  const [colorMode, setColorMode] = useState(initialColorMode)
  const [trails, setTrails] = useState(true)
  const [links, setLinks] = useState(false)
  const [panelOpen, setPanelOpen] = useState(() => {
    if (typeof window === "undefined") return false
    return window.innerWidth >= 1024
  })

  /* Mutable copy of settings read by the animation loop. React state changes
     do not restart the simulation. */
  const settingsRef = useRef({
    density: initialDensity(),
    motion: "DRIFT",
    colorMode: initialColorMode(),
    trails: true,
    links: false,
    meltStart: 0,
  })

  /* Touch-first devices: lower DPR ceiling + no LINKS layer. */
  const touchDeviceRef = useRef(isTouchDevice())

  /* Once the visitor picks a colour mode by hand, the hero stops following
     the site theme (the control stays fully functional). */
  const userColorLockRef = useRef(false)

  /* Sync hero colour mode with the site theme until overridden. */
  useEffect(() => {
    const unsubscribe = subscribeTheme((nextTheme) => {
      if (userColorLockRef.current) return
      const next = nextTheme === "light" ? "ON WHITE" : "TRUE"
      settingsRef.current.colorMode = next
      setColorMode(next)
    })
    return unsubscribe
  }, [])

  /* ── Reduced motion preference ─────────────────────────────────────────── */
  useEffect(() => {
    if (typeof window === "undefined") return
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => setReducedMotion(query.matches)
    apply()

    if (query.addEventListener) query.addEventListener("change", apply)
    else query.addListener(apply)

    return () => {
      if (query.removeEventListener) query.removeEventListener("change", apply)
      else query.removeListener(apply)
    }
  }, [])

  /* ── Helpers that live outside the render loop ─────────────────────────── */
  const selectDensity = (next) => {
    settingsRef.current.density = next
    setDensity(next)
  }

  const selectMotion = (next) => {
    const settings = settingsRef.current
    settings.motion = next

    // MELT is a one-shot sag. Selecting it again re-triggers the melt.
    if (next === "MELT") {
      settings.meltStart = performance.now()
    }

    setMotion(next)
  }

  const selectColorMode = (next) => {
    userColorLockRef.current = true
    settingsRef.current.colorMode = next
    setColorMode(next)
  }

  const selectTrails = () => {
    const next = !settingsRef.current.trails
    settingsRef.current.trails = next
    setTrails(next)
  }

  const selectLinks = () => {
    if (!linksSupported) return
    const next = !settingsRef.current.links
    settingsRef.current.links = next
    setLinks(next)
  }

  const linksSupported =
    !reducedMotion &&
    !touchDeviceRef.current && // LINKS stays off on touch devices
    engine === "2d" &&
    particleCount > 0 &&
    particleCount < LINKS_LIMIT

  const controlsDisabled = reducedMotion || engine === "static"
  const motionDisabled = reducedMotion || engine === "static"
  const lightMode = colorMode === "ON WHITE"
  const showStatic = reducedMotion || engine === "static"

  /* ═════════════════════════════════════════════════════════════════════════
     Main lifecycle — runs once per reduced-motion state.
     ═════════════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    setCanvasReady(false)

    if (reducedMotion) {
      setEngine("static")
      return undefined
    }

    const container = stageRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return undefined

    setEngine("pending")

    let disposed = false
    let animationId = null
    let running = false
    let lastFrameTime = 0
    let fpsLast = performance.now()
    let fpsFrames = 0
    let ready = false
    let revealed = false
    let logoImage = null

    const settings = settingsRef.current
    const pointer = {
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      active: false,
      down: false,
    }

    /* ── Pick an engine ─────────────────────────────────────────────────── */
    const glOptions = {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    }

    let gl = null
    let ctx2d = null

    try {
      gl = canvas.getContext("webgl2", glOptions)
      if (!gl) gl = canvas.getContext("webgl", glOptions)
    } catch {
      gl = null
    }

    if (!gl) {
      ctx2d = canvas.getContext("2d", { alpha: false })
    }

    if (!gl && !ctx2d) {
      setEngine("static")
      return undefined
    }

    const usingWebGL = Boolean(gl)
    setEngine(usingWebGL ? "webgl" : "2d")

    /* ── WebGL resources ────────────────────────────────────────────────── */
    let pointsProgram = null
    let fadeProgram = null
    let blitProgram = null
    let quadBuffer = null
    let posBuffer = null
    let sizeBuffer = null
    let colorBuffer = null
    let alphaBuffer = null
    let target = null
    let pointsLocations = null
    let fadeLocations = null
    let blitLocations = null

    const makeWebGLResources = () => {
      pointsProgram = createProgram(
        gl,
        POINTS_VERTEX_SHADER,
        POINTS_FRAGMENT_SHADER
      )
      fadeProgram = createProgram(gl, QUAD_VERTEX_SHADER, FADE_FRAGMENT_SHADER)
      blitProgram = createProgram(gl, BLIT_VERTEX_SHADER, BLIT_FRAGMENT_SHADER)
      quadBuffer = createQuadBuffer(gl)

      posBuffer = gl.createBuffer()
      sizeBuffer = gl.createBuffer()
      colorBuffer = gl.createBuffer()
      alphaBuffer = gl.createBuffer()

      pointsLocations = {
        aPos: gl.getAttribLocation(pointsProgram, "aPos"),
        aSize: gl.getAttribLocation(pointsProgram, "aSize"),
        aColor: gl.getAttribLocation(pointsProgram, "aColor"),
        aAlpha: gl.getAttribLocation(pointsProgram, "aAlpha"),
        uResolution: gl.getUniformLocation(pointsProgram, "uResolution"),
        uDpr: gl.getUniformLocation(pointsProgram, "uDpr"),
        uNegative: gl.getUniformLocation(pointsProgram, "uNegative"),
        uWhite: gl.getUniformLocation(pointsProgram, "uWhite"),
      }

      fadeLocations = {
        aClip: gl.getAttribLocation(fadeProgram, "aClip"),
        uFadeColor: gl.getUniformLocation(fadeProgram, "uFadeColor"),
      }

      blitLocations = {
        aClip: gl.getAttribLocation(blitProgram, "aClip"),
        uTexture: gl.getUniformLocation(blitProgram, "uTexture"),
      }
    }

    if (usingWebGL) {
      try {
        makeWebGLResources()
      } catch (error) {
        console.warn("Particle hero WebGL setup failed:", error)
        gl = null
        ctx2d = canvas.getContext("2d", { alpha: false })
        if (!ctx2d) {
          setEngine("static")
          return undefined
        }
        setEngine("2d")
      }
    }

    const uploadStaticBuffers = (sim) => {
      if (!gl || !sim) return

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, sim.pos, gl.DYNAMIC_DRAW)

      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, sim.size, gl.STATIC_DRAW)

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, sim.color, gl.STATIC_DRAW)

      gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, sim.alpha, gl.STATIC_DRAW)
    }

    const ensureTarget = (width, height) => {
      if (!gl) return
      if (target && target.width === width && target.height === height) return
      if (target) disposeRenderTarget(gl, target)
      target = createRenderTarget(gl, width, height)
    }

    /* ── Particle construction ──────────────────────────────────────────── */

    const buildParticles = ({ animate }) => {
      const width = Math.max(1, container.clientWidth || window.innerWidth)
      const height = Math.max(1, container.clientHeight || window.innerHeight)
      // Cap at 2× DPR for both touch and pointer devices; the bitmap is sized
      // from the container, never from a hardcoded desktop value.
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
      // Below the lg breakpoint the canvas lives in its own compact stage and
      // the logo is fitted to that box. At 1024px and up the original desktop
      // composition below is untouched.
      const isStacked = width < 1024
      const preset =
        DENSITY_PRESETS[settingsRef.current.density] || DENSITY_PRESETS.DENSE

      // Resize the drawing surface to the CSS area at capped DPR.
      const pixelWidth = Math.max(1, Math.round(width * dpr))
      const pixelHeight = Math.max(1, Math.round(height * dpr))
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth
        canvas.height = pixelHeight
        if (target) {
          disposeRenderTarget(gl, target)
          target = null
        }
      }

      // Keep the CSS box in sync with the backing bitmap on every rebuild.
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      if (ctx2d) ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0)

      const aspect =
        logoImage && logoImage.naturalWidth
          ? logoImage.naturalHeight / logoImage.naturalWidth
          : 0.95
      const hasImage = Boolean(logoImage && logoImage.naturalWidth)
      const hasWords = hasImage ? imageHasWordmark(logoImage) : false
      const needsText = !hasImage || !hasWords

      let drawWidth
      let imageHeight
      let textHeight
      let totalHeight

      if (isStacked) {
        // Fit the mark inside the dedicated mobile/tablet stage: target width
        // is the smaller of 80% of the width and 90% of the height, with the
        // image's aspect ratio preserved.
        const maxCompositionHeight = height * 0.9
        drawWidth = Math.min(width * 0.8, height * 0.9)
        imageHeight = drawWidth * aspect
        textHeight = needsText ? drawWidth * 0.34 : 0
        totalHeight = imageHeight + textHeight

        if (totalHeight > maxCompositionHeight) {
          const scale = maxCompositionHeight / totalHeight
          drawWidth *= scale
          imageHeight *= scale
          textHeight *= scale
          totalHeight = maxCompositionHeight
        }
      } else {
        // The mark is composed at ~50% of the viewport width on desktop and
        // ~64% of the height. A smaller composition is not sampled densely
        // enough to reach the target at the requested grid, so the sampler
        // solves the effective step (see solveSampleStep).
        const maxCompositionWidth = width * 0.5
        const maxCompositionHeight = Math.max(
          120,
          Math.min(height * 0.64, height - 190)
        )

        drawWidth = maxCompositionWidth
        imageHeight = drawWidth * aspect
        textHeight = needsText ? drawWidth * 0.28 : 0
        totalHeight = imageHeight + textHeight

        if (totalHeight > maxCompositionHeight) {
          const scale = maxCompositionHeight / totalHeight
          drawWidth *= scale
          imageHeight *= scale
          textHeight *= scale
          totalHeight = maxCompositionHeight
        }
      }

      const compositionWidth = Math.max(1, Math.round(drawWidth))
      const compositionHeight = Math.max(1, Math.round(totalHeight))
      const imageHeightPx = Math.max(
        0,
        Math.round((imageHeight / totalHeight) * compositionHeight)
      )
      const textHeightPx = Math.max(0, compositionHeight - imageHeightPx)

      const offscreen = document.createElement("canvas")
      offscreen.width = compositionWidth
      offscreen.height = compositionHeight
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true })
      if (!offCtx) return

      if (hasImage) {
        offCtx.drawImage(logoImage, 0, 0, compositionWidth, imageHeightPx)
      }

      // If the supplied PNG has no wordmark, typeset the two display lines
      // onto the same offscreen canvas and sample them like the image.
      if (needsText) {
        const displayFont =
          typeof document !== "undefined" &&
          document.fonts &&
          document.fonts.check('700 40px "Space Grotesk"')
            ? '"Space Grotesk", '
            : ""

        offCtx.textAlign = "center"
        offCtx.textBaseline = "top"

        const lineOne = "Kotlin User Group"
        const lineTwo = "Coimbatore"

        let sizeOne = Math.round(compositionWidth * 0.105)
        offCtx.font = `700 ${sizeOne}px ${displayFont}Manrope, sans-serif`
        const measure = offCtx.measureText(lineOne).width
        if (measure > compositionWidth * 0.92) {
          sizeOne = Math.max(
            8,
            Math.floor((sizeOne * compositionWidth * 0.92) / measure)
          )
        }

        const sizeTwo = Math.max(7, Math.round(sizeOne * 0.78))
        const blockTop = imageHeightPx + textHeightPx * 0.08
        const lineOneTop = blockTop
        const lineTwoTop = lineOneTop + sizeOne * 1.12

        offCtx.font = `700 ${sizeOne}px ${displayFont}Manrope, sans-serif`
        offCtx.fillStyle = CANVAS_INK_SOFT
        offCtx.fillText(lineOne, compositionWidth / 2, lineOneTop)

        offCtx.font = `700 ${sizeTwo}px ${displayFont}Manrope, sans-serif`
        offCtx.fillStyle = CANVAS_INK_FAINT
        offCtx.fillText(lineTwo, compositionWidth / 2, lineTwoTop)
      }

      let imageData
      try {
        imageData = offCtx.getImageData(
          0,
          0,
          compositionWidth,
          compositionHeight
        ).data
      } catch {
        return
      }

      const baseStep = isStacked
        ? preset.sampleStep.mobile
        : preset.sampleStep.desktop
      const requestedTarget = isStacked
        ? preset.logoTarget.mobile
        : preset.logoTarget.desktop

      // The 2D fallback is deliberately capped below 8k to protect frame rate.
      const logoCountTarget =
        usingWebGL && gl ? requestedTarget : Math.min(requestedTarget, 7400)

      const step = solveSampleStep(
        imageData,
        compositionWidth,
        compositionHeight,
        baseStep,
        logoCountTarget
      )

      const logoCount = Math.max(
        1,
        countSamples(imageData, compositionWidth, compositionHeight, step)
      )
      const strayCount = Math.round(logoCount * preset.strayRatio)
      const total = logoCount + strayCount

      const old = simRef.current
      const oldCount = old && old.initialized ? old.count : 0

      const x = new Float32Array(total)
      const y = new Float32Array(total)
      const vx = new Float32Array(total)
      const vy = new Float32Array(total)
      const homeX = new Float32Array(total)
      const homeY = new Float32Array(total)
      const startX = new Float32Array(total)
      const startY = new Float32Array(total)
      const color = new Float32Array(total * 3)
      const size = new Float32Array(total)
      const alpha = new Float32Array(total)
      const isStray = new Uint8Array(total)
      const phase = new Float32Array(total)
      const speed = new Float32Array(total)
      const orbit = new Float32Array(total)
      const delay = new Float32Array(total)
      const pos = new Float32Array(total * 2)

      const offsetX = (width - compositionWidth) / 2
      // The stacked stage centres the mark both ways. Desktop keeps its
      // original optical offset and clamps exactly as before.
      const offsetY = isStacked
        ? (height - compositionHeight) / 2
        : clamp(
            (height - compositionHeight) / 2 - height * 0.015,
            92,
            Math.max(92, height - compositionHeight - 104)
          )

      let index = 0

      outer: for (let sy = 0; sy < compositionHeight; sy += step) {
        const row = (sy | 0) * compositionWidth

        for (let sx = 0; sx < compositionWidth; sx += step) {
          const pixel = (row + (sx | 0)) * 4
          const sourceAlpha = imageData[pixel + 3]
          if (sourceAlpha <= 36) continue

          if (index >= logoCount) break outer

          // Jitter within the sampling cell so the grid never reads as a grid.
          const jitterX = (Math.random() - 0.5) * step * 0.68
          const jitterY = (Math.random() - 0.5) * step * 0.68
          const homeXValue = clamp(
            offsetX + sx + jitterX,
            2,
            width - 2
          )
          const homeYValue = clamp(
            offsetY + sy + jitterY,
            2,
            height - 2
          )

          homeX[index] = homeXValue
          homeY[index] = homeYValue

          if (animate) {
            // Scatter across (and slightly outside) the viewport, then fly in.
            const scatterX = (Math.random() * 1.35 - 0.175) * width
            const scatterY = (Math.random() * 1.35 - 0.175) * height
            x[index] = scatterX
            y[index] = scatterY
            startX[index] = scatterX
            startY[index] = scatterY
            vx[index] = (Math.random() - 0.5) * 1.8
            vy[index] = (Math.random() - 0.5) * 1.8
          } else if (old && index < oldCount) {
            // Density / resize rebuilds keep the current cloud alive.
            x[index] = old.x[index]
            y[index] = old.y[index]
            vx[index] = old.vx[index]
            vy[index] = old.vy[index]
            startX[index] = old.startX[index]
            startY[index] = old.startY[index]
          } else {
            x[index] = homeXValue
            y[index] = homeYValue
            vx[index] = 0
            vy[index] = 0
            startX[index] = homeXValue
            startY[index] = homeYValue
          }

          color[index * 3] = imageData[pixel] / 255
          color[index * 3 + 1] = imageData[pixel + 1] / 255
          color[index * 3 + 2] = imageData[pixel + 2] / 255

          // Faint antialiased edge pixels become fainter dust motes.
          alpha[index] = 0.55 + (sourceAlpha / 255) * 0.45
          size[index] =
            clamp(step * 0.56, 0.7, 1.9) * (0.82 + Math.random() * 0.46)
          isStray[index] = 0
          phase[index] = Math.random() * TAU
          speed[index] = 0.00025 + Math.random() * 0.0004
          orbit[index] = 8 + Math.random() * 28
          delay[index] = Math.random() * 0.35

          index += 1
        }
      }

      // A second layer of coloured stray dust gives the cloud depth. These
      // particles use the palette, a lower alpha, and a wider wandering orbit.
      const centreX = offsetX + compositionWidth / 2
      const centreY = offsetY + compositionHeight / 2
      const spreadX = compositionWidth * 0.62
      const spreadY = compositionHeight * 0.72

      for (let stray = 0; stray < strayCount; stray += 1) {
        const i = logoCount + stray
        const palette = PALETTE_RGB[(Math.random() * PALETTE_RGB.length) | 0]

        const homeXValue = clamp(
          centreX + (Math.random() - 0.5) * 2 * spreadX,
          8,
          width - 8
        )
        const homeYValue = clamp(
          centreY + (Math.random() - 0.5) * 2 * spreadY,
          8,
          height - 8
        )

        homeX[i] = homeXValue
        homeY[i] = homeYValue

        if (animate) {
          const scatterX = (Math.random() * 1.35 - 0.175) * width
          const scatterY = (Math.random() * 1.35 - 0.175) * height
          x[i] = scatterX
          y[i] = scatterY
          startX[i] = scatterX
          startY[i] = scatterY
          vx[i] = (Math.random() - 0.5) * 1.2
          vy[i] = (Math.random() - 0.5) * 1.2
        } else if (old && i < oldCount) {
          x[i] = old.x[i]
          y[i] = old.y[i]
          vx[i] = old.vx[i]
          vy[i] = old.vy[i]
          startX[i] = old.startX[i]
          startY[i] = old.startY[i]
        } else {
          x[i] = homeXValue
          y[i] = homeYValue
          vx[i] = 0
          vy[i] = 0
          startX[i] = homeXValue
          startY[i] = homeYValue
        }

        color[i * 3] = palette[0]
        color[i * 3 + 1] = palette[1]
        color[i * 3 + 2] = palette[2]

        // 0.25–0.5 alpha is the quiet background dust in the reference.
        alpha[i] = 0.25 + Math.random() * 0.25
        size[i] = 0.62 + Math.random() * 0.92
        isStray[i] = 1
        phase[i] = Math.random() * TAU
        speed[i] = 0.0003 + Math.random() * 0.0007
        orbit[i] = 14 + Math.random() * 36
        delay[i] = Math.random() * 0.4
      }

      for (let i = 0; i < total; i += 1) {
        pos[i * 2] = x[i]
        pos[i * 2 + 1] = y[i]
      }

      const sim = {
        count: total,
        logoCount,
        strayCount,
        x,
        y,
        vx,
        vy,
        homeX,
        homeY,
        startX,
        startY,
        color,
        size,
        alpha,
        isStray,
        phase,
        speed,
        orbit,
        delay,
        pos,
        width,
        height,
        dpr,
        step,
        offsetX,
        offsetY,
        compositionWidth,
        compositionHeight,
        initialized: true,
        startTime: animate ? performance.now() : performance.now() - ASSEMBLE_MS,
        buckets: null,
      }

      // 2D fallback renders in colour buckets to avoid a fillStyle change for
      // every single particle.
      if (ctx2d) {
        const bucketMap = new Map()
        for (let i = 0; i < total; i += 1) {
          const r = Math.min(4, (color[i * 3] * 5) | 0)
          const g = Math.min(4, (color[i * 3 + 1] * 5) | 0)
          const b = Math.min(4, (color[i * 3 + 2] * 5) | 0)
          const a = Math.min(2, (alpha[i] * 3) | 0)
          const key = ((r * 5 + g) * 5 + b) * 3 + a

          let bucket = bucketMap.get(key)
          if (!bucket) {
            bucket = {
              color: [color[i * 3], color[i * 3 + 1], color[i * 3 + 2]],
              alpha: Math.max(0.2, (a + 1) / 4.2),
              indices: [],
            }
            bucketMap.set(key, bucket)
          }
          bucket.indices.push(i)
        }
        sim.buckets = Array.from(bucketMap.values())
      }

      simRef.current = sim
      setParticleCount(total)

      if (gl && usingWebGL) {
        uploadStaticBuffers(sim)
        ensureTarget(canvas.width, canvas.height)
      }
    }

    /* ── Splash impulse ─────────────────────────────────────────────────── */

    const splash = (clientX, clientY, strength) => {
      const sim = simRef.current
      if (!sim) return

      const rect = container.getBoundingClientRect()
      const px = clientX - rect.left
      const py = clientY - rect.top
      const radius = Math.max(sim.width, sim.height) * 0.34

      for (let i = 0; i < sim.count; i += 1) {
        const dx = sim.x[i] - px
        const dy = sim.y[i] - py
        const distanceSq = dx * dx + dy * dy
        if (distanceSq > radius * radius) continue

        const distance = Math.sqrt(distanceSq)
        const falloff = smoothstep(1, 0, distance / radius)
        const inv = 1 / Math.max(distance, 0.001)
        const impulse = strength * falloff

        sim.vx[i] += dx * inv * impulse + (Math.random() - 0.5) * 2
        sim.vy[i] += dy * inv * impulse + (Math.random() - 0.5) * 2
      }
    }

    /* ── Pointer listeners ──────────────────────────────────────────────── */

    const isUiTarget = (event) =>
      event.target instanceof Element &&
      Boolean(event.target.closest("button, a, input, label"))

    const setPointerFromEvent = (event) => {
      const rect = container.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
    }

    const onPointerMove = (event) => {
      if (isUiTarget(event)) return
      setPointerFromEvent(event)

      if (event.pointerType === "touch" && !pointer.down) {
        pointer.active = false
        return
      }

      pointer.active = true
    }

    const onPointerDown = (event) => {
      if (isUiTarget(event)) return
      setPointerFromEvent(event)
      pointer.down = true
      pointer.active = true

      // SPLASH mode is the deliberately energetic click; every other mode
      // gets a smaller nudge so the surface still feels alive.
      const strength = settingsRef.current.motion === "SPLASH" ? 56 : 14
      splash(event.clientX, event.clientY, strength)
    }

    const onPointerUp = (event) => {
      pointer.down = false
      if (event.pointerType === "touch") {
        pointer.active = false
      }
    }

    const onPointerLeave = () => {
      pointer.active = false
      pointer.down = false
      pointer.prevX = -9999
      pointer.prevY = -9999
    }

    container.addEventListener("pointermove", onPointerMove, { passive: true })
    container.addEventListener("pointerdown", onPointerDown, { passive: true })
    container.addEventListener("pointerup", onPointerUp, { passive: true })
    container.addEventListener("pointercancel", onPointerUp, { passive: true })
    container.addEventListener("pointerleave", onPointerLeave, { passive: true })

    /* ── Physics ────────────────────────────────────────────────────────── */

    const integrate = (now, deltaMs) => {
      const sim = simRef.current
      if (!sim) return

      const width = sim.width
      const height = sim.height
      const dtScale = clamp(deltaMs / 16.667, 0.35, 2)
      const friction = Math.pow(FRICTION, dtScale)
      const settingsNow = settingsRef.current
      const motionNow = settingsNow.motion
      const isMelting =
        motionNow === "MELT" &&
        now - settingsNow.meltStart < MELT_MS &&
        settingsNow.meltStart > 0
      const isGathering = motionNow === "GATHER"
      const isSwarming = motionNow === "SWARM"
      const isDrifting = motionNow === "DRIFT" || motionNow === "SPLASH"
      const assembling = now - sim.startTime < ASSEMBLE_MS

      const radius = clamp(
        REPULSION_RADIUS * (width / 1440),
        88,
        170
      )
      const radiusSq = radius * radius

      const pointerVx =
        pointer.prevX === -9999 ? 0 : pointer.x - pointer.prevX
      const pointerVy =
        pointer.prevY === -9999 ? 0 : pointer.y - pointer.prevY
      pointer.prevX = pointer.x
      pointer.prevY = pointer.y

      const windX = clamp(pointerVx * WIND_DRIFT_FACTOR, -10, 10)
      const windY = clamp(pointerVy * WIND_DRIFT_FACTOR, -10, 10)

      const spring = isGathering ? GATHER_SPRING : SPRING
      const count = sim.count
      const pos = sim.pos

      /* Time steps are invariant across the particle loop — hoist them. */
      const swarmSin = isSwarming ? now * 0.0004 : 0
      const swarmCos = isSwarming ? now * 0.00033 : 0
      const driftSin = isDrifting || assembling ? now * 0.00045 : 0
      const driftCos = isDrifting || assembling ? now * 0.00038 : 0
      const meltSin = isMelting ? now * 0.002 : 0

      for (let i = 0; i < count; i += 1) {
        const stray = sim.isStray[i] === 1
        const phase = sim.phase[i]
        let targetX = sim.homeX[i]
        let targetY = sim.homeY[i]

        // Idle motion ------------------------------------------------------
        if (isSwarming) {
          targetX += fsin(swarmSin + sim.homeY[i] * 0.012 + phase) * 24
          targetY +=
            fcos(swarmCos + sim.homeX[i] * 0.012 + phase * 1.7) * 20
        } else if (isDrifting || assembling) {
          const amplitude = stray ? 16 : 2.4
          targetX += fsin(driftSin + phase) * amplitude
          targetY += fcos(driftCos + phase * 1.35) * amplitude * 0.72
        }

        // Stray dust keeps a wider, slower orbit than the logo cloud.
        if (stray && !isGathering && !isMelting) {
          const orbitAngle = now * sim.speed[i] + phase
          targetX += fcos(orbitAngle) * sim.orbit[i]
          targetY += fsin(orbitAngle * 0.86 + phase) * sim.orbit[i] * 0.7
        }

        // Load animation ---------------------------------------------------
        if (assembling) {
          const delay = sim.delay[i]
          const progress = clamp(
            (now - sim.startTime) / ASSEMBLE_MS / Math.max(0.001, 1 - delay),
            0,
            1
          )
          const eased = 1 - Math.pow(1 - progress, 3)
          targetX = sim.startX[i] + (targetX - sim.startX[i]) * eased
          targetY = sim.startY[i] + (targetY - sim.startY[i]) * eased
        }

        // Pointer repulsion ------------------------------------------------
        if (pointer.active) {
          const dx = sim.x[i] - pointer.x
          const dy = sim.y[i] - pointer.y
          const distanceSq = dx * dx + dy * dy

          if (distanceSq < radiusSq) {
            const distance = Math.sqrt(distanceSq)
            const falloff = smoothstep(1, 0, distance / radius)
            const inv = 1 / Math.max(distance, 0.001)

            // A little angular jitter keeps the scatter from looking radial.
            const directionX =
              distance > 0.001 ? dx * inv : Math.random() - 0.5
            const directionY =
              distance > 0.001 ? dy * inv : Math.random() - 0.5
            const jitterX = (Math.random() - 0.5) * 0.35
            const jitterY = (Math.random() - 0.5) * 0.35
            const push = REPULSION_STRENGTH * falloff

            sim.vx[i] +=
              (directionX + jitterX) * push + windX * falloff
            sim.vy[i] +=
              (directionY + jitterY) * push + windY * falloff
          }
        }

        // Spring + friction -------------------------------------------------
        if (!isMelting) {
          const springForce = stray ? spring * 0.62 : spring
          sim.vx[i] += (targetX - sim.x[i]) * springForce * dtScale
          sim.vy[i] += (targetY - sim.y[i]) * springForce * dtScale
        } else {
          // MELT: lose the spring, sag downward, then reform.
          sim.vy[i] += MELT_GRAVITY * dtScale
          sim.vx[i] += fsin(meltSin + phase) * 0.025 * dtScale
        }

        sim.vx[i] *= friction
        sim.vy[i] *= friction
        sim.x[i] += sim.vx[i] * dtScale
        sim.y[i] += sim.vy[i] * dtScale

        // Soft page bounds. Particles that are flung out drift back in.
        if (sim.x[i] < -20) sim.vx[i] += 0.08
        else if (sim.x[i] > width + 20) sim.vx[i] -= 0.08
        if (sim.y[i] < -20) sim.vy[i] += 0.08
        else if (sim.y[i] > height + 20) sim.vy[i] -= 0.08

        pos[i * 2] = sim.x[i]
        pos[i * 2 + 1] = sim.y[i]
      }
    }

    /* ── Rendering ──────────────────────────────────────────────────────── */

    const drawWebGL = () => {
      const sim = simRef.current
      if (!gl || !sim || !pointsLocations) return

      ensureTarget(canvas.width, canvas.height)
      if (!target) return

      const settingsNow = settingsRef.current
      const white = settingsNow.colorMode === "ON WHITE"
      const negative = settingsNow.colorMode === "NEGATIVE"
      const additive = settingsNow.colorMode === "LIGHT"
      const bg = white ? PAPER_BG_RGB : HERO_BG_RGB
      const bgR = bg[0] / 255
      const bgG = bg[1] / 255
      const bgB = bg[2] / 255

      // 1. Draw into the off-screen accumulation buffer. The translucent
      //    background rectangle is the trail fade — no full clear per frame.
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer)
      gl.viewport(0, 0, target.width, target.height)
      gl.disable(gl.DEPTH_TEST)
      gl.disable(gl.CULL_FACE)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

      if (target.fresh) {
        gl.clearColor(bgR, bgG, bgB, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        target.fresh = false
      }

      gl.useProgram(fadeProgram)
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
      gl.enableVertexAttribArray(fadeLocations.aClip)
      gl.vertexAttribPointer(fadeLocations.aClip, 2, gl.FLOAT, false, 0, 0)
      gl.uniform4f(
        fadeLocations.uFadeColor,
        bgR,
        bgG,
        bgB,
        settingsNow.trails ? TRAIL_ALPHA : 1
      )
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      gl.disableVertexAttribArray(fadeLocations.aClip)

      // 2. Upload the CPU-integrated positions and draw every particle in one
      //    gl.POINTS call.
      gl.useProgram(pointsProgram)
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, sim.pos)
      gl.enableVertexAttribArray(pointsLocations.aPos)
      gl.vertexAttribPointer(
        pointsLocations.aPos,
        2,
        gl.FLOAT,
        false,
        0,
        0
      )

      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer)
      gl.enableVertexAttribArray(pointsLocations.aSize)
      gl.vertexAttribPointer(
        pointsLocations.aSize,
        1,
        gl.FLOAT,
        false,
        0,
        0
      )

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
      gl.enableVertexAttribArray(pointsLocations.aColor)
      gl.vertexAttribPointer(
        pointsLocations.aColor,
        3,
        gl.FLOAT,
        false,
        0,
        0
      )

      gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer)
      gl.enableVertexAttribArray(pointsLocations.aAlpha)
      gl.vertexAttribPointer(
        pointsLocations.aAlpha,
        1,
        gl.FLOAT,
        false,
        0,
        0
      )

      gl.uniform2f(pointsLocations.uResolution, sim.width, sim.height)
      gl.uniform1f(pointsLocations.uDpr, sim.dpr)
      gl.uniform1f(pointsLocations.uNegative, negative ? 1 : 0)
      gl.uniform1f(pointsLocations.uWhite, white ? 1 : 0)

      if (additive) {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
      } else {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      }

      gl.drawArrays(gl.POINTS, 0, sim.count)

      gl.disableVertexAttribArray(pointsLocations.aPos)
      gl.disableVertexAttribArray(pointsLocations.aSize)
      gl.disableVertexAttribArray(pointsLocations.aColor)
      gl.disableVertexAttribArray(pointsLocations.aAlpha)

      // 3. Blit the accumulation buffer to the visible canvas.
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.disable(gl.BLEND)
      gl.clearColor(bgR, bgG, bgB, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.useProgram(blitProgram)
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, target.texture)
      gl.uniform1i(blitLocations.uTexture, 0)
      gl.enableVertexAttribArray(blitLocations.aClip)
      gl.vertexAttribPointer(blitLocations.aClip, 2, gl.FLOAT, false, 0, 0)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      gl.disableVertexAttribArray(blitLocations.aClip)
    }

    const drawLinks2D = (sim) => {
      const settingsNow = settingsRef.current
      if (!ctx2d || !settingsNow.links || sim.count >= LINKS_LIMIT) return

      const cellSize = 30
      const grid = new Map()

      for (let i = 0; i < sim.count; i += 1) {
        const gx = Math.floor(sim.x[i] / cellSize)
        const gy = Math.floor(sim.y[i] / cellSize)
        const key = `${gx}:${gy}`
        let cell = grid.get(key)
        if (!cell) {
          cell = []
          grid.set(key, cell)
        }
        cell.push(i)
      }

      const maxDistanceSq = 34 * 34
      /* Ink follows the colour mode: in ON WHITE the links must be dark on
         paper — white links would be invisible on the light canvas. */
      ctx2d.strokeStyle =
        settingsNow.colorMode === "ON WHITE"
          ? CANVAS_LINK_INK_LIGHT
          : CANVAS_LINK_INK_DARK
      ctx2d.lineWidth = 0.5
      ctx2d.beginPath()

      for (let i = 0; i < sim.count; i += 1) {
        const gx = Math.floor(sim.x[i] / cellSize)
        const gy = Math.floor(sim.y[i] / cellSize)

        // Only look forward through neighbouring cells, so each pair is once.
        for (let ox = 0; ox <= 1; ox += 1) {
          for (let oy = -1; oy <= 1; oy += 1) {
            if (ox === 0 && oy <= 0) continue
            const cell = grid.get(`${gx + ox}:${gy + oy}`)
            if (!cell) continue

            for (let k = 0; k < cell.length; k += 1) {
              const j = cell[k]
              if (j <= i) continue
              const dx = sim.x[j] - sim.x[i]
              const dy = sim.y[j] - sim.y[i]
              if (dx * dx + dy * dy > maxDistanceSq) continue
              ctx2d.moveTo(sim.x[i], sim.y[i])
              ctx2d.lineTo(sim.x[j], sim.y[j])
            }
          }
        }
      }

      ctx2d.stroke()
    }

    const draw2D = () => {
      const sim = simRef.current
      if (!ctx2d || !sim) return

      const settingsNow = settingsRef.current
      const white = settingsNow.colorMode === "ON WHITE"
      const negative = settingsNow.colorMode === "NEGATIVE"
      const additive = settingsNow.colorMode === "LIGHT"
      const bg = white ? PAPER_BG_RGB : HERO_BG_RGB

      ctx2d.globalCompositeOperation = "source-over"
      ctx2d.fillStyle = `rgba(${bg[0]},${bg[1]},${bg[2]},${
        settingsNow.trails ? TRAIL_ALPHA : 1
      })`
      ctx2d.fillRect(0, 0, sim.width, sim.height)

      if (settingsNow.links) drawLinks2D(sim)

      ctx2d.globalCompositeOperation = additive ? "lighter" : "source-over"

      for (let b = 0; b < sim.buckets.length; b += 1) {
        const bucket = sim.buckets[b]
        let r = bucket.color[0]
        let g = bucket.color[1]
        let blue = bucket.color[2]

        if (negative) {
          r = 1 - r
          g = 1 - g
          blue = 1 - blue
        }

        if (white) {
          r *= 0.56
          g *= 0.56
          blue *= 0.56
        }

        ctx2d.fillStyle = rgbCss(r, g, blue, bucket.alpha)
        ctx2d.beginPath()

        for (let k = 0; k < bucket.indices.length; k += 1) {
          const i = bucket.indices[k]
          const radius = sim.size[i]
          ctx2d.moveTo(sim.x[i] + radius, sim.y[i])
          ctx2d.arc(sim.x[i], sim.y[i], radius, 0, TAU)
        }

        ctx2d.fill()
      }

      ctx2d.globalCompositeOperation = "source-over"
    }

    /* ── RAF loop ───────────────────────────────────────────────────────── */

    /* Mobile scaling: touch devices settle at ≤30 simulated FPS. The reduced
       particle count and DPR already come from the preset; this thirds the
       per-second physics cost on the same-heavy frames (every untouched
       effect keeps running, it just steps at half the refresh rate). */
    const SIM_FRAME_MS = touchDeviceRef.current ? 33 : 0

    const render = (now) => {
      if (!running) return
      if (!simRef.current) {
        animationId = requestAnimationFrame(render)
        return
      }

      const delta = lastFrameTime ? Math.min(now - lastFrameTime, 40) : 16.667

      if (now - lastSimTime < SIM_FRAME_MS) {
        animationId = requestAnimationFrame(render)
        return
      }
      lastSimTime = now
      lastFrameTime = now

      integrate(now, delta)

      if (gl) drawWebGL()
      else draw2D()

      // Reveal only after a complete frame exists. This prevents the blank or
      // half-sampled canvas flash while the logo pixels are being read.
      if (!revealed) {
        revealed = true
        setCanvasReady(true)
      }

      // FPS readout is written straight to the DOM so React does not re-render
      // twice a second just to update two characters.
      fpsFrames += 1
      if (now - fpsLast >= 500) {
        const fps = Math.round((fpsFrames * 1000) / (now - fpsLast))
        if (fpsRef.current) fpsRef.current.textContent = String(fps)
        fpsFrames = 0
        fpsLast = now
      }

      animationId = requestAnimationFrame(render)
    }

    let lastSimTime = performance.now()

    const start = () => {
      if (running) return
      running = true
      lastFrameTime = 0
      fpsLast = performance.now()
      fpsFrames = 0
      animationId = requestAnimationFrame(render)
    }

    const stop = () => {
      running = false
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
        animationId = null
      }
    }

    /* ── Visibility / viewport pausing ─────────────────────────────────── */

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) start()
        else stop()
      },
      { threshold: 0.01 }
    )
    observer.observe(container)

    const onVisibilityChange = () => {
      if (document.hidden) stop()
      else if (container.getBoundingClientRect().bottom > 0) start()
    }
    document.addEventListener("visibilitychange", onVisibilityChange)

    /* ── Resize ─────────────────────────────────────────────────────────── */

    let resizeTimer = null
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        resizeTimer = null
        if (!ready || disposed) return
        buildParticles({ animate: false })
      }, 160)
    }

    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(container)
    window.addEventListener("resize", onResize)
    window.addEventListener("orientationchange", onResize)

    /* ── Logo load + first build ────────────────────────────────────────── */

    const logo = new Image()
    logo.decoding = "async"
    logo.src = "/assets/kug-logo.png"

    const prepare = async () => {
      try {
        if (!logo.complete) {
          await Promise.race([
            new Promise((resolve) => {
              logo.onload = resolve
              logo.onerror = resolve
            }),
            // Never hold the hero hostage to a slow asset request.
            new Promise((resolve) => setTimeout(resolve, 4000)),
          ])
        }
      } catch {
        // The text fallback handles a missing image.
      }

      if (document.fonts && document.fonts.ready) {
        try {
          await Promise.race([
            document.fonts.ready,
            new Promise((resolve) => setTimeout(resolve, 1200)),
          ])
        } catch {
          // Font loading is best-effort.
        }
      }

      /* Defer the heavy first build (sampling + WebGL upload) until the
         PageLoader has lifted, instead of competing with it for the main
         thread in the FCP/LCP window. The assembly fly-in then also plays
         in view. The fallback guarantees the hero never stalls if the
         loader is gone. */
      await Promise.race([
        loaderDone(),
        new Promise((resolve) => setTimeout(resolve, 4200)),
      ])

      if (disposed) return

      logoImage = logo.complete && logo.naturalWidth > 0 ? logo : null
      ready = true
      buildParticles({ animate: true })
      start()
    }

    prepare()

    // Exposed so a DENSITY change can rebuild without tearing down WebGL.
    rebuildRef.current = ({ animate = false } = {}) => {
      if (!ready || disposed) return
      buildParticles({ animate })
    }

    /* ── Cleanup ────────────────────────────────────────────────────────── */

    return () => {
      disposed = true
      ready = false
      rebuildRef.current = null
      stop()
      observer.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("orientationchange", onResize)
      if (resizeTimer) clearTimeout(resizeTimer)

      container.removeEventListener("pointermove", onPointerMove)
      container.removeEventListener("pointerdown", onPointerDown)
      container.removeEventListener("pointerup", onPointerUp)
      container.removeEventListener("pointercancel", onPointerUp)
      container.removeEventListener("pointerleave", onPointerLeave)

      if (gl) {
        disposeRenderTarget(gl, target)
        target = null
        if (posBuffer) gl.deleteBuffer(posBuffer)
        if (sizeBuffer) gl.deleteBuffer(sizeBuffer)
        if (colorBuffer) gl.deleteBuffer(colorBuffer)
        if (alphaBuffer) gl.deleteBuffer(alphaBuffer)
        if (quadBuffer) gl.deleteBuffer(quadBuffer)
        if (pointsProgram) gl.deleteProgram(pointsProgram)
        if (fadeProgram) gl.deleteProgram(fadeProgram)
        if (blitProgram) gl.deleteProgram(blitProgram)
      }

      simRef.current = null
    }
  }, [reducedMotion])

  /* ── Density changes rebuild the cloud in place ────────────────────────── */
  useEffect(() => {
    if (reducedMotion) return
    rebuildRef.current?.({ animate: false })
  }, [density, reducedMotion])

  /* ── UI theme variables (ON WHITE turns the instrument light) ──────────── */
  const themeStyle = lightMode
    ? {
        "--hero-bg": PAPER_BG,
        "--hero-fg": HERO_INK_LIGHT,
        "--hero-muted": HERO_INK_MUTED_LIGHT,
        "--hero-faint": HERO_INK_FAINT_LIGHT,
        "--hero-border": "rgba(16,16,18,0.16)",
        "--hero-shadow": "none",
      }
    : {
        "--hero-bg": HERO_BG,
        "--hero-fg": HERO_INK_DARK,
        "--hero-muted": HERO_INK_MUTED_DARK,
        /* #666666 failed AA (~3.5:1); #7D7D7D clears 4.5:1 on #050506 */
        "--hero-faint": HERO_INK_FAINT_DARK,
        "--hero-border": "rgba(255,255,255,0.08)",
        "--hero-shadow": "0 1px 8px rgba(0,0,0,0.55)",
      }

  const countLabel =
    showStatic || particleCount === 0
      ? "STATIC"
      : `${particleCount.toLocaleString()} PARTICLES`

  return (
    <section
      id="hero"
      style={themeStyle}
      className="hero-shell relative w-full select-none overflow-hidden"
      aria-label="Kotlin User Group Coimbatore particle cloud"
    >
      {/* Dedicated particle stage. On mobile it is a normal-flow box directly
          below the copy; at lg it becomes the original full-hero absolute
          canvas again. */}
      <div
        ref={stageRef}
        className="hero-stage relative z-0 order-2 overflow-hidden touch-pan-y lg:absolute lg:inset-0 lg:order-none lg:m-0 lg:h-full lg:w-full"
      >
        {/* WebGL points, or the 2D-canvas fallback. */}
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="The Kotlin User Group Coimbatore mark formed from tens of thousands of coloured dust particles. Move the pointer to disturb them; click to splash."
          className={`absolute inset-0 block h-full w-full touch-pan-y transition-opacity duration-700 ease-out ${
            showStatic
              ? "invisible"
              : canvasReady
                ? "opacity-100"
                : "opacity-0"
          }`}
        />

        {/* Reduced motion / no-canvas fallback: a crisp static mark. */}
        {showStatic && (
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <img
              src="/assets/kug-logo.png"
              alt="Kotlin User Group Coimbatore"
              className="w-[min(78vw,520px)] max-h-[62svh] object-contain"
            />
          </div>
        )}
      </div>

      {/* Top-left mark is now a NON-TEXT indicator. The brand name on this
          screen lives exactly once (the H1 below); repeating it here was
          duplication. Three Kotlin-brand dots keep the instrument corner
          populated without any words. */}
      {/* Top-left mark is now a NON-TEXT indicator (desktop instrument corner). */}
      <div
        className="hero-ui-shadow pointer-events-none absolute left-4 top-20 z-20 hidden items-center gap-1.5 lg:flex lg:left-12"
        aria-hidden="true"
      >
        {[
          { name: "Kotlin purple", hex: "#7F52FF" },
          { name: "Magenta", hex: "#C811E1" },
          { name: "Orange", hex: "#F88A00" },
        ].map((dot) => (
          <span
            key={dot.name}
            className="block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: dot.hex }}
          />
        ))}
      </div>

      {/* Live count / FPS readout, intentionally hidden on mobile. */}
      <div className="hero-ui-shadow pointer-events-none absolute right-8 top-20 z-20 hidden text-right font-mono text-[11px] uppercase leading-relaxed tracking-[0.24em] text-[color:var(--hero-faint)] lg:block lg:right-12">
        <div>{countLabel}</div>
        <div>
          <span ref={fpsRef}>60</span> FPS
        </div>
      </div>

      {/* Welcome copy and the settings rail share one quiet left column.
          Exactly one H1 on the page, one welcome sentence, no duplicate
          eyebrow. Mascot greetings chip introduces Kodee with high polish. */}
      <div className="hero-left-rail pointer-events-none absolute left-5 right-5 sm:right-auto top-[4.75rem] sm:top-[7.5rem] sm:bottom-8 z-20 flex flex-col sm:left-8 lg:left-12">
        <div className="hero-welcome hero-ui-shadow pointer-events-none shrink-0">
          <div className="hero-eyebrow-chip pointer-events-auto inline-flex items-center gap-2 self-start rounded-full border border-border bg-surface-2/90 px-2.5 py-1 backdrop-blur-md mb-2 sm:mb-3">
            <KodeeGif
              gif={KODEE_GIFS.greetings}
              frame={KODEE_FRAMES.welcoming}
              alt=""
              staticBelowNarrow
              eager
              className="h-4 w-4 shrink-0 object-contain"
            />
            <span className="font-mono text-[11px] font-semibold tracking-wider text-muted uppercase">
              Coimbatore Chapter
            </span>
          </div>
          <h1 className="hero-welcome__title font-display font-bold text-[color:var(--hero-fg)]">
            Kotlin User Group Coimbatore
          </h1>
          <p className="hero-welcome__body mt-2.5 sm:mt-3 text-[color:var(--hero-muted)]">
            A community of developers, learners, and builders who love Kotlin
            in Coimbatore — from your first line of code to production apps.
          </p>
          <div className="hero-welcome__actions">
            <a
              href="https://www.linkedin.com/company/kotlin-user-group-coimbatore"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-welcome__cta hero-focus pointer-events-auto"
            >
              Follow the chapter
            </a>
            <a
              href="#events"
              className="hero-welcome__cta hero-welcome__cta--ghost hero-focus pointer-events-auto"
            >
              Explore events
            </a>
          </div>
        </div>

        {/* One compact, labelled control toolbar. All four groups — Density,
            Motion, Colour, Scene — live here; the former duplicate bottom
            motion bar is gone, so each control appears exactly once. On
            mobile it is collapsed by default and expands in the rail with
            44px touch targets (scrollable if the panel is long). */}
        <aside className="hero-controls pointer-events-none flex min-h-0 w-[240px] max-w-full flex-col">
          <button
            type="button"
            onClick={() => setPanelOpen((open) => !open)}
            aria-expanded={panelOpen}
            aria-controls="hero-settings"
            aria-label="Toggle hero controls"
            className="hero-option hero-control-pill hero-focus hero-ui-shadow pointer-events-auto inline-flex items-center gap-2 self-start rounded-full border border-border bg-surface-2/90 px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-[0.2em] text-[color:var(--hero-muted)] hover:border-border-strong hover:text-[color:var(--hero-fg)] transition-all active:scale-95"
          >
            <span className="flex items-center gap-1.5 font-medium text-[color:var(--hero-fg)]">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Controls
            </span>
            <span className="h-3 w-px bg-border" />
            <span className="text-[10px] tracking-[0.16em] text-[color:var(--hero-faint)]">
              {motion}
            </span>
            <span aria-hidden="true" className="text-[10px] leading-none text-[color:var(--hero-faint)]">
              {panelOpen ? "▲" : "▼"}
            </span>
          </button>

          {panelOpen && (
            <div
              id="hero-settings"
              className="hero-ui-shadow pointer-events-auto mt-4 min-h-0 space-y-4 overflow-y-auto pr-2"
            >
              <ControlGroup label="Density">
                {Object.keys(DENSITY_PRESETS).map((key) => (
                  <OptionButton
                    key={key}
                    active={density === key}
                    disabled={controlsDisabled}
                    onClick={() => selectDensity(key)}
                  >
                    {DENSITY_PRESETS[key].label}
                  </OptionButton>
                ))}
              </ControlGroup>

              <div className="hero-divider" />

              <ControlGroup label="Motion">
                {MOTION_MODES.map((mode) => (
                  <OptionButton
                    key={mode}
                    active={motion === mode}
                    disabled={motionDisabled}
                    onClick={() => selectMotion(mode)}
                  >
                    {mode}
                  </OptionButton>
                ))}
              </ControlGroup>

              <div className="hero-divider" />

              <ControlGroup label="Colour">
                {COLOR_MODES.map((mode) => (
                  <OptionButton
                    key={mode}
                    active={colorMode === mode}
                    disabled={controlsDisabled}
                    onClick={() => selectColorMode(mode)}
                  >
                    {mode}
                  </OptionButton>
                ))}
              </ControlGroup>

              <div className="hero-divider" />

              <ControlGroup label="Scene">
                <OptionButton
                  active={trails}
                  disabled={controlsDisabled}
                  onClick={selectTrails}
                >
                  Trails
                </OptionButton>
                <OptionButton
                  active={links}
                  disabled={!linksSupported}
                  onClick={selectLinks}
                  className={!linksSupported ? "opacity-40" : ""}
                >
                  Links
                </OptionButton>
              </ControlGroup>

              {/* A tiny note explains why LINKS is usually unavailable. */}
              <p className="text-[11px] uppercase leading-relaxed tracking-[0.22em] text-[color:var(--hero-faint)]">
                Links draw below {LINKS_LIMIT.toLocaleString()} points
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* Quiet interaction hint, desktop only, anchored bottom-right with
          enough clearance that the companion FAB never covers it. */}
      <p className="hero-ui-shadow pointer-events-none absolute bottom-7 right-36 z-20 hidden text-[11px] uppercase tracking-[0.28em] text-[color:var(--hero-faint)] lg:block lg:right-44">
        Move to disturb <span aria-hidden="true">·</span> click to splash
      </p>
    </section>
  )
}
