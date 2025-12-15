"use client";

import { usePathname } from "next/navigation";
import { Users, Home, Calendar, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function AdminNav() {
  const pathname = usePathname();
  const basePath = pathname?.split("/").slice(0, 2).join("/") || "";

  const navItems = [
    {
      href: `${basePath}/admin`,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: `${basePath}/admin/agents`,
      label: "Agents",
      icon: Users,
    },
    {
      href: `${basePath}/admin/properties`,
      label: "Properties",
      icon: Home,
    },
    {
      href: `${basePath}/admin/bookings`,
      label: "Bookings",
      icon: Calendar,
    },
  ];

  return (
    <nav className="border-b bg-background overflow-x-auto">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-4 text-sm font-medium transition-colors border-b-2 border-transparent",
                  isActive
                    ? "border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
