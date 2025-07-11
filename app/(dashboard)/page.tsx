import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import Overview from "./_components/Overview";
import History from "./_components/History";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  return (
    <div className="flex flex-col ">
      {user && (
        <div className="w-full py-2 bg-card px-4">
          <h3 className="text-2xl font-bold">Welcome {user?.fullName}! 👋</h3>
        </div>
      )}
      <Overview />
      <History />
    </div>
  );
};

export default page;
