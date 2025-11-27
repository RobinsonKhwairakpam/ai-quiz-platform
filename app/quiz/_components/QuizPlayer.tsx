"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string | null;
}

interface Quiz {
  id: string;
  questions: Question[];
}

export default function QuizPlayer({ quiz }: { quiz: Quiz }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = quiz.questions[currentIndex];

  const handleOptionSelect = (option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // you can post answers to an API route here
    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      body: JSON.stringify({ quizId: quiz.id, answers }),
    });

    const data = await res.json();
    if (data.success) {
      router.push(`/quiz/${quiz.id}/review`);
    }
    setIsLoading(false);
  };

  return (
    <div className=" w-full sm:w-[85%] md:w-[740px] mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-5 underline">
        Question {currentIndex + 1}
      </h1>

      <div className="mb-8">
        <p className="text-lg font-medium mb-5">{currentQuestion.question}</p>
        <ul className="space-y-4">
          {currentQuestion.options.map((option, i) => (
            <li
              key={i}
              className={`cursor-pointer border rounded-lg p-3 ${
                answers[currentQuestion.id] === option
                  ? "bg-gray-900 border-gray-600"
                  : "hover:bg-gray-900"
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center gap-2">
        <Button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          variant="outline"
        >
          Previous
        </Button>

        {currentIndex < quiz.questions.length - 1 ? (
          <Button onClick={handleNext} disabled={!answers[currentQuestion.id]}>
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="flex items-center justify-center gap-1"
            disabled={!answers[currentQuestion.id] || isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        )}
      </div>
    </div>
  );
}
