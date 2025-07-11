"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import React, { useCallback, useState } from "react";

import { CreateTransactionSchema } from "@/schema/CreateTransactionSchema";
import z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryCombobox from "./CategoryCombobox";
import { TransactionDate } from "./TransactionDate";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTransaction } from "../_actions/CreateTransaction";
import { toast } from "sonner";

interface Props {
  trigger: React.ReactNode;
  type: TransactionType;
}

const CreateTransactionDialog = ({ trigger, type }: Props) => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof CreateTransactionSchema>>({
    defaultValues: {
      type,
      description: "",
      amount: 0.1,
      category: "",
      categoryIcon: "",
      date: new Date(),
    },
  });
  const queryClient = useQueryClient();

  const transactionMutation = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: async () => {
      toast.success("Transaction created successfully", {
        id: "create-transaction",
      });
      await queryClient.invalidateQueries({ queryKey: ["overview"] });
      setOpen(false);
      form.reset({
        type,
        description: "",
        amount: 0.1,
        category: "",
        categoryIcon: "",
        date: new Date(),
      });
    },
    onError: (err) => {
      console.log(err);
      toast.error("Something went wrong", { id: "create-transaction" });
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof CreateTransactionSchema>) => {
      toast.loading("Creating Transaction....", { id: "create-transaction" });
      transactionMutation.mutate({
        category: values.category,
        type,
        categoryIcon: values.categoryIcon,
        description: values.description || "",
        amount: values.amount,
        date: values.date,
      });
    },
    [transactionMutation],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn(
          "shadow-sm",
          type === "income" ? "shadow-emerald-500" : "shadow-pink-500",
        )}
      >
        <DialogHeader>
          <DialogTitle>
            Create new{" "}
            <span
              className={cn(
                type === "expense" ? "text-red-500" : "text-emerald-500",
              )}
            >
              {type}
            </span>{" "}
            transaction
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl className="w-full">
                    <Input {...field} placeholder="Enter your description" />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Transaction Description (Optional)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl className="w-full">
                    <Input
                      type="number"
                      {...field}
                      placeholder="Enter your amount"
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Transaction Amount (required)
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="flex flex-row items-center gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoryCombobox
                        type={type}
                        value={field.value}
                        setValue={field.onChange}
                        setIcon={(value) => {
                          form.setValue("categoryIcon", value);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl className="w-full">
                      <TransactionDate
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <Button
          disabled={transactionMutation.isPending}
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          className="w-full my-5 cursor-pointer"
        >
          {transactionMutation.isPending
            ? "Creating Transaction..."
            : "Create Transaction"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransactionDialog;
