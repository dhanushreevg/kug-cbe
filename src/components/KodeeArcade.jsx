import { useState, useEffect } from "react"

const MEMORY_MASCOTS = [
  { id: "electrified", name: "Electrified", src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-electrified.png" },
  { id: "excited", name: "Excited", src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-excited.png" },
  { id: "loving", name: "Loving", src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-loving.png" },
  { id: "welcoming", name: "Welcoming", src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-welcoming.png" },
  { id: "pleased", name: "Pleased", src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-pleased.png" },
  { id: "shocked", name: "Shocked", src: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-shocked.png" },
]

const QUIZ_QUESTIONS = [
  {
    q: "Which keyword is used to declare a read-only (immutable) variable in Kotlin?",
    options: ["var", "val", "const", "let"],
    answer: 1,
    tip: "val is immutable reference assignment — use it by default for cleaner, safer state.",
  },
  {
    q: "What is the name of the new high-performance compiler frontend shipped in Kotlin 2.0?",
    options: ["Kotlinc-Next", "K2", "ART", "TurboKotlin"],
    answer: 1,
    tip: "The K2 compiler unifies compiler pipelines and speeds up compilation by up to 2x.",
  },
  {
    q: "Which operator performs a safe-call on a nullable reference without risking an NPE?",
    options: ["!!", "?.", "?:", "as?"],
    answer: 1,
    tip: "?. executes the call only if the target is non-null, otherwise evaluates to null.",
  },
  {
    q: "What modifier marks a function that can pause execution without blocking an OS thread?",
    options: ["async", "defer", "suspend", "yield"],
    answer: 2,
    tip: "suspend fun allows coroutine execution to pause non-blockingly during I/O.",
  },
  {
    q: "What primary class type automatically generates equals(), hashCode(), and copy() functions?",
    options: ["enum class", "sealed class", "data class", "value class"],
    answer: 2,
    tip: "data class generates value-based equality and immutability utilities out-of-the-box.",
  },
  {
    q: "What operator is affectionately referred to as the 'Elvis operator' in Kotlin?",
    options: ["?:", "??", "||", "::"],
    answer: 0,
    tip: "?: provides a fallback default value if the left-hand expression is null.",
  },
]

export default function KodeeArcade() {
  const [activeTab, setActiveTab] = useState("memory") // "memory" | "quiz"

  // ── Mode 1: Memory Matrix State ──
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [timer, setTimer] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [memoryWon, setMemoryWon] = useState(false)

  // Initialize Memory Game
  const startMemoryGame = () => {
    const deck = [...MEMORY_MASCOTS, ...MEMORY_MASCOTS]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        instanceId: index,
        ...item,
      }))
    setCards(deck)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setTimer(0)
    setGameStarted(true)
    setMemoryWon(false)
  }

  useEffect(() => {
    startMemoryGame()
  }, [])

  // Memory Timer
  useEffect(() => {
    if (!gameStarted || memoryWon) return
    const interval = setInterval(() => {
      setTimer((t) => t + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [gameStarted, memoryWon])

  // Card click handler
  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(cards[index].id)) {
      return
    }

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1)
      const first = cards[newFlipped[0]]
      const second = cards[newFlipped[1]]

      if (first.id === second.id) {
        // Matched
        const newMatched = [...matched, first.id]
        setMatched(newMatched)
        setFlipped([])
        if (newMatched.length === MEMORY_MASCOTS.length) {
          setMemoryWon(true)
        }
      } else {
        // Not a match: flip back after short delay
        setTimeout(() => {
          setFlipped([])
        }, 750)
      }
    }
  }

  // ── Mode 2: Syntax Sprint State ──
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [quizMascot, setQuizMascot] = useState("/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-pleased.png")

  const handleAnswer = (optionIdx) => {
    if (isAnswerChecked) return
    setSelectedOption(optionIdx)
    setIsAnswerChecked(true)

    const correct = optionIdx === QUIZ_QUESTIONS[currentQ].answer
    if (correct) {
      const nextStreak = streak + 1
      const points = 100 + nextStreak * 25
      setScore((s) => s + points)
      setStreak(nextStreak)
      if (nextStreak >= 3) {
        setQuizMascot("/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-electrified.png")
      } else {
        setQuizMascot("/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-excited.png")
      }
    } else {
      setStreak(0)
      setQuizMascot("/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-shocked.png")
    }
  }

  const handleNextQuestion = () => {
    if (currentQ + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQ((q) => q + 1)
      setSelectedOption(null)
      setIsAnswerChecked(false)
      setQuizMascot("/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-pleased.png")
    } else {
      setQuizFinished(true)
      setQuizMascot("/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-loving.png")
    }
  }

  const restartQuiz = () => {
    setCurrentQ(0)
    setScore(0)
    setStreak(0)
    setQuizFinished(false)
    setSelectedOption(null)
    setIsAnswerChecked(false)
    setQuizMascot("/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-pleased.png")
  }

  return (
    <section id="arcade" className="py-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto bg-void">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="section-label">Developer Playground</div>
          <h2 className="section-heading font-display font-bold text-white text-[clamp(1.8rem,4vw,3rem)] leading-none tracking-[-0.03em] mb-4">
            Kodee <span className="gradient-text">Arcade</span> &amp; Challenges
          </h2>
          <p className="font-body text-text-muted text-base max-w-xl leading-relaxed">
            Test your memory and technical Kotlin reflexes. Powered by the official Kodee emoji expression library.
          </p>
        </div>

        {/* Game Mode Switcher */}
        <div className="flex items-center gap-2 bg-surface p-1.5 border border-border rounded-sm self-start md:self-auto">
          <button
            onClick={() => setActiveTab("memory")}
            className={`font-mono text-xs uppercase px-4 py-2 rounded-sm transition-all duration-150 select-none ${
              activeTab === "memory"
                ? "bg-surface-3 text-white border-b-2 border-kotlin-pink font-semibold"
                : "text-text-muted hover:text-white"
            }`}
          >
            [01] Memory Matrix
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`font-mono text-xs uppercase px-4 py-2 rounded-sm transition-all duration-150 select-none ${
              activeTab === "quiz"
                ? "bg-surface-3 text-white border-b-2 border-kotlin-indigo font-semibold"
                : "text-text-muted hover:text-white"
            }`}
          >
            [02] Syntax Sprint
          </button>
        </div>
      </div>

      {/* ── Mode 1: Memory Matrix ── */}
      {activeTab === "memory" && (
        <div className="card-base p-6 sm:p-10">
          {/* Monospace HUD Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6 mb-8">
            <div className="flex items-center gap-6 font-mono text-sm">
              <div>
                <span className="text-text-dim uppercase text-xs block">Timer</span>
                <span className="text-white font-bold tabular-nums">
                  {String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}
                </span>
              </div>
              <div className="border-l border-border pl-6">
                <span className="text-text-dim uppercase text-xs block">Moves</span>
                <span className="text-white font-bold tabular-nums">{moves}</span>
              </div>
              <div className="border-l border-border pl-6">
                <span className="text-text-dim uppercase text-xs block">Matches</span>
                <span className="text-kotlin-pink font-bold tabular-nums">
                  {matched.length} / {MEMORY_MASCOTS.length}
                </span>
              </div>
            </div>

            <button
              onClick={startMemoryGame}
              className="gradient-border px-5 py-2.5 rounded-sm font-mono text-xs uppercase text-text-body bg-surface hover:bg-surface-2 hover:text-white active:scale-95 transition-all select-none"
            >
              Reset Matrix
            </button>
          </div>

          {/* Victory Modal Overlay */}
          {memoryWon ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <img
                src="/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-excited.png"
                alt="Kodee Excited"
                className="w-24 h-24 object-contain mb-4 select-none"
              />
              <span className="font-mono text-xs uppercase tracking-widest text-kotlin-pink mb-2">
                Compilation Succeeded
              </span>
              <h3 className="font-display text-3xl font-bold text-white mb-2">
                All Memory Segments Paired!
              </h3>
              <p className="font-body text-text-muted text-sm max-w-md mb-6 leading-relaxed">
                Completed in {timer} seconds with {moves} moves. Zero memory leaks detected!
              </p>
              <button
                onClick={startMemoryGame}
                className="relative px-7 py-3 rounded-sm font-body font-medium text-sm text-white bg-gradient-kotlin transition-all duration-200 hover:brightness-110 active:scale-95 select-none"
              >
                Play Again
              </button>
            </div>
          ) : (
            /* Cards Grid: 12 cards (4 cols on desktop, 3 cols on mobile) */
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {cards.map((card, idx) => {
                const isFlipped = flipped.includes(idx) || matched.includes(card.id)
                const isMatched = matched.includes(card.id)

                return (
                  <div
                    key={card.instanceId}
                    onClick={() => handleCardClick(idx)}
                    className={`h-32 sm:h-36 rounded-sm p-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 select-none ${
                      isMatched
                        ? "bg-surface-3 border-2 border-kotlin-indigo/60 shadow-kotlin-sm"
                        : isFlipped
                        ? "bg-surface-2 border border-border-strong"
                        : "bg-surface border border-border hover:border-border-mid hover:bg-surface-2"
                    }`}
                  >
                    {isFlipped ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <img
                          src={card.src}
                          alt={card.name}
                          className="w-14 h-14 object-contain select-none"
                        />
                        <span className="font-mono text-[10px] uppercase tracking-wider text-text-body font-semibold">
                          {card.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1.5 opacity-40 hover:opacity-80 transition-opacity">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                          <path d="M24 24H0V0h24L12 12Z" fill="#7F52FF" />
                        </svg>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-text-dim">
                          #{String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Mode 2: Syntax Sprint Quiz ── */}
      {activeTab === "quiz" && (
        <div className="card-base p-6 sm:p-10">
          {quizFinished ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <img
                src={quizMascot}
                alt="Quiz Result"
                className="w-28 h-28 object-contain mb-4 select-none"
              />
              <span className="font-mono text-xs uppercase tracking-widest text-kotlin-pink mb-1">
                Challenge Complete
              </span>
              <h3 className="font-display text-3xl font-bold text-white mb-2">
                Final Score: <span className="gradient-text">{score} XP</span>
              </h3>
              <p className="font-body text-text-muted text-sm max-w-md mb-8 leading-relaxed">
                {score >= 600
                  ? "Rank: Senior Kotlin Architect. Flawless syntax mastery!"
                  : score >= 400
                  ? "Rank: Certified Coroutines Specialist. Solid engineering base!"
                  : "Rank: Kotlin Apprentice. Join our Coimbatore meetups to level up!"}
              </p>
              <button
                onClick={restartQuiz}
                className="relative px-7 py-3 rounded-sm font-body font-medium text-sm text-white bg-gradient-kotlin transition-all duration-200 hover:brightness-110 active:scale-95 select-none"
              >
                Restart Sprint
              </button>
            </div>
          ) : (
            <div>
              {/* Header HUD */}
              <div className="flex items-center justify-between border-b border-border pb-5 mb-8">
                <div className="flex items-center gap-6 font-mono text-xs">
                  <div>
                    <span className="text-text-dim uppercase block">Question</span>
                    <span className="text-white font-bold">
                      {String(currentQ + 1).padStart(2, "0")} / {String(QUIZ_QUESTIONS.length).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="border-l border-border pl-6">
                    <span className="text-text-dim uppercase block">Score</span>
                    <span className="text-kotlin-pink font-bold tabular-nums">{score} XP</span>
                  </div>
                  <div className="border-l border-border pl-6">
                    <span className="text-text-dim uppercase block">Streak</span>
                    <span className="text-kotlin-indigo font-bold tabular-nums">x{streak}</span>
                  </div>
                </div>

                {/* Live Kodee Reaction Badge */}
                <div className="flex items-center gap-2.5 bg-surface-2 px-3 py-1.5 border border-border rounded-sm">
                  <img
                    src={quizMascot}
                    alt="Kodee Mood"
                    className="w-7 h-7 object-contain select-none"
                  />
                  <span className="font-mono text-[10px] uppercase text-text-muted">
                    {streak >= 3 ? "⚡ Overclocked" : "Kodee Live"}
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-8">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
                  {QUIZ_QUESTIONS[currentQ].q}
                </h3>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {QUIZ_QUESTIONS[currentQ].options.map((opt, i) => {
                  let optStyle = "bg-surface border-border hover:border-border-mid hover:bg-surface-2 text-text-body"
                  if (isAnswerChecked) {
                    if (i === QUIZ_QUESTIONS[currentQ].answer) {
                      optStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-300 font-semibold"
                    } else if (i === selectedOption) {
                      optStyle = "bg-rose-950/40 border-rose-500 text-rose-300"
                    } else {
                      optStyle = "bg-surface border-border text-text-dim opacity-50"
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswerChecked}
                      onClick={() => handleAnswer(i)}
                      className={`p-4 border rounded-sm font-mono text-sm text-left transition-all duration-150 flex items-center justify-between select-none ${optStyle}`}
                    >
                      <span>{opt}</span>
                      <span className="font-mono text-xs text-text-dim">[{String.fromCharCode(65 + i)}]</span>
                    </button>
                  )
                })}
              </div>

              {/* Tip & Next button */}
              {isAnswerChecked && (
                <div className="border-t border-border pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="font-body text-xs text-text-muted leading-relaxed max-w-lg">
                    💡 <span className="text-white font-medium">Insight:</span> {QUIZ_QUESTIONS[currentQ].tip}
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="relative px-6 py-2.5 rounded-sm font-body font-medium text-xs uppercase tracking-wider text-white bg-gradient-kotlin transition-all duration-200 hover:brightness-110 active:scale-95 select-none shrink-0"
                  >
                    Next Question &rarr;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
