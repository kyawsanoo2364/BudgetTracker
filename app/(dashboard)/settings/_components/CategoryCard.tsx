"use client";

import DeleteDialog from "@/components/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon, XIcon } from "lucide-react";
import React from "react";
import { deleteCategory } from "../_actions/deleteCategory";
import { toast } from "sonner";
import { TransactionType } from "@/lib/types";

const CategoryCard = ({
  name,
  icon,
  type,
}: {
  name: string;
  icon: string;
  type: TransactionType;
}) => {
  const queryClient = useQueryClient();
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: async () => {
      toast.success("Category deleted successfully!", {
        id: "delete-category",
      });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Something went wrong!", { id: "delete-category" });
    },
  });

  return (
    <Card className="py-2 px-0">
      <CardContent>
        <div className="flex flex-row items-center gap-6">
          <span className="text-xl" role="img">
            {icon}
          </span>
          <span className="text-sm font-bold">{name}</span>
          <DeleteDialog
            trigger={
              <Button variant={"ghost"} className="rounded-full cursor-pointer">
                <Trash2Icon className="text-rose-500" />
              </Button>
            }
            actionFn={() => {
              toast.loading("Deleting category...", { id: "delete-category" });
              deleteCategoryMutation.mutate({ name, icon, type });
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
