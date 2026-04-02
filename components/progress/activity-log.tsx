"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { GameScore } from "@/lib/auth-context"
import { Star, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const CATEGORY_COLORS: Record<string, string> = {
  math: "bg-red-500/10 text-red-600",
  science: "bg-green-500/10 text-green-600",
  language: "bg-blue-500/10 text-blue-600",
  coding: "bg-purple-500/10 text-purple-600",
  identification: "bg-amber-500/10 text-amber-600",
  art: "bg-pink-500/10 text-pink-600",
  music: "bg-cyan-500/10 text-cyan-600",
  geography: "bg-emerald-500/10 text-emerald-600",
  iq: "bg-violet-500/10 text-violet-600",
}

interface ActivityLogProps {
  history: GameScore[]
}

export function ActivityLog({ history }: ActivityLogProps) {
  if (history.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-lg font-medium text-foreground">No activity yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Your game history will appear here after you play some games.
        </p>
      </Card>
    )
  }

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )

  return (
    <Card className="divide-y divide-border">
      {sortedHistory.map((game, index) => (
        <div key={`${game.gameId}-${index}`} className="flex items-center gap-4 p-4">
          <div className="flex-1">
            <p className="font-medium text-foreground">{game.gameName}</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge
                variant="secondary"
                className={CATEGORY_COLORS[game.category] || "bg-muted text-muted-foreground"}
              >
                {game.category.charAt(0).toUpperCase() + game.category.slice(1)}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(game.completedAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-foreground">
              {game.score}/{game.maxScore}
            </p>
            <div className="flex items-center justify-end gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < game.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </Card>
  )
}
