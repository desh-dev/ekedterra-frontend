import { Card } from "@/components/ui/card";
import { Users, Home, Calendar } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Agents",
      description: "Manage agent verifications",
      icon: Users,
      href: "/admin/agents",
      count: "—",
    },
    {
      title: "Properties",
      description: "View and manage all properties",
      icon: Home,
      href: "/admin/properties",
      count: "—",
    },
    {
      title: "Bookings",
      description: "Manage all bookings",
      icon: Calendar,
      href: "/admin/bookings",
      count: "—",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-2">
          Welcome to the admin dashboard. Manage your platform from here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.href} href={stat.href}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-2">{stat.count}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
