"use client"

import { useState, useMemo } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { GameCard } from "@/components/game-card"
import { games, categories } from "@/lib/game-data"
import { useAuth, type AgeGroup } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function GamesContent() {
  const searchParams = useSearchParams()
  const initialAge = searchParams.get("age") as AgeGroup | null
  const { user } = useAuth()
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(initialAge)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      if (search && !game.name.toLowerCase().includes(search.toLowerCase()) && !game.description.toLowerCase().includes(search.toLowerCase())) return false
      if (selectedCategory && game.category !== selectedCategory) return false
      if (selectedAge && !game.ageGroups.includes(selectedAge)) return false
      if (selectedDifficulty && game.difficulty !== selectedDifficulty) return false
      return true
    })
  }, [search, selectedCategory, selectedAge, selectedDifficulty])

  const activeFilters = [selectedCategory, selectedAge, selectedDifficulty].filter(Boolean).length

  function clearFilters() {
    setSelectedCategory(null)
    setSelectedAge(null)
    setSelectedDifficulty(null)
    setSearch("")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">All Games</h1>
              <p className="mt-1 text-muted-foreground">
                {filteredGames.length} games available
                {user && ` for ${user.name}`}
              </p>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search games..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              Filters:
            </div>

            <div className="flex flex-wrap gap-1.5">
              {categories
                .filter((c) => !c.comingSoon)
                .map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    size="sm"
                    className="h-8 gap-1.5 text-xs"
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === cat.id ? null : cat.id
                      )
                    }
                  >
                    <cat.icon className="h-3.5 w-3.5" />
                    {cat.name}
                  </Button>
                ))}
            </div>

            <div className="h-6 w-px bg-border" />

            <div className="flex gap-1.5">
              {(
                [
                  { value: "kindergarten", label: "4-6" },
                  { value: "below8", label: "6-8" },
                  { value: "below14", label: "8-14" },
                ] as const
              ).map((ag) => (
                <Button
                  key={ag.value}
                  variant={selectedAge === ag.value ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() =>
                    setSelectedAge(selectedAge === ag.value ? null : ag.value)
                  }
                >
                  {ag.label}
                </Button>
              ))}
            </div>

            <div className="h-6 w-px bg-border" />

            <div className="flex gap-1.5">
              {["easy", "medium", "hard"].map((d) => (
                <Button
                  key={d}
                  variant={selectedDifficulty === d ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-xs capitalize"
                  onClick={() =>
                    setSelectedDifficulty(
                      selectedDifficulty === d ? null : d
                    )
                  }
                >
                  {d}
                </Button>
              ))}
            </div>

            {activeFilters > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 text-xs text-destructive"
                onClick={clearFilters}
              >
                <X className="h-3 w-3" />
                Clear ({activeFilters})
              </Button>
            )}
          </div>

          {filteredGames.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="mt-16 flex flex-col items-center text-center">
              <Search className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No games found
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your filters or search terms.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={clearFilters}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default function GamesPage() {
  return (
    <Suspense>
      <GamesContent />
    </Suspense>
  )
}
