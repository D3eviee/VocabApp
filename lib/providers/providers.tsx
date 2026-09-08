"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WindowsProvider } from "@/components/dashboard/ui/WindowsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <WindowsProvider/>
      {children}
    </QueryClientProvider>
  );
}