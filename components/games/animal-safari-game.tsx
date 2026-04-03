"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Game } from "@/lib/game-data"
import { CheckCircle2, XCircle, Sparkles, RotateCcw } from "lucide-react"

interface AnimalSafariGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

interface Animal {
  name: string
  emoji: string
  sound: string
  habitat: string
  fact: string
  category: "mammal" | "bird" | "fish" | "reptile" | "insect"
}

const animals: Animal[] = [
  { name: "Lion", emoji: "🦁", sound: "roar", habitat: "Savanna", fact: "Lions are called the King of the Jungle!", category: "mammal" },
  { name: "Elephant", emoji: "🐘", sound: "trumpet", habitat: "Savanna", fact: "Elephants never forget!", category: "mammal" },
  { name: "Dolphin", emoji: "🐬", sound: "click", habitat: "Ocean", fact: "Dolphins sleep with one eye open!", category: "mammal" },
  { name: "Owl", emoji: "🦉", sound: "hoot", habitat: "Forest", fact: "Owls can turn their heads almost all the way around!", category: "bird" },
  { name: "Penguin", emoji: "🐧", sound: "squawk", habitat: "Antarctic", fact: "Penguins can't fly but they're great swimmers!", category: "bird" },
  { name: "Snake", emoji: "🐍", sound: "hiss", habitat: "Various", fact: "Snakes smell with their tongues!", category: "reptile" },
  { name: "Butterfly", emoji: "🦋", sound: "silent", habitat: "Garden", fact: "Butterflies taste with their feet!", category: "insect" },
  { name: "Bear", emoji: "🐻", sound: "growl", habitat: "Forest", fact: "Bears can run as fast as a horse!", category: "mammal" },
  { name: "Shark", emoji: "🦈", sound: "silent", habitat: "Ocean", fact: "Sharks have been around longer than dinosaurs!", category: "fish" },
  { name: "Frog", emoji: "🐸", sound: "ribbit", habitat: "Pond", fact: "Frogs can breathe through their skin!", category: "reptile" },
  { name: "Bee", emoji: "🐝", sound: "buzz", habitat: "Garden", fact: "Bees dance to tell other bees where flowers are!", category: "insect" },
  { name: "Horse", emoji: "🐴", sound: "neigh", habitat: "Farm", fact: "Horses can sleep standing up!", category: "mammal" },
]

interface Question {
  type: "identify" | "sound" | "habitat"
  question: string
  animal: Animal
  options: string[]
  correct: number
}

function generateQuestions(): Question[] {
  const questions: Question[] = []
  const shuffled = [...animals].sort(() => Math.random() - 0.5)
  
  for (let i = 0; i < 8; i++) {
    const animal = shuffled[i % shuffled.length]
    const type = ["identify", "sound", "habitat"][i % 3] as Question["type"]
    
    if (type === "identify") {
      const wrongOptions = animals
        .filter(a => a.name !== animal.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(a => a.name)
      const options = [...wrongOptions, animal.name].sort(() => Math.random() - 0.5)
      questions.push({
        type: "identify",
        question: "What animal is this?",
        animal,
        options,
        correct: options.indexOf(animal.name)
      })
    } else if (type === "sound") {
      const soundOptions = ["roar", "trumpet", "hoot", "hiss", "growl", "ribbit", "buzz", "neigh"]
        .filter(s => s !== animal.sound)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
      const options = [...soundOptions, animal.sound].sort(() => Math.random() - 0.5)
      questions.push({
        type: "sound",
        question: `What sound does a ${animal.name} make?`,
        animal,
        options,
        correct: options.indexOf(animal.sound)
      })
    } else {
      const habitatOptions = ["Savanna", "Ocean", "Forest", "Antarctic", "Garden", "Pond", "Farm"]
        .filter(h => h !== animal.habitat)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
      const options = [...habitatOptions, animal.habitat].sort(() => Math.random() - 0.5)
      questions.push({
        type: "habitat",
        question: `Where does a ${animal.name} live?`,
        animal,
        options,
        correct: options.indexOf(animal.habitat)
      })
    }
  }
  
  return questions
}

export function AnimalSafariGame({ game, onComplete }: AnimalSafariGameProps) {
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
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-5xl">
            🦁
          </div>
        </motion.div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Safari Expert!</h2>
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
          {/* Animal Display */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl"
            >
              {current.animal.emoji}
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
              className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
            >
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Fun Fact: </span>
                {current.animal.fact}
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
