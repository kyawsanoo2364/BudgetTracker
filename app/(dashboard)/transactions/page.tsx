"use client";

import React, { useState } from "react";
import { DataTable } from "./_components/table/data-table";
import { columns } from "./_components/table/columns";
import { useQuery } from "@tanstack/react-query";
import { es } from "date-fns/locale";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

const page = () => {
  const [date, setDate] = useState<DateRange>({
    from: addDays(Date.now(), -20),
    to: new Date(),
  });
  const transactionsQuery = useQuery({
    queryKey: [
      "overview",
      "transactions",
      "history",
      { from: date.from },
      { to: date.to },
    ],
    queryFn: () =>
      fetch(`/api/transactions?from=${date.from}&to=${date.to}`).then((res) =>
        res.json(),
      ),
  });

  return (
    <div className="flex w-full h-full flex-col gap-4 container mx-auto my-5">
      <h2 className="text-3xl font-bold">Transaction Histories</h2>
      <SkeletonWrapper isLoading={transactionsQuery.isLoading}>
        <div className="w-full h-96">
          <DataTable
            columns={columns}
            data={transactionsQuery?.data}
            date={date}
            setDate={setDate}
          />
        </div>
      </SkeletonWrapper>
    </div>
  );
};

export default page;
