"use client"

import { useState } from "react"
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
      onSubmit(username.trim())
    }
  }

  return (
    <Dialog open={isOpen}>
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
