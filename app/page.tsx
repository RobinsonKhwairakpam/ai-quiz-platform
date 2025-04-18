import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full">
      <Card className="w-[90%] mx-auto sm:w-[350px] max-w-[350px]">
        <CardHeader>
          <CardTitle className="text-xl text-center">Welcome to Career Coach 🔥!</CardTitle>
          <CardDescription className="mt-2 text-center text-[1.05rem]">
            Career Coach is a platform for creating quizzes and questionnaires
            using AI! Get started by logging in below!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButton>
            <Button className="w-full" variant="outline">Sign In</Button>
          </SignInButton>
        </CardContent>
      </Card>
    </div>
  );
}
