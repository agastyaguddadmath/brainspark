"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Game } from "@/lib/game-data"
import { Sparkles, RotateCcw, Eye, EyeOff } from "lucide-react"

interface MemoryGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

const symbols = ["🌟", "🎈", "🌈", "🎪", "🎭", "🎨", "🎯", "🎲", "🎮", "🎸", "🎹", "🎻"]
const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899"]

interface Card {
  id: number
  symbol: string
  color: string
  isFlipped: boolean
  isMatched: boolean
}

function createCards(pairCount: number): Card[] {
  const selectedSymbols = symbols.slice(0, pairCount)
  const selectedColors = colors.slice(0, pairCount)
  const cards: Card[] = []
  
  selectedSymbols.forEach((symbol, index) => {
    const color = selectedColors[index]
    cards.push(
      { id: index * 2, symbol, color, isFlipped: false, isMatched: false },
      { id: index * 2 + 1, symbol, color, isFlipped: false, isMatched: false }
    )
  })
  
  return cards.sort(() => Math.random() - 0.5)
}

export function MemoryGame({ game, onComplete }: MemoryGameProps) {
  const pairCount = game.difficulty === "easy" ? 6 : game.difficulty === "medium" ? 8 : 10
  const [cards, setCards] = useState(() => createCards(pairCount))
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [finished, setFinished] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const hasCompletedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const progress = (matchedPairs / pairCount) * 100

  // Preview cards for a few seconds at start
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreview(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (matchedPairs === pairCount && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      setFinished(true)
      // Calculate score based on efficiency (fewer moves = higher score)
      const perfectMoves = pairCount
      const efficiency = Math.max(0, 1 - (moves - perfectMoves) / (pairCount * 3))
      const finalScore = Math.round(efficiency * game.maxScore)
      onCompleteRef.current(finalScore, game.maxScore)
    }
  }, [matchedPairs, pairCount, moves, game.maxScore])

  const handleCardClick = useCallback((cardId: number) => {
    if (showPreview || isChecking) return
    if (flippedCards.length >= 2) return
    
    const card = cards.find(c => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    const newCards = cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    )
    setCards(newCards)
    
    const newFlipped = [...flippedCards, cardId]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setIsChecking(true)
      setMoves(m => m + 1)
      
      const [first, second] = newFlipped
      const firstCard = newCards.find(c => c.id === first)
      const secondCard = newCards.find(c => c.id === second)
      
      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        // Match found
        setTimeout(() => {
          setCards(cards => cards.map(c => 
            c.id === first || c.id === second ? { ...c, isMatched: true } : c
          ))
          setMatchedPairs(m => m + 1)
          setFlippedCards([])
          setIsChecking(false)
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards(cards => cards.map(c => 
            c.id === first || c.id === second ? { ...c, isFlipped: false } : c
          ))
          setFlippedCards([])
          setIsChecking(false)
        }, 1000)
      }
    }
  }, [cards, flippedCards, isChecking, showPreview])

  const resetGame = () => {
    setCards(createCards(pairCount))
    setFlippedCards([])
    setMoves(0)
    setMatchedPairs(0)
    setFinished(false)
    setShowPreview(true)
    hasCompletedRef.current = false
    
    setTimeout(() => {
      setShowPreview(false)
    }, 3000)
  }

  if (finished) {
    const efficiency = Math.max(0, 1 - (moves - pairCount) / (pairCount * 3))
    const finalScore = Math.round(efficiency * game.maxScore)
    const percentage = Math.round((finalScore / game.maxScore) * 100)
    
    return (
      <div className="p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        </motion.div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Memory Master!</h2>
        <p className="text-muted-foreground mb-2">
          You completed the game in {moves} moves!
        </p>
        <p className="text-muted-foreground mb-6">
          Score: {finalScore} out of {game.maxScore} ({percentage}%)
        </p>
        <Button onClick={resetGame} size="lg" className="gap-2">
          <RotateCcw className="w-4 h-4" /> Play Again
        </Button>
      </div>
    )
  }

  const gridCols = pairCount <= 6 ? "grid-cols-4" : pairCount <= 8 ? "grid-cols-4" : "grid-cols-5"

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground flex items-center gap-2">
          {showPreview ? (
            <>
              <Eye className="w-4 h-4" /> Memorize the cards...
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4" /> Find the pairs!
            </>
          )}
        </span>
        <span className="text-sm font-medium text-foreground">Moves: {moves}</span>
      </div>
      
      <Progress value={progress} className="h-2 mb-6" />

      <div className={`grid ${gridCols} gap-2 md:gap-3`}>
        {cards.map(card => (
          <motion.button
            key={card.id}
            whileHover={{ scale: (card.isFlipped || card.isMatched || showPreview) ? 1 : 1.05 }}
            whileTap={{ scale: (card.isFlipped || card.isMatched || showPreview) ? 1 : 0.95 }}
            onClick={() => handleCardClick(card.id)}
            className={`
              aspect-square rounded-xl text-2xl md:text-3xl transition-all duration-300
              ${card.isMatched 
                ? "bg-green-500/20 border-2 border-green-500" 
                : card.isFlipped || showPreview
                  ? "bg-card border-2 border-primary"
                  : "bg-primary/10 border-2 border-border hover:border-primary/50"
              }
            `}
            style={{
              transform: (card.isFlipped || showPreview || card.isMatched) ? "rotateY(0)" : "rotateY(180deg)",
              transformStyle: "preserve-3d"
            }}
          >
            <motion.div
              initial={false}
              animate={{ 
                opacity: (card.isFlipped || showPreview || card.isMatched) ? 1 : 0,
                scale: card.isMatched ? [1, 1.2, 1] : 1
              }}
              className="w-full h-full flex items-center justify-center"
              style={{ color: card.color }}
            >
              {(card.isFlipped || showPreview || card.isMatched) ? card.symbol : ""}
            </motion.div>
          </motion.button>
        ))}
      </div>

      {showPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center text-sm text-muted-foreground"
        >
          Cards will be hidden in a few seconds...
        </motion.div>
      )}
    </div>
  )
}
