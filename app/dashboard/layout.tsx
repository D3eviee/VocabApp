
'use client'
import Navbar from "@/components/dashboard/ui/navbar/Navbar";
import '../globals.css';
import { ModalProvider } from "@/components/modals/ModalProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from "react";

export default function RootLayout({children }: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient({}))

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <ModalProvider/>
      <main className="h-[calc(100vh-57px)] overflow-hidden">
        {children}
      </main>
    </QueryClientProvider>
  );
}