"use client"

import {
  Brain,
  BarChart3,
  Clock,
  Code2,
  Sparkles,
  Gamepad2,
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "IQ Assessment",
    description:
      "Track cognitive development with age-appropriate logic, memory, and spatial reasoning tests that measure growth over time.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Detailed history of scores, ratings, and learning progress across every category. Watch skills develop over time.",
  },
  {
    icon: Clock,
    title: "Guest Mode",
    description:
      "15-minute free play sessions for new visitors. No sign-up required. Jump right in and try our games!",
  },
  {
    icon: Code2,
    title: "Creative Coding",
    description:
      "Scratch-like block building, turtle graphics, and robot maze coding activities that foster creativity and problem-solving.",
  },
  {
    icon: Sparkles,
    title: "Adaptive Learning",
    description:
      "Games adapt to your skill level, providing the right challenge to keep you engaged and learning at your own pace.",
  },
  {
    icon: Gamepad2,
    title: "Fun Categories",
    description:
      "Explore math, science, language arts, coding, art, music, geography, and more through engaging educational games.",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground lg:text-4xl">
            Built for Learning, Designed for Fun
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Every feature is thoughtfully crafted to make education engaging and effective.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
