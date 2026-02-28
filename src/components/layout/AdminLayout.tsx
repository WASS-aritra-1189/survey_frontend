import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { Footer } from "./Footer";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminSidebar />
      <div className="pl-64 transition-all duration-300 flex-1 flex flex-col">
        <AdminHeader title={title} subtitle={subtitle} />
        <main className="p-6 flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
