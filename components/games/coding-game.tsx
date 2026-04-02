"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Trophy,
  Play,
  RotateCw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Trash2,
  ChevronRight,
  Code2,
  Star,
  Cpu,
} from "lucide-react"
import type { Game } from "@/lib/game-data"

type Direction = "up" | "down" | "left" | "right"
type CellType = "empty" | "start" | "end" | "wall" | "path" | "robot"

interface Level {
  grid: CellType[][]
  startPos: [number, number]
  endPos: [number, number]
  maxMoves: number
}

const levels: Level[] = [
  {
    grid: [
      ["start", "empty", "empty", "empty", "empty"],
      ["wall", "wall", "empty", "wall", "empty"],
      ["empty", "empty", "empty", "wall", "empty"],
      ["empty", "wall", "empty", "empty", "empty"],
      ["empty", "empty", "wall", "empty", "end"],
    ],
    startPos: [0, 0],
    endPos: [4, 4],
    maxMoves: 12,
  },
  {
    grid: [
      ["empty", "empty", "wall", "empty", "empty", "empty"],
      ["empty", "wall", "empty", "empty", "wall", "empty"],
      ["start", "empty", "empty", "wall", "empty", "empty"],
      ["empty", "wall", "empty", "empty", "empty", "wall"],
      ["empty", "empty", "empty", "wall", "empty", "end"],
    ],
    startPos: [2, 0],
    endPos: [4, 5],
    maxMoves: 15,
  },
  {
    grid: [
      ["start", "empty", "wall", "empty", "empty", "empty"],
      ["empty", "empty", "wall", "empty", "wall", "empty"],
      ["wall", "empty", "empty", "empty", "wall", "empty"],
      ["empty", "empty", "wall", "empty", "empty", "empty"],
      ["empty", "wall", "empty", "empty", "wall", "empty"],
      ["empty", "empty", "empty", "wall", "empty", "end"],
    ],
    startPos: [0, 0],
    endPos: [5, 5],
    maxMoves: 18,
  },
]

const blockColors: Record<Direction, string> = {
  up: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20",
  down: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20",
  left: "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20",
  right: "bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/20",
}

const dirIcons: Record<Direction, typeof ArrowUp> = {
  up: ArrowUp,
  down: ArrowDown,
  left: ArrowLeft,
  right: ArrowRight,
}

const dirDelta: Record<Direction, [number, number]> = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
}

interface CodingGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

export function CodingGame({ game, onComplete }: CodingGameProps) {
  const [levelIndex, setLevelIndex] = useState(0)
  const [instructions, setInstructions] = useState<Direction[]>([])
  const [robotPos, setRobotPos] = useState<[number, number]>([...levels[0].startPos])
  const [path, setPath] = useState<[number, number][]>([])
  const [running, setRunning] = useState(false)
  const [won, setWon] = useState(false)
  const [failed, setFailed] = useState(false)
  const [finished, setFinished] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const runRef = useRef(false)
  const hasCompletedRef = useRef(false)

  const level = levels[levelIndex]

  const reset = useCallback(() => {
    setRobotPos([...levels[levelIndex].startPos])
    setPath([])
    setWon(false)
    setFailed(false)
    setRunning(false)
    runRef.current = false
  }, [levelIndex])

  const addInstruction = useCallback(
    (dir: Direction) => {
      if (running || instructions.length >= level.maxMoves) return
      setInstructions((prev) => [...prev, dir])
    },
    [running, instructions.length, level.maxMoves]
  )

  const removeInstruction = useCallback(
    (index: number) => {
      if (running) return
      setInstructions((prev) => prev.filter((_, i) => i !== index))
    },
    [running]
  )

  const runProgram = useCallback(async () => {
    if (instructions.length === 0) return
    setRunning(true)
    runRef.current = true
    setPath([])
    let pos: [number, number] = [...level.startPos]
    setRobotPos([...pos])

    for (let i = 0; i < instructions.length; i++) {
      if (!runRef.current) break
      await new Promise((r) => setTimeout(r, 400))
      const [dr, dc] = dirDelta[instructions[i]]
      const newR = pos[0] + dr
      const newC = pos[1] + dc

      if (
        newR < 0 ||
        newR >= level.grid.length ||
        newC < 0 ||
        newC >= level.grid[0].length ||
        level.grid[newR][newC] === "wall"
      ) {
        setFailed(true)
        setRunning(false)
        runRef.current = false
        return
      }

      pos = [newR, newC]
      setRobotPos([...pos])
      setPath((prev) => [...prev, [...pos] as [number, number]])

      if (pos[0] === level.endPos[0] && pos[1] === level.endPos[1]) {
        setWon(true)
        const efficiency = Math.max(0, 100 - (instructions.length - (i + 1)) * 5)
        const levelScore = Math.round(efficiency * ((levelIndex + 1) / levels.length))
        setTotalScore((prev) => prev + levelScore)
        setRunning(false)
        runRef.current = false
        return
      }
    }

    setFailed(true)
    setRunning(false)
    runRef.current = false
  }, [instructions, level, levelIndex])

  const nextLevel = useCallback(() => {
    if (levelIndex + 1 >= levels.length) {
      setFinished(true)
    } else {
      setLevelIndex((prev) => prev + 1)
      setInstructions([])
      setRobotPos([...levels[levelIndex + 1].startPos])
      setPath([])
      setWon(false)
      setFailed(false)
      setRunning(false)
    }
  }, [levelIndex])

  useEffect(() => {
    if (finished && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      onComplete(totalScore, 100)
    }
  }, [finished, totalScore, onComplete])

  if (finished) {
    const stars = Math.ceil((totalScore / 100) * 5)
    
    return (
      <Card className="max-w-xl mx-auto overflow-hidden border-0 shadow-2xl">
        <div className="relative bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 p-8 text-white text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Trophy className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {totalScore >= 80 ? "Master Coder!" : totalScore >= 50 ? "Great Coding!" : "Keep Coding!"}
            </h2>
            <p className="text-white/80">All {levels.length} levels completed!</p>
          </div>
        </div>
        
        <CardContent className="p-8 bg-card">
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  i < stars
                    ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30"
                    : "bg-muted"
                }`}
              >
                <Star
                  className={`w-6 h-6 ${
                    i < stars ? "text-white fill-white" : "text-muted-foreground"
                  }`}
                />
              </div>
            ))}
          </div>
          
          <div className="rounded-2xl border border-border bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 p-6 text-center mb-6">
            <Code2 className="w-8 h-8 mx-auto mb-2 text-pink-600" />
            <p className="text-3xl font-bold text-foreground">{totalScore}</p>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </div>
          
          <Button 
            onClick={() => window.location.reload()} 
            size="lg"
            className="w-full h-14 text-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
          >
            <Play className="w-5 h-5 mr-2" />
            Play Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Stats Bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/20">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Level {levelIndex + 1} of {levels.length}</p>
            <p className="text-xs text-muted-foreground">Score: {totalScore} pts</p>
          </div>
        </div>
        <Badge className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800 rounded-lg px-3 py-1">
          <Code2 className="h-3 w-3 mr-1" />
          {instructions.length}/{level.maxMoves} blocks
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Game Grid Section */}
        <Card className="overflow-hidden border-0 shadow-xl">
          <div className="bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-red-500/10 p-4">
            <p className="text-sm font-medium text-foreground text-center mb-4">
              Guide the robot to the green goal!
            </p>

            <div className="flex justify-center">
              <div className="inline-grid gap-1 rounded-2xl bg-slate-800 p-4 shadow-inner">
                {level.grid.map((row, r) => (
                  <div key={r} className="flex gap-1">
                    {row.map((cell, c) => {
                      const isRobot = robotPos[0] === r && robotPos[1] === c
                      const isPath = path.some(([pr, pc]) => pr === r && pc === c)
                      const isEnd = level.endPos[0] === r && level.endPos[1] === c
                      const isStart = level.startPos[0] === r && level.startPos[1] === c

                      let bg = "bg-slate-700"
                      let shadow = ""
                      if (cell === "wall") bg = "bg-slate-900"
                      if (isPath) bg = "bg-pink-500/40"
                      if (isEnd) {
                        bg = "bg-gradient-to-br from-emerald-400 to-teal-500"
                        shadow = "shadow-lg shadow-emerald-500/30"
                      }
                      if (isStart && !isRobot) bg = "bg-pink-500/30"

                      return (
                        <div
                          key={c}
                          className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg text-xs font-bold ${bg} ${shadow} transition-all duration-200 ${
                            isRobot ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white ring-2 ring-pink-400 shadow-lg shadow-pink-500/40" : ""
                          }`}
                        >
                          {isRobot ? (
                            <Cpu className="w-5 h-5" />
                          ) : isEnd ? (
                            <span className="text-xs text-white font-bold">GO</span>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {won && (
              <div className="mt-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-3 text-center text-sm font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                Level complete! Great problem-solving!
              </div>
            )}
            {failed && (
              <div className="mt-4 rounded-xl bg-gradient-to-r from-rose-500/10 to-red-500/10 p-3 text-center text-sm font-medium text-rose-700 dark:text-rose-400 border border-rose-500/20">
                {"The robot couldn't reach the goal. Try different blocks!"}
              </div>
            )}
          </div>
        </Card>

        {/* Code Blocks Section */}
        <Card className="overflow-hidden border-0 shadow-xl">
          <CardContent className="p-6 space-y-4">
            <p className="text-sm font-medium text-foreground">Direction Blocks:</p>
            <div className="grid grid-cols-4 gap-2">
              {(["up", "down", "left", "right"] as Direction[]).map((dir) => {
                const Icon = dirIcons[dir]
                return (
                  <Button
                    key={dir}
                    className={`h-14 gap-1 text-xs capitalize rounded-xl ${blockColors[dir]}`}
                    onClick={() => addInstruction(dir)}
                    disabled={running || instructions.length >= level.maxMoves}
                  >
                    <Icon className="h-5 w-5" />
                    {dir}
                  </Button>
                )
              })}
            </div>

            <div className="min-h-[120px] rounded-xl border-2 border-dashed border-border bg-muted/30 p-4">
              <p className="mb-3 text-xs font-medium text-muted-foreground">Your Program:</p>
              <div className="flex flex-wrap gap-2">
                {instructions.map((dir, i) => {
                  const Icon = dirIcons[dir]
                  return (
                    <button
                      key={i}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all hover:scale-105 ${blockColors[dir]}`}
                      onClick={() => removeInstruction(i)}
                      disabled={running}
                      aria-label={`Remove ${dir} instruction`}
                    >
                      <span className="text-white/70">{i + 1}.</span>
                      <Icon className="h-4 w-4" />
                    </button>
                  )
                })}
                {instructions.length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    Click direction buttons above to build your program...
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {won ? (
                <Button 
                  className="flex-1 gap-2 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600" 
                  onClick={nextLevel}
                >
                  <ChevronRight className="h-4 w-4" />
                  {levelIndex + 1 >= levels.length ? "Finish" : "Next Level"}
                </Button>
              ) : (
                <>
                  <Button
                    className="flex-1 gap-2 h-12 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                    onClick={runProgram}
                    disabled={running || instructions.length === 0}
                  >
                    <Play className="h-4 w-4" />
                    Run Code
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 h-12 rounded-xl"
                    onClick={() => {
                      setInstructions([])
                      reset()
                    }}
                    disabled={running}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="gap-2 h-12 rounded-xl" onClick={reset} disabled={running}>
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
