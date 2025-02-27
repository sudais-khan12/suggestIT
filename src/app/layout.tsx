import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { DotPattern } from "@/components/ui/dot-pattern";
import "./globals.css";
import RouteLoader from "@/components/RouteLoader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`antialiased`}>
          <div className="relative min-h-screen">
            <RouteLoader />
            <DotPattern className="opacity-50" />{" "}
            <div className="relative z-10">
              {children}
              <Toaster />
            </div>
          </div>
        </body>
      </AuthProvider>
    </html>
  );
}
