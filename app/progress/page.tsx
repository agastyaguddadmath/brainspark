"use client"

import { useAuth } from "@/lib/auth-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProgressCharts } from "@/components/progress/progress-charts"
import { IqTracker } from "@/components/progress/iq-tracker"
import { ActivityLog } from "@/components/progress/activity-log"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { BarChart3, Brain, History, LogIn, Trophy, Flame, Target } from "lucide-react"
import Link from "next/link"

function formatPlayTime(minutes: number) {
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hrs > 0) return `${hrs}h ${mins}m`
  return `${mins}m`
}

export default function ProgressPage() {
  const { user, isAuthenticated, isGuest } = useAuth()

  if (!user || !isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-16">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-foreground">
              Track Your Learning
            </h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Sign in to view your progress, scores, and IQ assessments.
              {isGuest && " Guest mode does not save progress."}
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

  const avgScore =
    user.gameHistory.length > 0
      ? Math.round(
          user.gameHistory.reduce((sum, g) => sum + g.score, 0) /
            user.gameHistory.length
        )
      : 0

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-foreground">My Progress</h1>
            <p className="text-sm text-muted-foreground">
              Track your learning journey across all categories
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Games Played</p>
                <p className="text-xl font-bold text-foreground">
                  {user.gameHistory.length}
                </p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-success/15">
                <Target className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Score</p>
                <p className="text-xl font-bold text-foreground">{avgScore}%</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-destructive/15">
                <Flame className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Streak</p>
                <p className="text-xl font-bold text-foreground">
                  {user.streakDays} days
                </p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-info/15">
                <Brain className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Play Time</p>
                <p className="text-xl font-bold text-foreground">
                  {formatPlayTime(user.totalPlayTime)}
                </p>
              </div>
            </Card>
          </div>

          <Tabs defaultValue="charts" className="mt-8">
            <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
              <TabsTrigger
                value="charts"
                className="gap-1.5 rounded-lg border border-border bg-card px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                <BarChart3 className="h-4 w-4" />
                Charts
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="gap-1.5 rounded-lg border border-border bg-card px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
              <TabsTrigger
                value="iq"
                className="gap-1.5 rounded-lg border border-border bg-card px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                <Brain className="h-4 w-4" />
                IQ Scores
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="charts">
                <ProgressCharts history={user.gameHistory} />
              </TabsContent>
              <TabsContent value="history">
                <ActivityLog history={user.gameHistory} />
              </TabsContent>
              <TabsContent value="iq">
                <IqTracker scores={user.iqScores} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
