"use client"

import { use } from "react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { GameCard } from "@/components/game-card"
import { getCategoryById, getGamesByCategory } from "@/lib/game-data"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const category = getCategoryById(id)
  const categoryGames = getGamesByCategory(id)

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-foreground">
            Category not found
          </h1>
          <Button className="mt-4" asChild>
            <Link href="/categories">Back to categories</Link>
          </Button>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const Icon = category.icon

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <Button variant="ghost" className="mb-4 gap-2" asChild>
            <Link href="/categories">
              <ArrowLeft className="h-4 w-4" />
              All Categories
            </Link>
          </Button>

          <div className="flex items-center gap-4">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${category.bgColor}`}
            >
              <Icon className={`h-7 w-7 ${category.color}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {category.name}
              </h1>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {categoryGames.length === 0 && (
            <div className="mt-16 text-center">
              <p className="text-muted-foreground">
                No games available in this category yet.
              </p>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
