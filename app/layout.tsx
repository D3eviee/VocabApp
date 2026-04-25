import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import '../app/globals.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VocabApp",
  description: "Learning made easily",
};

export default function RootLayout({children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-dvh flex flex-col overflow-hidden bg-[#F5F5F7]">
        <main className="h-full flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
