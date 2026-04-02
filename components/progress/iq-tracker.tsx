"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { Brain, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface IqTrackerProps {
  scores: number[]
}

function getIqCategory(score: number): { label: string; color: string } {
  if (score >= 130) return { label: "Very Superior", color: "text-purple-500" }
  if (score >= 120) return { label: "Superior", color: "text-blue-500" }
  if (score >= 110) return { label: "High Average", color: "text-green-500" }
  if (score >= 90) return { label: "Average", color: "text-foreground" }
  if (score >= 80) return { label: "Low Average", color: "text-yellow-500" }
  return { label: "Below Average", color: "text-orange-500" }
}

export function IqTracker({ scores }: IqTrackerProps) {
  if (scores.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Brain className="h-7 w-7 text-primary" />
        </div>
        <p className="mt-4 text-lg font-medium text-foreground">No IQ tests taken yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete IQ assessment games to track your cognitive development.
        </p>
      </Card>
    )
  }

  const chartData = scores.map((score, index) => ({
    test: `Test ${index + 1}`,
    score,
  }))

  const latestScore = scores[scores.length - 1]
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  const { label: iqCategory, color: iqColor } = getIqCategory(latestScore)

  const trend =
    scores.length >= 2
      ? scores[scores.length - 1] - scores[scores.length - 2]
      : 0

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="p-6 lg:col-span-2">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          IQ Score History
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="test" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis domain={[70, 150]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <ReferenceLine y={100} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" label="Average" />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="p-6">
          <p className="text-xs text-muted-foreground">Latest Score</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{latestScore}</p>
          <Badge variant="secondary" className={`mt-2 ${iqColor}`}>
            {iqCategory}
          </Badge>
        </Card>

        <Card className="p-6">
          <p className="text-xs text-muted-foreground">Average Score</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{avgScore}</p>
        </Card>

        <Card className="p-6">
          <p className="text-xs text-muted-foreground">Trend</p>
          <div className="mt-1 flex items-center gap-2">
            {trend > 0 ? (
              <>
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-lg font-semibold text-green-500">+{trend}</span>
              </>
            ) : trend < 0 ? (
              <>
                <TrendingDown className="h-5 w-5 text-red-500" />
                <span className="text-lg font-semibold text-red-500">{trend}</span>
              </>
            ) : (
              <>
                <Minus className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg font-semibold text-muted-foreground">0</span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">vs previous test</p>
        </Card>
      </div>
    </div>
  )
}
