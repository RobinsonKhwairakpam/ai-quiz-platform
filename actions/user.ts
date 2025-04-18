"use server"

import db from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
    try {
      const { userId } = await auth();
      const user = await currentUser();
  
      if (!userId || !user) return;
  
      const existingUser = await db.user.findUnique({
        where: {
          clerkId: userId,
        },
      });
  
      if (existingUser) return existingUser;
  
      const dbUser = await db.user.create({
        data: {
          clerkId: userId,
          email: user.emailAddresses[0].emailAddress,
        },
      });
  
      return dbUser;
    } catch (error) {
      console.log("Error in syncUser", error);
    }
  }