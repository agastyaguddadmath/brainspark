"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { games, getCategoryById, getDifficultyColor, getAgeGroupLabel } from "@/lib/game-data"
import { type ParentalControls } from "@/lib/auth-context"
import { toast } from "sonner"
import {
  Search,
  Ban,
  CheckCircle2,
  Lock,
  Unlock,
  Save,
} from "lucide-react"

interface GameRestrictionsProps {
  controls: ParentalControls
  onSave: (controls: Partial<ParentalControls>) => void
}

export function GameRestrictions({ controls, onSave }: GameRestrictionsProps) {
  const [restricted, setRestricted] = useState<string[]>(
    controls.restrictedGames
  )
  const [search, setSearch] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  const availableGames = games.filter((g) =>
    controls.allowedCategories.includes(g.category)
  )

  const filteredGames = availableGames.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.category.toLowerCase().includes(search.toLowerCase())
  )

  function toggleRestriction(gameId: string) {
    setRestricted((prev) => {
      const next = prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId]
      setHasChanges(true)
      return next
    })
  }

  function handleSave() {
    onSave({ restrictedGames: restricted })
    setHasChanges(false)
    toast.success("Game restrictions updated")
  }

  const restrictedCount = restricted.length
  const totalCount = availableGames.length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-xs">
              {restrictedCount} restricted
            </Badge>
            <Badge variant="outline" className="text-xs">
              {totalCount - restrictedCount} available
            </Badge>
          </div>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {filteredGames.map((game) => {
          const isRestricted = restricted.includes(game.id)
          const category = getCategoryById(game.category)

          return (
            <Card
              key={game.id}
              className={`flex items-center gap-4 p-4 transition-all ${
                isRestricted
                  ? "border-destructive/20 bg-destructive/5"
                  : "hover:bg-secondary/50"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                {category && (
                  <category.icon className={`h-5 w-5 ${category.color}`} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {game.name}
                  </p>
                  <Badge
                    className={`shrink-0 border-0 text-xs ${getDifficultyColor(game.difficulty)}`}
                  >
                    {game.difficulty}
                  </Badge>
                  {isRestricted && (
                    <Badge variant="destructive" className="shrink-0 text-xs">
                      <Ban className="mr-1 h-3 w-3" />
                      Blocked
                    </Badge>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {game.ageGroups.map((ag) => (
                    <span key={ag} className="text-xs text-muted-foreground">
                      {getAgeGroupLabel(ag)}
                    </span>
                  ))}
                </div>
              </div>

              <Button
                variant={isRestricted ? "outline" : "destructive"}
                size="sm"
                className="shrink-0 gap-1.5 text-xs"
                onClick={() => toggleRestriction(game.id)}
              >
                {isRestricted ? (
                  <>
                    <Unlock className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Unblock</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Block</span>
                  </>
                )}
              </Button>
            </Card>
          )
        })}
      </div>

      {filteredGames.length === 0 && (
        <Card className="flex flex-col items-center p-12 text-center">
          <Search className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium text-foreground">
            No games found
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try a different search term or check your category settings.
          </p>
        </Card>
      )}

      {hasChanges && (
        <div className="sticky bottom-4 flex items-center justify-between rounded-2xl border border-primary/20 bg-card p-4 shadow-lg">
          <p className="text-sm font-medium text-foreground">
            {restrictedCount} games blocked
          </p>
          <Button size="sm" onClick={handleSave}>
            <Save className="mr-1.5 h-3.5 w-3.5" />
            Save Restrictions
          </Button>
        </div>
      )}
    </div>
  )
}
