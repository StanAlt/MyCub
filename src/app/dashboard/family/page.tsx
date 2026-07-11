import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FamilySettings } from "@/components/dashboard/family-settings";

export default async function FamilyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: membership } = await supabase.from("family_members").select("family_id, role").eq("user_id", user.id).limit(1).maybeSingle();
  const [{ data: family }, { data: children }] = await Promise.all([
    membership ? supabase.from("families").select("*").eq("id", membership.family_id).maybeSingle() : Promise.resolve({ data: null }),
    supabase.from("children").select("*").order("created_at"),
  ]);
  return <FamilySettings family={family} role={membership?.role} childRecords={children || []} userId={user.id} />;
}
