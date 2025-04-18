"use server";

import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateQuiz(topicTitle: String, numQuestions: Number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Generate ${numQuestions} technical interview questions for the topic ${topicTitle}.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

type QuestionInput = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
};

export async function saveQuiz(questions: QuestionInput[]) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) throw new Error("User not found");

    const quiz = await db.quiz.create({
      data: {
        userId: user.id,
        type: "QUIZ",
        duration: new Date(),
        // duration: new Date(Date.now() + duration * 1000), // assuming future datetime
        questions: {
          create: questions.map((q) => ({
            question: q.question,
            options: q.options,
            correct: q.correctAnswer,
            explanation: q.explanation,
          })),
        },
      },
      include: {
        questions: true,
      },
    });
  
    return quiz;
  } catch (error) {
    console.error("Error saving quiz:", error);
    throw new Error("Failed to save quiz questions");
  }
}

export async function getQuiz(quizId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) throw new Error("User not found");

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
      },
    });

    if (!quiz || quiz.userId !== user.id) {
      throw new Error("Unauthorized access to this quiz");
    }
  
    return quiz;
  } catch (error) {
    console.error("Error getting quiz:", error);
    throw new Error("Failed to get quiz questions");
  }
}

// export async function saveQuizResult(questions, answers, score) {
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   const user = await db.user.findUnique({
//     where: { clerkUserId: userId },
//   });

//   if (!user) throw new Error("User not found");

//   const questionResults = questions.map((q, index) => ({
//     question: q.question,
//     answer: q.correctAnswer,
//     userAnswer: answers[index],
//     isCorrect: q.correctAnswer === answers[index],
//     explanation: q.explanation,
//   }));

//   // Get wrong answers
//   const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

//   // Only generate improvement tips if there are wrong answers
//   let improvementTip = null;
//   if (wrongAnswers.length > 0) {
//     const wrongQuestionsText = wrongAnswers
//       .map(
//         (q) =>
//           `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
//       )
//       .join("\n\n");

//     const improvementPrompt = `
//       The user got the following ${user.industry} technical interview questions wrong:

//       ${wrongQuestionsText}

//       Based on these mistakes, provide a concise, specific improvement tip.
//       Focus on the knowledge gaps revealed by these wrong answers.
//       Keep the response under 2 sentences and make it encouraging.
//       Don't explicitly mention the mistakes, instead focus on what to learn/practice.
//     `;

//     try {
//       const tipResult = await model.generateContent(improvementPrompt);

//       improvementTip = tipResult.response.text().trim();
//       console.log(improvementTip);
//     } catch (error) {
//       console.error("Error generating improvement tip:", error);
//       // Continue without improvement tip if generation fails
//     }
//   }

//   try {
//     const assessment = await db.assessment.create({
//       data: {
//         userId: user.id,
//         quizScore: score,
//         questions: questionResults,
//         category: "Technical",
//         improvementTip,
//       },
//     });

//     return assessment;
//   } catch (error) {
//     console.error("Error saving quiz result:", error);
//     throw new Error("Failed to save quiz result");
//   }
// }

// export async function getAssessments() {
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   const user = await db.user.findUnique({
//     where: { clerkUserId: userId },
//   });

//   if (!user) throw new Error("User not found");

//   try {
//     const assessments = await db.assessment.findMany({
//       where: {
//         userId: user.id,
//       },
//       orderBy: {
//         createdAt: "asc",
//       },
//     });

//     return assessments;
//   } catch (error) {
//     console.error("Error fetching assessments:", error);
//     throw new Error("Failed to fetch assessments");
//   }
// }
