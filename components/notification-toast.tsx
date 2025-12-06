"use client"

import { useEffect } from "react"
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react"

export interface Toast {
  id: string
  title: string
  message?: string
  type: "success" | "error" | "info" | "notification"
  duration?: number
}

interface NotificationToastProps {
  toast: Toast
  onClose: (id: string) => void
}

export function NotificationToast({ toast, onClose }: NotificationToastProps) {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => onClose(toast.id), toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast, onClose])

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle2 size={20} className="text-emerald-500" />
      case "error":
        return <AlertCircle size={20} className="text-destructive" />
      case "notification":
        return <AlertCircle size={20} className="text-primary" />
      default:
        return <Info size={20} className="text-blue-500" />
    }
  }

  const getBgColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800"
      case "error":
        return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
      case "notification":
        return "bg-primary/10 dark:bg-primary/20 border-primary/30"
      default:
        return "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
    }
  }

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-down max-w-sm w-full ${getBgColor()}`}
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm">{toast.title}</p>
        {toast.message && <p className="text-xs text-muted-foreground mt-1">{toast.message}</p>}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  )
}
