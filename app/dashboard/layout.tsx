
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
      <div className="min-h-screen flex-col w-full bg-[#F5F5F7]">
        <Navbar />
        <main className="w-full overflow-scroll min-h-full pb-24">
          {children}
        </main> 
      </div>
    </QueryClientProvider>
  );
}