"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LogInIcon, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DotPattern } from "@/components/ui/dot-pattern";
import Link from "next/link";
import { useSession } from "next-auth/react"; // Import useSession

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["amazing", "new", "wonderful", "beautiful", "smart"],
    []
  );

  const { data: session } = useSession(); // Check if user is signed in

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dot Pattern Background */}
      <DotPattern className="absolute inset-0 z-0" />

      {/* Circular Blur Effect */}
      <div className="absolute inset-0 z-5 flex justify-center items-center">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(255,255,255,0.7)_70%)] backdrop-blur-sm dark:bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(0,0,0,0.7)_70%)]"
          style={{
            mask: "radial-gradient(circle at center, transparent 30%, black 70%)",
            WebkitMask:
              "radial-gradient(circle at center, transparent 30%, black 70%)",
          }}
        ></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <Button variant="secondary" size="sm" className="gap-4">
              Read About Us <MoveRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-spektr-cyan-50">This is something</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              Managing a small business today is already tough. Avoid further
              complications by ditching outdated, tedious trade methods. Our
              goal is to streamline SMB trade, making it easier and faster than
              ever.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            {session ? (
              // If user is signed in, show Dashboard button
              <Link href="/dashboard" passHref>
                <Button asChild size="lg" className="gap-4">
                  <span>
                    Go to Dashboard <MoveRight className="w-4 h-4" />
                  </span>
                </Button>
              </Link>
            ) : (
              // If user is not signed in, show Sign In and Sign Up buttons
              <>
                <Link href="/signIn" passHref>
                  <Button asChild size="lg" className="gap-4" variant="outline">
                    <span>
                      Sign In <LogInIcon className="w-4 h-4" />
                    </span>
                  </Button>
                </Link>
                <Link href="/signUp" passHref>
                  <Button asChild size="lg" className="gap-4">
                    <span>
                      Sign up here <MoveRight className="w-4 h-4" />
                    </span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };