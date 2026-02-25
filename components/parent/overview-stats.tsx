"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { type UserProfile } from "@/lib/auth-context"
import {
  Clock,
  Trophy,
  Flame,
  Brain,
  TrendingUp,
  Target,
} from "lucide-react"

function formatPlayTime(minutes: number) {
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hrs > 0) return `${hrs}h ${mins}m`
  return `${mins}m`
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string
  subtext?: string
  color: string
}) {
  return (
    <Card className="flex items-start gap-4 p-5">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-2xl font-bold text-foreground">{value}</p>
        {subtext && (
          <p className="mt-0.5 text-xs text-muted-foreground">{subtext}</p>
        )}
      </div>
    </Card>
  )
}

export function OverviewStats({ user }: { user: UserProfile }) {
  const avgScore =
    user.gameHistory.length > 0
      ? Math.round(
          user.gameHistory.reduce((sum, g) => sum + g.score, 0) /
            user.gameHistory.length
        )
      : 0

  const latestIq =
    user.iqScores.length > 0
      ? user.iqScores[user.iqScores.length - 1]
      : null

  const dailyLimit = user.parentalControls.maxDailyMinutes
  const todayPlayed = Math.min(user.totalPlayTime % dailyLimit, dailyLimit)
  const dailyProgress = Math.round((todayPlayed / dailyLimit) * 100)

  const categoryBreakdown = user.gameHistory.reduce(
    (acc, g) => {
      acc[g.category] = (acc[g.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const topCategory =
    Object.entries(categoryBreakdown).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0] || "None"

  const categoryLabel: Record<string, string> = {
    math: "Math",
    science: "Science",
    language: "Language Arts",
    coding: "Coding",
    identification: "Identification",
    iq: "IQ Assessment",
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Clock}
          label="Total Play Time"
          value={formatPlayTime(user.totalPlayTime)}
          subtext={`${dailyLimit} min daily limit`}
          color="bg-info/15 text-info"
        />
        <StatCard
          icon={Trophy}
          label="Games Completed"
          value={user.gameHistory.length.toString()}
          subtext={`Avg score: ${avgScore}/100`}
          color="bg-warning/15 text-warning-foreground"
        />
        <StatCard
          icon={Flame}
          label="Current Streak"
          value={`${user.streakDays} days`}
          subtext="Keep it up!"
          color="bg-destructive/15 text-destructive"
        />
        <StatCard
          icon={Brain}
          label="Latest IQ Score"
          value={latestIq ? latestIq.toString() : "Not taken"}
          subtext={
            latestIq
              ? latestIq >= 120
                ? "Superior"
                : latestIq >= 110
                  ? "High Average"
                  : latestIq >= 90
                    ? "Average"
                    : "Below Average"
              : "Take an assessment"
          }
          color="bg-primary/15 text-primary"
        />
        <StatCard
          icon={TrendingUp}
          label="Favorite Category"
          value={categoryLabel[topCategory] || topCategory}
          subtext={`${categoryBreakdown[topCategory] || 0} games played`}
          color="bg-accent/15 text-accent"
        />
        <StatCard
          icon={Target}
          label="Avg Rating Given"
          value={
            user.gameHistory.length > 0
              ? (
                  user.gameHistory.reduce((sum, g) => sum + g.rating, 0) /
                  user.gameHistory.length
                ).toFixed(1)
              : "N/A"
          }
          subtext="Out of 5 stars"
          color="bg-success/15 text-success"
        />
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              Daily Screen Time
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {todayPlayed} of {dailyLimit} minutes used today
            </p>
          </div>
          <span className="text-sm font-semibold text-foreground">
            {dailyProgress}%
          </span>
        </div>
        <Progress value={dailyProgress} className="mt-3 h-3" />
      </Card>
    </div>
  )
}
