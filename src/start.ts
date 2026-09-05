import { createStart, createCsrfMiddleware } from "@tanstack/react-start";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

/**
 * Global TanStack Start configuration.
 *
 * `attachSupabaseAuth` (see integrations/supabase/auth-attacher.ts) reads the
 * current Supabase session on the client and forwards its access token as a
 * Bearer header on every server function call. Without registering it here,
 * `requireSupabaseAuth` (auth-middleware.ts) never sees a token and every
 * authenticated server function call fails — this file is what wires the two
 * together.
 */
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [csrfMiddleware],
}));
