"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Loading from "./Loading";

const RouteLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [pathname, searchParams]);

  return isLoading ? <Loading /> : null;
};

export default RouteLoader;
