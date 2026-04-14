import { render } from "preact";
import "@/app/index.css";
import { App } from "@/app/app";
import { TooltipProvider } from "@/shared/components/ui/tooltip";

render(
  <TooltipProvider delayDuration={200}>
    <App />
  </TooltipProvider>,
  document.getElementById("app")!,
);
