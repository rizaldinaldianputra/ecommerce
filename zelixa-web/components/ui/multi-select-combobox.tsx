'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface MultiSelectComboboxProps {
  options: { label: string; value: string | number }[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
}

export function MultiSelectCombobox({
  options,
  value = [],
  onChange,
  placeholder = 'Select options...',
  emptyText = 'No option found.',
  disabled = false,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selectedValue: string | number) => {
    const newValue = value.includes(selectedValue)
      ? value.filter((v) => v !== selectedValue)
      : [...value, selectedValue];
    onChange(newValue);
  };

  const removeItem = (itemToRemove: string | number) => {
    onChange(value.filter((v) => v !== itemToRemove));
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between h-12 rounded-2xl border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/50 hover:bg-white/80 dark:hover:bg-black/80 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="truncate">
              {value.length > 0
                ? `${value.length} items selected`
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0 rounded-2xl border-white/20 bg-white/80 backdrop-blur-xl dark:bg-black/80" align="start">
          <Command className="bg-transparent">
            <CommandInput placeholder="Search..." className="h-12 border-none focus:ring-0" />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option.value)}
                    className="rounded-xl cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/30"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value.includes(option.value) ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Items Badges */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-white/30 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10">
          {value.map((v) => {
            const option = options.find((o) => o.value === v);
            return (
              <Badge
                key={v}
                variant="pink"
                className="flex items-center gap-1 pl-3 pr-1 py-1 text-[11px] font-bold tracking-tight animate-in zoom-in-95 duration-200"
              >
                {option?.label || v}
                <button
                  type="button"
                  onClick={() => removeItem(v)}
                  className="rounded-full hover:bg-pink-600/20 p-0.5 transition-colors"
                >
                  <X size={12} />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
