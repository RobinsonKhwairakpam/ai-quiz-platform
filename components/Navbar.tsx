import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
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
    <nav className="container flex justify-between gap-2 items-center mx-auto p-3">
      <Link href={"/"}>
        <div className="text-2xl cursor-pointer gradient-title">
          Career Coach
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
