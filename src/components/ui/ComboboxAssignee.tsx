"use client"

import * as React from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { ChevronDown, LoaderCircle } from "lucide-react";
import { User } from "@/schemas/backend.schemas";
import { useProject } from '@/hooks/CustomHooks';
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import * as z from 'zod';

type User = z.infer<typeof User>;


interface ComboboxAssigneeProps {
  name?: string;
  required?: boolean;
  onValueChange?: ()=>void
}

export default function ComboboxAssignee({onValueChange, name = "assignees", required = false }: ComboboxAssigneeProps) {
  const anchor = useComboboxAnchor()
  const [value, setValue] = React.useState<User[]>([]);
  const { members } = useProject()


  const users = members
    .map(member => member.user)
    .filter((user) => user.name !== "");

  return (
    <ErrorBoundary fallback={<p>❌ Echec du rendu composant…</p>}>
      <Suspense fallback={<LoaderCircle/>}>
        <input
          type="hidden"
          name={name}
          value={value.map(u => u.id).join(',')}
          required={required}
        />

          <Combobox
            multiple
            autoHighlight
            items={users}
            itemToStringValue={(user: User) => user.id}
            value={value}
            onValueChange={(newValue) => {
              setValue(newValue);
              setTimeout(() => onValueChange?.(), 0);
            }}
          >
            <ComboboxChips
              ref={anchor}
              className="w-full rounded-lg min-h-13.25 dark:bg-white bg-white focus:outline-none px-4.25 py-4.75 border"
            >

              <ComboboxValue>
                {value.map((user) => (
                  <ComboboxChip key={user.id}>{user.name}</ComboboxChip>
                ))}
              </ComboboxValue>
              <ComboboxChipsInput
                placeholder="Choisir un ou plusieurs collaborateurs"
              />
              <ChevronDown strokeWidth={1}/>
            </ComboboxChips>


            <ComboboxContent
              anchor={anchor}
              className="text-black z-100 bg-white shadow-lg"
              style={{
                pointerEvents: 'auto'
              }}
            >
              <ComboboxEmpty>Aucun membre trouvé.</ComboboxEmpty>
              <ComboboxList>
                {(user: User) => (
                  <ComboboxItem
                    key={user.id}
                    value={user}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center text-sm">
                        {user.name.charAt(0).toUpperCase()}{user.name.charAt(1).toUpperCase()}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Suspense>
      </ErrorBoundary>
  )
}