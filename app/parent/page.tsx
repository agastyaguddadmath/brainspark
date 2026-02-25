"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { OverviewStats } from "@/components/parent/overview-stats"
import { ActivityLog } from "@/components/parent/activity-log"
import { ControlsPanel } from "@/components/parent/controls-panel"
import { GameRestrictions } from "@/components/parent/game-restrictions"
import { ProgressCharts } from "@/components/parent/progress-charts"
import { IqTracker } from "@/components/parent/iq-tracker"
import {
  Shield,
  LayoutDashboard,
  History,
  Settings,
  Ban,
  BarChart3,
  Brain,
  LogIn,
} from "lucide-react"
import { useEffect } from "react"
import Link from "next/link"

function AccessDenied() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
            <Shield className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-foreground">
            Parent Access Required
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            This dashboard is only accessible to parent accounts. Please sign in
            with a parent account to manage parental controls, view activity, and
            track progress.
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/">Go Home</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/login">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In as Parent
              </Link>
            </Button>
          </div>
          <div className="mt-8 rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">
              Demo parent account:{" "}
              <span className="font-mono font-medium text-foreground">
                parent@brainspark.com
              </span>{" "}
              / password:{" "}
              <span className="font-mono font-medium text-foreground">
                parent123
              </span>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default function ParentDashboard() {
  const { user, isAuthenticated, updateParentalControls } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) return
    if (user.role !== "parent") return
  }, [user, router])

  if (!user || !isAuthenticated || user.role !== "parent") {
    return <AccessDenied />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          {/* Dashboard Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-primary text-lg text-primary-foreground">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    Parent Dashboard
                  </h1>
                  <Badge className="bg-primary/15 text-primary">
                    <Shield className="mr-1 h-3 w-3" />
                    Parent
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Monitor activity, set controls, and track {user.name}
                  {"'s"} learning progress
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="mt-8">
            <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="gap-1.5 rounded-lg border border-border bg-card px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="gap-1.5 rounded-lg border border-border bg-card px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
              <TabsTrigger
                value="progress"
                className="gap-1.5 rounded-lg border border-border bg-card px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Progress</span>
              </TabsTrigger>
              <TabsTrigger
                value="iq"
                className="gap-1.5 rounded-lg border border-border bg-card px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">IQ Scores</span>
              </TabsTrigger>
              <TabsTrigger
                value="controls"
                className="gap-1.5 rounded-lg border border-border bg-card px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Controls</span>
              </TabsTrigger>
              <TabsTrigger
                value="restrictions"
                className="gap-1.5 rounded-lg border border-border bg-card px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                <Ban className="h-4 w-4" />
                <span className="hidden sm:inline">Game Restrictions</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="overview">
                <OverviewStats user={user} />
              </TabsContent>

              <TabsContent value="activity">
                <ActivityLog history={user.gameHistory} />
              </TabsContent>

              <TabsContent value="progress">
                <ProgressCharts history={user.gameHistory} />
              </TabsContent>

              <TabsContent value="iq">
                <IqTracker scores={user.iqScores} />
              </TabsContent>

              <TabsContent value="controls">
                <ControlsPanel
                  controls={user.parentalControls}
                  onSave={updateParentalControls}
                />
              </TabsContent>

              <TabsContent value="restrictions">
                <GameRestrictions
                  controls={user.parentalControls}
                  onSave={updateParentalControls}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
