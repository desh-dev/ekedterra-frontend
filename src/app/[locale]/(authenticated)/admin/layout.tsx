import { AdminNav } from "@/components/admin/layout/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage agents, properties, and bookings
          </p>
        </div>
      </div>
      <AdminNav />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
