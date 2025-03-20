"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { formatDistance } from "date-fns"
import { cn } from "@/lib/utils"
import { Spending } from "@/utils/interfaces"

export interface ListItem {
  id: number
  created_at: Date
  item: string
  price: number
  type?: "income" | "expense"
}

interface AnimatedListProps {
  items: Spending[]
  className?: string
  formatCurrencyAction?: (amount: number) => string
  onItemClick?: (item: Spending) => void
}

export default function AnimatedList({
  items,
  className,
  formatCurrencyAction = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  },
  onItemClick,
}: AnimatedListProps) {
  const [renderedItems, setRenderedItems] = useState<Spending[]>([])

  // Update rendered items with animation delay
  useEffect(() => {
    setRenderedItems(items)
  }, [items])

  return (
    <div className={cn("space-y-2", className)}>
      <AnimatePresence initial={false}>
        {renderedItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              onClick={() => onItemClick?.(item)}
              className={cn(
                "flex items-center justify-between rounded-lg border p-4 shadow-sm transition-colors",
                onItemClick && "cursor-pointer hover:bg-muted/50",
              )}
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">
                  {formatDistance(item.created_at, new Date(), { addSuffix: true })}
                </span>
                <span className="font-medium">{item.item}</span>
              </div>
              <span
                className={cn(
                  "text-lg font-semibold tabular-nums")}
              >
                {formatCurrencyAction(Math.abs(item.price))}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {renderedItems.length === 0 && (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
          <p className="text-center text-muted-foreground">No items to display</p>
        </div>
      )}
    </div>
  )
}

