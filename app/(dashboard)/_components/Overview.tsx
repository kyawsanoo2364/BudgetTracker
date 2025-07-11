"use client";

import { Button } from "@/components/ui/button";
import { User } from "@clerk/nextjs/server";
import {
  BriefcaseBusinessIcon,
  PlusIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import React, { useMemo } from "react";
import CreateTransactionDialog from "./CreateTransactionDialog";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import DateRangePicker from "@/components/date-range-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, CurrencyFormatterFn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { GetTransactionsResponseType } from "@/app/api/overview-transactions/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import CountUp from "react-countup";
import PieChartOverview from "./PieChartOverview";

const Overview = () => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -20),
    to: new Date(Date.now()),
  });

  const transactionQuery = useQuery<GetTransactionsResponseType>({
    queryKey: ["overview", "transaction", date?.from, date?.to],
    queryFn: () =>
      fetch(
        `/api/overview-transactions?from=${date?.from}&to=${date?.to}`,
      ).then((res) => res.json()),
  });

  const total = useMemo(() => {
    return transactionQuery.data?.reduce(
      (acc, curr) => acc + (curr._sum.amount || 0),
      0,
    );
  }, [transactionQuery.data]);

  const income = useMemo(
    () =>
      transactionQuery.data
        ?.filter((t) => t.type === "income")
        .reduce((acc, curr) => acc + (curr._sum.amount || 0), 0),
    [transactionQuery.data],
  );
  const expense = useMemo(
    () =>
      transactionQuery.data
        ?.filter((t) => t.type === "expense")
        .reduce((acc, curr) => acc + (curr._sum.amount || 0), 0),
    [transactionQuery.data],
  );
  const balance = useMemo(() => {
    return (income as number) - (expense as number);
  }, [income, expense]);

  const data = useMemo(() => {
    return [
      { type: "income", value: ((income as number) / (total as number)) * 100 },
      {
        type: "expense",
        value: ((expense as number) / (total as number)) * 100,
      },
    ];
  }, [transactionQuery.data]);

  return (
    <div className="flex flex-col">
      <div className="flex md:items-center items-start gap-4 flex-col md:flex-row md:justify-between  container mx-auto py-4  px-2">
        <div className="flex flex-row w-full justify-between items-center ">
          <h2 className="md:text-3xl  text-2xl font-bold">Overview</h2>
          <DateRangePicker
            className="md:hidden block"
            date={date}
            setDate={setDate}
          />
        </div>

        <div className="flex w-full items-center justify-between md:justify-end md:gap-4 gap-2">
          <CreateTransactionDialog
            trigger={
              <Button
                className="bg-emerald-500/10 text-emerald-500 font-semibold hover:bg-emerald-500/50 hover:text-emerald-600 cursor-pointer"
                variant={"outline"}
              >
                <PlusIcon className="size-4" />
                Income 🤩
              </Button>
            }
            type="income"
          />
          <CreateTransactionDialog
            trigger={
              <Button
                className="bg-red-500/10 text-rose-500 font-semibold hover:bg-rose-500/50 hover:text-rose-600 cursor-pointer"
                variant={"outline"}
              >
                <PlusIcon className="size-4" />
                Expense 😐
              </Button>
            }
            type="expense"
          />
          <DateRangePicker
            className="hidden md:block"
            date={date}
            setDate={setDate}
          />
        </div>
      </div>

      <BalanceCards
        income={income || 0}
        expense={expense || 0}
        balance={balance || 0}
      />

      <div className="container mx-auto w-full flex md:flex-nowrap flex-wrap flex-col gap-2  md:flex-row items-center">
        <SkeletonWrapper
          isLoading={transactionQuery.isLoading}
          className="mt-2"
        >
          <div
            className={cn(
              "w-full  relative border rounded-md border-muted my-4 h-96",
              transactionQuery.isLoading && "h-90",
            )}
          >
            <div className="flex flex-col gap-4 absolute top-5 left-5">
              <div className="flex items-center flex-row gap-2">
                <div className="size-4 rounded-full bg-emerald-500" />
                <span className="font-medium">Income</span>
              </div>
              <div className="flex items-center flex-row gap-2">
                <div className="size-4 rounded-full bg-rose-500" />
                <span className="font-medium">Expense</span>
              </div>
            </div>
            <PieChartOverview data={data} />
          </div>
        </SkeletonWrapper>
        <Card className="w-full h-96">
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2 text-emerald-500">
              <span className="size-3 rounded-full bg-emerald-500"></span>
              Incomes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SkeletonWrapper isLoading={transactionQuery.isLoading}>
              <ScrollArea className="w-full h-72 ">
                {transactionQuery.data?.length > 0 ? (
                  transactionQuery.data
                    ?.filter((t) => t.type === "income")
                    .map((t) => {
                      const percentage =
                        ((t._sum.amount || 0) / (total as number)) * 100;
                      return (
                        <TransactionCardItem
                          key={t.category}
                          label={`${t.categoryIcon} ${t.category}`}
                          value={percentage}
                          type="income"
                        />
                      );
                    })
                ) : (
                  <div className="flex items-center justify-center flex-col w-full h-60">
                    <p className="text-muted-foreground text-center">
                      No transactions yet. Create a new transaction.
                    </p>
                  </div>
                )}
              </ScrollArea>
            </SkeletonWrapper>
          </CardContent>
        </Card>

        <Card className="w-full h-96">
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2 text-rose-500">
              <span className="size-3 rounded-full bg-rose-500"></span>
              Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SkeletonWrapper isLoading={transactionQuery.isLoading}>
              <ScrollArea className="w-full h-72 ">
                {transactionQuery.data?.length > 0 ? (
                  transactionQuery.data
                    ?.filter((t) => t.type === "expense")
                    .map((t) => {
                      const percentage =
                        ((t._sum.amount || 0) / (total as number)) * 100;
                      return (
                        <TransactionCardItem
                          key={t.category}
                          label={`${t.categoryIcon} ${t.category}`}
                          value={percentage}
                          type="expense"
                        />
                      );
                    })
                ) : (
                  <div className="flex items-center justify-center flex-col w-full h-60">
                    <p className="text-muted-foreground text-center">
                      No transactions yet. Create a new transaction.
                    </p>
                  </div>
                )}
              </ScrollArea>
            </SkeletonWrapper>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;

function TransactionCardItem({
  type,
  value,
  label,
}: {
  type: TransactionType;
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-row items-center justify-between gap-4 relative my-4">
      <div>
        <span className="flex flex-col items-center">{label}</span>
      </div>
      <div className="w-[70%] relative">
        <Progress
          value={value}
          className={cn("w-full")}
          indicatorclassname={cn(
            type === "income" ? "bg-emerald-500" : "bg-rose-500",
          )}
        />
        <span className="text-muted-foreground absolute right-0 -top-5 text-sm">
          {value.toFixed(0)} %
        </span>
      </div>
    </div>
  );
}

function BalanceCards({
  income,
  expense,
  balance,
}: {
  income: number;
  expense: number;
  balance: number;
}) {
  const userSettingsQuery = useQuery({
    queryKey: ["userSettings"],
    queryFn: () => fetch(`/api/userSettings`).then((res) => res.json()),
  });
  return (
    <div className="grid container mx-auto items-center grid-flow-row grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 w-full">
      <SkeletonWrapper isLoading={userSettingsQuery.isLoading}>
        <Card className="w-full md:py-2 py-1 ">
          <CardContent className="flex flex-row items-center gap-4">
            <TrendingUpIcon className="p-2 size-8 md:size-10 bg-emerald-500/20 text-emerald-500 rounded-md" />
            <div className="flex flex-col items-start ">
              <span className="text-base md:text-lg font-bold">Income</span>
              <span>
                {userSettingsQuery.data?.currency && (
                  <CountUp
                    end={income}
                    duration={0.7}
                    formattingFn={
                      CurrencyFormatterFn(userSettingsQuery.data?.currency)
                        .format
                    }
                  />
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={userSettingsQuery.isLoading}>
        <Card className="w-full md:py-2 py-1">
          <CardContent className="flex flex-row items-center gap-4">
            <TrendingDownIcon className="p-2 size-8 md:size-10 bg-rose-500/20 text-rose-500 rounded-md" />
            <div className="flex flex-col items-start ">
              <span className="text-base md:text-lg font-bold">Expense</span>
              <span>
                {userSettingsQuery.data?.currency && (
                  <CountUp
                    end={expense}
                    duration={0.7}
                    formattingFn={
                      CurrencyFormatterFn(userSettingsQuery.data?.currency)
                        .format
                    }
                  />
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={userSettingsQuery.isLoading}>
        <Card className="w-full md:py-2 py-1">
          <CardContent className="flex flex-row items-center gap-4">
            <BriefcaseBusinessIcon className="p-2 size-8 md:size-10 bg-violet-500/20 text-violet-500 rounded-md" />
            <div className="flex flex-col items-start ">
              <span className="text-base md:text-lg font-bold">Balance</span>
              <span>
                {userSettingsQuery.data?.currency && (
                  <CountUp
                    end={balance}
                    duration={0.7}
                    formattingFn={
                      CurrencyFormatterFn(userSettingsQuery.data?.currency)
                        .format
                    }
                  />
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      </SkeletonWrapper>
    </div>
  );
}
