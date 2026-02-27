"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

export type UserRole = "child" | "parent" | "guest"
export type AgeGroup = "kindergarten" | "below8" | "below14"

export interface ParentalControls {
  maxDailyMinutes: number
  allowedCategories: string[]
  restrictedGames: string[]
}

export interface GameScore {
  gameId: string
  gameName: string
  category: string
  score: number
  maxScore: number
  rating: number
  completedAt: string
  ageGroup: AgeGroup
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: UserRole
  ageGroup: AgeGroup
  avatar: string
  parentalControls: ParentalControls
  gameHistory: GameScore[]
  iqScores: number[]
  totalPlayTime: number
  streakDays: number
  joinedAt: string
}

export type OAuthProvider = "google" | "microsoft"

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  isGuest: boolean
  guestTimeRemaining: number
  login: (email: string, password: string) => Promise<boolean>
  loginWithOAuth: (provider: OAuthProvider, userData: OAuthUserData) => Promise<boolean>
  signUp: (data: SignUpData) => Promise<boolean>
  loginAsGuest: () => void
  logout: () => void
  updateProfile: (updates: Partial<UserProfile>) => void
  addGameScore: (score: GameScore) => void
  addIqScore: (score: number) => void
  updateParentalControls: (controls: Partial<ParentalControls>) => void
}

interface OAuthUserData {
  name: string
  email: string
  avatar?: string
}

interface SignUpData {
  name: string
  email: string
  password: string
  role: UserRole
  ageGroup: AgeGroup
}

const GUEST_TIME_LIMIT = 15 * 60

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "brainspark_users"
const CURRENT_USER_KEY = "brainspark_current_user"

function getStoredUsers(): Record<string, { password: string; profile: UserProfile }> {
  if (typeof window === "undefined") return {}
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveUsers(users: Record<string, { password: string; profile: UserProfile }>) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

function saveCurrentUser(user: UserProfile | null) {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

function getCurrentUser(): UserProfile | null {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

const demoUsers: Record<string, { password: string; profile: UserProfile }> = {
  "parent@brainspark.com": {
    password: "parent123",
    profile: {
      id: "usr_parent_1",
      name: "Sarah Johnson",
      email: "parent@brainspark.com",
      role: "parent",
      ageGroup: "below14",
      avatar: "SJ",
      parentalControls: {
        maxDailyMinutes: 60,
        allowedCategories: ["math", "science", "language", "coding", "identification", "art", "music", "geography", "iq"],
        restrictedGames: [],
      },
      gameHistory: [
        { gameId: "math-1", gameName: "Number Quest", category: "math", score: 85, maxScore: 100, rating: 4, completedAt: "2026-02-20T10:00:00Z", ageGroup: "below8" },
        { gameId: "sci-1", gameName: "Lab Explorer", category: "science", score: 92, maxScore: 100, rating: 5, completedAt: "2026-02-21T14:30:00Z", ageGroup: "below8" },
        { gameId: "lang-1", gameName: "Word Builder", category: "language", score: 78, maxScore: 100, rating: 3, completedAt: "2026-02-22T09:15:00Z", ageGroup: "below8" },
        { gameId: "code-1", gameName: "Block Builder", category: "coding", score: 95, maxScore: 100, rating: 5, completedAt: "2026-02-23T16:00:00Z", ageGroup: "below14" },
        { gameId: "math-2", gameName: "Shape Sorter", category: "math", score: 70, maxScore: 100, rating: 4, completedAt: "2026-02-24T11:00:00Z", ageGroup: "kindergarten" },
      ],
      iqScores: [105, 112, 108],
      totalPlayTime: 2450,
      streakDays: 7,
      joinedAt: "2026-01-15T08:00:00Z",
    },
  },
  "child@brainspark.com": {
    password: "child123",
    profile: {
      id: "usr_child_1",
      name: "Alex Johnson",
      email: "child@brainspark.com",
      role: "child",
      ageGroup: "below8",
      avatar: "AJ",
      parentalControls: {
        maxDailyMinutes: 60,
        allowedCategories: ["math", "science", "language", "coding", "identification", "art", "music", "geography", "iq"],
        restrictedGames: [],
      },
      gameHistory: [
        { gameId: "math-1", gameName: "Number Quest", category: "math", score: 85, maxScore: 100, rating: 4, completedAt: "2026-02-20T10:00:00Z", ageGroup: "below8" },
        { gameId: "sci-1", gameName: "Lab Explorer", category: "science", score: 92, maxScore: 100, rating: 5, completedAt: "2026-02-21T14:30:00Z", ageGroup: "below8" },
        { gameId: "lang-1", gameName: "Word Builder", category: "language", score: 78, maxScore: 100, rating: 3, completedAt: "2026-02-22T09:15:00Z", ageGroup: "below8" },
      ],
      iqScores: [105, 112],
      totalPlayTime: 1200,
      streakDays: 5,
      joinedAt: "2026-01-20T08:00:00Z",
    },
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isGuest, setIsGuest] = useState(false)
  const [guestTimeRemaining, setGuestTimeRemaining] = useState(GUEST_TIME_LIMIT)
  const [isInitialized, setIsInitialized] = useState(false)

  // Restore session on mount
  useEffect(() => {
    const savedUser = getCurrentUser()
    if (savedUser && savedUser.role !== "guest") {
      setUser(savedUser)
    }
    setIsInitialized(true)
  }, [])

  // Save user changes to storage
  useEffect(() => {
    if (isInitialized && user && !isGuest) {
      saveCurrentUser(user)
    }
  }, [user, isGuest, isInitialized])

  useEffect(() => {
    if (!isGuest || guestTimeRemaining <= 0) return
    const interval = setInterval(() => {
      setGuestTimeRemaining((prev) => {
        if (prev <= 1) {
          setUser(null)
          setIsGuest(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isGuest, guestTimeRemaining])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    console.log("[v0] Auth login called", { email })
    
    // Check demo users first
    const demoUser = demoUsers[email]
    console.log("[v0] Demo user check:", { found: !!demoUser, passwordMatch: demoUser?.password === password })
    if (demoUser && demoUser.password === password) {
      setUser(demoUser.profile)
      setIsGuest(false)
      saveCurrentUser(demoUser.profile)
      console.log("[v0] Demo user login successful")
      return true
    }
    
    // Check stored users
    const storedUsers = getStoredUsers()
    const storedUser = storedUsers[email]
    console.log("[v0] Stored user check:", { found: !!storedUser, passwordMatch: storedUser?.password === password })
    if (storedUser && storedUser.password === password) {
      setUser(storedUser.profile)
      setIsGuest(false)
      saveCurrentUser(storedUser.profile)
      console.log("[v0] Stored user login successful")
      return true
    }
    
    console.log("[v0] Login failed - no matching user")
    return false
  }, [])

  const loginWithOAuth = useCallback(async (provider: OAuthProvider, userData: OAuthUserData): Promise<boolean> => {
    console.log("[v0] OAuth login called", { provider, userData })
    
    const oauthKey = `oauth_${provider}_${userData.email}`
    const storedUsers = getStoredUsers()
    
    // Check if user already exists with this OAuth
    if (storedUsers[oauthKey]) {
      console.log("[v0] Existing OAuth user found")
      setUser(storedUsers[oauthKey].profile)
      setIsGuest(false)
      saveCurrentUser(storedUsers[oauthKey].profile)
      return true
    }
    
    console.log("[v0] Creating new OAuth user")
    // Create new user from OAuth data
    const newUser: UserProfile = {
      id: `usr_${provider}_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: "parent", // Default to parent for OAuth users
      ageGroup: "below14",
      avatar: userData.avatar || userData.name.split(" ").map((n) => n[0]).join("").toUpperCase(),
      parentalControls: {
        maxDailyMinutes: 60,
        allowedCategories: ["math", "science", "language", "coding", "identification", "art", "music", "geography", "iq"],
        restrictedGames: [],
      },
      gameHistory: [],
      iqScores: [],
      totalPlayTime: 0,
      streakDays: 0,
      joinedAt: new Date().toISOString(),
    }
    
    // Store OAuth user
    storedUsers[oauthKey] = {
      password: `oauth_${provider}`, // OAuth users don't have passwords
      profile: newUser,
    }
    saveUsers(storedUsers)
    
    setUser(newUser)
    setIsGuest(false)
    saveCurrentUser(newUser)
    return true
  }, [])

  const signUp = useCallback(async (data: SignUpData): Promise<boolean> => {
    // Check if email already exists
    const storedUsers = getStoredUsers()
    if (storedUsers[data.email] || demoUsers[data.email]) {
      return false // Email already in use
    }
    
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      ageGroup: data.ageGroup,
      avatar: data.name.split(" ").map((n) => n[0]).join("").toUpperCase(),
      parentalControls: {
        maxDailyMinutes: 60,
        allowedCategories: ["math", "science", "language", "coding", "identification", "art", "music", "geography", "iq"],
        restrictedGames: [],
      },
      gameHistory: [],
      iqScores: [],
      totalPlayTime: 0,
      streakDays: 0,
      joinedAt: new Date().toISOString(),
    }
    
    // Store the new user
    storedUsers[data.email] = {
      password: data.password,
      profile: newUser,
    }
    saveUsers(storedUsers)
    
    // Set as current user
    setUser(newUser)
    setIsGuest(false)
    saveCurrentUser(newUser)
    return true
  }, [])

  const loginAsGuest = useCallback(() => {
    setUser({
      id: "guest",
      name: "Explorer",
      email: "",
      role: "guest",
      ageGroup: "below8",
      avatar: "EX",
      parentalControls: {
        maxDailyMinutes: 15,
        allowedCategories: ["math", "science", "language"],
        restrictedGames: [],
      },
      gameHistory: [],
      iqScores: [],
      totalPlayTime: 0,
      streakDays: 0,
      joinedAt: new Date().toISOString(),
    })
    setIsGuest(true)
    setGuestTimeRemaining(GUEST_TIME_LIMIT)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setIsGuest(false)
    setGuestTimeRemaining(GUEST_TIME_LIMIT)
    saveCurrentUser(null)
  }, [])

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null))
  }, [])

  const addGameScore = useCallback((score: GameScore) => {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            gameHistory: [...prev.gameHistory, score],
            totalPlayTime: prev.totalPlayTime + 5,
          }
        : null
    )
  }, [])

  const addIqScore = useCallback((score: number) => {
    setUser((prev) =>
      prev ? { ...prev, iqScores: [...prev.iqScores, score] } : null
    )
  }, [])

  const updateParentalControls = useCallback(
    (controls: Partial<ParentalControls>) => {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              parentalControls: { ...prev.parentalControls, ...controls },
            }
          : null
      )
    },
    []
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !isGuest,
        isGuest,
        guestTimeRemaining,
        login,
        loginWithOAuth,
        signUp,
        loginAsGuest,
        logout,
        updateProfile,
        addGameScore,
        addIqScore,
        updateParentalControls,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
