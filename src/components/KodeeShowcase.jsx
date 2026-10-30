import { useState } from "react"

const KODEE_EXPRESSIONS = [
  {
    id: "electrified",
    name: "Electrified",
    src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-electrified.png",
    scenario: "Structured Concurrency",
    desc: "Non-blocking coroutines running across lightweight worker pools with zero thread contention.",
    tag: "Coroutines",
  },
  {
    id: "excited",
    name: "Excited",
    src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-excited.png",
    scenario: "K2 Compiler Green",
    desc: "Compilation finished in record time with 0 warnings, 0 errors, and maximum build cache hits.",
    tag: "Kotlin 2.0",
  },
  {
    id: "loving",
    name: "Loving",
    src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-loving.png",
    scenario: "Community Hub",
    desc: "Welcoming new Kotlin learners and collaborating with developers across Coimbatore.",
    tag: "Community",
  },
  {
    id: "welcoming",
    name: "Welcoming",
    src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-welcoming.png",
    scenario: "First Meetup RSVP",
    desc: "A warm Vanakkam to builders, students, and engineers joining Coimbatore's tech ecosystem.",
    tag: "Meetup",
  },
  {
    id: "pleased",
    name: "Pleased",
    src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-pleased.png",
    scenario: "KMP Multiplatform Target",
    desc: "Single shared business module successfully linking to native iOS, Android, and Desktop builds.",
    tag: "Multiplatform",
  },
  {
    id: "shocked",
    name: "Shocked",
    src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-shocked.png",
    scenario: "NullPointerException Catch",
    desc: "When someone uses the force unwrap operator (!!) in production code instead of safe-calls (?.).",
    tag: "Debugging",
  },
  {
    id: "surprised",
    name: "Surprised",
    src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-surprised.png",
    scenario: "Smart Cast In Action",
    desc: "When the compiler automatically smart-casts your variable without any manual type casting.",
    tag: "Type Safety",
  },
  {
    id: "angry",
    name: "Angry",
    src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-angry.png",
    scenario: "Clean Build Requested",
    desc: "When someone deleted ~/.gradle/caches and the entire project is re-indexing from scratch.",
    tag: "Gradle",
  },
  {
    id: "frustrated",
    name: "Frustrated",
    src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-frustrated.png",
    scenario: "Git Merge Conflict",
    desc: "Conflicting dependency version upgrades in build.gradle.kts right before a deployment deadline.",
    tag: "CI / CD",
  },
  {
    id: "naughty",
    name: "Naughty",
    src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-naughty.png",
    scenario: "Experimental Opt-In",
    desc: "Adding @OptIn(ExperimentalContracts::class) to unleash bleeding-edge compiler compiler features.",
    tag: "Compiler",
  },
  {
    id: "lost",
    name: "Lost",
    src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-lost.png",
    scenario: "Unresolved Reference",
    desc: "Missing import directive after refactoring package hierarchy across nested multi-modules.",
    tag: "Refactor",
  },
  {
    id: "grumpy",
    name: "Grumpy",
    src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-grumpy.png",
    scenario: "Legacy Java Codebase",
    desc: "Staring at thousands of lines of getters, setters, and boilerplate builder factories.",
    tag: "Legacy",
  },
  {
    id: "frightened",
    name: "Frightened",
    src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-frightened.png",
    scenario: "Production On-Call Page",
    desc: "A 3 AM pager alert reveals a latent race condition hiding deep inside an async pipeline.",
    tag: "Reliability",
  },
  {
    id: "broken-hearted",
    name: "Heartbroken",
    src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-broken-hearted.png",
    scenario: "Breaking API Change",
    desc: "Your favourite experimental API was removed upstream in the latest Kotlin release without a migration path.",
    tag: "Breaking Change",
  },
  {
    id: "sad",
    name: "Sad",
    src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-sad.png",
    scenario: "Deprecated API",
    desc: "When your favorite experimental coroutine operator is deprecated in the latest release.",
    tag: "Deprecation",
  },
]

const TRIVIA_FACTS = [
  {
    number: "2023",
    label: "Kodee Mascot Introduced",
    detail: "Crafted from geometric Kotlin primitives as the developer-first robotic companion.",
  },
  {
    number: "2.0",
    label: "Next-Gen Compiler",
    detail: "Unified compiler frontend bringing unprecedented build speed and compiler plugin parity.",
  },
  {
    number: "100%",
    label: "Java Interoperability",
    detail: "Seamless two-way callability with existing JVM codebases, libraries, and frameworks.",
  },
]

export default function KodeeShowcase() {
  const [selectedExpression, setSelectedExpression] = useState(KODEE_EXPRESSIONS[0])

  return (
    <section id="kodee" className="py-24 px-6 sm:px-10 lg:px-16 bg-void">
      <div className="max-w-7xl mx-auto">
        <div className="section-label">Mascot &amp; Architecture</div>
        <h2 className="section-heading font-display font-bold text-fg text-[clamp(1.8rem,4vw,3rem)] leading-none tracking-[-0.03em] mb-4">
          Meet Kodee &amp; Expression Matrix
        </h2>
        <p className="font-body text-muted text-base max-w-xl leading-relaxed mb-12">
          JetBrains designed Kodee with geometric shapes directly sampled from the Kotlin language mark.
          Explore the official developer expression states below.
        </p>

        {/* Mascot Centerpiece Card — Solid #111111, 12px radius, no glass */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-surface border border-border rounded-xl p-8 sm:p-12 mb-12">
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="p-6 flex items-center justify-center">
              <img
                src={selectedExpression.src}
                alt={selectedExpression.name}
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain kodee-img select-none"
              />
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="font-mono text-xs tracking-widest uppercase text-muted">
                {selectedExpression.tag}
              </span>
              <span className="font-mono text-[11px] text-dim border border-border px-2 py-0.5 rounded-md">
                Status: {selectedExpression.name}
              </span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-fg mb-4">
              {selectedExpression.scenario}
            </h3>
            <p className="font-body text-muted text-base leading-relaxed mb-6 max-w-lg">
              {selectedExpression.desc}
            </p>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-dim">
                Official JetBrains Mascot Asset · KUG Coimbatore
              </span>
            </div>
          </div>
        </div>

        {/* 15-Emotion Interactive Grid Selector */}
        <div className="mb-14">
          <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-mono text-xs tracking-widest uppercase text-dim">
              All 15 Official Emoji States (Select to Inspect)
            </span>
            <span className="font-mono text-xs text-body">
              {selectedExpression.name} Active
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {KODEE_EXPRESSIONS.map((expr) => {
              const isActive = selectedExpression.id === expr.id
              return (
                <button
                  key={expr.id}
                  onClick={() => setSelectedExpression(expr)}
                  className={`p-2.5 min-h-[52px] rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 select-none ${
                    isActive
                      ? "bg-surface-3 border border-fg text-fg"
                      : "bg-surface-2 border border-border hover:border-border-mid hover:bg-surface-3"
                  }`}
                  title={`${expr.name} - ${expr.scenario}`}
                >
                  <img
                    src={expr.src}
                    alt={expr.name}
                    className={`w-9 h-9 object-contain select-none transition-all duration-150 ${
                      isActive ? "filter-none scale-105" : "grayscale opacity-70 hover:grayscale-0 hover:opacity-100"
                    }`}
                  />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-dim truncate max-w-full">
                    {expr.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Trivia Cards in card-base with solid white numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRIVIA_FACTS.map((fact, idx) => (
            <div key={idx} className="card-base p-6">
              <div className="font-mono text-3xl font-bold text-fg mb-2">
                {fact.number}
              </div>
              <div className="font-mono text-xs tracking-widest uppercase text-muted mb-3">
                {fact.label}
              </div>
              <p className="font-body text-sm text-muted leading-relaxed">
                {fact.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
