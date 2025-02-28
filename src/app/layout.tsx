import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { DotPattern } from "@/components/ui/dot-pattern";
import "./globals.css";
import RouteLoader from "@/components/RouteLoader";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="relative min-h-screen">
              <RouteLoader />
              <DotPattern className="opacity-50 dark:opacity-30" />{" "}
              <div className="relative z-10">
                <div className="fixed bottom-4 left-4 z-50">
                  <ThemeToggle />
                </div>

                {children}
                <Toaster />
              </div>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
