import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import QuizForm from "./_components/QuizForm";

const QuizPage = async () => {
  const { userId } =  await auth();

  if (!userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-[85vh] flex justify-center items-center">
      <QuizForm />
    </div>
  );
};

export default QuizPage;
