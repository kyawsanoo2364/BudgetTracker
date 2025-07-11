"use client";

import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMonths } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import MonthHistoryBarChart from "./MonthHistoryBarChart";
import { GetMonthHistoryResponseType } from "@/app/api/month-history/route";
import { GetYearHistoryResponseType } from "@/app/api/year-history/route";
import YearHistoryBarChart from "./YearHistoryBarChart";

const History = () => {
  const [historyPeriod, setHistoryPeriod] = useState("month");
  const [month, setMonth] = useState(
    new Date(Date.now()).toLocaleString("default", { month: "long" }),
  );
  const [year, setYear] = useState(
    new Date(Date.now()).getUTCFullYear().toString(),
  );
  const months = useCallback(() => {
    return getMonths();
  }, []);

  const peroidQuery = useQuery<{ year: number }[]>({
    queryKey: ["overview", "history", "period"],
    queryFn: () => fetch(`/api/history-period`).then((res) => res.json()),
  });

  const historyMonthQuery = useQuery<GetMonthHistoryResponseType>({
    queryKey: ["overview", "history", "month", month, year],
    queryFn: () =>
      fetch(`/api/month-history?month=${month}&year=${year}`).then((res) =>
        res.json(),
      ),
  });

  const historyYearQuery = useQuery<GetYearHistoryResponseType>({
    queryKey: ["overview", "history", "year", year],
    queryFn: () =>
      fetch(`/api/year-history?year=${year}`).then((res) => res.json()),
  });

  const userSettingsQuery = useQuery({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/userSettings").then((res) => res.json()),
  });

  return (
    <div className="my-4 container mx-auto w-full">
      <div className="flex flex-row gap-6">
        <h2 className="text-3xl font-bold">History</h2>
        <Tabs value={historyPeriod} onValueChange={setHistoryPeriod}>
          <TabsList className="w-60">
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center flex-row gap-4">
          {historyPeriod === "month" && (
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a month" />
              </SelectTrigger>
              <SelectContent>
                {months().map((m) => (
                  <SelectItem value={m} key={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <SkeletonWrapper isLoading={peroidQuery.isLoading}>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a year" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {peroidQuery.data?.map((d) => (
                    <SelectItem key={d.year} value={d.year.toString()}>
                      {d.year}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </SkeletonWrapper>
        </div>
      </div>
      <SkeletonWrapper isLoading={userSettingsQuery.isLoading}>
        <div className="flex h-96 w-full border border-muted rounded-md mt-4">
          {historyPeriod === "month" && (
            <SkeletonWrapper isLoading={historyMonthQuery.isLoading}>
              <MonthHistoryBarChart
                currency={userSettingsQuery.data?.currency}
                data={historyMonthQuery.data as GetMonthHistoryResponseType}
              />
            </SkeletonWrapper>
          )}
          {historyPeriod === "year" && (
            <SkeletonWrapper isLoading={historyYearQuery.isLoading}>
              <YearHistoryBarChart
                currency={userSettingsQuery.data?.currency}
                data={historyYearQuery.data as GetYearHistoryResponseType}
              />
            </SkeletonWrapper>
          )}
        </div>
      </SkeletonWrapper>
    </div>
  );
};

export default History;
