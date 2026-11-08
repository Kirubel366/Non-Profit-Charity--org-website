import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Eye, EyeOff, KeyRound, Loader2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { ensureDemoAdmin } from "@/lib/admin.functions";
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD, DEMO_ADMIN_ENABLED } from "@/lib/adminConstants";
import { orgContent } from "@/data/orgContent";

export function AdminLogin() {
  const bootstrap = useServerFn(ensureDemoAdmin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (mail: string, pass: string) => {
    setBusy(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: mail,
      password: pass,
    });
    setBusy(false);
    if (authError) {
      setError(authError.message);
      return false;
    }
    toast.success("Welcome back", { description: "Signed in to the OCMS." });
    return true;
  };

  const handleDemo = async () => {
    setBusy(true);
    setError(null);
    const result = await bootstrap({});
    setBusy(false);
    if (!result.ok) {
      setError(result.reason ?? "Demo account could not be prepared.");
      return;
    }
    setEmail(DEMO_ADMIN_EMAIL);
    setPassword(DEMO_ADMIN_PASSWORD);
    await signIn(DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-card border border-border bg-card p-6 shadow-glass sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-card bg-brand-muted text-brand">
              <ShieldCheck className="size-5" aria-hidden />
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tight">{orgContent.admin.productName}</h1>
              <p className="text-xs text-muted-foreground">
                Organization content management
              </p>
            </div>
          </div>

          <form
            className="mt-7 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void signIn(email.trim(), password);
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="admin-email">Email address</Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={`you@${orgContent.admin.supportEmail.split("@")[1] ?? "yourorganization.org"}`}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                </button>
              </div>
            </div>

            {error ? (
              <p role="alert" className="text-sm font-medium text-destructive">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? (
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
              ) : (
                <Lock className="mr-2 size-4" aria-hidden />
              )}
              Sign in
            </Button>
          </form>

          {DEMO_ADMIN_ENABLED ? (
            <div className="mt-6 rounded-card border border-dashed border-border bg-muted/40 p-4">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <KeyRound className="size-3.5" aria-hidden /> Demo access
              </p>
              <dl className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="font-medium">{DEMO_ADMIN_EMAIL}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Password</dt>
                  <dd className="font-medium">{DEMO_ADMIN_PASSWORD}</dd>
                </div>
              </dl>
              <Button
                type="button"
                variant="outline"
                className="mt-3 w-full"
                onClick={() => void handleDemo()}
                disabled={busy}
              >
                Sign in with demo administrator
              </Button>
            </div>
          ) : null}
        </div>

      </div>
    </main>
  );
}

export default AdminLogin;
