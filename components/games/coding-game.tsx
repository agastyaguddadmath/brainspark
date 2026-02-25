"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  up: "bg-[oklch(0.55_0.2_250)] text-[oklch(0.99_0_0)]",
  down: "bg-[oklch(0.7_0.18_150)] text-[oklch(0.99_0_0)]",
  left: "bg-[oklch(0.7_0.2_50)] text-[oklch(0.99_0_0)]",
  right: "bg-[oklch(0.65_0.2_330)] text-[oklch(0.99_0_0)]",
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
    if (finished) onComplete(totalScore, 100)
  }, [finished, totalScore, onComplete])

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[oklch(0.65_0.2_330/0.1)]">
          <Trophy className="h-10 w-10 text-[oklch(0.65_0.2_330)]" />
        </div>
        <h2 className="mt-6 text-3xl font-bold text-foreground">
          {totalScore >= 80 ? "Master Coder!" : totalScore >= 50 ? "Great Coding!" : "Keep Coding!"}
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          You completed all {levels.length} levels!
        </p>
        <div className="mt-6 rounded-xl bg-secondary p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{totalScore}</div>
          <div className="text-xs text-muted-foreground">Total Points</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Level {levelIndex + 1}/{levels.length}</Badge>
          <Badge variant="secondary">{instructions.length}/{level.maxMoves} blocks</Badge>
        </div>
        <span className="text-sm font-medium text-foreground">Score: {totalScore}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">
            Guide the robot to the green goal by placing directional blocks below.
          </p>

          <div className="flex justify-center">
            <div className="inline-grid gap-1 rounded-xl border border-border bg-card p-3">
              {level.grid.map((row, r) => (
                <div key={r} className="flex gap-1">
                  {row.map((cell, c) => {
                    const isRobot = robotPos[0] === r && robotPos[1] === c
                    const isPath = path.some(([pr, pc]) => pr === r && pc === c)
                    const isEnd = level.endPos[0] === r && level.endPos[1] === c
                    const isStart = level.startPos[0] === r && level.startPos[1] === c

                    let bg = "bg-secondary"
                    if (cell === "wall") bg = "bg-foreground/20"
                    if (isPath) bg = "bg-primary/20"
                    if (isEnd) bg = "bg-[oklch(0.7_0.18_150)]"
                    if (isStart && !isRobot) bg = "bg-primary/30"

                    return (
                      <div
                        key={c}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold ${bg} transition-all ${
                          isRobot ? "bg-primary text-primary-foreground ring-2 ring-primary/50" : ""
                        }`}
                      >
                        {isRobot ? (
                          <span className="text-sm">{">"}</span>
                        ) : isEnd ? (
                          <span className="text-xs text-[oklch(0.99_0_0)]">{"GO"}</span>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {won && (
            <div className="rounded-lg bg-[oklch(0.7_0.18_150/0.1)] p-3 text-center text-sm font-medium text-[oklch(0.5_0.18_150)]">
              Level complete! Great problem-solving!
            </div>
          )}
          {failed && (
            <div className="rounded-lg bg-destructive/10 p-3 text-center text-sm font-medium text-destructive">
              {"The robot couldn't reach the goal. Try different blocks!"}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">Code blocks:</p>
          <div className="grid grid-cols-4 gap-2">
            {(["up", "down", "left", "right"] as Direction[]).map((dir) => {
              const Icon = dirIcons[dir]
              return (
                <Button
                  key={dir}
                  className={`h-12 gap-1 text-xs capitalize ${blockColors[dir]}`}
                  onClick={() => addInstruction(dir)}
                  disabled={running || instructions.length >= level.maxMoves}
                >
                  <Icon className="h-4 w-4" />
                  {dir}
                </Button>
              )
            })}
          </div>

          <div className="min-h-[120px] rounded-xl border border-border bg-card p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Program:</p>
            <div className="flex flex-wrap gap-1.5">
              {instructions.map((dir, i) => {
                const Icon = dirIcons[dir]
                return (
                  <button
                    key={i}
                    className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-all hover:opacity-80 ${blockColors[dir]}`}
                    onClick={() => removeInstruction(i)}
                    disabled={running}
                    aria-label={`Remove ${dir} instruction`}
                  >
                    <Icon className="h-3 w-3" />
                    {i + 1}
                  </button>
                )
              })}
              {instructions.length === 0 && (
                <span className="text-xs text-muted-foreground">
                  Click direction buttons to add instructions...
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {won ? (
              <Button className="flex-1 gap-2" onClick={nextLevel}>
                <ChevronRight className="h-4 w-4" />
                {levelIndex + 1 >= levels.length ? "Finish" : "Next Level"}
              </Button>
            ) : (
              <>
                <Button
                  className="flex-1 gap-2"
                  onClick={runProgram}
                  disabled={running || instructions.length === 0}
                >
                  <Play className="h-4 w-4" />
                  Run
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    setInstructions([])
                    reset()
                  }}
                  disabled={running}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>
                <Button variant="outline" className="gap-2" onClick={reset} disabled={running}>
                  <RotateCw className="h-4 w-4" />
                  Reset
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
