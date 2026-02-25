"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type GameScore } from "@/lib/auth-context"
import { Star, Calendar, Trophy } from "lucide-react"

const categoryColors: Record<string, string> = {
  math: "bg-[oklch(0.55_0.2_250/0.12)] text-[oklch(0.45_0.2_250)]",
  science: "bg-[oklch(0.7_0.18_150/0.12)] text-[oklch(0.5_0.18_150)]",
  language: "bg-[oklch(0.7_0.2_50/0.12)] text-[oklch(0.5_0.2_50)]",
  coding: "bg-[oklch(0.65_0.2_330/0.12)] text-[oklch(0.45_0.2_330)]",
  identification: "bg-[oklch(0.6_0.15_200/0.12)] text-[oklch(0.45_0.15_200)]",
  iq: "bg-[oklch(0.55_0.2_250/0.12)] text-[oklch(0.45_0.2_250)]",
}

function getScoreColor(score: number, maxScore: number) {
  const pct = (score / maxScore) * 100
  if (pct >= 90) return "text-success"
  if (pct >= 70) return "text-primary"
  if (pct >= 50) return "text-warning-foreground"
  return "text-destructive"
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function ActivityRow({ score }: { score: GameScore }) {
  const pct = Math.round((score.score / score.maxScore) * 100)

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-secondary/50">
      <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:flex">
        <Trophy className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {score.gameName}
          </p>
          <Badge
            variant="secondary"
            className={`shrink-0 border-0 text-xs ${categoryColors[score.category] || ""}`}
          >
            {score.category}
          </Badge>
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(score.completedAt)}
          </span>
          <span className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < score.rating
                    ? "fill-warning text-warning"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </span>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className={`text-lg font-bold ${getScoreColor(score.score, score.maxScore)}`}>
          {score.score}
        </p>
        <p className="text-xs text-muted-foreground">{pct}%</p>
      </div>
    </div>
  )
}

export function ActivityLog({ history }: { history: GameScore[] }) {
  const sorted = [...history].sort(
    (a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )

  if (sorted.length === 0) {
    return (
      <Card className="flex flex-col items-center p-12 text-center">
        <Trophy className="h-12 w-12 text-muted-foreground/40" />
        <p className="mt-4 text-sm font-medium text-foreground">
          No activity yet
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Games completed by your child will appear here.
        </p>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          {sorted.length} games completed
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {sorted.map((score, i) => (
          <ActivityRow key={`${score.gameId}-${i}`} score={score} />
        ))}
      </div>
    </div>
  )
}
