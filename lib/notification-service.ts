"use client"

// Service to manage all notification types across devices
export class NotificationService {
  static async requestPermissions() {
    // Request notification permissions
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        await Notification.requestPermission()
      }
    }

    // Register service worker for background notifications
    if ("serviceWorker" in navigator) {
      try {
        await navigator.serviceWorker.register("/sw.js")
      } catch (error) {
        console.log("[v0] Service worker registration failed")
      }
    }
  }

  static async showNotification(title: string, options: NotificationOptions = {}) {
    // Detect if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    if ("Notification" in window && Notification.permission === "granted") {
      // For mobile devices
      if (isMobile) {
        // Use service worker for lock screen notifications on mobile
        if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: "SHOW_NOTIFICATION",
            title,
            options: {
              ...options,
              badge: "/astrocore-badge.svg",
              icon: "/astrocore-icon.svg",
              tag: "reminder-" + Date.now(),
              requireInteraction: true, // Keep notification even if screen is locked
            },
          })
        }
      } else {
        // For desktop, show standard web notification
        new Notification(title, {
          ...options,
          badge: "/astrocore-badge.svg",
          icon: "/astrocore-icon.svg",
          requireInteraction: false,
        })
      }
    }
  }

  static playSound(type: "beep" | "chime" | "alert" = "beep") {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      switch (type) {
        case "beep":
          this.playBeepSound(audioContext)
          break
        case "chime":
          this.playChimeSound(audioContext)
          break
        case "alert":
          this.playAlertSound(audioContext)
          break
      }
    } catch (error) {
      console.log("[v0] Audio notification failed")
    }
  }

  private static playBeepSound(audioContext: AudioContext) {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  private static playChimeSound(audioContext: AudioContext) {
    const notes = [
      { freq: 523.25, duration: 0.15 }, // C5
      { freq: 659.25, duration: 0.15 }, // E5
      { freq: 783.99, duration: 0.3 }, // G5
    ]

    notes.forEach((note, index) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = note.freq
      oscillator.type = "sine"

      const startTime = audioContext.currentTime + index * 0.15
      gainNode.gain.setValueAtTime(0.3, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration)

      oscillator.start(startTime)
      oscillator.stop(startTime + note.duration)
    })
  }

  private static playAlertSound(audioContext: AudioContext) {
    // Two-tone alert sound
    for (let i = 0; i < 2; i++) {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = i === 0 ? 900 : 1100
      oscillator.type = "square"

      const startTime = audioContext.currentTime + i * 0.3
      gainNode.gain.setValueAtTime(0.2, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25)

      oscillator.start(startTime)
      oscillator.stop(startTime + 0.25)
    }
  }
}
