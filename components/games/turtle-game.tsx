"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowUp, RotateCcw, RotateCw, Play, Trash2, Star, ChevronRight } from "lucide-react"
import type { Game } from "@/lib/game-data"

interface TurtleGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

interface TurtleState {
  x: number
  y: number
  angle: number
}

interface Command {
  type: "forward" | "left" | "right"
  icon: React.ReactNode
  label: string
}

const COMMANDS: Command[] = [
  { type: "forward", icon: <ArrowUp className="h-6 w-6" />, label: "Forward" },
  { type: "left", icon: <RotateCcw className="h-6 w-6" />, label: "Turn Left" },
  { type: "right", icon: <RotateCw className="h-6 w-6" />, label: "Turn Right" },
]

const CHALLENGES = [
  {
    name: "Draw a Line",
    description: "Move the turtle forward 3 times",
    targetCommands: ["forward", "forward", "forward"],
    hint: "Click Forward 3 times!",
  },
  {
    name: "Turn Around",
    description: "Make the turtle turn right twice",
    targetCommands: ["right", "right"],
    hint: "Click Turn Right 2 times!",
  },
  {
    name: "Make an L",
    description: "Go forward, turn right, then go forward again",
    targetCommands: ["forward", "forward", "right", "forward", "forward"],
    hint: "Forward, Forward, Turn Right, Forward, Forward!",
  },
  {
    name: "Draw a Square",
    description: "Draw a square shape",
    targetCommands: ["forward", "right", "forward", "right", "forward", "right", "forward"],
    hint: "Forward + Turn Right, repeat 4 times!",
  },
  {
    name: "Zigzag Path",
    description: "Create a zigzag pattern",
    targetCommands: ["forward", "right", "forward", "left", "forward", "right", "forward"],
    hint: "Forward, turn, forward, turn the other way!",
  },
]

export function TurtleGame({ game, onComplete }: TurtleGameProps) {
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [commands, setCommands] = useState<string[]>([])
  const [turtle, setTurtle] = useState<TurtleState>({ x: 150, y: 150, angle: -90 })
  const [path, setPath] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const hasCompletedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const challenge = CHALLENGES[challengeIndex]
  const STEP_SIZE = 40
  const TURN_ANGLE = 90
  const CANVAS_SIZE = 300

  const resetTurtle = useCallback(() => {
    setTurtle({ x: 150, y: 150, angle: -90 })
    setPath([])
    setCommands([])
    setShowSuccess(false)
    setShowHint(false)
  }, [])

  const addCommand = useCallback((type: string) => {
    if (isRunning || showSuccess) return
    setCommands(prev => [...prev, type])
  }, [isRunning, showSuccess])

  const removeLastCommand = useCallback(() => {
    if (isRunning || showSuccess) return
    setCommands(prev => prev.slice(0, -1))
  }, [isRunning, showSuccess])

  const executeCommands = useCallback(async () => {
    if (commands.length === 0 || isRunning) return
    
    setIsRunning(true)
    setTurtle({ x: 150, y: 150, angle: -90 })
    setPath([])

    let currentTurtle = { x: 150, y: 150, angle: -90 }
    const newPath: { x1: number; y1: number; x2: number; y2: number }[] = []

    for (const cmd of commands) {
      await new Promise(resolve => setTimeout(resolve, 400))
      
      if (cmd === "forward") {
        const radians = (currentTurtle.angle * Math.PI) / 180
        const newX = Math.max(20, Math.min(CANVAS_SIZE - 20, currentTurtle.x + Math.cos(radians) * STEP_SIZE))
        const newY = Math.max(20, Math.min(CANVAS_SIZE - 20, currentTurtle.y + Math.sin(radians) * STEP_SIZE))
        
        newPath.push({
          x1: currentTurtle.x,
          y1: currentTurtle.y,
          x2: newX,
          y2: newY,
        })
        
        currentTurtle = { ...currentTurtle, x: newX, y: newY }
        setPath([...newPath])
        setTurtle({ ...currentTurtle })
      } else if (cmd === "left") {
        currentTurtle = { ...currentTurtle, angle: currentTurtle.angle - TURN_ANGLE }
        setTurtle({ ...currentTurtle })
      } else if (cmd === "right") {
        currentTurtle = { ...currentTurtle, angle: currentTurtle.angle + TURN_ANGLE }
        setTurtle({ ...currentTurtle })
      }
    }

    await new Promise(resolve => setTimeout(resolve, 300))
    setIsRunning(false)

    // Check if commands match the challenge
    const isCorrect = commands.length === challenge.targetCommands.length &&
      commands.every((cmd, i) => cmd === challenge.targetCommands[i])

    if (isCorrect) {
      setShowSuccess(true)
      const challengeScore = 20
      setScore(prev => prev + challengeScore)
    }
  }, [commands, isRunning, challenge.targetCommands])

  const nextChallenge = useCallback(() => {
    if (challengeIndex < CHALLENGES.length - 1) {
      setChallengeIndex(prev => prev + 1)
      resetTurtle()
    } else {
      // Game complete
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true
        const finalScore = Math.min(score + 20, game.maxScore)
        onCompleteRef.current(finalScore, game.maxScore)
      }
    }
  }, [challengeIndex, score, game.maxScore, resetTurtle])

  return (
    <div className="p-6 bg-gradient-to-b from-green-50 to-emerald-100 min-h-[600px]">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-emerald-800">Turtle Graphics</h2>
        <p className="text-emerald-600">Challenge {challengeIndex + 1} of {CHALLENGES.length}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-emerald-700">{score} points</span>
        </div>
      </div>

      {/* Challenge Info */}
      <Card className="p-4 mb-4 bg-white/80 border-emerald-200">
        <h3 className="font-bold text-lg text-emerald-800">{challenge.name}</h3>
        <p className="text-emerald-600">{challenge.description}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHint(!showHint)}
          className="mt-2 text-emerald-500"
        >
          {showHint ? "Hide Hint" : "Show Hint"}
        </Button>
        {showHint && (
          <p className="text-sm text-amber-600 mt-1 bg-amber-50 p-2 rounded">
            {challenge.hint}
          </p>
        )}
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Canvas */}
        <Card className="p-4 bg-white">
          <svg
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="bg-emerald-50 rounded-lg border-2 border-emerald-200 mx-auto"
          >
            {/* Grid lines */}
            {Array.from({ length: 7 }).map((_, i) => (
              <g key={i}>
                <line
                  x1={i * 50}
                  y1={0}
                  x2={i * 50}
                  y2={CANVAS_SIZE}
                  stroke="#d1fae5"
                  strokeWidth={1}
                />
                <line
                  x1={0}
                  y1={i * 50}
                  x2={CANVAS_SIZE}
                  y2={i * 50}
                  stroke="#d1fae5"
                  strokeWidth={1}
                />
              </g>
            ))}

            {/* Path drawn */}
            {path.map((segment, i) => (
              <motion.line
                key={i}
                x1={segment.x1}
                y1={segment.y1}
                x2={segment.x2}
                y2={segment.y2}
                stroke="#10b981"
                strokeWidth={4}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              />
            ))}

            {/* Turtle */}
            <motion.g
              animate={{ x: turtle.x, y: turtle.y, rotate: turtle.angle + 90 }}
              transition={{ type: "spring", damping: 20 }}
            >
              {/* Turtle body */}
              <circle cx={0} cy={0} r={15} fill="#059669" />
              {/* Turtle head */}
              <circle cx={0} cy={-12} r={8} fill="#34d399" />
              {/* Eyes */}
              <circle cx={-3} cy={-14} r={2} fill="white" />
              <circle cx={3} cy={-14} r={2} fill="white" />
              <circle cx={-3} cy={-14} r={1} fill="black" />
              <circle cx={3} cy={-14} r={1} fill="black" />
              {/* Legs */}
              <ellipse cx={-12} cy={-5} rx={5} ry={4} fill="#34d399" />
              <ellipse cx={12} cy={-5} rx={5} ry={4} fill="#34d399" />
              <ellipse cx={-12} cy={8} rx={5} ry={4} fill="#34d399" />
              <ellipse cx={12} cy={8} rx={5} ry={4} fill="#34d399" />
              {/* Shell pattern */}
              <circle cx={0} cy={0} r={10} fill="none" stroke="#047857" strokeWidth={2} />
            </motion.g>
          </svg>
        </Card>

        {/* Controls */}
        <div className="space-y-4">
          {/* Command buttons */}
          <Card className="p-4 bg-white">
            <p className="text-sm font-medium text-gray-600 mb-3">Commands:</p>
            <div className="flex gap-2 flex-wrap">
              {COMMANDS.map((cmd) => (
                <Button
                  key={cmd.type}
                  onClick={() => addCommand(cmd.type)}
                  disabled={isRunning || showSuccess}
                  className="flex-1 min-w-[80px] bg-emerald-500 hover:bg-emerald-600"
                >
                  {cmd.icon}
                  <span className="ml-1 text-xs">{cmd.label}</span>
                </Button>
              ))}
            </div>
          </Card>

          {/* Command sequence */}
          <Card className="p-4 bg-white">
            <p className="text-sm font-medium text-gray-600 mb-2">Your Program:</p>
            <div className="min-h-[60px] bg-gray-50 rounded-lg p-2 flex flex-wrap gap-1">
              {commands.length === 0 ? (
                <span className="text-gray-400 text-sm">Click commands above to add them here</span>
              ) : (
                commands.map((cmd, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${cmd === "forward" ? "bg-blue-100 text-blue-700" : ""}
                      ${cmd === "left" ? "bg-purple-100 text-purple-700" : ""}
                      ${cmd === "right" ? "bg-orange-100 text-orange-700" : ""}
                    `}
                  >
                    {cmd === "forward" ? "FWD" : cmd === "left" ? "LEFT" : "RIGHT"}
                  </motion.span>
                ))
              )}
            </div>
          </Card>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              onClick={executeCommands}
              disabled={commands.length === 0 || isRunning || showSuccess}
              className="flex-1 bg-green-500 hover:bg-green-600"
            >
              <Play className="h-4 w-4 mr-2" />
              Run
            </Button>
            <Button
              onClick={removeLastCommand}
              disabled={commands.length === 0 || isRunning || showSuccess}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              onClick={resetTurtle}
              disabled={isRunning}
              variant="outline"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Success overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="text-6xl mb-4"
              >
                🐢
              </motion.div>
              <h3 className="text-2xl font-bold text-emerald-600 mb-2">Great Job!</h3>
              <p className="text-gray-600 mb-4">You completed the challenge!</p>
              <div className="flex items-center justify-center gap-1 mb-4">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <Button
                onClick={nextChallenge}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                {challengeIndex < CHALLENGES.length - 1 ? (
                  <>
                    Next Challenge
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  "Finish Game"
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
