"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette, RotateCcw, Check, Sparkles } from "lucide-react"
import type { Game } from "@/lib/game-data"

interface ColoringGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

interface ColorSection {
  id: string
  path: string
  targetColor: string
  currentColor: string
  name: string
}

// Simple coloring templates
const coloringTemplates = [
  {
    name: "Happy Sun",
    sections: [
      { id: "sun", path: "M150,150 m-60,0 a60,60 0 1,0 120,0 a60,60 0 1,0 -120,0", targetColor: "#FFD700", currentColor: "#E5E7EB", name: "Sun" },
      { id: "ray1", path: "M150,60 L150,20", targetColor: "#FFA500", currentColor: "#E5E7EB", name: "Ray" },
      { id: "ray2", path: "M150,240 L150,280", targetColor: "#FFA500", currentColor: "#E5E7EB", name: "Ray" },
      { id: "ray3", path: "M60,150 L20,150", targetColor: "#FFA500", currentColor: "#E5E7EB", name: "Ray" },
      { id: "ray4", path: "M240,150 L280,150", targetColor: "#FFA500", currentColor: "#E5E7EB", name: "Ray" },
    ]
  },
  {
    name: "Cute Flower",
    sections: [
      { id: "petal1", path: "M150,80 Q180,50 150,20 Q120,50 150,80", targetColor: "#FF69B4", currentColor: "#E5E7EB", name: "Petal" },
      { id: "petal2", path: "M220,150 Q250,120 280,150 Q250,180 220,150", targetColor: "#FF69B4", currentColor: "#E5E7EB", name: "Petal" },
      { id: "petal3", path: "M150,220 Q180,250 150,280 Q120,250 150,220", targetColor: "#FF69B4", currentColor: "#E5E7EB", name: "Petal" },
      { id: "petal4", path: "M80,150 Q50,120 20,150 Q50,180 80,150", targetColor: "#FF69B4", currentColor: "#E5E7EB", name: "Petal" },
      { id: "center", path: "M150,150 m-30,0 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0", targetColor: "#FFD700", currentColor: "#E5E7EB", name: "Center" },
      { id: "stem", path: "M150,180 L150,280 Q150,300 130,300", targetColor: "#22C55E", currentColor: "#E5E7EB", name: "Stem" },
    ]
  },
  {
    name: "Rainbow",
    sections: [
      { id: "red", path: "M50,200 Q150,50 250,200", targetColor: "#EF4444", currentColor: "#E5E7EB", name: "Red Arc" },
      { id: "orange", path: "M70,200 Q150,70 230,200", targetColor: "#F97316", currentColor: "#E5E7EB", name: "Orange Arc" },
      { id: "yellow", path: "M90,200 Q150,90 210,200", targetColor: "#EAB308", currentColor: "#E5E7EB", name: "Yellow Arc" },
      { id: "green", path: "M110,200 Q150,110 190,200", targetColor: "#22C55E", currentColor: "#E5E7EB", name: "Green Arc" },
      { id: "blue", path: "M130,200 Q150,130 170,200", targetColor: "#3B82F6", currentColor: "#E5E7EB", name: "Blue Arc" },
    ]
  }
]

const colors = [
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Gold", value: "#FFD700" },
  { name: "Green", value: "#22C55E" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#FF69B4" },
]

export function ColoringGame({ game, onComplete }: ColoringGameProps) {
  const [templateIndex, setTemplateIndex] = useState(0)
  const [sections, setSections] = useState<ColorSection[]>([])
  const [selectedColor, setSelectedColor] = useState(colors[0].value)
  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const hasCompletedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    // Initialize with a random template
    const randomIndex = Math.floor(Math.random() * coloringTemplates.length)
    setTemplateIndex(randomIndex)
    setSections(coloringTemplates[randomIndex].sections.map(s => ({ ...s })))
  }, [])

  const handleSectionClick = (sectionId: string) => {
    if (completed) return

    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return { ...section, currentColor: selectedColor }
      }
      return section
    }))
  }

  const checkCompletion = () => {
    let correctCount = 0
    sections.forEach(section => {
      if (section.currentColor === section.targetColor) {
        correctCount++
      }
    })
    
    const calculatedScore = Math.round((correctCount / sections.length) * game.maxScore)
    setScore(calculatedScore)
    setCompleted(true)
    
    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true
      onCompleteRef.current(calculatedScore, game.maxScore)
    }
  }

  const resetDrawing = () => {
    setSections(coloringTemplates[templateIndex].sections.map(s => ({ ...s })))
  }

  const template = coloringTemplates[templateIndex]

  if (completed) {
    return (
      <div className="p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Beautiful Art!</h2>
          <p className="text-xl text-muted-foreground">You colored {template?.name}</p>
        </motion.div>
        
        <div className="bg-muted rounded-2xl p-6 mb-6 inline-block">
          <svg viewBox="0 0 300 300" className="w-48 h-48">
            {sections.map((section) => (
              <path
                key={section.id}
                d={section.path}
                fill={section.id.includes("ray") || section.id.includes("stem") || section.id.includes("Arc") ? "none" : section.currentColor}
                stroke={section.currentColor}
                strokeWidth={section.id.includes("ray") || section.id.includes("stem") ? "8" : section.id.includes("Arc") ? "15" : "3"}
                strokeLinecap="round"
              />
            ))}
          </svg>
        </div>

        <Badge className="text-2xl px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500">
          Score: {score}/{game.maxScore}
        </Badge>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-foreground mb-1">Color the {template?.name}!</h2>
        <p className="text-muted-foreground">Click on a part, then choose a color</p>
      </div>

      {/* Canvas */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <svg 
            viewBox="0 0 300 300" 
            className="w-full max-w-[300px] mx-auto cursor-pointer"
          >
            {sections.map((section) => (
              <motion.path
                key={section.id}
                d={section.path}
                fill={section.id.includes("ray") || section.id.includes("stem") || section.id.includes("Arc") ? "none" : section.currentColor}
                stroke={section.currentColor}
                strokeWidth={section.id.includes("ray") || section.id.includes("stem") ? "8" : section.id.includes("Arc") ? "15" : "3"}
                strokeLinecap="round"
                onClick={() => handleSectionClick(section.id)}
                whileHover={{ scale: 1.05, opacity: 0.8 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer transition-colors"
              />
            ))}
          </svg>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <div className="mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Palette className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Choose a color:</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {colors.map((color) => (
            <motion.button
              key={color.value}
              onClick={() => setSelectedColor(color.value)}
              className={`w-10 h-10 rounded-full border-4 ${
                selectedColor === color.value ? "border-foreground scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: color.value }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-3">
        <Button
          variant="outline"
          onClick={resetDrawing}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
        <Button
          onClick={checkCompletion}
          className="gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
        >
          <Check className="w-4 h-4" />
          Done!
        </Button>
      </div>
    </div>
  )
}
