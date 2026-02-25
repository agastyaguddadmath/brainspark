"use client"

import {
  Shield,
  Brain,
  BarChart3,
  Clock,
  Code2,
  Users,
} from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Parental Controls",
    description:
      "Set daily time limits, restrict specific categories, and monitor your child's learning activity from a dedicated dashboard.",
  },
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
      "15-minute free play sessions for new visitors. No sign-up required. Time limits prevent parental control bypass.",
  },
  {
    icon: Code2,
    title: "Creative Coding",
    description:
      "Scratch-like block building, turtle graphics, and robot maze coding activities that foster creativity and problem-solving.",
  },
  {
    icon: Users,
    title: "Family Accounts",
    description:
      "Parent and child roles with separate dashboards. Parents oversee progress, children enjoy a focused learning experience.",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground lg:text-4xl">
            Built for Learning, Designed for Safety
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Every feature is thoughtfully crafted for children and trusted by parents.
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
