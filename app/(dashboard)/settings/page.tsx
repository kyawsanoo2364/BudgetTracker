"use client";

import CurrencyCard from "@/app/wizard/_components/CurrencyCard";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import CategoryCard from "./_components/CategoryCard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlusSquareIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateCategoryDialog from "../_components/CreateCategoryDialog";

const page = () => {
  const incomeCategoriesQuery = useQuery({
    queryKey: ["categories", "income"],
    queryFn: () =>
      fetch(`/api/categories?type=income`).then((res) => res.json()),
  });

  const expenseCategoriesQuery = useQuery({
    queryKey: ["categories", "expense"],
    queryFn: () =>
      fetch(`/api/categories?type=expense`).then((res) => res.json()),
  });

  return (
    <div className="flex w-full h-full flex-col gap-6 container mx-auto my-5">
      <div className="flex flex-col gap-4 w-full ">
        <h3 className="text-3xl font-bold">My Currency</h3>
        <CurrencyCard className="max-w-full" />
      </div>
      <div className="flex flex-col gap-4 w-full">
        <h3 className="text-3xl font-bold">Categories</h3>
        <div className="flex flex-col md:flex-row w-full gap-4 items-center">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between flex-row">
                <p>
                  <span className="text-emerald-500">Income</span> Categories
                </p>
                <CreateCategoryDialog
                  type="income"
                  trigger={
                    <Button className="cursor-pointer" variant={"outline"}>
                      <PlusSquareIcon />
                      Create
                    </Button>
                  }
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SkeletonWrapper isLoading={incomeCategoriesQuery.isLoading}>
                <ScrollArea className={cn("flex flex-row w-full gap-4  h-80")}>
                  {incomeCategoriesQuery.data &&
                  incomeCategoriesQuery.data.length > 0 ? (
                    <div className="flex flex-row w-full items-center flex-wrap gap-2">
                      {incomeCategoriesQuery.data?.map((category) => (
                        <CategoryCard
                          key={category.name}
                          name={category.name}
                          icon={category.icon}
                          type="income"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col w-full items-center justify-center h-70">
                      <p className="text-muted-foreground">No Category yet.</p>
                    </div>
                  )}
                </ScrollArea>
              </SkeletonWrapper>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between flex-row">
                <p>
                  <span className="text-rose-500">Expense</span> Categories
                </p>
                <CreateCategoryDialog
                  type="expense"
                  trigger={
                    <Button className="cursor-pointer" variant={"outline"}>
                      <PlusSquareIcon />
                      Create
                    </Button>
                  }
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SkeletonWrapper isLoading={expenseCategoriesQuery.isLoading}>
                <ScrollArea className={cn("flex flex-row w-full gap-4  h-80")}>
                  {expenseCategoriesQuery.data &&
                  expenseCategoriesQuery.data.length > 0 ? (
                    <div className="flex flex-row w-full items-center flex-wrap gap-2">
                      {expenseCategoriesQuery.data?.map((category) => (
                        <CategoryCard
                          key={category.name}
                          name={category.name}
                          icon={category.icon}
                          type="expense"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col w-full items-center justify-center h-70">
                      <p className="text-muted-foreground">No Category yet.</p>
                    </div>
                  )}
                </ScrollArea>
              </SkeletonWrapper>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default page;
