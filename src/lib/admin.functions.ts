import { createServerFn } from "@tanstack/react-start";
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD, DEMO_ADMIN_ENABLED } from "./adminConstants";
import { orgContent } from "@/data/orgContent";

/**
 * Bootstraps (or repairs) the demo OCMS administrator account so the panel
 * can be opened on a fresh environment. Only runs when VITE_DEMO_ADMIN_EMAIL
 * / VITE_DEMO_ADMIN_PASSWORD are set — see adminConstants.ts for why this is
 * opt-in rather than a fixed default.
 */
export const ensureDemoAdmin = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ ok: boolean; reason?: string }> => {
    if (!DEMO_ADMIN_ENABLED) {
      return { ok: false, reason: "Demo admin bootstrap is disabled (no credentials configured)." };
    }
    try {
      const { supabaseAdmin } = await import(
        "@/integrations/supabase/client.server"
      );

      const { data: list } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 200,
      });
      let user = list?.users.find((entry) => entry.email === DEMO_ADMIN_EMAIL);

      if (!user) {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: DEMO_ADMIN_EMAIL,
          password: DEMO_ADMIN_PASSWORD,
          email_confirm: true,
          user_metadata: { full_name: orgContent.admin.demoAdminDisplayName },
        });
        if (error || !data.user) {
          return { ok: false, reason: error?.message ?? "Could not create admin." };
        }
        user = data.user;
      }

      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .upsert(
          { user_id: user.id, role: "admin" as const },
          { onConflict: "user_id,role" },
        );
      if (roleError) return { ok: false, reason: roleError.message };

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        reason: error instanceof Error ? error.message : "Bootstrap failed.",
      };
    }
  },
);
