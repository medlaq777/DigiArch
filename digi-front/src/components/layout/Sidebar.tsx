"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Copy, LayoutDashboard, Users } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@digiarch.com'; // Adjust logic based on real role

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Upload", href: "/dashboard/upload", icon: Copy },
    // { name: "Search", href: "/dashboard/search", icon: Search }, // Search is on dashboard or separate? Task says "Search & Dashboard"
    { name: "Users", href: "/admin/users", icon: Users, adminOnly: true },
  ];

  return (
    <div className="pb-12 min-h-screen w-64 border-r bg-sidebar">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            DigiArch
          </h2>
          <div className="space-y-1">
            {links.map((link) => {
              if (link.adminOnly && !isAdmin) return null;
              const Icon = link.icon;
              return (
                <Button
                  key={link.href}
                  variant={pathname === link.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={link.href}>
                    <Icon className="mr-2 h-4 w-4" />
                    {link.name}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
