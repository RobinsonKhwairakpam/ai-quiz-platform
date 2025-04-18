import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";
import { History } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }
  return (
    <main className="p-8 mx-auto max-w-[85rem]">
      <h2 className="mr-2 text-2xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid grid-cols-12 gap-6 mt-4">
        <div className="col-span-4">
          <Link href={"/quiz"}>
            <Card
              className="hover:cursor-pointer hover:opacity-75"
              //   onClick={() => {
              //     router.push("/history");
              //   }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xl font-bold">Create Quiz</CardTitle>
                <History size={28} strokeWidth={2.5} />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create a quiz with a topic of your choice
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
        <Card
          className="col-span-4 hover:cursor-pointer hover:opacity-75"
          //   onClick={() => {
          //     router.push("/history");
          //   }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xl font-bold">History</CardTitle>
            <History size={28} strokeWidth={2.5} />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              View past quiz attempts.
            </p>
          </CardContent>
        </Card>
        <Card
          className="col-span-4 hover:cursor-pointer hover:opacity-75"
          //   onClick={() => {
          //     router.push("/history");
          //   }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xl font-bold">History</CardTitle>
            <History size={28} strokeWidth={2.5} />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              View past quiz attempts.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default Dashboard;
