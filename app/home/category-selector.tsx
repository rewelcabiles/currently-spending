"use client"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { supabaseService } from "@/services/supabase"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Category } from "@/utils/interfaces"


type CategoryItems = {
  value: string
  label: string
  parent: string
}

interface CategorySelectorProps {
  placeholder?: string
  emptyMessage?: string
  onSelect?: (category: CategoryItems) => void
}

export function CategorySelector({
  placeholder = "Select a category",
  emptyMessage = "No category found.",
  onSelect,
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [search, setSearch] = useState("")
  const [categories, setCategories] = useState<CategoryItems[]>([])

  useEffect(() => {
    supabaseService.getCategories()
      .then((data) => {
        if (!data) return
        const categ: CategoryItems[] = data.map((category: any) => {
          return {
            value: String(category.id),
            label: category.name.trim(),
            parent: category.parent_id ? String(category.parent_id.name) : ""
          } as CategoryItems
        });
        setCategories(categ)
      })
  }, [])

  const selectedCategory = categories.find((category) => category.value === value)

  const createCategory = async () => {
    if (!search) return

    // Check if category already exists
    const exists = categories.some((category) => category.label.toLowerCase() === search.toLowerCase())

    if (!exists) {

      const newCategoryRow = await supabaseService.createCategory(search)
      console.log(newCategoryRow)
      const newCategory = {
        value: String(newCategoryRow.id),
        label: newCategoryRow.name,
      } as CategoryItems
      setCategories([...categories, newCategory])
      setValue(newCategory.value)
      onSelect?.(newCategory)
      setSearch("")
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-11 px-4 border-2">
          {selectedCategory ? selectedCategory.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
        <Command>
          <CommandInput placeholder="Search categories..." value={search} onValueChange={setSearch} className="h-11" />
          <CommandList>
            <CommandEmpty>
              <div className="py-3 px-4 text-sm text-muted-foreground">{emptyMessage}</div>
              <CommandItem onSelect={createCategory} className="flex items-center gap-2 text-primary py-3">
                <PlusCircle className="h-5 w-5" />
                <span>Create "{search}"</span>
              </CommandItem>
            </CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.value}
                  value={category.value}
                  className="py-3"
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    if (currentValue !== value) {
                      onSelect?.(category)
                    }
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === category.value ? "opacity-100" : "opacity-0")} />
                  <div className="flex flex-row w-full">
                    <div>{category.label}</div>
                    <div className="ml-auto text-end mr-4">{category.parent}</div>

                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            {search && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={createCategory} className="flex items-center gap-2 text-primary py-3">
                    <PlusCircle className="h-5 w-5" />
                    <span>Create "{search}"</span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

