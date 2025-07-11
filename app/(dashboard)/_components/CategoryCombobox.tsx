"use client";

import React from "react";

import { Check, ChevronsUpDown, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/lib/generated/prisma";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { TransactionType } from "@/lib/types";
import SkeletonWrapper from "@/components/SkeletonWrapper";

const CategoryCombobox = ({
  value,
  setValue,
  type,
  setIcon,
}: {
  value: string;
  setValue: (value: string) => void;
  type: TransactionType;
  setIcon: (value: string) => void;
}) => {
  const [open, setOpen] = React.useState(false);

  const categoryQuery = useQuery({
    queryKey: ["categories", "transaction", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? value : "Select a category"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn("w-[200px] p-0 shadow-sm shadow-violet-500")}
      >
        <SkeletonWrapper isLoading={categoryQuery.isLoading}>
          <Command>
            <CommandInput placeholder="Search framework..." className="h-9" />
            <CommandList>
              <CreateCategoryDialog
                type={type}
                trigger={
                  <Button
                    variant={"ghost"}
                    className="w-full flex items-center gap-2 p-2 border-b"
                  >
                    <PlusIcon className="size-4" />
                    Create new category
                  </Button>
                }
              />
              <CommandEmpty>No category found.</CommandEmpty>

              <CommandGroup>
                {categoryQuery.data?.map((category: Category) => (
                  <CommandItem
                    key={category.name}
                    value={category.name}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                      setIcon(category.icon);
                    }}
                  >
                    {category.icon} {category.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === category.name ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </SkeletonWrapper>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryCombobox;
