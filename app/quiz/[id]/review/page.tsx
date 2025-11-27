import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import { MoveLeft, Trophy } from "lucide-react";
import Link from "next/link";

type ReviewPageParams = {
  params: {
    id: string;
  };
};

const ReviewPage = async ({ params }: ReviewPageParams) => {
  const { userId } = await auth();
  if (!userId) return <div className="text-center">Unauthorized</div>;
  const paramsId = await params

  const quiz = await db.quiz.findUnique({
    where: { id: paramsId.id },
    include: {
      questions: true,
    },
  });

  if (!quiz)
    return <div className="text-center">Quiz not found or unauthorized</div>;

  return (
    <div className="max-w-[60rem] mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 flex gap-4 items-center">
        Quiz Review <Trophy size={30} />
      </h1>
      <p className="text-lg font-semibold mb-4">
        Score: {quiz.score ?? "N/A"} / {quiz.questions.length}
      </p>

      {quiz.questions.map((q, idx) => {
        const isCorrect = q.answer === q.correct;
        return (
          <div key={q.id} className="mb-6 border p-4 rounded-md">
            <p className="font-medium">
              Q{idx + 1}: {q.question}
            </p>

            <p className="mt-1">
              <span className="font-semibold">Your Answer:</span>{" "}
              <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                {q.answer || "No answer"}
              </span>
            </p>

            {!isCorrect && (
              <>
                <p>
                  <span className="font-semibold">Correct Answer:</span>{" "}
                  {q.correct}
                </p>
              </>
            )}
            {q.explanation && (
              <Accordion type="single" collapsible>
                <AccordionItem value={`explanation-${q.id}`}>
                  <AccordionTrigger className="text-sm text-gray-500 cursor-pointer hover:no-underline">
                    Show Explanation
                  </AccordionTrigger>
                  <AccordionContent className="text-[.92rem] text-gray-300 font-medium italic">
                    {q.explanation}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        );
      })}
      <Link href="/dashboard" className="flex items-center gap-2 text-gray-300 hover:brightness-110">
        <MoveLeft /> Back to dashboard
      </Link>
    </div>
  );
};

export default ReviewPage;
