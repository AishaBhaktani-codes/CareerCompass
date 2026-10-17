import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/app/client-layout";

export const metadata: Metadata = {
  title: "CareerCompass — Adaptive Student Strength Analysis and Career Pathway Intelligence Platform",
  description: "AI-Powered Adaptive Learning & Career Pathway Intelligence platform analyzing academic performance, subject-wise weaknesses, competitive mock cutoffs, and practical artifacts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body text-on-surface min-h-screen bg-slate-950 text-slate-100" suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
