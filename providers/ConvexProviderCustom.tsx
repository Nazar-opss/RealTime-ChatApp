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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GoogleLogo = (props: any) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 775 794"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M775 405.797C775 373.248 772.362 349.496 766.653 324.865H395.408V471.773H613.32C608.929 508.282 585.204 563.264 532.482 600.209L531.743 605.127L649.124 696.166L657.256 696.979C731.943 627.921 775 526.315 775 405.797"
      fill="#4285F4"
    />
    <path
      d="M395.408 792.866C502.167 792.866 591.792 757.676 657.256 696.979L532.482 600.209C499.093 623.521 454.279 639.796 395.408 639.796C290.845 639.796 202.099 570.741 170.463 475.294L165.826 475.688L43.772 570.256L42.1759 574.698C107.198 704.013 240.758 792.866 395.408 792.866Z"
      fill="#34A853"
    />
    <path
      d="M170.463 475.294C162.116 450.662 157.285 424.269 157.285 397C157.285 369.728 162.116 343.338 170.024 318.706L169.803 313.46L46.2193 217.373L42.1759 219.299C15.3772 272.961 0 333.222 0 397C0 460.778 15.3772 521.036 42.1759 574.698L170.463 475.294"
      fill="#FBBC05"
    />
    <path
      d="M395.408 154.201C469.656 154.201 519.74 186.31 548.298 213.143L659.891 104.059C591.356 40.2812 502.167 1.13428 395.408 1.13428C240.758 1.13428 107.198 89.9835 42.1759 219.299L170.024 318.706C202.099 223.259 290.845 154.201 395.408 154.201"
      fill="#EB4335"
    />
  </svg>
);

const ConvexProviderCustom = ({ children, size = 100 }: Props) => {
  const banner = useRef(null);
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

  const manageMouseMovement = (e: MouseEvent) => {
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
            {/* <Image
            src="/login_banner.svg"
            alt="login banner"
            width={size}
            height={size}
            className="bg-primary"
          /> */}

            <div className="flex items-center justify-evenly h-full w-full">
              <Image
                src="/banner.svg"
                alt="banner"
                width={800}
                height={800}
                className=""
                ref={banner}
              />
              <div className="flex flex-col items-center justify-center gap-4">
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
                  <Button className="flex gap-4 px-4 py-4 text-sm font-bold rounded-md dark:hover:bg-background">
                    <GoogleLogo />
                    <div>Sign in with Google</div>
                  </Button>
                </SignInButton>
              </div>
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
