"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Game } from "@/lib/game-data"
import { Sparkles, RotateCcw, HelpCircle } from "lucide-react"

interface PatternFinderGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

interface Pattern {
  sequence: string[]
  answer: string
  options: string[]
  hint: string
}

const shapePatterns: Pattern[] = [
  { sequence: ["🔴", "🔵", "🔴", "🔵", "🔴"], answer: "🔵", options: ["🔵", "🔴", "🟢", "🟡"], hint: "Red, blue, red, blue..." },
  { sequence: ["🟡", "🟡", "🔴", "🟡", "🟡"], answer: "🔴", options: ["🔴", "🟡", "🔵", "🟢"], hint: "Look for the pattern that repeats" },
  { sequence: ["⭐", "🌙", "⭐", "🌙", "⭐"], answer: "🌙", options: ["🌙", "⭐", "☀️", "🌟"], hint: "Star, moon, star, moon..." },
  { sequence: ["🔷", "🔷", "🔶", "🔷", "🔷"], answer: "🔶", options: ["🔶", "🔷", "🔴", "🔵"], hint: "Two diamonds, then what?" },
]

const numberPatterns: Pattern[] = [
  { sequence: ["1", "2", "3", "4", "5"], answer: "6", options: ["6", "7", "5", "8"], hint: "Count up by 1" },
  { sequence: ["2", "4", "6", "8", "10"], answer: "12", options: ["12", "11", "14", "10"], hint: "Count up by 2" },
  { sequence: ["5", "10", "15", "20", "25"], answer: "30", options: ["30", "35", "25", "40"], hint: "Count up by 5" },
  { sequence: ["1", "1", "2", "2", "3"], answer: "3", options: ["3", "4", "2", "1"], hint: "Each number appears twice" },
]

const emojiPatterns: Pattern[] = [
  { sequence: ["🍎", "🍊", "🍎", "🍊", "🍎"], answer: "🍊", options: ["🍊", "🍎", "🍇", "🍌"], hint: "Apple, orange, apple, orange..." },
  { sequence: ["🐶", "🐱", "🐶", "🐱", "🐶"], answer: "🐱", options: ["🐱", "🐶", "🐰", "🐻"], hint: "Dog, cat, dog, cat..." },
  { sequence: ["🌸", "🌸", "🌺", "🌸", "🌸"], answer: "🌺", options: ["🌺", "🌸", "🌻", "🌹"], hint: "Two pink flowers, then what?" },
  { sequence: ["🚗", "🚕", "🚙", "🚗", "🚕"], answer: "🚙", options: ["🚙", "🚗", "🚕", "🚌"], hint: "Three vehicles repeat" },
]

function generateQuestions(): Pattern[] {
  const allPatterns = [...shapePatterns, ...numberPatterns, ...emojiPatterns]
  return allPatterns.sort(() => Math.random() - 0.5).slice(0, 8)
}

export function PatternFinderGame({ game, onComplete }: PatternFinderGameProps) {
  const [questions] = useState(() => generateQuestions())
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const hasCompletedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const current = questions[currentQ]
  const progress = ((currentQ + 1) / questions.length) * 100
  const shuffledOptions = [...current.options].sort(() => Math.random() - 0.5)

  useEffect(() => {
    if (finished && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      onCompleteRef.current(score, game.maxScore)
    }
  }, [finished, score, game.maxScore])

  const handleAnswer = (option: string) => {
    if (selected !== null) return
    const index = shuffledOptions.indexOf(option)
    setSelected(index)
    
    if (option === current.answer) {
      setScore(s => s + 12)
    }
  }

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrentQ(q => q + 1)
      setSelected(null)
      setShowHint(false)
    }
  }

  const resetGame = () => {
    setCurrentQ(0)
    setScore(0)
    setSelected(null)
    setFinished(false)
    setShowHint(false)
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
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        </motion.div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Pattern Pro!</h2>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-center text-foreground">
            What comes next in the pattern?
          </h3>

          {/* Pattern Display */}
          <div className="flex items-center justify-center gap-2 flex-wrap p-4 rounded-xl bg-muted/50">
            {current.sequence.map((item, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="w-12 h-12 flex items-center justify-center bg-background rounded-lg shadow text-2xl"
              >
                {item}
              </motion.div>
            ))}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-12 h-12 flex items-center justify-center bg-primary/20 rounded-lg border-2 border-dashed border-primary text-xl"
            >
              ?
            </motion.div>
          </div>

          {/* Hint Button */}
          {!showHint && selected === null && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowHint(true)}
              className="w-full text-muted-foreground"
            >
              <HelpCircle className="w-4 h-4 mr-2" /> Need a hint?
            </Button>
          )}

          {showHint && selected === null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 rounded-lg bg-blue-500/10 text-center text-sm text-blue-700"
            >
              Hint: {current.hint}
            </motion.div>
          )}

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-3">
            {shuffledOptions.map((option, index) => {
              const isCorrect = option === current.answer
              const isSelected = selected === index
              
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: selected === null ? 1.05 : 1 }}
                  whileTap={{ scale: selected === null ? 0.95 : 1 }}
                  onClick={() => handleAnswer(option)}
                  disabled={selected !== null}
                  className={`
                    p-6 rounded-xl border-2 text-3xl transition-all
                    ${selected === null 
                      ? "border-border hover:border-primary/50 bg-card" 
                      : isSelected && isCorrect
                        ? "border-green-500 bg-green-500/20"
                        : isSelected && !isCorrect
                          ? "border-red-500 bg-red-500/20"
                          : isCorrect
                            ? "border-green-500 bg-green-500/20"
                            : "border-border bg-card opacity-50"
                    }
                  `}
                >
                  {option}
                </motion.button>
              )
            })}
          </div>

          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button onClick={nextQuestion} className="w-full" size="lg">
                {currentQ + 1 >= questions.length ? "See Results" : "Next Pattern"}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
