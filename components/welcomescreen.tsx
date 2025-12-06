"use client"

import { useEffect, useState } from "react"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    // Auto-complete after video duration (adjust timing as needed)
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 500) // Wait for fade out animation
    }, 4000) // 4 seconds - adjust based on your video length

    return () => clearTimeout(timer)
  }, [onComplete])

  const handleVideoEnd = () => {
    setIsVisible(false)
    setTimeout(onComplete, 500)
  }

  const handleSkip = () => {
    setIsVisible(false)
    setTimeout(onComplete, 500)
  }

  const handleVideoLoad = () => {
    setVideoLoaded(true)
    setVideoError(false)
  }

  const handleVideoError = () => {
    setVideoError(true)
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-black/90" />

        {/* Video container */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          {!videoError ? (
            <video
              autoPlay
              muted
              loop
              onEnded={handleVideoEnd}
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
              className="w-64 h-64 md:w-120 md:h-120 object-contain"
            >
              <source src="/logo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center bg-primary/10 rounded-full">
              <div className="text-6xl">🚀</div>
            </div>
          )}

          {/* Loading text */}
          <div className="mt-1 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Astrocore Reminder Pro</h1>
            <p className="text-muted-foreground text-lg">Smart Task Management & Follow-up System...</p>

            {/* Loading animation */}
            <div className="mt-6 flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
