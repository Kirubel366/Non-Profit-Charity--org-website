import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { enabledModules } from "@/config/moduleFlags";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminShell, visibleAdminTabs, type AdminTab } from "@/components/admin/AdminShell";
import { OverviewPanel, useAdminCounts } from "@/components/admin/OverviewPanel";
import { EventsManager } from "@/components/admin/EventsManager";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { VolunteerPipeline } from "@/components/admin/VolunteerPipeline";
import { DonationsDesk } from "@/components/admin/DonationsDesk";
import { InquiriesInbox } from "@/components/admin/InquiriesInbox";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import { LoadingRows } from "@/components/admin/primitives";
import { orgContent } from "@/data/orgContent";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: `OCMS Admin — ${orgContent.navbar.orgName}` },
      {
        name: "description",
        content: `Secure ${orgContent.navbar.orgName} staff console for events, gallery media, volunteers, donations and site settings.`,
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: `OCMS Admin — ${orgContent.navbar.orgName}` },
      {
        property: "og:description",
        content: `Staff console for managing ${orgContent.navbar.orgName} website content and submissions.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<AdminTab>("overview");

  useEffect(() => {
    const onAuth = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });

    return () => {
      try {
        // Supabase client may return different shapes depending on version/build.
        // Safely attempt to unsubscribe if available.
        const sub = (onAuth as any)?.data?.subscription ?? (onAuth as any)?.subscription ?? onAuth;
        if (sub?.unsubscribe) sub.unsubscribe();
        else if (typeof sub === "function") sub();
      } catch (e) {
        // swallow errors during cleanup
      }
    };
  }, []);

  const counts = useAdminCounts();

  if (!enabledModules.ocmsAdmin) {
    void navigate({ to: "/" });
    return null;
  }

  if (!ready) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <LoadingRows rows={3} />
      </main>
    );
  }

  if (!session) return <AdminLogin />;

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    setSession(null);
  };

  const activeTab = visibleAdminTabs.some((item) => item.id === tab) ? tab : "overview";

  return (
    <AdminShell
      active={activeTab}
      onSelect={setTab}
      counts={counts.data ?? {}}
      email={session.user.email ?? "Signed in"}
      onSignOut={() => void handleSignOut()}
    >
      {activeTab === "overview" ? (
        <OverviewPanel counts={counts.data ?? {}} onNavigate={setTab} />
      ) : null}
      {activeTab === "events" ? <EventsManager /> : null}
      {activeTab === "gallery" ? <GalleryManager /> : null}
      {activeTab === "volunteers" ? <VolunteerPipeline /> : null}
      {activeTab === "donations" ? <DonationsDesk /> : null}
      {activeTab === "inquiries" ? <InquiriesInbox /> : null}
      {activeTab === "settings" ? <SettingsPanel /> : null}
    </AdminShell>
  );
}
