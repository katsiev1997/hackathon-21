import { HomePage } from "@/pages/home-page";
import { Route, Router } from "wouter-preact";

export function App() {
  return (
    <Router>
      <Route path="/" component={HomePage} />
    </Router>
  );
}
