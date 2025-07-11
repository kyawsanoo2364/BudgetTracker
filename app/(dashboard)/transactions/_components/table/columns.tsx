"use client";

import { GetTransactionsDataResponseType } from "@/app/api/transactions/route";
import DeleteDialog from "@/components/DeleteDialog";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, CurrencyFormatterFn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { Trash2 } from "lucide-react";
import CountUp from "react-countup";
import { deleteTransaction } from "../../_actions/deleteTransaction";
import { toast } from "sonner";

export const columns: ColumnDef<GetTransactionsDataResponseType[0]>[] = [
  {
    accessorKey: "category",
    header: "Category",
    cell: (props) => {
      return (
        <div className="flex items-center flex-row gap-2">
          <span className="text-lg" rel="img">
            {props.row.original.categoryIcon}
          </span>{" "}
          {props.row.original.category}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const userSettingsQuery = useQuery<{ currency: string }>({
        queryKey: ["userSettings"],
        queryFn: () => fetch(`/api/userSettings`).then((res) => res.json()),
      });
      return (
        <SkeletonWrapper isLoading={userSettingsQuery.isLoading}>
          <span
            className={cn(
              "text-base",
              row.original.type === "income"
                ? "text-emerald-500"
                : "text-rose-500",
            )}
          >
            {userSettingsQuery.data && (
              <CountUp
                end={row.original.amount}
                duration={0.4}
                formattingFn={
                  CurrencyFormatterFn(
                    userSettingsQuery.data?.currency as string,
                  ).format
                }
              />
            )}
          </span>
        </SkeletonWrapper>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const formattedDate = formatDate(new Date(row.original.date), "PP");
      return <span className="text-base">{formattedDate}</span>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return (
        <Badge
          variant={"outline"}
          className={cn(
            "p-2",
            row.original.type === "income"
              ? "bg-emerald-400/10"
              : "bg-rose-400/10",
          )}
        >
          <div
            className={cn(
              row.original.type === "income" ? "bg-emerald-500" : "bg-rose-500",
              "size-2 rounded-full",
            )}
          />
          <span className="capitalize">{row.original.type}</span>
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const queryClient = useQueryClient();
      const mutation = useMutation({
        mutationFn: deleteTransaction,
        onSuccess: async () => {
          toast.success("Transaction deleted successfully", {
            id: "delete-transaction",
          });

          await queryClient.invalidateQueries({
            queryKey: ["overview"],
          });
        },
        onError: () => {
          toast.error("Something went wrong", { id: "delete-transaction" });
        },
      });
      return (
        <DeleteDialog
          trigger={
            <Button variant={"outline"} className="cursor-pointer">
              <Trash2 />
            </Button>
          }
          actionFn={() => {
            toast.loading("Deleting Transaction...", {
              id: "delete-transaction",
            });
            mutation.mutate({ id: row.original.id });
          }}
        />
      );
    },
  },
];
