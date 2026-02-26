"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import type { Game } from "@/lib/game-data"
import { 
  Paintbrush, 
  Eraser, 
  RotateCcw, 
  Check, 
  Palette,
  Circle,
  Square,
  Star,
  Download
} from "lucide-react"

interface ArtGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

const COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", 
  "#3b82f6", "#8b5cf6", "#ec4899", "#000000", "#ffffff"
]

const challengePrompts = [
  { prompt: "Draw a happy sun", keywords: ["sun", "circle", "yellow", "rays"] },
  { prompt: "Draw a house with a tree", keywords: ["house", "tree", "home"] },
  { prompt: "Draw a rainbow", keywords: ["rainbow", "colors", "arc"] },
  { prompt: "Draw your favorite animal", keywords: ["animal", "pet", "creature"] },
  { prompt: "Draw a flower garden", keywords: ["flower", "garden", "nature"] },
]

export function ArtGame({ game, onComplete }: ArtGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#3b82f6")
  const [brushSize, setBrushSize] = useState(8)
  const [tool, setTool] = useState<"brush" | "eraser">("brush")
  const [challenge] = useState(() => 
    challengePrompts[Math.floor(Math.random() * challengePrompts.length)]
  )
  const [isCompleted, setIsCompleted] = useState(false)
  const [strokes, setStrokes] = useState(0)
  const [colorsUsed, setColorsUsed] = useState<Set<string>>(new Set())
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsDrawing(true)
    lastPos.current = getPos(e)
    if (tool === "brush") {
      setColorsUsed(prev => new Set([...prev, color]))
    }
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !lastPos.current) return

    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color
    ctx.lineWidth = tool === "eraser" ? brushSize * 2 : brushSize
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke()
    lastPos.current = pos
    setStrokes(prev => prev + 1)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    lastPos.current = null
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setStrokes(0)
    setColorsUsed(new Set())
  }

  const submitArt = () => {
    // Score based on effort (strokes) and creativity (colors used)
    const strokeScore = Math.min(strokes / 50, 1) * 50
    const colorScore = Math.min(colorsUsed.size / 4, 1) * 30
    const completionBonus = 20
    const totalScore = Math.round(strokeScore + colorScore + completionBonus)
    
    setIsCompleted(true)
    onComplete(totalScore, game.maxScore)
  }

  const downloadArt = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement("a")
    link.download = "my-artwork.png"
    link.href = canvas.toDataURL()
    link.click()
  }

  if (isCompleted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
            <Star className="w-10 h-10 text-success fill-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Beautiful Artwork!
          </h2>
          <p className="text-muted-foreground mb-4">
            You used {colorsUsed.size} colors and made {strokes} strokes
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={downloadArt} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={() => window.location.reload()}>
              Draw Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="w-5 h-5 text-primary" />
            Challenge: {challenge.prompt}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Canvas */}
          <div className="border-2 border-border rounded-lg overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full h-auto cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>

          {/* Tools */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={tool === "brush" ? "default" : "outline"}
                size="sm"
                onClick={() => setTool("brush")}
              >
                <Paintbrush className="w-4 h-4" />
              </Button>
              <Button
                variant={tool === "eraser" ? "default" : "outline"}
                size="sm"
                onClick={() => setTool("eraser")}
              >
                <Eraser className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={clearCanvas}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Brush Size */}
            <div className="flex items-center gap-2 min-w-[120px]">
              <Circle className="w-3 h-3" />
              <Slider
                value={[brushSize]}
                onValueChange={([v]) => setBrushSize(v)}
                min={2}
                max={24}
                step={2}
                className="w-20"
              />
              <Square className="w-5 h-5" />
            </div>
          </div>

          {/* Color Palette */}
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c)
                  setTool("brush")
                }}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  color === c && tool === "brush" 
                    ? "border-primary ring-2 ring-primary/30 scale-110" 
                    : "border-border"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-2">
            <Badge variant="secondary">
              {colorsUsed.size} colors used
            </Badge>
            <Badge variant="secondary">
              {strokes} strokes
            </Badge>
          </div>

          {/* Submit */}
          <Button onClick={submitArt} className="w-full" size="lg">
            <Check className="w-4 h-4 mr-2" />
            Submit Artwork
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
