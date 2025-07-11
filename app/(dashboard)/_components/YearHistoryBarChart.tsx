"use client";

import { GetYearHistoryResponseType } from "@/app/api/year-history/route";
import { CurrencyFormatterFn } from "@/lib/utils";
import React from "react";
import CountUp from "react-countup";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const YearHistoryBarChart = ({
  data,
  currency,
}: {
  data: GetYearHistoryResponseType;
  currency: string;
}) => {
  return (
    <ResponsiveContainer>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="5 5" opacity={0.2} />
        <XAxis dataKey={"month"} />
        <YAxis />
        <Tooltip
          content={(props) => <CustomTooltip {...props} currency={currency} />}
        />
        <Legend />
        <Bar dataKey={"income"} fill="#50C878" />
        <Bar dataKey={"expense"} fill="#FF007F" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default YearHistoryBarChart;

const CustomTooltip = ({ active, payload, label, currency }) => {
  const isVisible = active && payload && payload.length;

  return (
    <div
      className="w-40 p-2 bg-background rounded-md"
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      <div className="flex flex-col gap-4">
        <span>{payload[0]?.payload?.month}</span>
        <div className="flex items-center flex-row gap-2">
          <div className="size-4 rounded-full bg-emerald-500" />

          <CountUp
            duration={0.2}
            end={payload[0]?.payload.income}
            formattingFn={CurrencyFormatterFn(currency).format}
          />
        </div>
        <div className="flex items-center flex-row gap-2">
          <div className="size-4 rounded-full bg-red-500" />
          <CountUp
            duration={0.2}
            end={payload[0]?.payload.expense}
            formattingFn={CurrencyFormatterFn(currency).format}
          />
        </div>
      </div>
    </div>
  );
};
