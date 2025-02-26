"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            Suggest IT
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {session ? (
              <>
                {/* Welcome Message */}
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Welcome, {user.userName || user.email}
                </span>

                {/* Logout Button */}
                <Button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  variant="outline"
                  className="text-sm font-medium"
                >
                  Logout
                </Button>
              </>
            ) : (
              // Sign In Button
              <Link href="/signIn">
                <Button variant="default" className="text-sm font-medium">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
