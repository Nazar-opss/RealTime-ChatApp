'use client'
import { UserButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
export default function Home() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  console.log(isLoading, isAuthenticated)
  return (
    <UserButton />
  );
}
