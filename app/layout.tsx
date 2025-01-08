import type { Metadata } from "next";
import "./globals.css";
import { Separator } from "@/components/ui/separator";
import { Github, Twitter } from "lucide-react";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME || "6 Degrees Github Stats",
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "6 Degrees Github Stats Dashboard",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="bg-gray-100 text-gray-900 dark:bg-[#0c175c] dark:text-gray-50">
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    {children}

                    <footer className="text-gray-500 container mx-auto p-4 ">
                        <Separator className="my-4" />
                        <div className="grid lg:grid-cols-2">
                            <span>
                                Developed with ❤️ by{" "}
                                <Link className="underline" target="_blank" href="https://www.6degrees.com.sa">
                                    6 Degrees
                                </Link>
                            </span>
                            <span className="flex gap-4 justify-end">
                                <Link target="_blank" href="https://www.github.com/mo9a7i/github_stats">
                                    <Github />
                                </Link>
                                <Link target="_blank" href="https://x.com/6degrees_sa">
                                    <Twitter />
                                </Link>
                            </span>
                        </div>
                    </footer>
                </ThemeProvider>
            </body>
        </html>
    );
}
