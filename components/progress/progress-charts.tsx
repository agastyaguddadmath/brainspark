"use client"

import { Card } from "@/components/ui/card"
// Progress chart component for tracking game performance
import type { GameScore } from "@/lib/auth-context"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const CATEGORY_COLORS: Record<string, string> = {
  math: "#ef4444",
  science: "#22c55e",
  language: "#3b82f6",
  coding: "#a855f7",
  identification: "#f59e0b",
  art: "#ec4899",
  music: "#06b6d4",
  geography: "#10b981",
  iq: "#8b5cf6",
}

interface ProgressChartsProps {
  history: GameScore[]
}

export function ProgressCharts({ history }: ProgressChartsProps) {
  // Group scores by category
  const categoryData = history.reduce(
    (acc, game) => {
      if (!acc[game.category]) {
        acc[game.category] = { total: 0, count: 0 }
      }
      acc[game.category].total += game.score
      acc[game.category].count += 1
      return acc
    },
    {} as Record<string, { total: number; count: number }>
  )

  const barData = Object.entries(categoryData).map(([category, data]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    avgScore: Math.round(data.total / data.count),
    gamesPlayed: data.count,
    fill: CATEGORY_COLORS[category] || "#6b7280",
  }))

  const pieData = Object.entries(categoryData).map(([category, data]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: data.count,
    fill: CATEGORY_COLORS[category] || "#6b7280",
  }))

  if (history.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-lg font-medium text-foreground">No games played yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Start playing games to see your progress charts here.
        </p>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Average Score by Category
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis dataKey="name" type="category" width={80} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar dataKey="avgScore" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Games by Category
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
