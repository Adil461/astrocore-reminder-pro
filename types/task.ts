export type TaskType = "micro" | "follow-up"

export interface Task {
  id: string
  title: string
  description: string
  type: TaskType
  createdAt: number
  reminderTime: number // in minutes for micro tasks
  followUpTime?: string // HH:mm format for follow-up tasks
  completed: boolean
  lastTriggered?: number // timestamp for follow-up tasks
  repeatEnabled: boolean
  repeatDays?: number // repeat after X days (for micro tasks completed)
}
