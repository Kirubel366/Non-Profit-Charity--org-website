import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, KeyRound, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { LoadingRows, PanelHeader } from "./primitives";

type SettingsForm = {
  emergency_phone: string;
  secondary_phone: string;
  contact_email: string;
};

type AccountForm = {
  current_password: string;
  email: string;
  new_password: string;
  confirm_password: string;
};

const defaults: SettingsForm = {
  emergency_phone: "",
  secondary_phone: "",
  contact_email: "",
};

const defaultAccountForm: AccountForm = {
  current_password: "",
  email: "",
  new_password: "",
  confirm_password: "",
};

export function SettingsPanel() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SettingsForm>(defaults);
  const [accountForm, setAccountForm] = useState<AccountForm>(defaultAccountForm);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rowId, setRowId] = useState<string | null>(null);

  const settings = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const row = settings.data;
    if (!row) return;
    setRowId(row.id);
    setForm({
      emergency_phone: row.emergency_phone ?? "",
      secondary_phone: row.secondary_phone ?? "",
      contact_email: row.contact_email ?? "",
    });
  }, [settings.data]);

  useEffect(() => {
    const loadUserEmail = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user?.email) return;
      setAccountForm((current) => ({ ...current, email: user.email ?? current.email }));
    };

    void loadUserEmail();
  }, []);

  const save = useMutation({
    mutationFn: async (values: SettingsForm) => {
      const payload = {
        emergency_phone: values.emergency_phone || null,
        secondary_phone: values.secondary_phone || null,
        contact_email: values.contact_email || null,
      };
      if (rowId) {
        const { error } = await supabase.from("site_settings").update(payload).eq("id", rowId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_settings").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Site settings saved");
      void queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      void queryClient.invalidateQueries({ queryKey: ["site-profile"] });
    },
    onError: (error: Error) => toast.error("Save failed", { description: error.message }),
  });

  const updateAccount = useMutation({
    mutationFn: async () => {
      const trimmedEmail = accountForm.email.trim();
      const trimmedPassword = accountForm.new_password.trim();
      const currentPassword = accountForm.current_password.trim();

      if (!currentPassword) {
        throw new Error("Current password is required to verify your account");
      }

      if (!trimmedEmail) {
        throw new Error("A valid email address is required");
      }

      if (trimmedPassword && trimmedPassword !== accountForm.confirm_password.trim()) {
        throw new Error("New password confirmation does not match");
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user?.email) {
        throw new Error("No active admin session found");
      }

      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (verifyError) {
        throw new Error("Current password is incorrect");
      }

      const updatePayload: { email?: string; password?: string } = {};
      if (trimmedEmail.toLowerCase() !== user.email.toLowerCase()) {
        updatePayload.email = trimmedEmail;
      }
      if (trimmedPassword) {
        updatePayload.password = trimmedPassword;
      }

      if (Object.keys(updatePayload).length === 0) {
        throw new Error("No account changes were provided");
      }

      const { error: updateError } = await supabase.auth.updateUser(updatePayload);
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      toast.success("Account updated successfully");
      setAccountForm((current) => ({
        ...current,
        current_password: "",
        new_password: "",
        confirm_password: "",
      }));
    },
    onError: (error: Error) =>
      toast.error("Account update failed", { description: error.message }),
  });

  const update = (patch: Partial<SettingsForm>) =>
    setForm((current) => ({ ...current, ...patch }));

  const updateAccountForm = (patch: Partial<AccountForm>) =>
    setAccountForm((current) => ({ ...current, ...patch }));

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Profile and Account"
        description="Site details and credentials"
      />

      {settings.isLoading ? (
        <LoadingRows rows={2} />
      ) : (
        <div className="max-w-2xl space-y-6">
          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              save.mutate(form);
            }}
          >
            <fieldset className="space-y-4 rounded-card border border-border bg-card p-4">
              <legend className="px-1 text-sm font-semibold">Contact profile</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="emergency-phone">Emergency phone number</Label>
                  <Input
                    id="emergency-phone"
                    type="tel"
                    value={form.emergency_phone}
                    onChange={(event) => update({ emergency_phone: event.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="secondary-phone">Secondary phone number</Label>
                  <Input
                    id="secondary-phone"
                    type="tel"
                    value={form.secondary_phone}
                    onChange={(event) => update({ secondary_phone: event.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-email">Contact email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={form.contact_email}
                  onChange={(event) => update({ contact_email: event.target.value })}
                />
              </div>

              <Button type="submit" variant="secondary" disabled={save.isPending}>
                <Save className="mr-2 size-4" aria-hidden />
                {save.isPending ? "Updating profile…" : "Update profile"}
              </Button>
            </fieldset>
          </form>

          <div className="rounded-card border border-border bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-card bg-primary/10 text-primary">
                <KeyRound className="size-4" aria-hidden />
              </div>
              <div>
                <h3 className="text-base font-semibold">Update account</h3>
                <p className="text-sm text-muted-foreground">
                  Verify your current password before changing your email or password.
                </p>
              </div>
            </div>

            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                void updateAccount.mutateAsync();
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="current-password">Current password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={accountForm.current_password}
                    onChange={(event) => updateAccountForm({ current_password: event.target.value })}
                    placeholder="Enter your current password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                    onClick={() => setShowCurrentPassword((current) => !current)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="account-email">Email address</Label>
                <Input
                  id="account-email"
                  type="email"
                  autoComplete="email"
                  value={accountForm.email}
                  onChange={(event) => updateAccountForm({ email: event.target.value })}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="new-password">New password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={accountForm.new_password}
                      onChange={(event) => updateAccountForm({ new_password: event.target.value })}
                      placeholder="Optional"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                      onClick={() => setShowNewPassword((current) => !current)}
                      className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={accountForm.confirm_password}
                      onChange={(event) => updateAccountForm({ confirm_password: event.target.value })}
                      placeholder="Optional"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      onClick={() => setShowConfirmPassword((current) => !current)}
                      className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                    </button>
                  </div>
                </div>
              </div>

              <Button type="submit" variant="secondary" disabled={updateAccount.isPending}>
                {updateAccount.isPending ? "Updating account…" : "Update account"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPanel;
