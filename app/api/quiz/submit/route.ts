// /app/api/quiz/submit/route.ts
import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { quizId, answers } = await req.json();

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    let score = 0;

    quiz.questions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (userAnswer && userAnswer === q.correct) score += 1;
    });

    await db.quiz.update({
      where: { id: quizId },
      data: {
        score,
      },
    });

    // Save user's answers in the Question model (optional but useful)
    await Promise.all(
      quiz.questions.map((q) =>
        db.question.update({
          where: { id: q.id },
          data: {
            answer: answers[q.id] || null,
          },
        })
      )
    );

    return NextResponse.json({ success: true, score });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 });
  }
}
