import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Suspense } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import {Providers} from "./components/providers";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";


export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Currently Spending",
  description: "Quick and easy way to track your spending",
  manifest: '/manifest.ts'
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <Providers>
          <main className="min-h-screen flex flex-col items-center flex-1">
            <div className="flex-1 w-full flex flex-col sm-gap-20 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <SidebarTrigger />
                    <div >Spending</div>
                  </div>
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </div>
              </nav>
              <div className="flex flex-col w-full md:w-[640px] p-5 items-center">
                <Suspense>
                  {children}
                </Suspense>
                <Analytics />
              </div>
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
