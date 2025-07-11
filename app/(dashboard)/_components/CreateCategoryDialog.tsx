"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TransactionType } from "@/lib/types";
import { CreateCategorySchema } from "@/schema/CreateCategorySchema";
import { SmilePlusIcon } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import emojiData from "@emoji-mart/data";
import EmojiPicker from "@emoji-mart/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "next-themes";

import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategory } from "../_actions/CreateCategory";
import { zodResolver } from "@hookform/resolvers/zod";

const CreateCategoryDialog = ({
  trigger,
  type,
}: {
  trigger: React.ReactNode;
  type: TransactionType;
}) => {
  const form = useForm<z.infer<typeof CreateCategorySchema>>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      type,
      name: "",
      icon: "",
    },
  });
  const theme = useTheme();
  const [mobileEmojiPickerShow, setMobileEmojiPickerShow] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const queryClient = useQueryClient();

  const categoryMutation = useMutation({
    mutationFn: CreateCategory,
    onSuccess: async (data) => {
      toast.success(`${data.icon} ${data.name} is created successfully!`, {
        id: "create-category",
      });
      setCategoryOpen((prev) => !prev);
      form.reset({
        type,
        name: "",
        icon: "",
      });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      toast.error("Something went wrong", { id: "create-category" });
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof CreateCategorySchema>) => {
      toast.loading("Creating category...", { id: "create-category" });
      categoryMutation.mutate({
        name: values.name,
        type: values.type,
        icon: values.icon,
      });
    },
    [categoryMutation],
  );

  return (
    <Dialog open={categoryOpen} onOpenChange={setCategoryOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="shadow-sm shadow-violet-500 w-[400px]">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your category name"
                      {...field}
                      disabled={categoryMutation.isPending}
                    />
                  </FormControl>
                  <FormDescription>Category Name (requred)</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <div>
                      {/** Desktop */}
                      <Popover>
                        <PopoverTrigger asChild className="hidden md:flex">
                          <Button
                            disabled={categoryMutation.isPending}
                            type="button"
                            className="w-full h-42 "
                            variant={"outline"}
                          >
                            {field.value ? (
                              <span className="text-5xl">{field.value}</span>
                            ) : (
                              <SmilePlusIcon className="size-14 text-muted-foreground" />
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-full md:inline-block hidden"
                          align="center"
                          side="right"
                        >
                          <EmojiPicker
                            data={emojiData}
                            onEmojiSelect={(data: { native: string }) => {
                              field.onChange(data.native);
                            }}
                            navPosition="bottom"
                            theme={theme.resolvedTheme}
                          />
                        </PopoverContent>
                      </Popover>
                      {/** Mobile */}
                      <Dialog
                        open={mobileEmojiPickerShow}
                        onOpenChange={setMobileEmojiPickerShow}
                      >
                        <DialogTrigger asChild className="md:hidden flex">
                          <Button
                            disabled={categoryMutation.isPending}
                            type="button"
                            className="w-full h-42 "
                            variant={"outline"}
                          >
                            {field.value ? (
                              <span className="text-5xl">{field.value}</span>
                            ) : (
                              <SmilePlusIcon className="size-14 text-muted-foreground" />
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="md:hidden inline-block">
                          <DialogHeader>
                            <DialogTitle>Choose Category Icon</DialogTitle>
                          </DialogHeader>
                          <EmojiPicker
                            perLine={7}
                            data={emojiData}
                            onEmojiSelect={(data: { native: string }) => {
                              field.onChange(data.native);
                              setMobileEmojiPickerShow((prev) => !prev);
                            }}
                            navPosition="bottom"
                            theme={theme.resolvedTheme}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </FormControl>
                  <FormDescription>Category Icon (requred)</FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          className="w-full cursor-pointer"
          disabled={categoryMutation.isPending}
        >
          Create Category
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;
