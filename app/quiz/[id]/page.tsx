import { getQuiz } from "@/actions/quiz";
import QuizPlayer from "../_components/QuizPlayer";

type PlayQuizParams = {
  params: {
    id: string;
  };
};

const PlayQuiz = async ({ params }: PlayQuizParams) => {
  const quizId = params.id;
  const quiz = await getQuiz(quizId);

  if (!quiz) return <div>Quiz not found</div>;

  return (
    <div className="min-h-[80vh] flex justify-center items-center">
      <QuizPlayer quiz={quiz} />
    </div>
  );
};

export default PlayQuiz;
