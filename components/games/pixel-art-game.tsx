"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette, RotateCcw, Check, Sparkles, Eraser } from "lucide-react"
import type { Game } from "@/lib/game-data"

interface PixelArtGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

const GRID_SIZE = 8
const PIXEL_SIZE = 36

const colors = [
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Green", value: "#22C55E" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Brown", value: "#92400E" },
  { name: "Black", value: "#1F2937" },
  { name: "White", value: "#F9FAFB" },
]

// Simple pixel art templates to recreate
const templates = [
  {
    name: "Heart",
    hint: "A symbol of love",
    pattern: [
      [0,0,1,1,0,1,1,0],
      [0,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,1],
      [0,0,1,1,1,1,1,0],
      [0,0,0,1,1,1,0,0],
      [0,0,0,0,1,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    color: "#EF4444"
  },
  {
    name: "Star",
    hint: "It twinkles at night",
    pattern: [
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,1,1,1,1,0,0],
      [1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,0],
      [0,0,1,1,1,1,0,0],
      [0,1,1,0,0,1,1,0],
      [1,1,0,0,0,0,1,1],
    ],
    color: "#EAB308"
  },
  {
    name: "Tree",
    hint: "It grows in the forest",
    pattern: [
      [0,0,0,1,1,0,0,0],
      [0,0,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    color: "#22C55E"
  }
]

export function PixelArtGame({ game, onComplete }: PixelArtGameProps) {
  const [grid, setGrid] = useState<string[][]>(() => 
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill("#F3F4F6"))
  )
  const [selectedColor, setSelectedColor] = useState(colors[0].value)
  const [isErasing, setIsErasing] = useState(false)
  const [templateIndex] = useState(() => Math.floor(Math.random() * templates.length))
  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [pixelsPlaced, setPixelsPlaced] = useState(0)
  const hasCompletedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const template = templates[templateIndex]

  const handlePixelClick = (row: number, col: number) => {
    if (completed) return

    const newGrid = [...grid.map(r => [...r])]
    if (isErasing) {
      newGrid[row][col] = "#F3F4F6"
    } else {
      if (newGrid[row][col] === "#F3F4F6") {
        setPixelsPlaced(prev => prev + 1)
      }
      newGrid[row][col] = selectedColor
    }
    setGrid(newGrid)
  }

  const resetGrid = () => {
    setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill("#F3F4F6")))
    setPixelsPlaced(0)
  }

  const checkCompletion = () => {
    // Score based on creativity (pixels placed) and effort
    const creativityScore = Math.min((pixelsPlaced / 20) * 50, 50)
    const effortBonus = pixelsPlaced > 10 ? 30 : pixelsPlaced > 5 ? 20 : 10
    const completionBonus = 20
    
    const calculatedScore = Math.min(Math.round(creativityScore + effortBonus + completionBonus), game.maxScore)
    setScore(calculatedScore)
    setCompleted(true)
    
    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true
      onCompleteRef.current(calculatedScore, game.maxScore)
    }
  }

  if (completed) {
    return (
      <div className="p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Pixel Perfect!</h2>
          <p className="text-xl text-muted-foreground">Great pixel art creation!</p>
        </motion.div>
        
        <div className="bg-muted rounded-2xl p-4 mb-6 inline-block">
          <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
            {grid.map((row, rowIndex) =>
              row.map((color, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="w-6 h-6 rounded-sm"
                  style={{ backgroundColor: color }}
                />
              ))
            )}
          </div>
        </div>

        <Badge className="text-2xl px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500">
          Score: {score}/{game.maxScore}
        </Badge>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-foreground mb-1">Create Pixel Art!</h2>
        <p className="text-muted-foreground">Try to draw: {template.name} ({template.hint})</p>
      </div>

      {/* Reference */}
      <div className="flex justify-center mb-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Example:</p>
          <div className="grid gap-0 border rounded" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
            {template.pattern.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`ref-${rowIndex}-${colIndex}`}
                  className="w-3 h-3"
                  style={{ backgroundColor: cell ? template.color : "#F3F4F6" }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <Card className="mb-4">
        <CardContent className="p-4 flex justify-center">
          <div 
            className="grid gap-0.5 bg-muted p-2 rounded-lg"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
          >
            {grid.map((row, rowIndex) =>
              row.map((color, colIndex) => (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handlePixelClick(rowIndex, colIndex)}
                  className="cursor-pointer rounded-sm border border-border/50"
                  style={{ 
                    backgroundColor: color,
                    width: PIXEL_SIZE,
                    height: PIXEL_SIZE
                  }}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <div className="mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Palette className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Colors:</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {colors.map((color) => (
            <motion.button
              key={color.value}
              onClick={() => {
                setSelectedColor(color.value)
                setIsErasing(false)
              }}
              className={`w-8 h-8 rounded-lg border-2 ${
                selectedColor === color.value && !isErasing ? "border-foreground ring-2 ring-primary" : "border-border"
              }`}
              style={{ backgroundColor: color.value }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={color.name}
            />
          ))}
          <motion.button
            onClick={() => setIsErasing(true)}
            className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center ${
              isErasing ? "border-foreground ring-2 ring-primary bg-muted" : "border-border bg-background"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Eraser"
          >
            <Eraser className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-3">
        <Button
          variant="outline"
          onClick={resetGrid}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Clear
        </Button>
        <Button
          onClick={checkCompletion}
          className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
        >
          <Check className="w-4 h-4" />
          Done!
        </Button>
      </div>
    </div>
  )
}
