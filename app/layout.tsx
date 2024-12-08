import type { Metadata } from "next";
import "./globals.css";
import { Separator } from "@/components/ui/separator";
import { Github, Twitter } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "6 Degrees Github Stats",
    description: "6 Degrees Github Stats is a simple web app to show the stats of 6 Degrees Github organization and their repositories.",  
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-gray-50">
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
            </body>
        </html>
    );
}
