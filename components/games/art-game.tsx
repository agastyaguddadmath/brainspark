"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  Download,
  Play,
  Sparkles
} from "lucide-react"

interface ArtGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

const COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", 
  "#3b82f6", "#8b5cf6", "#ec4899", "#000000", "#ffffff",
  "#f43f5e", "#d946ef", "#14b8a6", "#84cc16"
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
    const calculatedScore = Math.round(strokeScore + colorScore + completionBonus)
    const totalScore = Math.min(calculatedScore, game.maxScore)
    
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
      <Card className="max-w-xl mx-auto overflow-hidden border-0 shadow-2xl">
        <div className="relative bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 p-8 text-white text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Star className="w-12 h-12 fill-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">
              Beautiful Artwork!
            </h2>
            <p className="text-white/80">Your masterpiece is complete!</p>
          </div>
        </div>
        
        <CardContent className="p-8 bg-card">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl border border-border bg-gradient-to-br from-fuchsia-50 to-purple-50 dark:from-fuchsia-950/20 dark:to-purple-950/20 p-4 text-center">
              <Palette className="w-6 h-6 mx-auto mb-2 text-fuchsia-600" />
              <p className="text-2xl font-bold text-foreground">{colorsUsed.size}</p>
              <p className="text-sm text-muted-foreground">Colors Used</p>
            </div>
            <div className="rounded-2xl border border-border bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 p-4 text-center">
              <Paintbrush className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-foreground">{strokes}</p>
              <p className="text-sm text-muted-foreground">Brush Strokes</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={downloadArt} 
              variant="outline"
              size="lg"
              className="flex-1 h-14 rounded-xl"
            >
              <Download className="w-5 h-5 mr-2" />
              Download
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              size="lg"
              className="flex-1 h-14 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-500 hover:from-fuchsia-600 hover:to-purple-600"
            >
              <Play className="w-5 h-5 mr-2" />
              Draw Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Stats Bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-500 text-white shadow-lg shadow-fuchsia-500/20">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Art Challenge</p>
            <p className="text-xs text-muted-foreground">{challenge.prompt}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-gradient-to-r from-fuchsia-500/10 to-purple-500/10 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-800 rounded-lg">
            <Sparkles className="h-3 w-3 mr-1" />
            {colorsUsed.size} colors
          </Badge>
          <Badge variant="outline" className="rounded-lg">
            {strokes} strokes
          </Badge>
        </div>
      </div>

      <Card className="overflow-hidden border-0 shadow-xl">
        <div className="bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-indigo-500/10 p-4">
          {/* Canvas */}
          <div className="rounded-2xl overflow-hidden bg-white shadow-inner border-4 border-white">
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
        </div>
        
        <CardContent className="p-6 space-y-4">
          {/* Tools Row */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={tool === "brush" ? "default" : "outline"}
                size="sm"
                onClick={() => setTool("brush")}
                className={`rounded-xl h-10 px-4 ${tool === "brush" ? "bg-gradient-to-r from-fuchsia-500 to-purple-500" : ""}`}
              >
                <Paintbrush className="w-4 h-4 mr-2" />
                Brush
              </Button>
              <Button
                variant={tool === "eraser" ? "default" : "outline"}
                size="sm"
                onClick={() => setTool("eraser")}
                className={`rounded-xl h-10 px-4 ${tool === "eraser" ? "bg-gradient-to-r from-gray-500 to-slate-500" : ""}`}
              >
                <Eraser className="w-4 h-4 mr-2" />
                Eraser
              </Button>
              <Button variant="outline" size="sm" onClick={clearCanvas} className="rounded-xl h-10 px-4">
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>

            {/* Brush Size */}
            <div className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-2">
              <Circle className="w-3 h-3 text-muted-foreground" />
              <Slider
                value={[brushSize]}
                onValueChange={([v]) => setBrushSize(v)}
                min={2}
                max={24}
                step={2}
                className="w-24"
              />
              <Circle className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          {/* Color Palette */}
          <div className="rounded-xl bg-muted/30 p-4">
            <p className="text-xs font-medium text-muted-foreground mb-3">Color Palette</p>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setColor(c)
                    setTool("brush")
                  }}
                  className={`w-10 h-10 rounded-xl transition-all duration-200 hover:scale-110 ${
                    color === c && tool === "brush" 
                      ? "ring-2 ring-offset-2 ring-fuchsia-500 scale-110 shadow-lg" 
                      : "hover:shadow-md"
                  }`}
                  style={{ 
                    backgroundColor: c,
                    border: c === "#ffffff" ? "2px solid #e5e7eb" : "none"
                  }}
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <Button 
            onClick={submitArt} 
            className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-500 hover:from-fuchsia-600 hover:to-purple-600"
          >
            <Check className="w-5 h-5 mr-2" />
            Submit Artwork
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
