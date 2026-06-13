"use client";

import { Loader2, LogIn, PencilRuler, Sprout } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { TeacherDashboard } from "@/components/dashboard/teacher-dashboard";
import { HostDashboard } from "@/components/dashboard/host-dashboard";

export default function DashboardPage() {
  const { enabled, loading, user, profile, signIn, setRoles } = useAuth();

  if (!enabled) {
    return <Shell>Accounts aren&apos;t configured in this environment.</Shell>;
  }
  if (loading) {
    return (
      <Shell>
        <Loader2 className="h-6 w-6 animate-spin text-moss" />
      </Shell>
    );
  }
  if (!user) {
    return (
      <Shell>
        <h1 className="font-display text-3xl font-semibold text-bark">
          Your dashboard
        </h1>
        <p className="mt-3 max-w-md text-bark-soft">
          Sign in to find host sites for your craft, manage your residencies,
          and steward your land.
        </p>
        <button
          type="button"
          onClick={() => void signIn()}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-paper shadow-soft transition-colors hover:bg-moss-deep"
        >
          <LogIn className="h-4 w-4" />
          Sign in with Google
        </button>
      </Shell>
    );
  }

  const roles = profile?.roles ?? [];
  const isTeacher = roles.includes("teacher");
  const isHost = roles.includes("host");
  const firstName = (profile?.displayName || user.displayName || "").split(
    " ",
  )[0];

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <header>
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-clay">
          Your dashboard
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-bark">
          {firstName ? `Hello, ${firstName}.` : "Hello."}
        </h1>
      </header>

      {!isTeacher && !isHost && (
        <div className="mt-8 rounded-2xl border border-stone-soft bg-paper p-8 text-center shadow-soft">
          <p className="font-display text-lg font-semibold text-bark">
            Add a role to unlock your dashboard
          </p>
          <p className="mt-2 text-sm text-bark-soft">
            Teach a craft, or open your land to residencies, you can do both.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => void setRoles([...roles, "teacher"])}
              className="inline-flex items-center gap-2 rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-paper hover:bg-moss-deep"
            >
              <PencilRuler className="h-4 w-4" /> I&apos;m a teacher
            </button>
            <button
              type="button"
              onClick={() => void setRoles([...roles, "host"])}
              className="inline-flex items-center gap-2 rounded-full border border-moss/30 px-5 py-2.5 text-sm font-semibold text-moss-deep hover:bg-fern/10"
            >
              <Sprout className="h-4 w-4" /> I steward land
            </button>
          </div>
        </div>
      )}

      {isTeacher && (
        <TeacherDashboard
          uid={user.uid}
          teacherName={profile?.displayName || user.displayName || ""}
        />
      )}
      {isHost && <HostDashboard />}
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-5xl flex-col items-start justify-center px-5 py-12 sm:px-8">
      {children}
    </div>
  );
}
