"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Child } from "@/lib/types";
import { formatDateOnly } from "@/lib/utils";
import { Baby, Check, Home, Plus, Save, ShieldCheck, Users } from "lucide-react";

type Family = { id: string; name: string; created_by: string; created_at: string };

export function FamilySettings({ family, role, childRecords, userId }: { family: Family | null; role?: string; childRecords: Child[]; userId: string }) {
  const [name, setName] = useState(family?.name || "My family");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  async function save() {
    setSaving(true); setMessage("");
    const supabase = createClient();
    if (family) {
      const { error } = await supabase.from("families").update({ name: name.trim() }).eq("id", family.id);
      setMessage(error ? error.message : "Family name saved");
    } else {
      const { data, error } = await supabase.from("families").insert({ name: name.trim(), created_by: userId }).select("id").single();
      if (!error && data) {
        const result = await supabase.from("family_members").insert({ family_id: data.id, user_id: userId, role: "owner" });
        setMessage(result.error ? result.error.message : "Family space created");
      } else setMessage(error?.message || "Could not create family");
    }
    setSaving(false); router.refresh();
  }
  return (
    <div className="family-page">
      <div className="family-heading"><span className="workspace-kicker">FAMILY SPACE</span><h1>The people at the heart of it.</h1><p>Keep every childâ€™s story together in one private, shared home.</p></div>
      <div className="family-grid">
        <section className="family-card primary-card">
          <div className="family-icon"><Home /></div><div><span>FAMILY NAME</span><h2>{family?.name || "Create your family"}</h2><p>This name appears across your private workspace and reports.</p></div>
          <label><span>Workspace name</span><div><input value={name} onChange={(event) => setName(event.target.value)} maxLength={80}/><button onClick={save} disabled={saving || !name.trim()}><Save />{saving ? "Saving" : "Save"}</button></div></label>
          {message ? <p className="save-message"><Check /> {message}</p> : null}
        </section>
        <section className="family-card security-card"><div className="family-icon"><ShieldCheck /></div><div><span>YOUR ACCESS</span><h2>{role || "Owner"}</h2><p>Family data is protected with row-level permissions. Only authenticated family members can access child records.</p></div><div className="security-points"><span><Check/> Private photo storage</span><span><Check/> Member-scoped records</span><span><Check/> Secure sign-in sessions</span></div></section>
      </div>
      <section className="children-section"><header><div><span>CHILDREN</span><h2>Your growing family</h2></div><Link href="/dashboard/add-child" className="app-button primary"><Plus/> Add child</Link></header>
        <div className="children-grid">{childRecords.map((child,index) => <Link href={`/dashboard?child=${child.id}`} className="child-family-card" key={child.id}><div className={`child-avatar tone-${index%4}`}>{child.name[0]}</div><div><strong>{child.name}</strong><span>{formatDateOnly(child.birth_date,{month:"long",day:"numeric",year:"numeric"})}</span></div><Baby/></Link>)}{!childRecords.length ? <div className="no-children"><Users/><strong>Your family story starts here</strong><p>Add a child to begin tracking growth and milestones.</p></div> : null}</div>
      </section>
    </div>
  );
}
