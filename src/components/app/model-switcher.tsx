"use client"

import * as React from "react"
import { Check, Bot } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const models = [
  {
    value: "gemini",
    label: "Google Gemini",
  },
  {
    value: "llama",
    label: "Llama",
  },
  {
    value: "mistral",
    label: "Mistral",
  },
]

type Model = (typeof models)[number]

export function ModelSwitcher({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [open, setOpen] = React.useState(false)
  const [selectedModel, setSelectedModel] = React.useState<Model>(models[0])

  return (
    <div className={cn("flex items-center space-x-4", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a model"
            className="w-[200px] justify-between"
          >
            <Bot className="mr-2 h-4 w-4 shrink-0" />
            {selectedModel.label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search models..." />
            <CommandList>
              <CommandEmpty>No model found.</CommandEmpty>
              <CommandGroup>
                {models.map((model) => (
                  <CommandItem
                    key={model.value}
                    value={model.value}
                    onSelect={(currentValue) => {
                      setSelectedModel(
                        models.find((m) => m.value === currentValue) || models[0]
                      )
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedModel.value === model.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {model.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
