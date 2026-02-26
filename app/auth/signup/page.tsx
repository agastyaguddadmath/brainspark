"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth, type AgeGroup, type UserRole } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sparkles, Eye, EyeOff, Baby, Users, GraduationCap, Shield, User } from "lucide-react"
import { toast } from "sonner"

export default function SignUpPage() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<UserRole>("child")
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("below8")
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!name.trim() || !email.trim() || password.length < 6) {
      toast.error("Please fill in all fields correctly")
      return
    }
    
    setLoading(true)
    try {
      const success = await signUp({ name, email, password, role, ageGroup })
      setLoading(false)
      if (success) {
        toast.success("Account created! Welcome to BrainSpark!")
        router.push("/games")
      } else {
        toast.error("Email already in use. Try signing in instead.")
      }
    } catch (error) {
      setLoading(false)
      toast.error("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-accent p-10 lg:flex">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-foreground/20">
            <Sparkles className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="text-xl font-bold text-accent-foreground">BrainSpark</span>
        </Link>
        <div>
          <h2 className="max-w-md text-3xl font-bold leading-tight text-accent-foreground">
            Start your child's learning journey today.
          </h2>
          <p className="mt-4 max-w-md text-accent-foreground/70">
            Create a free account and unlock full access to all educational
            games, progress tracking, and parental controls.
          </p>
        </div>
        <p className="text-sm text-accent-foreground/50">
          Join 50,000+ families learning through play.
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">BrainSpark</span>
          </Link>

          <div className="mb-6 flex gap-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>

          <h1 className="text-2xl font-bold text-foreground">
            {step === 1 ? "Create your account" : "Choose your profile"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {step === 1
              ? "Fill in your details to get started."
              : "Select who will be using BrainSpark."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => {
                    if (name && email && password.length >= 6) setStep(2)
                    else toast.error("Please fill all fields (password min 6 chars)")
                  }}
                >
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>I am a...</Label>
                  <RadioGroup
                    value={role}
                    onValueChange={(v) => setRole(v as UserRole)}
                    className="grid grid-cols-2 gap-3"
                  >
                    <Label
                      htmlFor="role-parent"
                      className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors ${
                        role === "parent"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <RadioGroupItem value="parent" id="role-parent" className="sr-only" />
                      <Shield className="h-6 w-6 text-primary" />
                      <span className="text-sm font-medium">Parent</span>
                    </Label>
                    <Label
                      htmlFor="role-child"
                      className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors ${
                        role === "child"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <RadioGroupItem value="child" id="role-child" className="sr-only" />
                      <User className="h-6 w-6 text-primary" />
                      <span className="text-sm font-medium">Child</span>
                    </Label>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Age Group</Label>
                  <RadioGroup
                    value={ageGroup}
                    onValueChange={(v) => setAgeGroup(v as AgeGroup)}
                    className="space-y-2"
                  >
                    {[
                      {
                        value: "kindergarten",
                        label: "Kindergarten",
                        desc: "Ages 4-6",
                        icon: Baby,
                      },
                      {
                        value: "below8",
                        label: "Explorer",
                        desc: "Ages 6-8",
                        icon: Users,
                      },
                      {
                        value: "below14",
                        label: "Advanced",
                        desc: "Ages 8-14",
                        icon: GraduationCap,
                      },
                    ].map((option) => {
                      const Icon = option.icon
                      return (
                        <Label
                          key={option.value}
                          htmlFor={`age-${option.value}`}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                            ageGroup === option.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={`age-${option.value}`}
                            className="sr-only"
                          />
                          <Icon className="h-5 w-5 text-primary" />
                          <div>
                            <span className="text-sm font-medium text-foreground">
                              {option.label}
                            </span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              {option.desc}
                            </span>
                          </div>
                        </Label>
                      )
                    })}
                  </RadioGroup>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? "Creating..." : "Create Account"}
                  </Button>
                </div>
              </div>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
