"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { SplashScreen } from "@/components/splash-screen"

interface AppWrapperProps {
  children: React.ReactNode
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [showSplash, setShowSplash] = useState(true)
  const [hasSeenSplash, setHasSeenSplash] = useState(false)

  useEffect(() => {
    // Check if user has seen splash in this session
    const seen = sessionStorage.getItem("brainspark-splash-seen")
    if (seen === "true") {
      setShowSplash(false)
      setHasSeenSplash(true)
    }
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
    setHasSeenSplash(true)
    sessionStorage.setItem("brainspark-splash-seen", "true")
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && !hasSeenSplash && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>
      <div
        style={{
          opacity: showSplash && !hasSeenSplash ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        {children}
      </div>
    </>
  )
}
