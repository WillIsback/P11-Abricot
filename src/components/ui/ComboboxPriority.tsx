"use client"

import * as React from "react"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxInput,
  useComboboxAnchor
} from "@/components/ui/combobox";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";


interface ComboboxPriorityProps {
  name?: string;
  required?: boolean;
  onValueChange?: ()=>void
}

export default function ComboboxPriority({onValueChange, name = "assignees", required = false }: ComboboxPriorityProps) {
  const anchor = useComboboxAnchor()
  const [value, setValue] = React.useState<Priority>("LOW");
  
  return (
  <>
    <input 
        type="hidden" 
        name={name}
        value={value}
        required={required}
    />
      
    <Combobox 
      items={['LOW','MEDIUM','HIGH','URGENT']}
      value={value}
      onValueChange={(newValue) => {
        if (newValue !== null) {
          setValue(newValue);
          setTimeout(() => onValueChange?.(), 0);
        }
      }}
    >
      <ComboboxInput placeholder="Select a priority" 
        className="w-full rounded-lg min-h-13.25 bg-white dark:bg-white
        focus:outline-none px-4.25 py-4.75 border"
      />
      <ComboboxContent 
        anchor={anchor}
        className="text-black z-100 bg-white shadow-lg" 
        style={{ 
          pointerEvents: 'auto'  
        }}
      >
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
  </>
  )
  
}


