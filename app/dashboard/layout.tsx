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
      <ModalProvider/>
      <div className="h-dvh flex flex-col w-full bg-[#F5F5F7] overflow-hidden">
        <Navbar />
        <main className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
          {children}
        </main> 
      </div>
    </QueryClientProvider>
  );
}
