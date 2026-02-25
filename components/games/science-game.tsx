"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Trophy, Lightbulb } from "lucide-react"
import type { Game } from "@/lib/game-data"

interface ScienceQuestion {
  question: string
  options: string[]
  correct: number
  fact: string
}

const easyQuestions: ScienceQuestion[] = [
  { question: "Which planet is closest to the Sun?", options: ["Venus", "Mercury", "Earth", "Mars"], correct: 1, fact: "Mercury orbits the Sun in just 88 Earth days!" },
  { question: "What do plants need to grow?", options: ["Water, sunlight, and soil", "Only water", "Only sunlight", "Only air"], correct: 0, fact: "Plants use photosynthesis to convert sunlight into food!" },
  { question: "How many legs does a spider have?", options: ["6", "8", "10", "4"], correct: 1, fact: "Spiders are arachnids, not insects. Insects have 6 legs." },
  { question: "What is the biggest animal on Earth?", options: ["Elephant", "Giraffe", "Blue Whale", "Shark"], correct: 2, fact: "A blue whale's heart is as big as a small car!" },
  { question: "Which of these is NOT a state of matter?", options: ["Solid", "Liquid", "Gas", "Energy"], correct: 3, fact: "The three main states of matter are solid, liquid, and gas." },
  { question: "What gives leaves their green color?", options: ["Water", "Chlorophyll", "Oxygen", "Sunlight"], correct: 1, fact: "Chlorophyll absorbs sunlight to help plants make food." },
  { question: "What is H2O?", options: ["Oxygen", "Carbon Dioxide", "Water", "Hydrogen"], correct: 2, fact: "Water is made of 2 hydrogen atoms and 1 oxygen atom." },
  { question: "Which season comes after summer?", options: ["Spring", "Winter", "Autumn/Fall", "Summer"], correct: 2, fact: "The Earth's tilt causes seasons as it orbits the Sun." },
]

const mediumQuestions: ScienceQuestion[] = [
  { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Membrane"], correct: 1, fact: "Mitochondria produce energy (ATP) for cell functions." },
  { question: "What gas do humans breathe out?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"], correct: 2, fact: "We breathe in O2 and breathe out CO2 as a waste product." },
  { question: "What force keeps us on the ground?", options: ["Friction", "Magnetism", "Gravity", "Inertia"], correct: 2, fact: "Gravity pulls objects toward each other. Earth's gravity is 9.8 m/s." },
  { question: "How many planets are in our solar system?", options: ["7", "8", "9", "10"], correct: 1, fact: "Pluto was reclassified as a dwarf planet in 2006." },
  { question: "What organ pumps blood through your body?", options: ["Brain", "Lungs", "Heart", "Liver"], correct: 2, fact: "Your heart beats about 100,000 times every day!" },
  { question: "What is the hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Quartz"], correct: 2, fact: "Diamonds are made of carbon atoms arranged in a crystal structure." },
  { question: "Which planet is known as the Red Planet?", options: ["Jupiter", "Mars", "Saturn", "Venus"], correct: 1, fact: "Mars appears red because of iron oxide (rust) on its surface." },
  { question: "What do bees collect from flowers?", options: ["Water", "Nectar", "Seeds", "Leaves"], correct: 1, fact: "Bees turn nectar into honey and pollinate 80% of flowering plants." },
]

const hardQuestions: ScienceQuestion[] = [
  { question: "What is the speed of light approximately?", options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "100,000 km/s"], correct: 0, fact: "Light travels at 299,792,458 meters per second in a vacuum." },
  { question: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], correct: 2, fact: "Au comes from the Latin word 'aurum' meaning gold." },
  { question: "What is the pH of pure water?", options: ["5", "7", "9", "0"], correct: 1, fact: "pH 7 is neutral. Below 7 is acidic, above 7 is basic." },
  { question: "Which type of rock is formed from cooled magma?", options: ["Sedimentary", "Metamorphic", "Igneous", "Fossil"], correct: 2, fact: "Igneous comes from the Latin word 'ignis' meaning fire." },
  { question: "What is the smallest unit of life?", options: ["Atom", "Cell", "Molecule", "Organ"], correct: 1, fact: "Cells are the basic building blocks of all living things." },
  { question: "What element makes up most of Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correct: 2, fact: "Nitrogen makes up about 78% of Earth's atmosphere." },
  { question: "What is the process by which liquid becomes gas?", options: ["Condensation", "Evaporation", "Sublimation", "Precipitation"], correct: 1, fact: "Evaporation occurs when molecules gain enough energy to escape." },
  { question: "How many bones are in the adult human body?", options: ["186", "206", "256", "306"], correct: 1, fact: "Babies are born with about 270 bones, some fuse as they grow." },
]

function getQuestions(difficulty: Game["difficulty"]): ScienceQuestion[] {
  const pool = difficulty === "easy" ? easyQuestions : difficulty === "medium" ? mediumQuestions : hardQuestions
  return [...pool].sort(() => Math.random() - 0.5).slice(0, 8)
}

interface ScienceGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

export function ScienceGame({ game, onComplete }: ScienceGameProps) {
  const [questions] = useState(() => getQuestions(game.difficulty))
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const [showFact, setShowFact] = useState(false)

  const handleAnswer = useCallback(
    (index: number) => {
      if (selected !== null) return
      setSelected(index)
      const correct = index === questions[currentQ].correct
      if (correct) setScore((prev) => prev + 12)
      setShowFact(true)

      setTimeout(() => {
        if (currentQ + 1 >= questions.length) {
          setFinished(true)
        } else {
          setCurrentQ((prev) => prev + 1)
          setSelected(null)
          setShowFact(false)
        }
      }, 3000)
    },
    [selected, currentQ, questions]
  )

  useEffect(() => {
    if (finished) onComplete(score, questions.length * 12)
  }, [finished, score, questions.length, onComplete])

  if (finished) {
    const percentage = Math.round((score / (questions.length * 12)) * 100)
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[oklch(0.7_0.18_150/0.1)]">
          <Trophy className="h-10 w-10 text-[oklch(0.7_0.18_150)]" />
        </div>
        <h2 className="mt-6 text-3xl font-bold text-foreground">
          {percentage >= 80 ? "Science Genius!" : percentage >= 50 ? "Great Explorer!" : "Keep Discovering!"}
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          You scored {score} out of {questions.length * 12} points
        </p>
        <div className="mt-6 flex items-center gap-4">
          <div className="rounded-xl bg-secondary p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{percentage}%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
          <div className="rounded-xl bg-secondary p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{score}</div>
            <div className="text-xs text-muted-foreground">Points</div>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[currentQ]

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="outline">{currentQ + 1}/{questions.length}</Badge>
        <span className="text-sm font-medium text-foreground">Score: {score}</span>
      </div>

      <Progress value={((currentQ + 1) / questions.length) * 100} className="h-2" />

      <div className="rounded-2xl border border-border bg-card p-8">
        <p className="text-center text-lg font-semibold leading-relaxed text-foreground">
          {q.question}
        </p>
      </div>

      <div className="grid gap-3">
        {q.options.map((option, i) => {
          let extraClass = ""
          if (selected !== null) {
            if (i === q.correct) extraClass = "border-[oklch(0.7_0.18_150)] bg-[oklch(0.7_0.18_150/0.1)] text-foreground"
            else if (i === selected) extraClass = "border-destructive bg-destructive/10 text-foreground"
          }
          return (
            <Button
              key={i}
              variant="outline"
              className={`h-auto justify-start px-4 py-3 text-left text-sm ${extraClass}`}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
            >
              <span className="mr-3 flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">
                {String.fromCharCode(65 + i)}
              </span>
              {option}
              {selected !== null && i === q.correct && (
                <CheckCircle2 className="ml-auto h-5 w-5 text-[oklch(0.7_0.18_150)]" />
              )}
              {selected === i && i !== q.correct && (
                <XCircle className="ml-auto h-5 w-5 text-destructive" />
              )}
            </Button>
          )
        })}
      </div>

      {showFact && (
        <div className="flex items-start gap-3 rounded-lg bg-[oklch(0.6_0.15_230/0.1)] p-4">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-[oklch(0.6_0.15_230)]" />
          <div>
            <p className="text-xs font-medium text-[oklch(0.6_0.15_230)]">Fun Fact</p>
            <p className="mt-0.5 text-sm text-foreground">{q.fact}</p>
          </div>
        </div>
      )}
    </div>
  )
}
