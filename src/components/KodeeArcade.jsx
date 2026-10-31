import { useState, useEffect } from "react"
import KodeeGif, { KODEE_GIFS, KODEE_FRAMES } from "@/components/KodeeGif"
import SectionHeader from "@/components/SectionHeader"

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

/* Kodee reactions + game feedback assets */
const KODEE_QUIZ = {
  pleased: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-pleased.png",
  excited: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-excited.png",
  electrified: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-electrified.png",
  frightened: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-frightened.png",
  brokenHearted: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-broken-hearted.png",
  sad: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-sad.png",
}
const KODEE_JUMPING = "/assets/kotlin_mascot_2/Digital/PNG/Kodee-jumping-96.png"

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
  const [justMatched, setJustMatched] = useState(null) // id → pop kodee-jumping

  const startMemoryGame = () => {
    const deck = [...MEMORY_MASCOTS, ...MEMORY_MASCOTS]
      .sort(() => Math.random() - 0.5)
      .map((item, idx) => ({ ...item, instanceId: `${item.id}-${idx}` }))

    setCards(deck)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setTimer(0)
    setGameStarted(true)
    setMemoryWon(false)
    setJustMatched(null)
  }

  useEffect(() => {
    startMemoryGame()
  }, [])

  useEffect(() => {
    let interval = null
    if (gameStarted && !memoryWon) {
      interval = setInterval(() => {
        setTimer((t) => t + 1)
      }, 1000)
    }
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
        // Matched — jump feedback flashes on the pair once per match
        const newMatched = [...matched, first.id]
        setMatched(newMatched)
        setFlipped([])
        setJustMatched(first.id)
        window.setTimeout(() => setJustMatched((current) => (current === first.id ? null : current)), 1100)
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
  const [correctCount, setCorrectCount] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [quizMascot, setQuizMascot] = useState(KODEE_QUIZ.pleased)

  const handleAnswer = (optionIdx) => {
    if (isAnswerChecked) return
    setSelectedOption(optionIdx)
    setIsAnswerChecked(true)

    const correct = optionIdx === QUIZ_QUESTIONS[currentQ].answer
    if (correct) {
      const nextStreak = streak + 1
      const points = 100 + nextStreak * 25
      setScore((s) => s + points)
      setCorrectCount((c) => c + 1)
      setStreak(nextStreak)
      if (nextStreak >= 3) {
        setQuizMascot(KODEE_QUIZ.electrified)
      } else {
        setQuizMascot(KODEE_QUIZ.excited)
      }
    } else {
      // Wrong answer: a broken streak over 2 gives the heartbroken Kodee,
      // otherwise the frightened one.
      setStreak(0)
      setQuizMascot(streak >= 2 ? KODEE_QUIZ.brokenHearted : KODEE_QUIZ.frightened)
    }
  }

  const handleNextQuestion = () => {
    if (currentQ + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQ((q) => q + 1)
      setSelectedOption(null)
      setIsAnswerChecked(false)
      setQuizMascot(KODEE_QUIZ.pleased)
    } else {
      setQuizFinished(true)
    }
  }

  const restartQuiz = () => {
    setCurrentQ(0)
    setScore(0)
    setStreak(0)
    setCorrectCount(0)
    setQuizFinished(false)
    setSelectedOption(null)
    setIsAnswerChecked(false)
    setQuizMascot(KODEE_QUIZ.pleased)
  }

  /* Final-result mascot: 4–5 correct answers out of 6 earn kodee-happy.gif;
     a perfect run keeps the electrified Kodee, ≤3 stays crestfallen. */
  const finalQuizMascot =
    correctCount >= QUIZ_QUESTIONS.length
      ? KODEE_QUIZ.electrified
      : correctCount >= 4
      ? "HAPPY_GIF"
      : KODEE_QUIZ.sad

  return (
    <section
      id="arcade"
      className="max-w-7xl mx-auto bg-void px-5 sm:px-10 lg:px-16 py-[clamp(4rem,8vw,8rem)]"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="min-w-0">
          <SectionHeader
            num="03"
            label="Developer Playground"
            title="Kodee Arcade & Challenges"
          />
          <p className="font-body text-muted text-base max-w-xl leading-relaxed mt-1">
            Test your memory and technical Kotlin reflexes. Powered by the official Kodee emoji expression library.
          </p>
        </div>

        {/* Game Mode Switcher — 44px on touch via .tap-44 */}
        <div className="flex w-full items-center gap-2 bg-surface-2 p-1.5 border border-border rounded-xl self-start sm:w-auto md:self-auto md:shrink-0">
          <button
            onClick={() => setActiveTab("memory")}
            aria-pressed={activeTab === "memory"}
            className={`tap-44 flex-1 justify-center whitespace-nowrap font-mono text-[11px] sm:text-xs uppercase px-2 sm:px-4 py-2 rounded-lg transition-all duration-150 select-none ${
              activeTab === "memory"
                ? "bg-surface-4 text-fg font-semibold"
                : "text-muted hover:text-fg"
            }`}
          >
            [01] Memory Matrix
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            aria-pressed={activeTab === "quiz"}
            className={`tap-44 flex-1 justify-center whitespace-nowrap font-mono text-[11px] sm:text-xs uppercase px-2 sm:px-4 py-2 rounded-lg transition-all duration-150 select-none ${
              activeTab === "quiz"
                ? "bg-surface-4 text-fg font-semibold"
                : "text-muted hover:text-fg"
            }`}
          >
            [02] Syntax Sprint
          </button>
        </div>
      </div>

      {/* ── Mode 1: Memory Matrix ── */}
      {activeTab === "memory" && (
        <div className="bg-surface border border-border rounded-xl p-6 sm:p-10">
          {/* Monospace HUD Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6 mb-8">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono text-sm">
              <div>
                <span className="text-dim uppercase text-xs block">Timer</span>
                <span className="text-fg font-bold tabular-nums">
                  {String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}
                </span>
              </div>
              <div className="border-l border-border pl-4 sm:pl-6">
                <span className="text-dim uppercase text-xs block">Moves</span>
                <span className="text-fg font-bold tabular-nums">{moves}</span>
              </div>
              <div className="border-l border-border pl-4 sm:pl-6">
                <span className="text-dim uppercase text-xs block">Matches</span>
                <span className="text-fg font-bold tabular-nums">
                  {matched.length} / {MEMORY_MASCOTS.length}
                </span>
              </div>
            </div>

            <button
              onClick={startMemoryGame}
              className="tap-44 px-5 py-2.5 rounded-xl font-mono text-xs uppercase text-body hover:text-fg bg-surface-2 hover:bg-surface-3 border border-border active:scale-95 transition-all select-none"
            >
              Reset Matrix
            </button>
          </div>

          {/* Victory Modal Overlay — kodee-happy.gif revealed once per win */}
          {memoryWon ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="win-reveal">
                <KodeeGif
                  gif={KODEE_GIFS.happy}
                  frame={KODEE_FRAMES.excited}
                  alt="Kodee happy about the completed memory matrix"
                  eager
                  className="w-24 h-24 object-contain mb-4"
                />
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-muted mb-2">
                Compilation Succeeded
              </span>
              <h3 className="font-display text-3xl font-bold text-fg mb-2">
                All Memory Segments Paired!
              </h3>
              <p className="font-body text-muted text-sm max-w-md mb-6 leading-relaxed">
                Completed in {timer} seconds with {moves} moves. Zero memory leaks detected!
              </p>
              <button
                onClick={startMemoryGame}
                className="tap-44 px-7 py-3 rounded-xl font-body font-medium text-sm text-ink bg-fg hover:bg-fg-hover transition-all duration-150 active:scale-95 select-none"
              >
                Play Again
              </button>
            </div>
          ) : (
            /* Cards Grid: 12 cards with 12px radius, solid backgrounds */
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {cards.map((card, idx) => {
                const isFlipped = flipped.includes(idx) || matched.includes(card.id)
                const isMatched = matched.includes(card.id)

                return (
                  <div
                    key={card.instanceId}
                    onClick={() => handleCardClick(idx)}
                    className={`group h-32 sm:h-36 rounded-xl p-2 sm:p-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 select-none ${
                      isMatched
                        ? "bg-surface-3 border border-fg"
                        : isFlipped
                        ? "bg-surface-2 border border-border-strong"
                        : "bg-surface-2 border border-border hover:border-border-mid hover:bg-surface-3"
                    }`}
                  >
                    {isFlipped ? (
                      <div className="relative flex flex-col items-center justify-center gap-2">
                        <img
                          src={card.src}
                          alt={card.name}
                          className="w-11 h-11 sm:w-14 sm:h-14 object-contain select-none"
                        />
                        {/* Match feedback: kodee-jumping pops once per match */}
                        {isMatched && justMatched === card.id && (
                          <img
                            src={KODEE_JUMPING}
                            alt=""
                            aria-hidden="true"
                            className="match-pop absolute -right-3 -top-3 h-8 w-8 object-contain z-10 select-none"
                          />
                        )}
                        <span className="font-mono text-[11px] uppercase tracking-wider text-body font-semibold">
                          {card.name}
                        </span>
                      </div>
                    ) : (
                      /* Face-down cards: dimmed by ink colour, never by opacity
                         (an opacity wrapper failed WCAG AA ≥4.5:1). Both the
                         glyph and the number sit at text-dim, which clears 4.5:1
                         on every themed surface. The hover hint is a scale on
                         the glyph instead of a fade. */
                      <div className="flex flex-col items-center justify-center gap-1.5 text-dim">
                        <svg
                          className="w-6 h-6 transition-transform duration-150 group-hover:scale-110"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path d="M24 24H0V0h24L12 12Z" fill="currentColor" />
                        </svg>
                        <span className="font-mono text-[11px] uppercase tracking-widest text-dim">
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
        <div className="bg-surface border border-border rounded-xl p-6 sm:p-10">
          {quizFinished ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              {finalQuizMascot === "HAPPY_GIF" ? (
                <div className="win-reveal">
                  <KodeeGif
                    gif={KODEE_GIFS.happy}
                    frame={KODEE_FRAMES.excited}
                    alt="Kodee is happy with the quiz score"
                    eager
                    className="w-28 h-28 object-contain mb-4"
                  />
                </div>
              ) : (
                <img
                  src={finalQuizMascot}
                  alt={correctCount >= QUIZ_QUESTIONS.length ? "Kodee electrified — perfect score" : "Kodee crestfallen after the quiz"}
                  className="w-28 h-28 object-contain mb-4 select-none"
                />
              )}
              <span className="font-mono text-xs uppercase tracking-widest text-muted mb-1">
                Challenge Complete
              </span>
              <h3 className="font-display text-3xl font-bold text-fg mb-2">
                Final Score: <span className="text-fg">{score} XP</span>
              </h3>
              <p className="font-body text-muted text-sm max-w-md mb-8 leading-relaxed">
                {correctCount}/{QUIZ_QUESTIONS.length} correct.{" "}
                {correctCount >= QUIZ_QUESTIONS.length
                  ? "Rank: Senior Kotlin Architect. Flawless syntax mastery!"
                  : score >= 400
                  ? "Rank: Certified Coroutines Specialist. Solid engineering base!"
                  : "Rank: Kotlin Apprentice. Join our Coimbatore meetups to level up!"}
              </p>
              <button
                onClick={restartQuiz}
                className="tap-44 px-7 py-3 rounded-xl font-body font-medium text-sm text-ink bg-fg hover:bg-fg-hover transition-all duration-150 active:scale-95 select-none"
              >
                Restart Sprint
              </button>
            </div>
          ) : (
            <div>
              {/* Header HUD */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5 mb-8">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono text-xs">
                  <div>
                    <span className="text-dim uppercase block">Question</span>
                    <span className="text-fg font-bold">
                      {String(currentQ + 1).padStart(2, "0")} / {String(QUIZ_QUESTIONS.length).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="border-l border-border pl-4 sm:pl-6">
                    <span className="text-dim uppercase block">Score</span>
                    <span className="text-fg font-bold tabular-nums">{score} XP</span>
                  </div>
                  <div className="border-l border-border pl-4 sm:pl-6">
                    <span className="text-dim uppercase block">Streak</span>
                    <span className="text-fg font-bold tabular-nums">x{streak}</span>
                  </div>
                </div>

                {/* Live Kodee Reaction Badge */}
                <div className="flex shrink-0 items-center gap-2.5 bg-surface-2 px-3 py-1.5 border border-border rounded-xl">
                  <img
                    src={quizMascot}
                    alt="Kodee Mood"
                    className="w-7 h-7 object-contain select-none"
                  />
                  <span className="font-mono text-[11px] uppercase text-muted">
                    {streak >= 3 ? ">> Overclocked" : "Kodee Live"}
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-8">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-fg leading-snug">
                  {QUIZ_QUESTIONS[currentQ].q}
                </h3>
              </div>

              {/* Options Grid — answer feedback is colour PLUS glyph PLUS
                  text, never colour alone (✓ on the correct option, ✕ on the
                  picked wrong one). */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {QUIZ_QUESTIONS[currentQ].options.map((opt, i) => {
                  let optStyle = "bg-surface-2 border-border hover:border-border-strong hover:bg-surface-3 text-body"
                  let feedbackGlyph = null
                  if (isAnswerChecked) {
                    if (i === QUIZ_QUESTIONS[currentQ].answer) {
                      optStyle = "bg-correct-bg border-correct-line text-correct-text font-semibold"
                      feedbackGlyph = "✓"
                    } else if (i === selectedOption) {
                      optStyle = "bg-wrong-bg border-wrong-line text-wrong-text"
                      feedbackGlyph = "✕"
                    } else {
                      optStyle = "bg-surface-2 border-border text-dim opacity-60"
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswerChecked}
                      onClick={() => handleAnswer(i)}
                      aria-label={
                        isAnswerChecked && feedbackGlyph
                          ? `${feedbackGlyph === "✓" ? "Correct answer" : "Wrong answer"}: ${opt}`
                          : undefined
                      }
                      className={`min-h-[44px] p-4 border rounded-xl font-mono text-sm text-left transition-all duration-150 flex items-center justify-between select-none ${optStyle}`}
                    >
                      <span>
                        {feedbackGlyph && (
                          <span
                            aria-hidden="true"
                            className="font-bold mr-2"
                          >
                            {feedbackGlyph}
                          </span>
                        )}
                        {opt}
                      </span>
                      {feedbackGlyph ? (
                        <span className="font-mono text-xs font-bold">
                          {feedbackGlyph}
                        </span>
                      ) : (
                        <span className="font-mono text-xs text-dim">[{String.fromCharCode(65 + i)}]</span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Answer status: icon + words, not just a colour change. Also
                  an aria-live region so the outcome is announced. */}
              {isAnswerChecked && (
                <p
                  role="status"
                  className={`mb-6 font-mono text-xs uppercase tracking-[0.14em] ${
                    selectedOption === QUIZ_QUESTIONS[currentQ].answer
                      ? "text-correct-text"
                      : "text-wrong-text"
                  }`}
                >
                  {selectedOption === QUIZ_QUESTIONS[currentQ].answer
                    ? "✓ Correct — one for the streak."
                    : "✕ Not quite — read the insight below."}
                </p>
              )}

              {/* Tip & Next button */}
              {isAnswerChecked && (
                <div className="border-t border-border pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="font-body text-xs text-muted leading-relaxed max-w-lg">
                    <span className="text-fg font-medium">Insight:</span> {QUIZ_QUESTIONS[currentQ].tip}
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="tap-44 px-6 py-2.5 rounded-xl font-body font-medium text-xs uppercase tracking-wider text-ink bg-fg hover:bg-fg-hover transition-all duration-150 active:scale-95 select-none shrink-0"
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
