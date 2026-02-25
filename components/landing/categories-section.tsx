"use client"

import Link from "next/link"
import { categories } from "@/lib/game-data"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

export function CategoriesSection() {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground lg:text-4xl">
            Explore Learning Categories
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            From math and science to coding and beyond, we grow with your child.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = cat.icon
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
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.bgColor}`}
                  >
                    <Icon className={`h-6 w-6 ${cat.color}`} />
                  </div>
                  {cat.comingSoon ? (
                    <Badge variant="secondary">Coming Soon</Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {cat.gameCount} games
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {cat.name}
                </h3>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {cat.description}
                </p>
                {!cat.comingSoon && (
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Explore games
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
