import { PreactQueryProvider } from "./providers/preact-query-provider";
import { RouterProvider } from "./providers/router-provider";
import { TooltipProvider } from "@/shared/components/ui/tooltip";

export function App() {
  return (
    <TooltipProvider delayDuration={200}>
      <PreactQueryProvider>
        <RouterProvider />
      </PreactQueryProvider>
    </TooltipProvider>
  );
}
