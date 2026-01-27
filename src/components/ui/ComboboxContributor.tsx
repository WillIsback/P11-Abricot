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
import { searchUserStream } from "@/action/user-stream.action";
import { useTransition } from "react";

// Type simplifié pour les utilisateurs recherchés
type SearchUser = {
  id: string;
  email: string;
  name: string;
};

interface ComboboxContributorProps {
  name?: string;
  required?: boolean;
  onValueChange?: () => void;
}

export default function ComboboxContributor({
  onValueChange,
  name = "contributor",
  required = false
}: ComboboxContributorProps) {
  const anchor = useComboboxAnchor();
  const [query, setQuery] = React.useState<string>('');
  const [selectedUsers, setSelectedUsers] = React.useState<SearchUser[]>([]);
  const [searchResults, setSearchResults] = React.useState<SearchUser[]>([]);
  const [isPending, startTransition] = useTransition();

  // Debounce et streaming de la recherche
  React.useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    // Debounce de 300ms
    const timeoutId = setTimeout(() => {
      startTransition(async () => {
        const results = await searchUserStream(query);
        if (results) {
          setSearchResults(results);
        } else {
          setSearchResults([]);
        }
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);
  return (
    <>
      <input
        type="hidden"
        name={name}
        value={selectedUsers.map((u) => `${u.email}`)}
        required={required}
      />
      <Combobox
        multiple
        autoHighlight
        items={searchResults}
        itemToStringValue={(user: SearchUser) => user.id}
        value={selectedUsers}

      >
        <ComboboxChips
          ref={anchor}
          className="w-full rounded-lg min-h-13.25 dark:bg-white bg-white focus:outline-none px-4.25 py-4.75 border"
        >
          <ComboboxValue>
            {selectedUsers.map((user) => (
              <ComboboxChip key={user.id}>{user.name}</ComboboxChip>
            ))}
          </ComboboxValue>
          <ComboboxChipsInput
            placeholder="Choisir un ou plusieurs collaborateurs"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            value={query}
          />
          {isPending && <LoaderCircle className="animate-spin" size={16} />}
          {!isPending && <ChevronDown strokeWidth={1} />}
        </ComboboxChips>
        <ComboboxContent
          anchor={anchor}
          className="text-black z-100 bg-white shadow-lg"
          style={{
            pointerEvents: 'auto'
          }}
        >
          <ComboboxEmpty>
            {query.length < 2 
              ? "Saisissez au moins 2 caractères" 
              : "Aucun membre trouvé."}
          </ComboboxEmpty>
          <ComboboxList>
            {(user: SearchUser) => (
              <ComboboxItem
                key={user.id}
                value={user}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSelectedUsers(prevItems => [...prevItems, user])
                  setTimeout(() => onValueChange?.(), 0);
                  setQuery('')
                }}
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
    </>
  );
}