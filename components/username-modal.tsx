"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { banned } from "@/lib/words"

interface UsernameModalProps {
  isOpen: boolean
  onSubmit: (username: string) => void
}

export function UsernameModal({ isOpen, onSubmit }: UsernameModalProps) {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(isOpen)

  useEffect(() => {
    const savedUsername = localStorage.getItem("username")
    if (savedUsername) {
      onSubmit(savedUsername)
      setShowModal(false)
    }
  }, [onSubmit])

  const containsBannedWord = (input: string) => {
    return banned.some((word) =>
      input.toLowerCase().includes(word.toLowerCase())
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (containsBannedWord(username)) {
      setError("Please choose a different username. Inappropriate words are not allowed.")
      return
    }
    if (username.trim()) {
      setError("") // Clear error if input is valid
      localStorage.setItem("username", username.trim()) // Save username to localStorage
      onSubmit(username.trim())
      setShowModal(false) // Hide the modal
    }
  }

  return (
    <Dialog open={showModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Your Username</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            maxLength={20}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            Start Playing
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
