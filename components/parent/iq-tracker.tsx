"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, TrendingDown, Minus } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts"

function getIqClassification(score: number) {
  if (score >= 130) return { label: "Very Superior", color: "bg-primary text-primary-foreground" }
  if (score >= 120) return { label: "Superior", color: "bg-success text-success-foreground" }
  if (score >= 110) return { label: "High Average", color: "bg-accent text-accent-foreground" }
  if (score >= 90) return { label: "Average", color: "bg-info text-info-foreground" }
  if (score >= 80) return { label: "Low Average", color: "bg-warning text-warning-foreground" }
  return { label: "Below Average", color: "bg-destructive text-destructive-foreground" }
}

export function IqTracker({ scores }: { scores: number[] }) {
  if (scores.length === 0) {
    return (
      <Card className="flex flex-col items-center p-12 text-center">
        <Brain className="h-12 w-12 text-muted-foreground/40" />
        <p className="mt-4 text-sm font-medium text-foreground">
          No IQ assessments taken yet
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          IQ scores from cognitive assessments will appear here.
        </p>
      </Card>
    )
  }

  const latest = scores[scores.length - 1]
  const previous = scores.length >= 2 ? scores[scores.length - 2] : null
  const diff = previous ? latest - previous : 0
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  const highest = Math.max(...scores)
  const classification = getIqClassification(latest)

  const chartData = scores.map((score, i) => ({
    attempt: i + 1,
    score,
  }))

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Latest Score</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-3xl font-bold text-foreground">{latest}</p>
            {diff !== 0 && (
              <div
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  diff > 0 ? "text-success" : "text-destructive"
                }`}
              >
                {diff > 0 ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                {diff > 0 ? "+" : ""}
                {diff}
              </div>
            )}
            {diff === 0 && previous !== null && (
              <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                <Minus className="h-3.5 w-3.5" />
                No change
              </div>
            )}
          </div>
          <Badge className={`mt-2 text-xs ${classification.color}`}>
            {classification.label}
          </Badge>
        </Card>

        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Average Score</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{avg}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Across {scores.length} assessments
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Highest Score</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{highest}</p>
          <Badge className={`mt-2 text-xs ${getIqClassification(highest).color}`}>
            {getIqClassification(highest).label}
          </Badge>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-base font-semibold text-foreground">
          IQ Score Progression
        </h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Cognitive assessment scores over time
        </p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="iqGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4361ee" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4361ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="attempt"
                tick={{ fontSize: 12 }}
                stroke="var(--muted-foreground)"
                label={{
                  value: "Assessment #",
                  position: "insideBottom",
                  offset: -4,
                  fontSize: 12,
                  fill: "var(--muted-foreground)",
                }}
              />
              <YAxis
                domain={[70, 150]}
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
                labelFormatter={(l) => `Assessment ${l}`}
                formatter={(value: number) => [
                  `${value} - ${getIqClassification(value).label}`,
                  "IQ Score",
                ]}
              />
              <ReferenceLine
                y={100}
                stroke="var(--muted-foreground)"
                strokeDasharray="5 5"
                label={{
                  value: "Average (100)",
                  position: "insideTopRight",
                  fontSize: 10,
                  fill: "var(--muted-foreground)",
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#4361ee"
                strokeWidth={2}
                fill="url(#iqGradient)"
                dot={{ r: 5, fill: "#4361ee" }}
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground">
          Understanding IQ Scores
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { range: "130+", label: "Very Superior", color: "bg-primary/15 text-primary" },
            { range: "120-129", label: "Superior", color: "bg-success/15 text-success" },
            { range: "110-119", label: "High Average", color: "bg-accent/15 text-accent" },
            { range: "90-109", label: "Average", color: "bg-info/15 text-info" },
            { range: "80-89", label: "Low Average", color: "bg-warning/15 text-warning-foreground" },
            { range: "< 80", label: "Below Avg", color: "bg-destructive/15 text-destructive" },
          ].map((item) => (
            <div
              key={item.range}
              className={`flex flex-col items-center rounded-xl p-3 ${item.color}`}
            >
              <span className="text-sm font-bold">{item.range}</span>
              <span className="mt-0.5 text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
