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
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return (
    <div className="min-h-screen bg-warm-50">
      <DashboardNav
        user={profile || { id: user.id, email: user.email!, full_name: "", created_at: "" }}
        children={childrenData || []}
      />
      <main className="pt-16 pb-8 px-4">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
