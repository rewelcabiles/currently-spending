"use client"

import { useState } from "react"
import { format } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"

export function DatePicker() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize date from URL or use current date
  const initialDate = searchParams.get("date") ? new Date(searchParams.get("date") as string) : new Date()

  const [date, setDate] = useState<Date | undefined>(initialDate)

  // Update URL and trigger data fetch when date changes
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)

    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd")
      const params = new URLSearchParams(searchParams)
      params.set("date", formattedDate)
      router.push(`?${params.toString()}`)
    }
  }

  return (
    
    <>
      <pre className="text-sm text-gray-400">Select a date:</pre>
      <input className="border-2 p-3 text-sm rounded-md bg-zinc-950 w-full"
    type="date" value={date ? format(date, "yyyy-MM-dd") : ""} onChange={(e: any) => handleDateSelect(new Date(e.target.value))} />
    </>
  )
}

