"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { type ParentalControls } from "@/lib/auth-context"
import { categories } from "@/lib/game-data"
import { toast } from "sonner"
import {
  Clock,
  Shield,
  Save,
  RotateCcw,
  CheckCircle2,
} from "lucide-react"

interface ControlsPanelProps {
  controls: ParentalControls
  onSave: (controls: Partial<ParentalControls>) => void
}

export function ControlsPanel({ controls, onSave }: ControlsPanelProps) {
  const [dailyMinutes, setDailyMinutes] = useState(controls.maxDailyMinutes)
  const [allowedCats, setAllowedCats] = useState<string[]>(
    controls.allowedCategories
  )
  const [hasChanges, setHasChanges] = useState(false)

  function toggleCategory(catId: string) {
    setAllowedCats((prev) => {
      const next = prev.includes(catId)
        ? prev.filter((c) => c !== catId)
        : [...prev, catId]
      setHasChanges(true)
      return next
    })
  }

  function handleMinutesChange(value: number[]) {
    setDailyMinutes(value[0])
    setHasChanges(true)
  }

  function handleSave() {
    onSave({
      maxDailyMinutes: dailyMinutes,
      allowedCategories: allowedCats,
    })
    setHasChanges(false)
    toast.success("Parental controls updated successfully")
  }

  function handleReset() {
    setDailyMinutes(controls.maxDailyMinutes)
    setAllowedCats(controls.allowedCategories)
    setHasChanges(false)
  }

  const activeCats = categories.filter((c) => !c.comingSoon)

  function formatTime(mins: number) {
    if (mins >= 60) {
      const h = Math.floor(mins / 60)
      const m = mins % 60
      return m > 0 ? `${h}h ${m}m` : `${h}h`
    }
    return `${mins}m`
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Daily Time Limit */}
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/15">
            <Clock className="h-5 w-5 text-info" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Daily Screen Time Limit
            </h3>
            <p className="text-sm text-muted-foreground">
              Maximum play time allowed per day
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Time limit</span>
            <span className="text-lg font-bold text-foreground">
              {formatTime(dailyMinutes)}
            </span>
          </div>
          <Slider
            value={[dailyMinutes]}
            onValueChange={handleMinutesChange}
            min={15}
            max={180}
            step={15}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>15 min</span>
            <span>1 hour</span>
            <span>2 hours</span>
            <span>3 hours</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-2">
          {[30, 60, 90, 120].map((mins) => (
            <Button
              key={mins}
              variant={dailyMinutes === mins ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => {
                setDailyMinutes(mins)
                setHasChanges(true)
              }}
            >
              {formatTime(mins)}
            </Button>
          ))}
        </div>
      </Card>

      {/* Category Access */}
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Category Access
            </h3>
            <p className="text-sm text-muted-foreground">
              Control which game categories are available
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {activeCats.map((cat) => {
            const isAllowed = allowedCats.includes(cat.id)
            return (
              <div
                key={cat.id}
                className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-secondary/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${cat.bgColor}`}
                  >
                    <cat.icon className={`h-4 w-4 ${cat.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {cat.name}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {cat.gameCount} games
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {cat.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isAllowed && (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  )}
                  <Switch
                    checked={isAllowed}
                    onCheckedChange={() => toggleCategory(cat.id)}
                    aria-label={`Toggle ${cat.name} access`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Guest Mode Info */}
      <Card className="border-warning/30 bg-warning/5 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning/15">
            <Shield className="h-5 w-5 text-warning-foreground" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Guest Mode Protection
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Guest sessions are automatically limited to 15 minutes. Guests
              can only access free-tier games and cannot bypass parental
              controls. No progress or scores are saved in guest mode.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                15-min session limit
              </Badge>
              <Badge variant="outline" className="text-xs">
                No score saving
              </Badge>
              <Badge variant="outline" className="text-xs">
                Free games only
              </Badge>
              <Badge variant="outline" className="text-xs">
                Auto sign-out
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Bar */}
      {hasChanges && (
        <div className="sticky bottom-4 flex items-center justify-between rounded-2xl border border-primary/20 bg-card p-4 shadow-lg">
          <p className="text-sm font-medium text-foreground">
            You have unsaved changes
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
