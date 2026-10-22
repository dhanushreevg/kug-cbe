import { useState } from "react"

const EMOTIONS = [
  {
    id: "floating",
    name: "Floating",
    category: "Animation",
    src: "/assets/kotlin_mascot_2/Digital/Emoji/kodee-floating.gif",
    isGif: true,
    tag: "Multiplatform",
    quote: "Floating across platforms effortlessly — iOS, Android, Desktop, and Web with Kotlin Multiplatform!",
  },
  {
    id: "greetings",
    name: "Greetings",
    category: "Animation",
    src: "/assets/kotlin_mascot_2/Digital/Emoji/kodee-greetings.gif",
    isGif: true,
    tag: "Welcome",
    quote: "A big Vanakkam from Coimbatore! Whether you are a student or seasoned dev, you belong here.",
  },
  {
    id: "happy",
    name: "Pure Joy",
    category: "Animation",
    src: "/assets/kotlin_mascot_2/Digital/Emoji/kodee-happy.gif",
    isGif: true,
    tag: "Kotlin 2.0",
    quote: "The K2 compiler is stable and builds are faster than ever. Pure happiness!",
  },
  {
    id: "walking",
    name: "On The Move",
    category: "Animation",
    src: "/assets/kotlin_mascot_2/Digital/Emoji/kodee-walking.gif",
    isGif: true,
    tag: "Journey",
    quote: "Every Kotlin journey starts with a simple `fun main()`. Step by step to production greatness.",
  },
  {
    id: "electrified",
    name: "Electrified",
    category: "Emoji",
    src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-electrified.png",
    isGif: false,
    tag: "Coroutines",
    quote: "Non-blocking, asynchronous, lightning fast — powering through tasks with Kotlin Coroutines!",
  },
  {
    id: "loving",
    name: "In Love",
    category: "Emoji",
    src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-loving.png",
    isGif: false,
    tag: "Community",
    quote: "Kotlin isn't just a language; it's a worldwide community of friendly, collaborative developers.",
  },
  {
    id: "winter",
    name: "Winter Scarf",
    category: "Vector SVG",
    src: "/assets/kotlin_mascot_2/Digital/SVG/Kodee_Assets_Digital_Kodee-winter.svg",
    isGif: false,
    tag: "Special Edition",
    quote: "Even during rainy monsoon or breezy winter evenings in Coimbatore, Kodee stays cozy coding.",
  },
  {
    id: "sharing",
    name: "Sharing",
    category: "Vector SVG",
    src: "/assets/kotlin_mascot_2/Digital/SVG/Kodee_Assets_Digital_Kodee-sharing.svg",
    isGif: false,
    tag: "Open Source",
    quote: "Knowledge grows when shared. Speak at our meetup or contribute to local open source!",
  },
]

const KOTLIN_TIDBITS = [
  "Did you know? JetBrains introduced Kodee in 2023 as the official robotic Kotlin mascot crafted from geometric shapes!",
  "Kotlin 2.0 comes with the brand new K2 compiler, offering up to 2x compilation speedup and unified architecture.",
  "With Kotlin Multiplatform (KMP), you share business logic, networking, and state management while keeping 100% native UI.",
  "Coroutines use cooperative multitasking — suspending functions pause execution without blocking OS threads.",
  "Jetpack Compose is fully declarative, letting you build intuitive Android & Desktop UIs with minimal boilerplate.",
]

export default function KodeeShowcase() {
  const [selectedEmotion, setSelectedEmotion] = useState(EMOTIONS[0])
  const [tidbitIndex, setTidbitIndex] = useState(0)

  const nextTidbit = () => {
    setTidbitIndex((prev) => (prev + 1) % KOTLIN_TIDBITS.length)
  }

  return (
    <section id="kodee" className="py-28 px-6 md:px-12 max-w-7xl mx-auto relative">
      {/* Decorative ambient aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 mascot-glow-intense pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="reveal inline-flex items-center gap-2 text-kotlin-purple font-mono text-sm tracking-widest uppercase bg-kotlin-purple/10 px-4 py-1.5 rounded-full border border-kotlin-purple/20">
          <span className="w-2 h-2 rounded-full bg-kotlin-purple animate-pulse" />
          Official Mascot Playground
        </span>
        <h2 className="reveal text-4xl md:text-6xl font-bold mt-4">
          Meet <span className="kotlin-gradient-text">Kodee</span>
        </h2>
        <p className="reveal text-white/60 mt-4 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          Kodee is the curious, warm, and playful mascot created by JetBrains for the Kotlin ecosystem.
          Click through Kodee’s moods and animations below!
        </p>
      </div>

      {/* Main Interactive Stage */}
      <div className="reveal grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Emotion Selection Grid */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-white/50 uppercase tracking-widest">
              Choose an emotion / state:
            </span>
            <span className="text-xs font-mono text-kotlin-light">
              {EMOTIONS.length} Expressions
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {EMOTIONS.map((item) => {
              const isSelected = item.id === selectedEmotion.id
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedEmotion(item)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 group ${
                    isSelected
                      ? "bg-kotlin-purple/25 border-kotlin-purple text-white shadow-lg shadow-kotlin-purple/20 scale-[1.02]"
                      : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <img
                    src={item.src}
                    alt={item.name}
                    className="w-8 h-8 object-contain shrink-0 group-hover:scale-110 transition-transform"
                  />
                  <div className="overflow-hidden">
                    <div className="text-sm font-semibold truncate leading-tight">
                      {item.name}
                    </div>
                    <div className="text-[11px] font-mono text-white/40 truncate">
                      {item.tag}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Mascot Fact Card */}
          <div className="mt-4 glass-card p-5 border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-kotlin-light uppercase tracking-wider flex items-center gap-1.5">
                <span>💡</span>
                <span>Kodee Trivia</span>
              </span>
              <button
                onClick={nextTidbit}
                className="text-xs font-mono text-white/50 hover:text-white transition-colors underline decoration-dotted"
              >
                Next Fact →
              </button>
            </div>
            <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-sans">
              {KOTLIN_TIDBITS[tidbitIndex]}
            </p>
          </div>
        </div>

        {/* Right Column: Hero Stage Preview */}
        <div className="lg:col-span-7 glass-card p-8 md:p-12 flex flex-col items-center justify-between border-kotlin-purple/30 relative overflow-hidden">
          {/* Subtle water-like glow background inside preview */}
          <div className="absolute inset-0 bg-gradient-to-b from-kotlin-purple/15 via-transparent to-kotlin-purple/5 pointer-events-none" />

          {/* Top category badges */}
          <div className="relative z-10 w-full flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-kotlin-purple/20 text-kotlin-purple border border-kotlin-purple/30 px-3 py-1 rounded-full uppercase tracking-wider">
                {selectedEmotion.category}
              </span>
              <span className="text-xs font-mono text-white/40">
                • {selectedEmotion.tag}
              </span>
            </div>
            <span className="text-xs font-mono text-kotlin-coral font-medium">
              KUG CBE Companion
            </span>
          </div>

          {/* Center Mascot Image with Dynamic Animation */}
          <div className="relative z-10 my-8 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 mascot-glow rounded-full scale-110 pointer-events-none -z-10 animate-pulse-glow" />
              <img
                key={selectedEmotion.id}
                src={selectedEmotion.src}
                alt={selectedEmotion.name}
                className={`w-64 h-64 md:w-72 md:h-72 object-contain drop-shadow-[0_25px_35px_rgba(127,82,255,0.45)] transition-all duration-300 ${
                  selectedEmotion.isGif ? "" : "animate-float"
                }`}
              />
            </div>
            <span className="mt-4 text-xs font-mono text-white/40 tracking-wider">
              {selectedEmotion.name} Edition
            </span>
          </div>

          {/* Dynamic Quote & Community Context */}
          <div className="relative z-10 w-full glass rounded-2xl p-5 border-kotlin-purple/25 text-center">
            <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed italic">
              "{selectedEmotion.quote}"
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs font-mono text-white/45">
              <span>Coimbatore Kotlin User Group</span>
              <span>•</span>
              <a
                href="https://surveys.jetbrains.com/s3/submit-a-local-kotlin-user-group"
                target="_blank"
                rel="noopener noreferrer"
                className="text-kotlin-purple hover:text-kotlin-light transition-colors underline"
              >
                Join with Kodee →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
