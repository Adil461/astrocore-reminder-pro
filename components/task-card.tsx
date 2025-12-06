"use client"

import { useEffect, useState } from "react"
import { useNotification } from "@/components/notification-container"
import { NotificationService } from "@/lib/notification-service"
import type { Task } from "@/types/task"
import { Trash2, CheckCircle2, Circle, Clock, AlertCircle, Zap, RotateCcw } from "lucide-react"

interface TaskCardProps {
  task: Task
  onDelete: (id: string) => void
  onComplete: (id: string) => void
  onUpdate: (id: string, updatedTask: Partial<Task>) => void
}

export default function TaskCard({ task, onDelete, onComplete, onUpdate }: TaskCardProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("")
  const [hasNotified, setHasNotified] = useState(false)
  const { addToast } = useNotification()

  useEffect(() => {
    const interval = setInterval(() => {
      if (task.completed) {
        setTimeRemaining("")
        return
      }

      const now = new Date().getTime()
      let targetTime: number

      if (task.type === "micro") {
        targetTime = task.createdAt + task.reminderTime * 60 * 1000
      } else {
        const [hours, minutes] = (task.followUpTime || "10:00").split(":").map(Number)
        const today = new Date()
        today.setHours(hours, minutes, 0, 0)
        targetTime = today.getTime()

        if (targetTime <= now) {
          today.setDate(today.getDate() + 1)
          targetTime = today.getTime()
        }
      }

      const remaining = targetTime - now

      if (remaining <= 0) {
        if (!hasNotified && !task.completed) {
          showNotification(task)
          setHasNotified(true)

          if (task.type === "micro") {
            onComplete(task.id)
          } else {
            onUpdate(task.id, { lastTriggered: now })
          }
        }
        setTimeRemaining("Triggered!")
      } else {
        setTimeRemaining(formatTimeRemaining(remaining))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [task, hasNotified, onComplete, onUpdate, addToast])

  const showNotification = async (task: Task) => {
    addToast({
      type: "notification",
      title: `⚡ ${task.title}`,
      message: task.description || "Time to complete this task!",
      duration: 6000,
    })

    await NotificationService.showNotification(`Reminder: ${task.title}`, {
      body: task.description || "Time to complete this task!",
      tag: task.id,
    })

    NotificationService.playSound("chime")
  }

  const formatTimeRemaining = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  }

  const handleReset = () => {
    setHasNotified(false)
    if (task.repeatEnabled && task.repeatDays) {
      const now = new Date().getTime()
      onUpdate(task.id, { 
        completed: false, 
        createdAt: now,
        lastTriggered: undefined 
      })
      addToast({
        type: "success",
        title: "Task Reset",
        message: `Task reset and will repeat in ${task.repeatDays} day(s)`,
        duration: 3000,
      })
    } else {
      const now = new Date().getTime()
      onUpdate(task.id, { 
        completed: false, 
        createdAt: now,
        lastTriggered: undefined 
      })
      addToast({
        type: "success",
        title: "Task Reset",
        message: "Task marked as pending again",
        duration: 3000,
      })
    }
  }

  return (
    <div
      className={`bg-card border border-border rounded-xl p-4 md:p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-200 ${
        task.completed ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3 gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-xs font-semibold px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg flex items-center gap-1 whitespace-nowrap ${
                task.type === "micro" ? "bg-primary/15 text-primary" : "bg-secondary/15 text-secondary"
              }`}
            >
              {task.type === "micro" ? (
                <>
                  <Zap size={12} /> Micro
                </>
              ) : (
                <>
                  <Clock size={12} /> Follow-Up
                </>
              )}
            </span>
            {task.repeatEnabled && (
              <span className="text-xs font-semibold px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg bg-accent/15 text-accent flex items-center gap-1 whitespace-nowrap">
                <RotateCcw size={12} /> Repeats
              </span>
            )}
          </div>
          <h3
            className={`font-bold text-foreground text-base md:text-lg leading-tight break-words ${
              task.completed ? "line-through opacity-60" : ""
            }`}
          >
            {task.title}
          </h3>
        </div>
      </div>

      {task.description && (
        <p
          className={`text-sm text-muted-foreground mb-4 leading-relaxed break-words ${
            task.completed ? "line-through opacity-60" : ""
          }`}
        >
          {task.description}
        </p>
      )}

      {/* Time Info */}
      <div className="space-y-2 mb-4 pb-4 border-b border-border">
        {task.type === "micro" ? (
          <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground">
            <Clock size={14} className="opacity-60 flex-shrink-0" />
            <span>Set for: {task.reminderTime} minutes</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground">
              <Clock size={14} className="opacity-60 flex-shrink-0" />
              <span>Daily at: {task.followUpTime}</span>
            </div>
            {task.lastTriggered && (
              <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground">
                <AlertCircle size={14} className="opacity-60 flex-shrink-0" />
                <span>Last triggered: {new Date(task.lastTriggered).toLocaleDateString()}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div
        className={`text-xs md:text-sm font-bold mb-4 md:mb-5 ${
          timeRemaining === "Triggered!"
            ? "text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text animate-pulse"
            : "text-foreground"
        }`}
      >
        {timeRemaining || "Loading..."}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onComplete(task.id)}
          className={`flex-1 flex items-center justify-center gap-1.5 md:gap-2 py-2 md:py-2.5 px-2 md:px-3 rounded-lg transition-all duration-200 font-medium text-xs md:text-sm ${
            task.completed
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-muted hover:bg-muted/80 text-foreground"
          }`}
        >
          {task.completed ? (
            <>
              <CheckCircle2 size={14} />
              <span className="hidden sm:inline">Completed</span>
            </>
          ) : (
            <>
              <Circle size={14} />
              <span className="hidden sm:inline">Mark Done</span>
            </>
          )}
        </button>
        {task.completed && (
          <button
            onClick={handleReset}
            className="p-2 md:p-2.5 rounded-lg bg-muted hover:bg-accent/20 text-muted-foreground hover:text-accent transition-all duration-200"
            aria-label="Reset task"
            title="Reset task to pending"
          >
            <RotateCcw size={16} />
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 md:p-2.5 rounded-lg bg-muted hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-all duration-200"
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}
