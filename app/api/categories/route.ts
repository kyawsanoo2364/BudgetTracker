import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  if (!type)
    return Response.json({ error: "Type is required!" }, { status: 400 });

  try {
    const categories = await prisma.category.findMany({
      where: {
        userId: user.id,
        type,
      },
    });

    return Response.json(categories, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
