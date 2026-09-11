"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * ============================================================================
 * TANSTACK REACT QUERY PROVIDER
 * ============================================================================
 * Provides server state caching, background re-fetching, and cache invalidation
 * to all client components in KeepBirr.
 */
export default function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 2, // Data is fresh for 2 minutes
            gcTime: 1000 * 60 * 10, // Unused cache kept for 10 minutes
            retry: 1, // Retry failed queries once before throwing error
            refetchOnWindowFocus: false, // Don't refetch every time user tabs back
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
