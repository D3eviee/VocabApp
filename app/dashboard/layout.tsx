import Navbar from "@/components/dashboard/ui/navbar/Navbar";
import '../globals.css';
import { getCurrentUser } from "@/lib/auth";
import { Providers } from "@/lib/providers/providers";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  return (
    <Providers>
      <div className="h-dvh flex flex-col w-full bg-[#F5F5F7] overflow-hidden">
        <Navbar user={user} />
            
        <main className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">{children}</main> 
      </div>
    </Providers>
  );
}