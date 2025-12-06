"use client"

import type React from "react"
import { useState } from "react"
import type { Task, TaskType } from "@/types/task"
import { X, Sparkles } from "lucide-react"

interface AddTaskFormProps {
  onAddTask: (task: Task) => void
}

const TIME_OPTIONS = [
  { label: "5 minutes", value: 5 },
  { label: "10 minutes", value: 10 },
  { label: "30 minutes", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "Custom", value: "custom" },
]

export default function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskType, setTaskType] = useState<TaskType>("micro")
  const [timeOption, setTimeOption] = useState<number | string>(5)
  const [customTime, setCustomTime] = useState("")
  const [followUpTime, setFollowUpTime] = useState("10:00")
  const [repeatEnabled, setRepeatEnabled] = useState(false)
  const [repeatDays, setRepeatDays] = useState("1")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!taskTitle.trim()) return

    const reminderTime = timeOption === "custom" ? Number.parseInt(customTime) : (timeOption as number)

    if (isNaN(reminderTime) || reminderTime <= 0) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskTitle,
      description: taskDescription,
      type: taskType,
      createdAt: new Date().getTime(),
      reminderTime: reminderTime,
      followUpTime: taskType === "follow-up" ? followUpTime : undefined,
      completed: false,
      lastTriggered: taskType === "follow-up" ? new Date().getTime() : undefined,
      repeatEnabled: repeatEnabled,
      repeatDays: repeatEnabled ? Number.parseInt(repeatDays) : undefined,
    }

    onAddTask(newTask)

    setTaskTitle("")
    setTaskDescription("")
    setTaskType("micro")
    setTimeOption(5)
    setCustomTime("")
    setFollowUpTime("10:00")
    setRepeatEnabled(false)
    setRepeatDays("1")
    setIsOpen(false)
  }

  return (
    <div className="mb-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20 text-primary-foreground font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-95"
        >
          <Sparkles size={20} />
          Add New Task
        </button>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-7 shadow-lg animate-slide-down">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles size={18} className="text-primary-foreground" />
              </div>
              Create New Task
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2.5">Task Title</label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Enter task title..."
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2.5">Description</label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Enter task description..."
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent resize-none transition-all"
                rows={2}
              />
            </div>

            {/* Task Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2.5">Task Type</label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value as TaskType)}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                >
                  <option value="micro">⚡ Micro Task</option>
                  <option value="follow-up">🔄 Follow-Up</option>
                </select>
              </div>

              {/* Time Options */}
              {taskType === "micro" && (
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2.5">Reminder Time</label>
                  <select
                    value={timeOption}
                    onChange={(e) => {
                      const value = e.target.value === "custom" ? "custom" : Number.parseInt(e.target.value)
                      setTimeOption(value)
                    }}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  >
                    {TIME_OPTIONS.map((option) => (
                      <option key={option.label} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Custom Time Input */}
              {taskType === "micro" && timeOption === "custom" && (
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2.5">Minutes</label>
                  <input
                    type="number"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    placeholder="Enter minutes..."
                    min="1"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  />
                </div>
              )}

              {/* Follow-Up Time */}
              {taskType === "follow-up" && (
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2.5">Daily Time</label>
                  <input
                    type="time"
                    value={followUpTime}
                    onChange={(e) => setFollowUpTime(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  />
                </div>
              )}
            </div>

            <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={repeatEnabled}
                  onChange={(e) => setRepeatEnabled(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
                <span className="text-sm font-semibold text-foreground">Enable Repeat Task</span>
              </label>
              {repeatEnabled && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-2">Repeat after (days)</label>
                  <input
                    type="number"
                    value={repeatDays}
                    onChange={(e) => setRepeatDays(e.target.value)}
                    placeholder="1"
                    min="1"
                    max="30"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Task will reappear as pending after completion</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:scale-[1.01] active:scale-95"
              >
                Create Task
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 border border-border rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
