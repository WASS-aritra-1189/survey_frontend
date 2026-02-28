import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import {
  LayoutDashboard,
  FileText,
  Users,
  Smartphone,
  MapPin,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Database,
  ClipboardList,
  Activity,
  Pencil,
  Menu,
  ShieldCheck,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const surveyState = useAppSelector((state) => state.survey);
  const surveyCount = surveyState?.data?.length || 0;

  const navGroups: NavGroup[] = [
    {
      title: "Overview",
      items: [
        { title: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
        { title: "Surveys", href: "/surveys", icon: <FileText className="h-5 w-5" />, badge: surveyCount },
        { title: "Survey Builder", href: "/surveys/builder", icon: <Pencil className="h-5 w-5" /> },
        { title: "Survey Assignment", href: "/surveys/assignment", icon: <Users className="h-5 w-5" /> },
        { title: "Survey Statistics", href: "/surveys/stats", icon: <BarChart3 className="h-5 w-5" /> },
        { title: "Responses", href: "/responses", icon: <ClipboardList className="h-5 w-5" /> },
      ],
    },
    {
      title: "Management",
      items: [
        { title: "Users", href: "/users", icon: <Users className="h-5 w-5" /> },
        { title: "Staff", href: "/staff", icon: <Shield className="h-5 w-5" /> },
        { title: "Devices", href: "/devices", icon: <Smartphone className="h-5 w-5" /> },
        { title: "Geo-Fencing", href: "/geofencing", icon: <MapPin className="h-5 w-5" /> },
        { title: "Zone Management", href: "/zone-management", icon: <MapPin className="h-5 w-5" /> },
        { title: "Location Management", href: "/location-management", icon: <MapPin className="h-5 w-5" /> },
      ],
    },
    {
      title: "Analytics",
      items: [
        { title: "Reports", href: "/reports", icon: <BarChart3 className="h-5 w-5" /> },
        { title: "Activity Logs", href: "/logs", icon: <Activity className="h-5 w-5" /> },
      ],
    },
    {
      title: "System",
      items: [
        { title: "Master Data", href: "/master-data", icon: <Database className="h-5 w-5" /> },
        { title: "Menus", href: "/menus", icon: <Menu className="h-5 w-5" /> },
        { title: "Permissions", href: "/permissions", icon: <ShieldCheck className="h-5 w-5" /> },
        { title: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
        { title: "Help & Support", href: "/help", icon: <HelpCircle className="h-5 w-5" /> },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen gradient-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-sidebar-foreground">SurveyPro</span>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground/60 hover:text-sidebar-foreground",
              collapsed && "hidden"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-6">
              {!collapsed && (
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                  {group.title}
                </h3>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                          collapsed && "justify-center px-2"
                        )}
                      >
                        {item.icon}
                        {!collapsed && (
                          <>
                            <span className="flex-1">{item.title}</span>
                            {item.badge && (
                              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-accent-foreground">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors",
              collapsed && "justify-center px-2"
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span>Collapse</span>
              </>
            )}
          </button>
          <Link
            to="/login"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-colors mt-1",
              collapsed && "justify-center px-2"
            )}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Logout</span>}
          </Link>
        </div>
      </div>
    </aside>
  );
}
