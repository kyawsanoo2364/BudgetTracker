"use client";

import React, { useEffect, useState } from "react";
import { cn, Currencies } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChangeCurrency } from "../_actions/changeCurrency";
import { toast } from "sonner";

const CurrencyCard = ({ className }: { className?: string }) => {
  const [value, setValue] = useState("");
  const client = useQueryClient();
  const queryClient = useQuery<{ userId: string; currency: string }>({
    queryKey: ["userSettings"],
    queryFn: () => fetch(`/api/userSettings`).then((res) => res.json()),
  });

  const mutation = useMutation({
    mutationFn: ChangeCurrency,
    onSuccess: async () => {
      toast.success("Currency Changed successfully", { id: "change-currency" });
      await client.invalidateQueries({ queryKey: ["userSettings"] });
    },
    onError: () => {
      toast.error("Something went wrong!", { id: "change-currency" });
    },
  });

  useEffect(() => {
    if (queryClient.data) {
      const match = Currencies.find(
        (c) => c.currency === queryClient.data.currency,
      ) as (typeof Currencies)[0];
      setValue(match.locale);
    }
  }, [queryClient.data]);

  useEffect(() => {
    if (
      value &&
      value !==
        Currencies.find((c) => queryClient.data?.currency === c.currency)
          ?.locale
    ) {
      const currency = Currencies.find((c) => c.locale === value)
        ?.currency as string;
      toast.loading("Changing currency...", { id: "change-currency" });
      mutation.mutate(currency);
    }
  }, [value]);
  return (
    <Card className={cn("max-w-lg w-full", className)}>
      <CardHeader>
        <CardTitle>Choose your currency</CardTitle>
        <CardDescription>
          You can change it anytime in Settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SkeletonWrapper isLoading={queryClient.isFetching}>
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Currencies</SelectLabel>
                {Currencies.map((c) => (
                  <SelectItem key={c.locale} value={c.locale}>
                    {c.label} ({c.currency})
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </SkeletonWrapper>
      </CardContent>
    </Card>
  );
};

export default CurrencyCard;
