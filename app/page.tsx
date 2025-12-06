"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import AddTaskForm from "@/components/add-task-form"
import TaskDashboard from "@/components/task-dashboard"
import Footer from "@/components/footer"
import { SplashScreen } from "@/components/welcomescreen"
import type { Task } from "@/types/task"

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showSplash, setShowSplash] = useState(true)

  // Load tasks from LocalStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    const savedDarkMode = localStorage.getItem("darkMode")

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }

    setIsLoading(false)

    import("@/lib/notification-service").then(({ NotificationService }) => {
      NotificationService.requestPermissions()
    })
  }, [])

  // Save tasks to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  // Save dark mode to LocalStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const addTask = (task: Task) => {
    setTasks([...tasks, task])
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const completeTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: true } : task)))
  }

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)))
  }

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-background">Loading...</div>
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark" : ""}`}>
      <div className="bg-background text-foreground min-h-screen flex flex-col">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="container mx-auto px-4 py-8 max-w-6xl flex-grow">
          <AddTaskForm onAddTask={addTask} />
          <TaskDashboard
            tasks={tasks}
            onDeleteTask={deleteTask}
            onCompleteTask={completeTask}
            onUpdateTask={updateTask}
          />
        </main>
        <Footer />
      </div>
    </div>
  )
}
