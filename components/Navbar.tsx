import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user";

async function Navbar() {
  const user = await currentUser();
  if (user) await syncUser();
  return (
    <nav className="w-full flex justify-between gap-2 items-center mx-auto pt-3 pb-2 px-12 border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <Link href={"/"}>
        <div className="text-2xl cursor-pointer gradient-title">
          AI Quiz Platform
        </div>
      </Link>
      <div>
        <SignedOut>
          <SignInButton>
            <Button variant="outline">Sign In</Button>
          </SignInButton>
          {/* <SignUpButton>
            <Button variant="outline">Sign Up</Button>
          </SignUpButton> */}
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}

export default Navbar;
