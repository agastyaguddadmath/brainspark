import Link from "next/link"
import { Sparkles } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">BrainSpark</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Making learning fun and accessible for every child, every day.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Learn</h4>
            <ul className="mt-3 space-y-2">
              {["Math", "Science", "Language Arts", "Coding", "Identification"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="/categories"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Platform</h4>
            <ul className="mt-3 space-y-2">
              {[
                { label: "All Games", href: "/games" },
                { label: "Progress Tracking", href: "/progress" },
                { label: "IQ Assessment", href: "/categories/iq" },
                { label: "Parent Dashboard", href: "/parent" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Account</h4>
            <ul className="mt-3 space-y-2">
              {[
                { label: "Sign In", href: "/auth/login" },
                { label: "Create Account", href: "/auth/signup" },
                { label: "Guest Mode", href: "/games" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground">
            {'2026 BrainSpark. All rights reserved. Built with love for curious minds.'}
          </p>
        </div>
      </div>
    </footer>
  )
}
