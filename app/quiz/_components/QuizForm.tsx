"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateQuiz, saveQuiz } from "@/actions/quiz";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const QuizForm = () => {
  const router = useRouter();
  const [topicTitle, setTopicTitle] = useState("");
  const [numQuestions, setNumQuestions] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle || !numQuestions) return;
    setLoading(true);
    // Add your submit logic here
    const questions = await generateQuiz(topicTitle, Number(numQuestions));
    const quiz = await saveQuiz(questions);
    setLoading(false);
    if (quiz.id) {
      router.push(`/quiz/${quiz.id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-[30rem] w-full mx-auto ">
      <Card className="px-3 py-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Create a Quiz</CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label htmlFor="topic">Enter a topic</Label>
            <Input
              id="topic"
              placeholder="e.g. JavaScript Basics"
              value={topicTitle}
              onChange={(e) => setTopicTitle(e.target.value)}
            />
          </div>

          <div className="space-y-3 mt-8">
            <Label htmlFor="questions">Number of Questions</Label>
            <Select onValueChange={setNumQuestions}>
              <SelectTrigger className="w-full" id="questions">
                <SelectValue placeholder="Select number" />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 15, 20].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full mt-7 flex items-center justify-center gap-1"
            disabled={!topicTitle || !numQuestions || loading}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? "Generating..." : "Create Quiz"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default QuizForm;
