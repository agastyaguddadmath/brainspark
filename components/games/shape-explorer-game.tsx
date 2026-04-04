"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Game } from "@/lib/game-data"
import { CheckCircle2, XCircle, Sparkles, RotateCcw } from "lucide-react"

interface ShapeExplorerGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

interface Shape {
  name: string
  sides: number
  svg: React.ReactNode
  color: string
  facts: string[]
}

const shapes: Shape[] = [
  {
    name: "Circle",
    sides: 0,
    color: "#ef4444",
    svg: <circle cx="50" cy="50" r="40" fill="currentColor" />,
    facts: ["A circle has no corners!", "Wheels are shaped like circles."]
  },
  {
    name: "Triangle",
    sides: 3,
    color: "#f59e0b",
    svg: <polygon points="50,10 90,90 10,90" fill="currentColor" />,
    facts: ["Triangles have 3 sides and 3 corners!", "Pizza slices are triangles."]
  },
  {
    name: "Square",
    sides: 4,
    color: "#22c55e",
    svg: <rect x="15" y="15" width="70" height="70" fill="currentColor" />,
    facts: ["All 4 sides of a square are equal!", "Windows are often squares."]
  },
  {
    name: "Rectangle",
    sides: 4,
    color: "#3b82f6",
    svg: <rect x="10" y="25" width="80" height="50" fill="currentColor" />,
    facts: ["Rectangles have 2 long sides and 2 short sides!", "Doors are rectangles."]
  },
  {
    name: "Pentagon",
    sides: 5,
    color: "#8b5cf6",
    svg: <polygon points="50,10 95,38 80,90 20,90 5,38" fill="currentColor" />,
    facts: ["Pentagons have 5 sides!", "A famous building in the USA is called the Pentagon."]
  },
  {
    name: "Hexagon",
    sides: 6,
    color: "#ec4899",
    svg: <polygon points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5" fill="currentColor" />,
    facts: ["Hexagons have 6 sides!", "Honeycomb cells are hexagons."]
  },
  {
    name: "Octagon",
    sides: 8,
    color: "#14b8a6",
    svg: <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="currentColor" />,
    facts: ["Octagons have 8 sides!", "Stop signs are octagons."]
  },
  {
    name: "Star",
    sides: 10,
    color: "#eab308",
    svg: <polygon points="50,5 61,35 95,35 68,57 79,90 50,70 21,90 32,57 5,35 39,35" fill="currentColor" />,
    facts: ["Stars have 5 points!", "Stars twinkle in the night sky."]
  },
]

type QuestionType = "identify" | "sides" | "compare"

interface Question {
  type: QuestionType
  question: string
  shape: Shape
  options: string[]
  correct: number
}

function generateQuestions(): Question[] {
  const questions: Question[] = []
  const shuffledShapes = [...shapes].sort(() => Math.random() - 0.5)
  
  for (let i = 0; i < 8; i++) {
    const shape = shuffledShapes[i % shuffledShapes.length]
    const questionType: QuestionType = ["identify", "sides", "compare"][i % 3] as QuestionType
    
    if (questionType === "identify") {
      const wrongOptions = shapes
        .filter(s => s.name !== shape.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(s => s.name)
      const options = [...wrongOptions, shape.name].sort(() => Math.random() - 0.5)
      questions.push({
        type: "identify",
        question: "What shape is this?",
        shape,
        options,
        correct: options.indexOf(shape.name)
      })
    } else if (questionType === "sides") {
      const sideOptions = shape.sides === 0 
        ? ["0 (no sides)", "1", "2", "3"]
        : [shape.sides.toString(), (shape.sides + 1).toString(), (shape.sides - 1).toString(), (shape.sides + 2).toString()]
      const correctAnswer = shape.sides === 0 ? "0 (no sides)" : shape.sides.toString()
      const options = sideOptions.sort(() => Math.random() - 0.5)
      questions.push({
        type: "sides",
        question: `How many sides does a ${shape.name} have?`,
        shape,
        options,
        correct: options.indexOf(correctAnswer)
      })
    } else {
      const otherShape = shapes.find(s => s.name !== shape.name && s.sides !== shape.sides)!
      const moreSides = shape.sides > otherShape.sides ? shape.name : otherShape.name
      const options = [shape.name, otherShape.name, "They're equal", "Can't tell"].sort(() => Math.random() - 0.5)
      questions.push({
        type: "compare",
        question: `Which shape has more sides: ${shape.name} or ${otherShape.name}?`,
        shape,
        options,
        correct: options.indexOf(moreSides)
      })
    }
  }
  
  return questions
}

export function ShapeExplorerGame({ game, onComplete }: ShapeExplorerGameProps) {
  const [questions] = useState(() => generateQuestions())
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const [showFact, setShowFact] = useState(false)
  const hasCompletedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const current = questions[currentQ]
  const progress = ((currentQ + 1) / questions.length) * 100

  useEffect(() => {
    if (finished && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      onCompleteRef.current(score, game.maxScore)
    }
  }, [finished, score, game.maxScore])

  const handleAnswer = (index: number) => {
    if (selected !== null) return
    setSelected(index)
    
    if (index === current.correct) {
      setScore(s => s + 12)
    }
    setShowFact(true)
  }

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrentQ(q => q + 1)
      setSelected(null)
      setShowFact(false)
    }
  }

  const resetGame = () => {
    setCurrentQ(0)
    setScore(0)
    setSelected(null)
    setFinished(false)
    setShowFact(false)
    hasCompletedRef.current = false
  }

  if (finished) {
    const percentage = Math.round((score / game.maxScore) * 100)
    return (
      <div className="p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        </motion.div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Shape Master!</h2>
        <p className="text-muted-foreground mb-6">
          You scored {score} out of {game.maxScore} points ({percentage}%)
        </p>
        <Button onClick={resetGame} size="lg" className="gap-2">
          <RotateCcw className="w-4 h-4" /> Play Again
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">
          Question {currentQ + 1} of {questions.length}
        </span>
        <span className="text-sm font-medium text-foreground">Score: {score}</span>
      </div>
      
      <Progress value={progress} className="h-2 mb-6" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          {/* Shape Display */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className="w-32 h-32"
            >
              <svg 
                viewBox="0 0 100 100" 
                className="w-full h-full"
                style={{ color: current.shape.color }}
              >
                {current.shape.svg}
              </svg>
            </motion.div>
          </div>

          <h3 className="text-xl font-semibold text-center text-foreground mb-6">
            {current.question}
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {current.options.map((option, index) => {
              const isCorrect = index === current.correct
              const isSelected = selected === index
              
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: selected === null ? 1.02 : 1 }}
                  whileTap={{ scale: selected === null ? 0.98 : 1 }}
                  onClick={() => handleAnswer(index)}
                  disabled={selected !== null}
                  className={`
                    p-4 rounded-xl border-2 text-left font-medium transition-all
                    ${selected === null 
                      ? "border-border hover:border-primary/50 bg-card hover:bg-accent" 
                      : isSelected && isCorrect
                        ? "border-green-500 bg-green-500/10 text-green-700"
                        : isSelected && !isCorrect
                          ? "border-red-500 bg-red-500/10 text-red-700"
                          : isCorrect
                            ? "border-green-500 bg-green-500/10"
                            : "border-border bg-card opacity-50"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {selected !== null && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    )}
                    {selected !== null && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                    )}
                    <span>{option}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {showFact && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20"
            >
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Fun Fact: </span>
                {current.shape.facts[Math.floor(Math.random() * current.shape.facts.length)]}
              </p>
              <Button onClick={nextQuestion} className="mt-4 w-full">
                {currentQ + 1 >= questions.length ? "See Results" : "Next Question"}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
