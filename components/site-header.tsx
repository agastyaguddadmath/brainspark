"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  LogOut,
  User,
  BarChart3,
  Clock,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/games", label: "Games" },
  { href: "/categories", label: "Categories" },
  { href: "/progress", label: "Progress" },
]

function GuestTimer({ timeRemaining }: { timeRemaining: number }) {
  const mins = Math.floor(timeRemaining / 60)
  const secs = timeRemaining % 60
  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-warning/15 px-3 py-1.5 text-sm font-medium text-warning-foreground">
      <Clock className="h-4 w-4" />
      <span>
        {mins}:{secs.toString().padStart(2, "0")}
      </span>
    </div>
  )
}

export function SiteHeader() {
  const { user, isGuest, guestTimeRemaining, logout } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">BrainSpark</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary",
                  pathname === link.href
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isGuest && <GuestTimer timeRemaining={guestTimeRemaining} />}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="hidden gap-2 md:flex"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.name}</span>
                  {isGuest && (
                    <Badge variant="secondary" className="text-xs">
                      Guest
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {!isGuest && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/progress" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Progress
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  {isGuest ? "Exit Guest Mode" : "Sign Out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Create Your Account</Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-t border-border pt-4">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="mr-1 h-4 w-4" />
                  {isGuest ? "Exit" : "Sign Out"}
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link href="/auth/signup">Create Account</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
