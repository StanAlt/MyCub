import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard/nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: childrenData } = await supabase
    .from("children")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="app-shell">
      <DashboardNav
        user={profile || { id: user.id, email: user.email!, full_name: "", created_at: "" }}
        childRecords={childrenData || []}
      />
      <main className="app-main">
        <div className="app-content">{children}</div>
      </main>
    </div>
  );
}
