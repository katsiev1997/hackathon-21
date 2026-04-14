import { QueryClient, QueryClientProvider } from "@tanstack/preact-query";
import type { PropsWithChildren } from "preact/compat";
import { PreactQueryDevtools } from "@tanstack/preact-query-devtools";

// Create a client
const queryClient = new QueryClient();

export function PreactQueryProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <PreactQueryDevtools />
    </QueryClientProvider>
  );
}
