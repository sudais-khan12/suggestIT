"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Loading from "./Loading";

const RouteLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoading(true); // Show loader when route changes

    const timeoutId = setTimeout(() => {
      setIsLoading(false); // Hide loader after a short delay
    }, 500); // Adjust the delay as needed

    return () => clearTimeout(timeoutId); // Cleanup timeout
  }, [pathname, searchParams]);

  return isLoading ? <Loading /> : null;
};

export default RouteLoader;
