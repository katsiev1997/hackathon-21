import {
  ForgotPasswordPage,
  RecoveryPasswordPage,
} from "@/pages/auth-page";
import { HomePage } from "@/pages/home-page";
import { Route, Router } from "wouter-preact";

export function App() {
  return (
    <Router>
      <Route path="/" component={HomePage} />
      <Route path="/auth/forgot-password" component={ForgotPasswordPage} />
      <Route path="/auth/recovery-password" component={RecoveryPasswordPage} />
    </Router>
  );
}
