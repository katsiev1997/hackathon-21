import { useState } from "preact/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Code2,
  Lightbulb,
  Lock,
  Mail,
  Rocket,
  Users,
  X,
  Eye,
  EyeOff,
  CircleHelp,
} from "lucide-react";
import { cn } from "@/lib/utils";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

type AuthTab = "login" | "signup";

export function App() {
  const [tab, setTab] = useState<AuthTab>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
    <div className="flex min-h-svh flex-col bg-background md:flex-row">
      {/* Marketing panel */}
      <aside
        className={cn(
          "relative hidden flex-1 flex-col justify-between overflow-hidden p-8 text-primary-foreground md:flex lg:p-12",
          "bg-linear-to-br from-violet-950 via-violet-700 to-indigo-500"
        )}
      >
        <div className="relative z-10 flex flex-col gap-8">
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
              <Code2 className="size-5" strokeWidth={2.25} />
            </span>
            <span className="text-lg font-semibold tracking-tight">HackForge</span>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            Registration Open for Winter Hackathon
          </div>

          <div className="space-y-3">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance lg:text-4xl">
              Build the future. Together.
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-white/85">
              The ultimate platform for hackathon participants. Find your dream team, pitch ideas, and
              ship incredible products.
            </p>
          </div>

          <ul className="flex flex-col gap-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                <Users className="size-4" />
              </span>
              <span className="pt-1 text-white/95">Smart team formation &amp; matching</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                <Lightbulb className="size-4" />
              </span>
              <span className="pt-1 text-white/95">Idea pitching &amp; community voting</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                <Rocket className="size-4" />
              </span>
              <span className="pt-1 text-white/95">Project tracking &amp; mentor access</span>
            </li>
          </ul>
        </div>

        <div className="relative z-10 mt-10 rounded-xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["bg-violet-300", "bg-fuchsia-300", "bg-cyan-300"].map((bg, i) => (
                <span
                  key={i}
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-full ring-2 ring-violet-950/80",
                    bg
                  )}
                  aria-hidden
                />
              ))}
            </div>
            <p className="text-sm font-medium text-white/95">10,000+ Builders joined</p>
          </div>
        </div>

        <div
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 size-72 rounded-full bg-indigo-400/20 blur-3xl"
          aria-hidden
        />
      </aside>

      {/* Form panel */}
      <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-10 md:px-8 lg:px-12">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground md:right-5 md:top-5"
          aria-label="Закрыть"
        >
          <X className="size-4" />
        </Button>

        <Card className="w-full max-w-md border-0 bg-card py-6 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
          <CardHeader className="items-center space-y-1 px-6 text-center">
            <CardTitle className="text-xl font-semibold tracking-tight">Welcome back</CardTitle>
            <CardDescription>Enter your details to access your dashboard.</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 px-6">
            <div
              className="flex rounded-lg bg-muted/80 p-1 ring-1 ring-border/60"
              role="tablist"
              aria-label="Режим входа"
            >
              <button
                type="button"
                role="tab"
                aria-selected={tab === "login"}
                className={cn(
                  "flex-1 rounded-md py-2 text-sm font-medium transition-all",
                  tab === "login"
                    ? "bg-card text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setTab("login")}
              >
                Log In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "signup"}
                className={cn(
                  "flex-1 rounded-md py-2 text-sm font-medium transition-all",
                  tab === "signup"
                    ? "bg-card text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setTab("signup")}
              >
                Sign Up
              </button>
            </div>

            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    className="h-10 pl-9"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-xs font-medium text-primary hover:underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={tab === "login" ? "current-password" : "new-password"}
                    placeholder="••••••••"
                    className="h-10 pl-9 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember((e.target as HTMLInputElement).checked)}
                  className="size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                />
                <Label htmlFor="remember" className="cursor-pointer font-normal text-muted-foreground">
                  Remember me for 30 days
                </Label>
              </div>

              <Button type="submit" size="lg" className="h-10 w-full font-medium">
                {tab === "login" ? "Sign in" : "Create account"}
              </Button>
            </form>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
                <span className="bg-card px-3">Or continue with</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <Button type="button" variant="outline" size="lg" className="h-10 w-full gap-2 font-normal">
                <GitHubIcon className="size-4" />
                Sign in with GitHub
              </Button>
              <Button type="button" variant="outline" size="lg" className="h-10 w-full gap-2 font-normal">
                <GoogleIcon className="size-4" />
                Sign in with Google
              </Button>
            </div>

            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              By signing in, you agree to our{" "}
              <a href="#" className="font-medium text-foreground underline-offset-4 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium text-foreground underline-offset-4 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </CardContent>
        </Card>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute bottom-4 right-4 rounded-full border-border text-muted-foreground shadow-sm md:bottom-6 md:right-6"
          aria-label="Помощь"
        >
          <CircleHelp className="size-4" />
        </Button>
      </main>
    </div>
  );
}
