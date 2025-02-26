import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { DotPattern } from "@/components/ui/dot-pattern"; // Adjust the import path as needed
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`antialiased`}>
          {/* Add the DotPattern component here */}
          <div className="relative min-h-screen">
            <DotPattern className="opacity-50" />{" "}
            {/* Adjust opacity or other styles as needed */}
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
