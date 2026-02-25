"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Baby, Users, GraduationCap, ArrowRight } from "lucide-react"

const ageGroups = [
  {
    id: "kindergarten",
    label: "Kindergarten",
    ages: "Ages 4-6",
    difficulty: "Beginner",
    icon: Baby,
    description:
      "Gentle introduction to learning through colorful games, shape recognition, counting, and phonics.",
    features: [
      "Large, touch-friendly buttons",
      "Voice-guided instructions",
      "Reward animations",
      "Simple drag & drop",
    ],
    color: "bg-[oklch(0.7_0.18_150)]",
    borderColor: "border-[oklch(0.7_0.18_150/0.3)]",
    textColor: "text-[oklch(0.7_0.18_150)]",
  },
  {
    id: "below8",
    label: "Explorer",
    ages: "Ages 6-8",
    difficulty: "Intermediate",
    icon: Users,
    description:
      "Building core skills with addition, reading comprehension, basic science experiments, and simple coding.",
    features: [
      "Timed challenges",
      "Multi-step problems",
      "Story-based learning",
      "Progress streaks",
    ],
    color: "bg-primary",
    borderColor: "border-primary/30",
    textColor: "text-primary",
  },
  {
    id: "below14",
    label: "Advanced",
    ages: "Ages 8-14",
    difficulty: "Advanced",
    icon: GraduationCap,
    description:
      "Challenging content with algebra, chemistry, creative writing, block-based programming, and IQ assessment.",
    features: [
      "Complex problem-solving",
      "Block-based coding",
      "Research projects",
      "IQ assessments",
    ],
    color: "bg-[oklch(0.65_0.2_330)]",
    borderColor: "border-[oklch(0.65_0.2_330/0.3)]",
    textColor: "text-[oklch(0.65_0.2_330)]",
  },
]

export function AgeGroupsSection() {
  return (
    <section className="bg-card py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground lg:text-4xl">
            Tailored for Every Age
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Three carefully designed learning levels that grow with your child.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {ageGroups.map((group) => {
            const Icon = group.icon
            return (
              <div
                key={group.id}
                className={`relative flex flex-col rounded-2xl border ${group.borderColor} bg-card p-8 transition-all hover:shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${group.color}`}
                  >
                    <Icon className="h-6 w-6 text-card" />
                  </div>
                  <Badge variant="outline" className={group.textColor}>
                    {group.difficulty}
                  </Badge>
                </div>
                <h3 className="mt-5 text-xl font-bold text-foreground">
                  {group.label}
                </h3>
                <p className={`text-sm font-medium ${group.textColor}`}>
                  {group.ages}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {group.description}
                </p>
                <ul className="mt-5 space-y-2">
                  {group.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <div className={`h-1.5 w-1.5 rounded-full ${group.color}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="mt-6 gap-2"
                  asChild
                >
                  <Link href={`/games?age=${group.id}`}>
                    View Games
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
