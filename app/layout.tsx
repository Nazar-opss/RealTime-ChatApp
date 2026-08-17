import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ConvexProviderCustom from "@/providers/ConvexProviderCustom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "RealTime - Your best chat app",
  description: "Welcome to RealTime ChatApp! Connect with people instantly. Chat in real-time, manage your friends list, create group conversations, and enjoy a seamless messaging experience with a sleek dark mode interface. Secure, fast, and built for you. Sign in with your Google account and start chatting right now!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexProviderCustom>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster richColors/>
          </ConvexProviderCustom>
        </ThemeProvider>
      </body>
    </html>
  );
}
