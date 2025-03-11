"use client";
import LoaderLogo from "@/components/shared/LoaderLogo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";
// import { SignIn } from "@clerk/clerk-react";
import { ClerkProvider, SignedOut, SignInButton, useAuth } from "@clerk/nextjs";
import { Authenticated, AuthLoading, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import Image from "next/image";
import React, { useRef } from "react";
import { gsap } from "gsap";

type Props = {
  children: React.ReactNode;
  size?: number;
};

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const CLERK_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

const convex = new ConvexReactClient(CONVEX_URL);

const ConvexProviderCustom = ({ children, size = 100 }: Props) => {
  const banner = useRef<HTMLImageElement | null>(null);
  const speed = 0.09;
  let xForce = 0;
  let yForce = 0;
  let requestAnimationFrameId: number | null = null;
  const easing = 0.08;

  const animate = ({}) => {
    xForce = lerp(xForce, 0, easing);
    yForce = lerp(yForce, 0, easing);
    gsap.set(banner.current, {
      x: `+=${xForce * speed}`,
      y: `+=${yForce * speed}`,
    });

    if (Math.abs(xForce) < 0.01) xForce = 0;
    if (Math.abs(yForce) < 0.01) yForce = 0;

    if (xForce > 0 || yForce > 0) {
      requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestAnimationFrameId!);
      console.log("animation stopped");
      requestAnimationFrameId = null;
    }
  };

  const lerp = (start: number, end: number, amount: number) =>
    start * (1 - amount) + end * amount;

  const manageMouseMovement = (e: React.MouseEvent<HTMLElement>) => {
    const { movementX, movementY } = e;
    xForce += movementX * speed;
    yForce += movementY * speed;

    if (!requestAnimationFrameId) {
      requestAnimationFrameId = requestAnimationFrame(animate);
    }
  };
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <SignedOut>
          <div
            className="flex items-center justify-evenly h-full w-full"
            onMouseMove={(e) => manageMouseMovement(e)}
          >
            <div className="absolute" style={{ left: "16px", bottom: "16px" }}>
              <ThemeToggle />
            </div>
            <div className="flex" style={{ width: "800px", height: "900px" }}>
              <Image
                src="/banner.svg"
                alt="banner"
                width={600}
                height={600}
                ref={banner}
              />
            </div>
            <div className="flex flex-col items-center gap-4">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={size}
                height={size}
                className="animate-pulse duration-1000"
              />
              {/* <SignIn
              appearance={{
                variables: { colorPrimary: "#ea580c" },
                elements: { rootBox: "mx-auto" },
                }}
                /> */}
              <SignInButton>
                <Button
                  variant={"outline"}
                  style={{ borderColor: "#ea580c" }}
                  className="flex gap-4 px-4 py-4 text-sm font-bold rounded-md dark:hover:bg-background"
                >
                  <Image
                    src="/googleLogo.svg"
                    alt="GoogleLogo"
                    width={24}
                    height={24}
                  />
                  <div>Sign in with Google</div>
                </Button>
              </SignInButton>
            </div>
          </div>
        </SignedOut>
        <Authenticated>{children}</Authenticated>
        <AuthLoading>
          <LoaderLogo />
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};

export default ConvexProviderCustom;
