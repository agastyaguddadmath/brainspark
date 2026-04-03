"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Sparkles, Heart, Apple, Cherry, Fish, Bird, Flower2, Sun, Moon, Cloud, Candy } from "lucide-react"
import type { Game } from "@/lib/game-data"

interface CountingGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

const ITEMS = [
  { icon: Star, color: "text-yellow-400", bg: "bg-yellow-100" },
  { icon: Heart, color: "text-pink-500", bg: "bg-pink-100" },
  { icon: Apple, color: "text-red-500", bg: "bg-red-100" },
  { icon: Cherry, color: "text-rose-500", bg: "bg-rose-100" },
  { icon: Fish, color: "text-blue-500", bg: "bg-blue-100" },
  { icon: Bird, color: "text-sky-500", bg: "bg-sky-100" },
  { icon: Flower2, color: "text-purple-500", bg: "bg-purple-100" },
  { icon: Sun, color: "text-orange-400", bg: "bg-orange-100" },
  { icon: Moon, color: "text-indigo-400", bg: "bg-indigo-100" },
  { icon: Cloud, color: "text-slate-400", bg: "bg-slate-100" },
  { icon: Candy, color: "text-pink-400", bg: "bg-pink-100" },
  { icon: Sparkles, color: "text-amber-400", bg: "bg-amber-100" },
]

interface CountingQuestion {
  count: number
  itemIndex: number
  options: number[]
}

function generateQuestion(maxCount: number): CountingQuestion {
  const count = Math.floor(Math.random() * maxCount) + 1
  const itemIndex = Math.floor(Math.random() * ITEMS.length)
  
  const options = new Set<number>([count])
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 3) - 1
    const wrong = count + offset
    if (wrong !== count && wrong > 0 && wrong <= maxCount + 2) {
      options.add(wrong)
    } else {
      options.add(Math.floor(Math.random() * maxCount) + 1)
    }
  }
  
  return {
    count,
    itemIndex,
    options: Array.from(options).sort(() => Math.random() - 0.5),
  }
}

export function CountingGame({ game, onComplete }: CountingGameProps) {
  const maxCount = game.difficulty === "easy" ? 5 : game.difficulty === "medium" ? 10 : 15
  const totalQuestions = 8
  
  const [questions] = useState(() =>
    Array.from({ length: totalQuestions }, () => generateQuestion(maxCount))
  )
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [finished, setFinished] = useState(false)
  const [celebrating, setCelebrating] = useState(false)
  
  const hasCompletedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (finished && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      const maxScore = totalQuestions * 12
      onCompleteRef.current(Math.min(score, maxScore), maxScore)
    }
  }, [finished, score])

  const handleAnswer = useCallback((answer: number) => {
    if (showResult) return
    
    const question = questions[currentQ]
    const isCorrect = answer === question.count
    
    setSelected(answer)
    setShowResult(true)
    
    if (isCorrect) {
      setScore(prev => prev + 12)
      setCelebrating(true)
      setTimeout(() => setCelebrating(false), 1000)
    }
    
    setTimeout(() => {
      if (currentQ + 1 >= totalQuestions) {
        setFinished(true)
      } else {
        setCurrentQ(prev => prev + 1)
        setSelected(null)
        setShowResult(false)
      }
    }, 1500)
  }, [currentQ, questions, showResult])

  const question = questions[currentQ]
  const Item = ITEMS[question.itemIndex]

  if (finished) {
    const maxScore = totalQuestions * 12
    const percentage = Math.round((score / maxScore) * 100)
    
    return (
      <div className="p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <div className="text-6xl mb-4">
            {percentage >= 80 ? "🌟" : percentage >= 60 ? "😊" : "💪"}
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Great Counting!</h2>
          <p className="text-muted-foreground mb-4">
            You scored {score} out of {maxScore} points!
          </p>
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-8 h-8 ${
                  i < Math.ceil(percentage / 20)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Question {currentQ + 1} of {totalQuestions}</span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            {score} points
          </span>
        </div>
        <Progress value={((currentQ + 1) / totalQuestions) * 100} className="h-3" />
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          How many {question.count === 1 ? "item" : "items"} do you see?
        </h2>
        <p className="text-muted-foreground">Count carefully and tap the right number!</p>
      </div>

      {/* Items to count */}
      <div className={`${Item.bg} rounded-2xl p-8 mb-8 min-h-[200px] flex items-center justify-center`}>
        <div className="flex flex-wrap justify-center gap-4 max-w-md">
          <AnimatePresence>
            {Array.from({ length: question.count }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: celebrating ? [1, 1.2, 1] : 1, 
                  rotate: 0,
                  y: celebrating ? [0, -10, 0] : 0
                }}
                transition={{ 
                  delay: i * 0.1, 
                  type: "spring",
                  y: { repeat: celebrating ? Infinity : 0, duration: 0.3 }
                }}
                className="relative"
              >
                <Item.icon className={`w-12 h-12 ${Item.color} drop-shadow-md`} />
                {celebrating && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 0] }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Answer options */}
      <div className="grid grid-cols-4 gap-3">
        {question.options.map((option, i) => {
          const isCorrect = option === question.count
          const isSelected = selected === option
          
          let buttonClass = "h-16 text-2xl font-bold rounded-xl transition-all "
          
          if (showResult) {
            if (isCorrect) {
              buttonClass += "bg-green-500 text-white border-green-500 ring-4 ring-green-200"
            } else if (isSelected) {
              buttonClass += "bg-red-400 text-white border-red-400"
            } else {
              buttonClass += "bg-muted text-muted-foreground opacity-50"
            }
          } else {
            buttonClass += "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-2 border-primary/20 hover:border-primary"
          }
          
          return (
            <motion.div
              key={i}
              whileHover={!showResult ? { scale: 1.05 } : {}}
              whileTap={!showResult ? { scale: 0.95 } : {}}
            >
              <Button
                variant="outline"
                className={buttonClass}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
              >
                {option}
              </Button>
            </motion.div>
          )
        })}
      </div>

      {/* Feedback message */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 text-center"
          >
            {selected === question.count ? (
              <p className="text-lg font-semibold text-green-600">
                Yes! There are {question.count} items! Great counting!
              </p>
            ) : (
              <p className="text-lg font-semibold text-orange-600">
                Not quite! There are {question.count} items. Let&apos;s try the next one!
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
