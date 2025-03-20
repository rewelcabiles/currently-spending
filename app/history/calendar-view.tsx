"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
      </PopoverContent>
    </Popover>
  )
}

