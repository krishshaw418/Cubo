"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

const Quotes = [
    // "SOL",
    "USDC",
] as const

interface QuoteProps {
  id: string
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  name?: string
}

export function Quote({ id, value, onChange, onBlur, name }: QuoteProps) {
  return (
    <Combobox items={Quotes}
      id={id}
      value={value}
      onValueChange={(value) => onChange?.(value ?? "")}
    >
      <ComboboxInput placeholder="Select a quote token" />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
