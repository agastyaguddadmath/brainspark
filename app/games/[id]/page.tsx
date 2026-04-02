"use client"

import { use, useCallback } from "react"
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
  const isRestricted =
    user && !isGuest && user.parentalControls.restrictedGames.includes(game.id)

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

  if (isRestricted) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-16">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
              <Lock className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-foreground">
              Game Restricted
            </h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{game.name}</span>{" "}
              has been restricted by your parent. Ask them to unblock this game
              from the Parent Dashboard.
            </p>
            <Button className="mt-6" variant="outline" asChild>
              <Link href="/games">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Games
              </Link>
            </Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  function renderGame() {
    switch (game!.category) {
      case "math":
        return <MathGame game={game!} onComplete={handleGameComplete} />
      case "science":
      case "identification":
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

          <Card className="overflow-hidden">{renderGame()}</Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
