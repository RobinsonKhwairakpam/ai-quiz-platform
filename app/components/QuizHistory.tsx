"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, RotateCcw, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Question {
  id: string;
  quizId: string;
  question: string;
  answer: string | null;
  options: string[];
  correct: string | null;
  explanation: string | null;
}

interface Quiz {
  id: string;
  userId: string;
  type: "QUIZ" | "QUESTIONNAIRE";
  duration: Date | null;
  score: number | null;
  improvementTip: string | null;
  questions: Question[];
}

function PerformanceChart({ quizzes }: { quizzes: Quiz[] }) {
  const [chartData, setChartData] = useState<
    Array<{ date: number; score: number }>
  >([]);

  useEffect(() => {
    if (quizzes?.length) {
      const formattedData = quizzes
        .filter(
          (quiz) =>
            quiz.type === "QUIZ" &&
            quiz.score !== null &&
            quiz.duration &&
            quiz.questions.length > 0
        )
        .sort(
          (a, b) =>
            new Date(a.duration!).getTime() - new Date(b.duration!).getTime()
        )
        .map((quiz) => ({
          date: new Date(quiz.duration!).getTime(),
          score: (quiz.score! / quiz.questions.length) * 100,
        }));

      setChartData(formattedData);
    }
  }, [quizzes]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl md:text-4xl gradient-title">
          Performance Trend
        </CardTitle>
        <CardDescription>Your quiz scores over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                type="number"
                domain={["auto", "auto"]}
                tickFormatter={(tick) => format(new Date(tick), "MMM dd")}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-md">
                        <p className="text-sm font-medium">
                          Score: {Math.round(payload[0].value as number)}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(payload[0].payload.date), "MMM dd")}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default function QuizHistory({ quizzes }: { quizzes: Quiz[] }) {
  const router = useRouter();

  const retakeQuiz = (quizId: string) => {
    router.push(`/quiz/${quizId}`);
  };

  const reviewQuiz = (quizId: string) => {
    router.push(`/quiz/${quizId}/review`);
  };

  const deleteQuiz = async (quizId: string) => {
    try {
      const response = await fetch(`/api/quiz/${quizId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete quiz');
      }

      toast.success('Quiz deleted successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete quiz');
      console.error('Error deleting quiz:', error);
    }
  };

  return (
    <div className="space-y-8">
      <PerformanceChart quizzes={quizzes} />

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl gradient-title">Quiz History</CardTitle>
          <CardDescription>Review and retake your past quizzes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quizzes
              .filter(quiz => quiz.type === "QUIZ")
              .map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-center flex-wrap gap-2 justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">
                      Score: {quiz.score !== null ? `${quiz.score}/${quiz.questions.length}` : 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {quiz.duration ? format(new Date(quiz.duration), "PPp") : 'Date unknown'}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => reviewQuiz(quiz.id)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Eye size={16} />
                      Review
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => retakeQuiz(quiz.id)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw size={16} />
                      Retake
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 text-red-600 hover:text-destructive cursor-pointer"
                        >
                          <Trash2 size={16} />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this quiz? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteQuiz(quiz.id)}
                            className="bg-destructive hover:bg-destructive/90 text-gray-300"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            {quizzes.filter(quiz => quiz.type === "QUIZ").length === 0 && (
              <p className="text-center text-muted-foreground">
                No quiz attempts yet. Start by creating a new quiz!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 