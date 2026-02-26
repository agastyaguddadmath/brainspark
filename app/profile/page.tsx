"use client"

import { useAuth } from "@/lib/auth-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import {
  User,
  Mail,
  Calendar,
  Trophy,
  Clock,
  Flame,
  Shield,
  ArrowLeft,
  LogIn,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const ageGroupLabels = {
  kindergarten: "Kindergarten (4-5)",
  below8: "Elementary (6-7)",
  below14: "Junior (8-13)",
}

export default function ProfilePage() {
  const { user, isGuest, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || "")

  if (!user || isGuest) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-16">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-foreground">
              Sign In to View Profile
            </h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Create an account or sign in to view and manage your profile,
              track your progress, and access all features.
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

  const handleSave = () => {
    if (name.trim()) {
      updateProfile({
        name: name.trim(),
        avatar: name
          .trim()
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
      })
      setIsEditing(false)
      toast.success("Profile updated successfully")
    }
  }

  const stats = [
    {
      icon: Trophy,
      label: "Games Completed",
      value: user.gameHistory.length,
    },
    {
      icon: Clock,
      label: "Total Play Time",
      value: `${Math.floor(user.totalPlayTime / 60)}h ${user.totalPlayTime % 60}m`,
    },
    {
      icon: Flame,
      label: "Day Streak",
      value: user.streakDays,
    },
  ]

  const avgScore = user.gameHistory.length
    ? Math.round(
        user.gameHistory.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) /
          user.gameHistory.length
      )
    : 0

  const avgIq = user.iqScores.length
    ? Math.round(user.iqScores.reduce((a, b) => a + b, 0) / user.iqScores.length)
    : null

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardContent className="flex flex-col items-center pt-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl font-bold text-foreground">
                  {user.name}
                </h2>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {user.role}
                  </Badge>
                  {user.role === "parent" && (
                    <Badge variant="outline" className="bg-accent/10 text-accent">
                      <Shield className="mr-1 h-3 w-3" />
                      Admin
                    </Badge>
                  )}
                </div>
                <Separator className="my-4 w-full" />
                <div className="w-full space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{ageGroupLabels[user.ageGroup]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined{" "}
                      {new Date(user.joinedAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6 md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stats Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="flex flex-col items-center rounded-lg bg-secondary/50 p-4 text-center"
                      >
                        <stat.icon className="h-5 w-5 text-primary" />
                        <span className="mt-2 text-2xl font-bold text-foreground">
                          {stat.value}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-border bg-card p-4 text-center">
                      <span className="text-sm text-muted-foreground">
                        Average Score
                      </span>
                      <p className="mt-1 text-2xl font-bold text-foreground">
                        {avgScore}%
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4 text-center">
                      <span className="text-sm text-muted-foreground">
                        Estimated IQ
                      </span>
                      <p className="mt-1 text-2xl font-bold text-foreground">
                        {avgIq ?? "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Profile Settings</CardTitle>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setName(user.name)
                        setIsEditing(true)
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                      />
                    ) : (
                      <p className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
                        {user.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ageGroup">Age Group</Label>
                    {isEditing ? (
                      <Select
                        value={user.ageGroup}
                        onValueChange={(val) =>
                          updateProfile({
                            ageGroup: val as "kindergarten" | "below8" | "below14",
                          })
                        }
                      >
                        <SelectTrigger id="ageGroup">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kindergarten">
                            Kindergarten (4-5)
                          </SelectItem>
                          <SelectItem value="below8">Elementary (6-7)</SelectItem>
                          <SelectItem value="below14">Junior (8-13)</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
                        {ageGroupLabels[user.ageGroup]}
                      </p>
                    )}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSave}>Save Changes</Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
