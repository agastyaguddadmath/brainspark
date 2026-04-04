"use client"

import { use, useCallback, useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getGameById, getCategoryById } from "@/lib/game-data"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MathGame } from "@/components/games/math-game"
import { ScienceGame } from "@/components/games/science-game"
import { WordGame } from "@/components/games/word-game"
import { CodingGame } from "@/components/games/coding-game"
import { ArtGame } from "@/components/games/art-game"
import { MusicGame } from "@/components/games/music-game"
import { GeographyGame } from "@/components/games/geography-game"
import { CountingGame } from "@/components/games/counting-game"
import { ShapeExplorerGame } from "@/components/games/shape-explorer-game"
import { ColorMatchGame } from "@/components/games/color-match-game"
import { AnimalSafariGame } from "@/components/games/animal-safari-game"
import { PatternFinderGame } from "@/components/games/pattern-finder-game"
import { MemoryGame } from "@/components/games/memory-game"
import { PianoGame } from "@/components/games/piano-game"
import { DrumGame } from "@/components/games/drum-game"
import { RhythmGame } from "@/components/games/rhythm-game"
import { ColoringGame } from "@/components/games/coloring-game"
import { PixelArtGame } from "@/components/games/pixel-art-game"
import { GameLoading } from "@/components/games/game-loading"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Lock, LogIn, Clock, Users, Star } from "lucide-react"
import { toast } from "sonner"

export default function GamePlayPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { user, isGuest, addGameScore } = useAuth()
  const router = useRouter()
  const game = getGameById(id)
  const category = game ? getCategoryById(game.category) : null
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate game loading time for a smooth experience
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [id])

  const handleGameComplete = useCallback((score: number, maxScore: number) => {
    const stars = Math.ceil((score / maxScore) * 5)
    if (game && user) {
      addGameScore({
        gameId: game.id,
        gameName: game.name,
        category: game.category,
        score,
        maxScore,
        rating: stars,
        completedAt: new Date().toISOString(),
        ageGroup: user.ageGroup,
      })
    }
    toast.success(`Great job! You scored ${score}/${maxScore}`, {
      description: `You earned ${stars} star${stars !== 1 ? 's' : ''}!`,
    })
  }, [game, user, addGameScore])

  if (!game) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-16">
          <h1 className="text-2xl font-bold text-foreground">Game Not Found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This game does not exist or has been removed.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/games">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Link>
          </Button>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const needsAuth = !game.guestAllowed && (!user || isGuest)

  if (needsAuth) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-16">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-foreground">
              Sign In to Play
            </h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{game.name}</span>{" "}
              requires a free account. Sign in or create an account to access
              this game and track your progress.
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild>
                <Link href="/auth/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/signup">Create Account</Link>
              </Button>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

function renderGame() {
    const gameId = game!.id
    
    // Route to specific game components based on game ID
    switch (gameId) {
      // Math games
      case "math-counting":
        return <CountingGame game={game!} onComplete={handleGameComplete} />
      case "math-geometry":
        return <ShapeExplorerGame game={game!} onComplete={handleGameComplete} />
      case "math-addition":
      case "math-multiplication":
      case "math-fractions":
      case "math-algebra":
        return <MathGame game={game!} onComplete={handleGameComplete} />
      
      // Identification games
      case "id-colors":
        return <ColorMatchGame game={game!} onComplete={handleGameComplete} />
      case "id-animals":
        return <AnimalSafariGame game={game!} onComplete={handleGameComplete} />
      case "id-patterns":
        return <PatternFinderGame game={game!} onComplete={handleGameComplete} />
      case "id-flags":
        return <GeographyGame game={game!} onComplete={handleGameComplete} />
      
      // IQ games
      case "iq-memory":
        return <MemoryGame game={game!} onComplete={handleGameComplete} />
      case "iq-logic":
      case "iq-spatial":
        return <ScienceGame game={game!} onComplete={handleGameComplete} />
      
      // Music games
      case "music-piano":
        return <PianoGame game={game!} onComplete={handleGameComplete} />
      case "music-drums":
        return <DrumGame game={game!} onComplete={handleGameComplete} />
      case "music-rhythm":
        return <RhythmGame game={game!} onComplete={handleGameComplete} />
      case "music-notes":
      case "music-composer":
        return <MusicGame game={game!} onComplete={handleGameComplete} />
      
      // Art games
      case "art-coloring":
        return <ColoringGame game={game!} onComplete={handleGameComplete} />
      case "art-pixel":
        return <PixelArtGame game={game!} onComplete={handleGameComplete} />
      case "art-drawing":
      case "art-animation":
        return <ArtGame game={game!} onComplete={handleGameComplete} />
      
      // Geography games
      case "geo-capitals":
      case "geo-flags":
      case "geo-continents":
      case "geo-landmarks":
      case "geo-oceans":
      case "geo-countries":
      case "geo-mountains":
        return <GeographyGame game={game!} onComplete={handleGameComplete} />
      
      // Science games
      case "sci-space":
      case "sci-lab":
      case "sci-body":
      case "sci-nature":
      case "sci-chemistry":
        return <ScienceGame game={game!} onComplete={handleGameComplete} />
      
      // Language games
      case "lang-words":
      case "lang-phonics":
      case "lang-spelling":
      case "lang-story":
      case "lang-reading":
        return <WordGame game={game!} onComplete={handleGameComplete} />
      
      // Coding games
      case "code-blocks":
      case "code-sequence":
      case "code-loops":
      case "code-debug":
      case "code-game":
        return <CodingGame game={game!} onComplete={handleGameComplete} />
      
      // Fallback to category-based routing
      default:
        switch (game!.category) {
          case "math":
            return <MathGame game={game!} onComplete={handleGameComplete} />
          case "science":
            return <ScienceGame game={game!} onComplete={handleGameComplete} />
          case "identification":
            return <ColorMatchGame game={game!} onComplete={handleGameComplete} />
          case "iq":
            return <ScienceGame game={game!} onComplete={handleGameComplete} />
          case "language":
            return <WordGame game={game!} onComplete={handleGameComplete} />
          case "coding":
            return <CodingGame game={game!} onComplete={handleGameComplete} />
          case "art":
            return <ArtGame game={game!} onComplete={handleGameComplete} />
          case "music":
            return <MusicGame game={game!} onComplete={handleGameComplete} />
          case "geography":
            return <GeographyGame game={game!} onComplete={handleGameComplete} />
          default:
            return <MathGame game={game!} onComplete={handleGameComplete} />
        }
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/games">
                  <ArrowLeft className="h-5 w-5" />
                  <span className="sr-only">Back to games</span>
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground">
                    {game.name}
                  </h1>
                  {category && (
                    <Badge
                      variant="secondary"
                      className={`border-0 ${category.bgColor} ${category.color}`}
                    >
                      {category.name}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {game.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {game.duration}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {game.playCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                {game.rating}
              </span>
            </div>
          </div>

          <Card className="overflow-hidden">
            {isLoading ? (
              <GameLoading gameName={game.name} category={game.category} />
            ) : (
              renderGame()
            )}
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
