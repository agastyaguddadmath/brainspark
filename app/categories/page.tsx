"use client"

import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { categories, getGamesByCategory } from "@/lib/game-data"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="mt-1 text-muted-foreground">
            Browse our curated collection of educational game categories.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const Icon = cat.icon
              const gameCount = getGamesByCategory(cat.id).length
              return (
                <Link
                  key={cat.id}
                  href={cat.comingSoon ? "#" : `/categories/${cat.id}`}
                  className={`group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg ${
                    cat.comingSoon ? "pointer-events-none opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${cat.bgColor}`}
                    >
                      <Icon className={`h-7 w-7 ${cat.color}`} />
                    </div>
                    {cat.comingSoon ? (
                      <Badge variant="secondary">Coming Soon</Badge>
                    ) : (
                      <Badge variant="outline">{gameCount} games</Badge>
                    )}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-foreground">
                    {cat.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {cat.description}
                  </p>
                  {!cat.comingSoon && (
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                      Explore category
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
