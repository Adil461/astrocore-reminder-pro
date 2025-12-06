"use client"

import { useState } from "react"
import type { Task } from "@/types/task"
import TaskCard from "./task-card"
import { Search, Zap, RotateCw } from "lucide-react"

interface TaskDashboardProps {
  tasks: Task[]
  onDeleteTask: (id: string) => void
  onCompleteTask: (id: string) => void
  onUpdateTask: (id: string, updatedTask: Partial<Task>) => void
}

export default function TaskDashboard({ tasks, onDeleteTask, onCompleteTask, onUpdateTask }: TaskDashboardProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const microTasks = tasks.filter((t) => t.type === "micro")
  const followUpTasks = tasks.filter((t) => t.type === "follow-up")

  const filterTasks = (taskList: Task[]) => {
    return taskList.filter((task) => {
      const matchesFilter =
        filter === "all" || (filter === "pending" && !task.completed) || (filter === "completed" && task.completed)

      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesFilter && matchesSearch
    })
  }

  const filteredMicroTasks = filterTasks(microTasks)
  const filteredFollowUpTasks = filterTasks(followUpTasks)

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search your tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                filter === f
                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-sm"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Micro Tasks Section */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
            <Zap size={18} className="text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Micro Tasks</h2>
          <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-lg">
            {filteredMicroTasks.length}
          </span>
        </div>
        {filteredMicroTasks.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredMicroTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
                onComplete={onCompleteTask}
                onUpdate={onUpdateTask}
              />
            ))}
          </div>
        ) : (
          <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground">
            <Zap size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No micro tasks yet. Create one to get started!</p>
          </div>
        )}
      </div>

      {/* Follow-Up Tasks Section */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-sm">
            <RotateCw size={18} className="text-secondary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Follow-Up Tasks</h2>
          <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-lg">
            {filteredFollowUpTasks.length}
          </span>
        </div>
        {filteredFollowUpTasks.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredFollowUpTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
                onComplete={onCompleteTask}
                onUpdate={onUpdateTask}
              />
            ))}
          </div>
        ) : (
          <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground">
            <RotateCw size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No follow-up tasks yet. Create one for daily reminders!</p>
          </div>
        )}
      </div>
    </div>
  )
}
