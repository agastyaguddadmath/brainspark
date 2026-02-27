"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Sparkles, Play, ArrowRight, Star } from "lucide-react"

export function HeroSection() {
  const { user, loginAsGuest } = useAuth()

  return (
    <section className="relative overflow-hidden bg-card pb-16 pt-12 lg:pb-24 lg:pt-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/5" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/5" />
        <div className="absolute right-1/4 top-1/3 h-48 w-48 rounded-full bg-warning/5" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
            <Star className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium text-foreground">
              Trusted by 50,000+ families worldwide
            </span>
          </div>

          <h1 className="max-w-4xl text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
            Where Learning Becomes an{" "}
            <span className="text-primary">Adventure</span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground lg:text-xl">
            An engaging educational game platform for children ages 4-14. Math,
            science, coding, language arts, and more. All designed to make
            learning irresistibly fun.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            {user ? (
              <Button size="lg" className="gap-2 px-8 text-base" asChild>
                <Link href="/games">
                  <Play className="h-5 w-5" />
                  Continue Playing
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" className="gap-2 px-8 text-base" asChild>
                  <Link href="/auth/signup">
                    <Sparkles className="h-5 w-5" />
                    Create Your Account
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 px-8 text-base"
                  onClick={loginAsGuest}
                >
                  <Play className="h-5 w-5" />
                  Try as Guest
                </Button>
              </>
            )}
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Guest mode includes 15 minutes of free play.{" "}
            <Link href="/auth/signup" className="font-medium text-primary underline-offset-4 hover:underline">
              Create your BrainSpark account for unlimited access
              <ArrowRight className="ml-1 inline h-3 w-3" />
            </Link>
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Active Learners", value: "50K+" },
            { label: "Games Available", value: "25+" },
            { label: "Skill Categories", value: "6" },
            { label: "Avg. Rating", value: "4.8" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-6 text-center"
            >
              <div className="text-2xl font-bold text-primary lg:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
