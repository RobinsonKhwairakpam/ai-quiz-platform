import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";
import { History, Plus, Target, Trophy } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import QuizHistory from "@/app/components/QuizHistory";
import db from "@/lib/prisma";

async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const quizzes = await db.quiz.findMany({
    where: { userId: user.id },
    include: { questions: true },
    orderBy: { duration: "desc" },
  });

  // Calculate statistics
  const completedQuizzes = quizzes.filter(
    (quiz) => quiz.type === "QUIZ" && quiz.score !== null && quiz.questions?.length > 0
  );
  
  const totalAttempts = completedQuizzes.length;
  
  const averageScore = totalAttempts > 0
    ? Math.round(
        completedQuizzes.reduce((acc, quiz) => {
          const percent = ((quiz.score || 0) / quiz.questions.length) * 100;
          return acc + percent;
        }, 0) / totalAttempts
      )
    : 0;
  

  return (
    <main className="px-7 py-5 mx-auto max-w-[85rem]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
        {/* Create Quiz Card */}
        <div className="w-full">
          <Link href="/quiz">
            <Card className="hover:cursor-pointer hover:scale-[1.02] transition-transform duration-200 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xl font-bold">Create Quiz</CardTitle>
                <Plus size={26} strokeWidth={2.5} />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create and take a quiz on any topic of your choice with AI-generated questions.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Total Attempts Card */}
        <div className="w-full">
          <Card className="hover:scale-[1.02] transition-transform duration-200 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-bold">
                Total Attempts
              </CardTitle>
              <Target size={26} strokeWidth={2.5} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalAttempts}
                <span className="text-sm text-muted-foreground ml-2">
                  quizzes completed
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Average Score Card */}
        <div className="w-full">
          <Card className="hover:scale-[1.02] transition-transform duration-200 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-bold">Average Score</CardTitle>
              <Trophy size={26} strokeWidth={2.5} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageScore}%
                <span className="text-sm text-muted-foreground ml-2">
                  across all quizzes
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz History */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <QuizHistory quizzes={quizzes} />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
