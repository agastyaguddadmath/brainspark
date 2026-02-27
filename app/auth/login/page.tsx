"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth, type OAuthProvider } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Sparkles, Eye, EyeOff, Play, Mail } from "lucide-react"
import { toast } from "sonner"

// Google icon SVG component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

// Microsoft icon SVG component
function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 23 23">
      <path fill="#f35325" d="M1 1h10v10H1z" />
      <path fill="#81bc06" d="M12 1h10v10H12z" />
      <path fill="#05a6f0" d="M1 12h10v10H1z" />
      <path fill="#ffba08" d="M12 12h10v10H12z" />
    </svg>
  )
}

export default function LoginPage() {
  const [signInMethod, setSignInMethod] = useState<"select" | "brainspark" | "oauth">("select")
  const [oauthProvider, setOauthProvider] = useState<OAuthProvider | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // OAuth modal states
  const [showOAuthModal, setShowOAuthModal] = useState(false)
  const [oauthEmail, setOauthEmail] = useState("")
  const [oauthName, setOauthName] = useState("")
  const [oauthLoading, setOauthLoading] = useState(false)
  
  const { login, loginWithOAuth, loginAsGuest } = useAuth()
  const router = useRouter()

  async function handleBrainSparkSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log("[v0] BrainSpark login attempt", { email, password: "***" })
    
    if (!email || !password) {
      toast.error("Please enter your email and password")
      return
    }
    setLoading(true)
    try {
      const success = await login(email, password)
      console.log("[v0] Login result:", success)
      setLoading(false)
      if (success) {
        toast.success("Welcome back!")
        console.log("[v0] Redirecting to /games...")
        router.push("/games")
      } else {
        console.log("[v0] Login failed, showing error toast")
        toast.error("Invalid credentials. Please check your email and password.")
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      setLoading(false)
      toast.error("An error occurred. Please try again.")
    }
  }

  function handleOAuthClick(provider: OAuthProvider) {
    setOauthProvider(provider)
    setOauthEmail("")
    setOauthName("")
    setShowOAuthModal(true)
  }

  async function handleOAuthSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log("[v0] OAuth submit triggered", { oauthProvider, oauthEmail, oauthName })
    
    if (!oauthProvider || !oauthEmail || !oauthName) {
      toast.error("Please fill in all fields")
      return
    }
    
    setOauthLoading(true)
    
    try {
      // Simulate OAuth delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log("[v0] Calling loginWithOAuth...")
      const success = await loginWithOAuth(oauthProvider, {
        name: oauthName,
        email: oauthEmail,
      })
      
      console.log("[v0] loginWithOAuth result:", success)
      setOauthLoading(false)
      
      if (success) {
        setShowOAuthModal(false)
        toast.success(`Signed in with ${oauthProvider === "google" ? "Google" : "Microsoft"}!`)
        router.push("/games")
      } else {
        toast.error("Failed to sign in. Please try again.")
      }
    } catch (error) {
      console.error("[v0] OAuth error:", error)
      setOauthLoading(false)
      toast.error("An error occurred. Please try again.")
    }
  }

  function handleGuest() {
    loginAsGuest()
    toast.success("Guest mode activated! You have 15 minutes.")
    router.push("/games")
  }

  function handleBackToSelect() {
    setSignInMethod("select")
    setEmail("")
    setPassword("")
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - branding */}
      <div className="hidden flex-1 flex-col justify-between bg-primary p-10 lg:flex">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/20">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-primary-foreground">BrainSpark</span>
        </Link>
        <div>
          <h2 className="max-w-md text-3xl font-bold leading-tight text-primary-foreground">
            Learning is the greatest adventure a child can take.
          </h2>
          <p className="mt-4 max-w-md text-primary-foreground/70">
            Sign in to continue your child&apos;s educational journey with fun,
            interactive games across math, science, coding, and more.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/50">
          Safe, engaging, and parent-approved.
        </p>
      </div>

      {/* Right side - sign in options */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">BrainSpark</span>
          </Link>

          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose how you want to sign in to your account.
          </p>

          {/* Sign in method selection */}
          {signInMethod === "select" && (
            <div className="mt-8 space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-base"
                onClick={() => handleOAuthClick("google")}
              >
                <GoogleIcon className="h-5 w-5" />
                Sign in with Google
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-base"
                onClick={() => handleOAuthClick("microsoft")}
              >
                <MicrosoftIcon className="h-5 w-5" />
                Sign in with Microsoft
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-base"
                onClick={() => setSignInMethod("brainspark")}
              >
                <div className="flex h-5 w-5 items-center justify-center rounded bg-primary">
                  <Sparkles className="h-3 w-3 text-primary-foreground" />
                </div>
                Sign in with BrainSpark
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button
                variant="secondary"
                className="w-full gap-2"
                onClick={handleGuest}
              >
                <Play className="h-4 w-4" />
                Continue as Guest (15 min)
              </Button>
            </div>
          )}

          {/* BrainSpark email/password form */}
          {signInMethod === "brainspark" && (
            <div className="mt-8">
              <button
                type="button"
                onClick={handleBackToSelect}
                className="mb-4 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to sign in options
              </button>
              
              <div className="mb-6 flex items-center gap-3 rounded-lg bg-secondary p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">BrainSpark Account</p>
                  <p className="text-xs text-muted-foreground">Sign in with your email and password</p>
                </div>
              </div>

              <form onSubmit={handleBrainSparkSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 rounded-lg bg-muted/50 p-4">
                <p className="text-xs font-medium text-foreground">Demo Accounts:</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Parent: parent@brainspark.com / parent123
                </p>
                <p className="text-xs text-muted-foreground">
                  Child: child@brainspark.com / child123
                </p>
              </div>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link
              href="/auth/signup"
              className="font-medium text-primary hover:underline"
            >
              Create your account
            </Link>
          </p>
        </div>
      </div>

      {/* OAuth Modal */}
      <Dialog open={showOAuthModal} onOpenChange={setShowOAuthModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {oauthProvider === "google" && <GoogleIcon className="h-6 w-6" />}
              {oauthProvider === "microsoft" && <MicrosoftIcon className="h-6 w-6" />}
              Sign in with {oauthProvider === "google" ? "Google" : "Microsoft"}
            </DialogTitle>
            <DialogDescription>
              Enter your {oauthProvider === "google" ? "Google" : "Microsoft"} account details to continue.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleOAuthSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="oauth-name">Full Name</Label>
              <Input
                id="oauth-name"
                type="text"
                placeholder="John Doe"
                value={oauthName}
                onChange={(e) => setOauthName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="oauth-email">Email</Label>
              <Input
                id="oauth-email"
                type="email"
                placeholder={oauthProvider === "google" ? "you@gmail.com" : "you@outlook.com"}
                value={oauthEmail}
                onChange={(e) => setOauthEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowOAuthModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={oauthLoading}>
                {oauthLoading ? "Signing in..." : "Continue"}
              </Button>
            </div>
          </form>
          
          <p className="text-xs text-center text-muted-foreground mt-2">
            This is a demo. In production, this would redirect to {oauthProvider === "google" ? "Google" : "Microsoft"}&apos;s secure login page.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  )
}
