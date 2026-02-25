"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, Lock, Play, Users } from "lucide-react"
import { type Game, getDifficultyColor, getAgeGroupLabel, getCategoryById } from "@/lib/game-data"
import { useAuth } from "@/lib/auth-context"

const gameColors: Record<string, string> = {
  math: "from-[oklch(0.55_0.2_250)] to-[oklch(0.65_0.18_270)]",
  science: "from-[oklch(0.6_0.18_150)] to-[oklch(0.7_0.16_170)]",
  language: "from-[oklch(0.65_0.2_50)] to-[oklch(0.75_0.18_30)]",
  coding: "from-[oklch(0.55_0.2_330)] to-[oklch(0.65_0.18_310)]",
  identification: "from-[oklch(0.5_0.15_200)] to-[oklch(0.6_0.13_220)]",
  iq: "from-[oklch(0.45_0.2_250)] to-[oklch(0.55_0.18_270)]",
}

export function GameCard({ game }: { game: Game }) {
  const { user, isGuest } = useAuth()
  const category = getCategoryById(game.category)
  const isLocked = !game.guestAllowed && (isGuest || !user)

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg">
      <div
        className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${
          gameColors[game.category] || "from-primary to-primary/80"
        }`}
      >
        {category && (
          <category.icon className="h-16 w-16 text-card/30" />
        )}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-1">
              <Lock className="h-6 w-6 text-card" />
              <span className="text-xs font-medium text-card">Sign in to play</span>
            </div>
          </div>
        )}
        <div className="absolute right-3 top-3 flex gap-1.5">
          <Badge className={`${getDifficultyColor(game.difficulty)} border-0 text-xs`}>
            {game.difficulty}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-foreground">{game.name}</h3>
          <div className="flex items-center gap-1 text-sm text-warning">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-xs">{game.rating}</span>
          </div>
        </div>
        <p className="mt-1 flex-1 text-sm text-muted-foreground">
          {game.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {game.ageGroups.map((ag) => (
            <Badge key={ag} variant="secondary" className="text-xs">
              {getAgeGroupLabel(ag)}
            </Badge>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {game.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {game.playCount.toLocaleString()} plays
            </span>
          </div>
        </div>
        <Button
          className="mt-3 w-full gap-2"
          variant={isLocked ? "secondary" : "default"}
          asChild={!isLocked}
          disabled={isLocked}
        >
          {isLocked ? (
            <span>
              <Lock className="h-4 w-4" />
              Sign in required
            </span>
          ) : (
            <Link href={`/games/${game.id}`}>
              <Play className="h-4 w-4" />
              Play Now
            </Link>
          )}
        </Button>
      </div>
    </div>
  )
}
