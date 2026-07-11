"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UserProfile, Child } from "@/lib/types";
import {
  Baby, BarChart3, BookHeart, ChevronDown, FileText, Home, LogOut,
  Menu, Plus, Ruler, Settings2, Sparkles, X,
} from "lucide-react";

interface NavProps { user: UserProfile; childRecords: Child[] }
const links = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/growth", label: "Growth", icon: BarChart3 },
  { href: "/dashboard/milestones", label: "Milestones", icon: Sparkles },
  { href: "/dashboard/photos", label: "Memories", icon: BookHeart },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/family", label: "Family", icon: Settings2 },
];

export function DashboardNav({ user, childRecords }: NavProps) {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [profile, setProfile] = useState(false);
  const childId = params.get("child") || childRecords[0]?.id;
  const withChild = (href: string) => childId && !href.endsWith("/family") ? `${href}?child=${childId}` : href;
  async function signOut() {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }
  return (
    <>
      <aside className={`app-sidebar ${menu ? "is-open" : ""}`}>
        <div className="sidebar-head">
          <Link href="/dashboard" className="brand"><span><Baby /></span>mycub</Link>
          <button className="sidebar-close" onClick={() => setMenu(false)} aria-label="Close navigation"><X /></button>
        </div>
        <div className="child-context">
          <small>TRACKING</small>
          {childRecords.length ? (
            <div className="child-select-wrap">
              <Ruler />
              <select value={childId} onChange={(event) => router.push(`/dashboard?child=${event.target.value}`)} aria-label="Selected child">
                {childRecords.map((child) => <option value={child.id} key={child.id}>{child.name}</option>)}
              </select>
              <ChevronDown />
            </div>
          ) : <p>No child added yet</p>}
        </div>
        <nav className="side-links" aria-label="Family workspace">
          <small>YOUR SPACE</small>
          {links.map((link) => {
            const active = link.href === "/dashboard" ? pathname === link.href : pathname.startsWith(link.href);
            return <Link className={active ? "active" : ""} href={withChild(link.href)} key={link.href} onClick={() => setMenu(false)}><link.icon />{link.label}</Link>;
          })}
        </nav>
        <Link href="/dashboard/add-child" className="add-child-link"><Plus /> Add another child</Link>
        <div className="sidebar-note"><Sparkles /><div><strong>Small moments matter.</strong><span>Log what changed today.</span></div></div>
      </aside>

      {menu ? <button className="sidebar-scrim" onClick={() => setMenu(false)} aria-label="Close navigation overlay" /> : null}
      <header className="app-topbar">
        <button className="mobile-menu" onClick={() => setMenu(true)} aria-label="Open navigation"><Menu /></button>
        <div><small>MYCUB FAMILY SPACE</small><strong>{childRecords.length ? `${childRecords.length} ${childRecords.length === 1 ? "child" : "children"} growing` : "Let’s begin"}</strong></div>
        <div className="profile-wrap">
          <button className="profile-button" onClick={() => setProfile(!profile)} aria-expanded={profile}>
            <span>{(user.full_name || user.email).slice(0, 1).toUpperCase()}</span>
            <div><strong>{user.full_name || "Parent"}</strong><small>Family account</small></div><ChevronDown />
          </button>
          {profile ? <div className="profile-menu"><p>{user.email}</p><button onClick={signOut}><LogOut /> Sign out</button></div> : null}
        </div>
      </header>
    </>
  );
}
