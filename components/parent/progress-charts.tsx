"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { type GameScore } from "@/lib/auth-context"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts"

const CATEGORY_COLORS: Record<string, string> = {
  math: "#4361ee",
  science: "#2ec4b6",
  language: "#e09f3e",
  coding: "#c77dff",
  identification: "#3a86a8",
  iq: "#5e60ce",
}

const CATEGORY_LABELS: Record<string, string> = {
  math: "Math",
  science: "Science",
  language: "Language",
  coding: "Coding",
  identification: "Identification",
  iq: "IQ",
}

export function ProgressCharts({ history }: { history: GameScore[] }) {
  const categoryData = useMemo(() => {
    const grouped: Record<string, { total: number; count: number }> = {}
    history.forEach((g) => {
      if (!grouped[g.category]) grouped[g.category] = { total: 0, count: 0 }
      grouped[g.category].total += g.score
      grouped[g.category].count += 1
    })
    return Object.entries(grouped).map(([cat, data]) => ({
      name: CATEGORY_LABELS[cat] || cat,
      category: cat,
      average: Math.round(data.total / data.count),
      games: data.count,
    }))
  }, [history])

  const pieData = useMemo(() => {
    const counts: Record<string, number> = {}
    history.forEach((g) => {
      counts[g.category] = (counts[g.category] || 0) + 1
    })
    return Object.entries(counts).map(([cat, count]) => ({
      name: CATEGORY_LABELS[cat] || cat,
      value: count,
      color: CATEGORY_COLORS[cat] || "#94a3b8",
    }))
  }, [history])

  const trendData = useMemo(() => {
    const sorted = [...history].sort(
      (a, b) =>
        new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    )
    return sorted.map((g, i) => ({
      game: i + 1,
      score: g.score,
      name: g.gameName,
    }))
  }, [history])

  if (history.length === 0) {
    return (
      <Card className="flex flex-col items-center p-12 text-center">
        <p className="text-sm font-medium text-foreground">
          No data to display yet
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Charts will appear once games are completed.
        </p>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Score Trend */}
      <Card className="p-6">
        <h3 className="text-base font-semibold text-foreground">
          Score Trend Over Time
        </h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Performance across all completed games
        </p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="game"
                tick={{ fontSize: 12 }}
                stroke="var(--muted-foreground)"
                label={{
                  value: "Game #",
                  position: "insideBottom",
                  offset: -4,
                  fontSize: 12,
                  fill: "var(--muted-foreground)",
                }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                stroke="var(--muted-foreground)"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelFormatter={(label) => `Game ${label}`}
                formatter={(value: number, _name: string, props) => [
                  `${value}%`,
                  props.payload?.name || "Score",
                ]}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#4361ee"
                strokeWidth={2}
                dot={{ r: 4, fill: "#4361ee" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Performance */}
        <Card className="p-6">
          <h3 className="text-base font-semibold text-foreground">
            Average Score by Category
          </h3>
          <p className="mb-4 text-xs text-muted-foreground">
            How your child performs in each subject
          </p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={80}
                  tick={{ fontSize: 11 }}
                  stroke="var(--muted-foreground)"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Avg Score"]}
                />
                <Bar dataKey="average" radius={[0, 6, 6, 0]}>
                  {categoryData.map((entry) => (
                    <Cell
                      key={entry.category}
                      fill={CATEGORY_COLORS[entry.category] || "#94a3b8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="text-base font-semibold text-foreground">
            Games by Category
          </h3>
          <p className="mb-4 text-xs text-muted-foreground">
            Distribution of games played
          </p>
          <div className="flex items-center gap-6">
            <div className="h-48 w-48 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value} games`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {entry.name}
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
