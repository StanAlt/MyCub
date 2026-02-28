"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import type { UserProfile, Child } from "@/lib/types";
import {
  Baby,
  LayoutDashboard,
  TrendingUp,
  Brain,
  ImageIcon,
  Sparkles,
  LogOut,
  Plus,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

interface NavProps {
  user: UserProfile;
  children: Child[];
}

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/growth", label: "Growth", icon: TrendingUp },
  { href: "/dashboard/milestones", label: "Milestones", icon: Brain },
  { href: "/dashboard/photos", label: "Photos", icon: ImageIcon },
  { href: "/dashboard/insights", label: "AI Insights", icon: Sparkles },
];

export function DashboardNav({ user, children }: NavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [showMenu, setShowMenu] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-warm-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
            <Baby className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-warm-900 hidden sm:block">
            MyCub
          </span>
        </Link>

        {/* Nav links - desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "soft" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 hover:bg-warm-100 rounded-2xl px-2 py-1.5 transition-colors"
          >
            <Avatar className="w-8 h-8">
              {user.avatar_url && <AvatarImage src={user.avatar_url} />}
              <AvatarFallback>
                {getInitials(user.full_name || user.email)}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="w-3 h-3 text-warm-500" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-soft border border-warm-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-warm-100">
                  <p className="font-medium text-sm text-warm-900 truncate">
                    {user.full_name || "Parent"}
                  </p>
                  <p className="text-xs text-warm-500 truncate">{user.email}</p>
                </div>

                {/* Children list */}
                {children.length > 0 && (
                  <div className="px-2 py-2 border-b border-warm-100">
                    <p className="text-xs text-warm-400 font-medium px-2 mb-1">
                      Your cubs
                    </p>
                    {children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/dashboard?child=${child.id}`}
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-warm-50 transition-colors"
                      >
                        <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-600">
                          {child.name[0]}
                        </div>
                        <span className="text-sm text-warm-700">
                          {child.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                <div className="px-2 py-1">
                  <Link
                    href="/dashboard/add-child"
                    onClick={() => setShowMenu(false)}
                  >
                    <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-warm-50 transition-colors text-sm text-sage-600">
                      <Plus className="w-4 h-4" />
                      Add a child
                    </button>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-red-50 transition-colors text-sm text-red-500"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "soft" : "ghost"}
                size="sm"
                className="gap-1.5 text-xs whitespace-nowrap"
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
