"use client"

import { useState, useEffect } from "react"

interface RandomStringWithReplacementProps {
  templates: string[]
  replacement: string
  marker?: string
  className?: string
}

export default function RandomStringWithReplacement({
  templates,
  replacement,
  marker = "{placeholder}",
  className,
}: RandomStringWithReplacementProps) {
  const [selectedString, setSelectedString] = useState<string>("")

  const getRandomString = () => {
    if (!templates || templates.length === 0) return ""

    const randomIndex = Math.floor(Math.random() * templates.length)
    const template = templates[randomIndex]

    return template.replace(new RegExp(marker, "g"), replacement)
  }

  useEffect(() => {
    setSelectedString(getRandomString())
  }, [templates, replacement, marker])

  return (
        <h3 className="mb-4 text-2xl font-bold text-center h1">{selectedString}</h3>
  )
}

