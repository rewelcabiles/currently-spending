"use client"

import { useState } from "react"
import { Check, Search } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Category } from "@/utils/interfaces"


interface CategorySelectorProps {
  categories: Category[]
  onSelectionChange?: (selectedId: number | null) => void
  initialSelected?: number | null
  className?: string
}

export function CategorySelector({
  categories,
  onSelectionChange,
  initialSelected = null,
  className,
}: CategorySelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(initialSelected)
  const [isOpen, setIsOpen] = useState<string | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState("")

  // Group categories into parent and children
  const getCategoryGroups = () => {
    const parentCategories: Category[] = categories.filter((cat) => cat.parent_id === null)

    const categoryGroups = parentCategories.map((parent) => {
      const children = categories.filter((cat) => cat.parent_id === parent.id)
      return { parent, children }
    })

    return categoryGroups
  }

  const categoryGroups = getCategoryGroups()

  // Filter categories based on search term
  const filteredCategoryGroups = searchTerm
    ? categoryGroups.filter((group) => {
        const parentMatches = group.parent.name.toLowerCase().includes(searchTerm.toLowerCase())
        const childrenMatch = group.children.some((child) =>
          child.name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        return parentMatches || childrenMatch
      })
    : categoryGroups

  const selectCategory = (categoryId: number) => {
    // Toggle selection: if already selected, unselect it
    const newSelection = selectedCategory === categoryId ? null : categoryId

    setSelectedCategory(newSelection)
    onSelectionChange?.(newSelection)
  }

  // Get the selected category name for display
  const getSelectedCategoryName = () => {
    if (selectedCategory === null) return null
    const category = categories.find((cat) => cat.id === selectedCategory)
    return category?.name
  }

  return (
    <div className={cn("w-full", className)}>
      <Accordion
        type="single"
        collapsible
        value={isOpen}
        onValueChange={setIsOpen}
        className="w-full border rounded-md overflow-hidden"
      >
        <AccordionItem value="categories" className="border-none">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50 group">
            <div className="flex items-center justify-between w-full">
              <span className="font-medium">
                {selectedCategory !== null ? (
                  <>
                    Choose category: <span className="text-primary">{getSelectedCategoryName()}</span>
                  </>
                ) : (
                  "Choose category"
                )}
              </span>
              {selectedCategory !== null && (
                <Badge variant="secondary" className="ml-2">
                  Selected
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-0">
            <div className="px-4 py-3 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search categories..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-[350px] overflow-y-auto">
              {filteredCategoryGroups.length > 0 ? (
                filteredCategoryGroups.map(({ parent, children }) => (
                  <div key={parent.id} className="border-b last:border-b-0">
                    <div
                      className={cn(
                        "flex items-center px-4 py-3 cursor-pointer hover:bg-accent/50 transition-colors",
                        selectedCategory === parent.id && "bg-accent/30",
                      )}
                      onClick={() => selectCategory(parent.id)}
                    >
                      <div className="flex-1 font-medium">{parent.name}</div>
                      {parent.is_default && (
                        <Badge variant="outline" className="mr-2 text-xs">
                          Default
                        </Badge>
                      )}
                      {selectedCategory === parent.id && <Check className="h-4 w-4 text-primary" />}
                    </div>

                    {children.length > 0 && (
                      <div className="bg-muted/30">
                        {children
                          .filter((child) => !searchTerm || child.name.toLowerCase().includes(searchTerm.toLowerCase()))
                          .map((child) => (
                            <div
                              key={child.id}
                              className={cn(
                                "flex items-center px-4 py-2.5 pl-8 cursor-pointer hover:bg-accent/50 transition-colors border-t border-border/30",
                                selectedCategory === child.id && "bg-accent/30",
                              )}
                              onClick={() => selectCategory(child.id)}
                            >
                              <div className="flex-1 text-sm">{child.name}</div>
                              {child.is_default && (
                                <Badge variant="outline" className="mr-2 text-xs">
                                  Default
                                </Badge>
                              )}
                              {selectedCategory === child.id && <Check className="h-4 w-4 text-primary" />}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-muted-foreground">No categories found</div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

