"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Languages, 
  Timer, 
  CalendarDays, 
  BarChart3, 
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Practice", href: "/practice", icon: BookOpen },
  { name: "Vocabulary", href: "/vocabulary", icon: Languages },
  { name: "Simulation", href: "/simulation", icon: Timer },
  { name: "Study Plan", href: "/study-plan", icon: CalendarDays },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card shadow-sm">
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold font-mono">T</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Toeflup</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1 flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("size-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t p-4">
        <div className="flex flex-col gap-4">
          <Button variant="ghost" className="w-full justify-start gap-3 px-3 text-muted-foreground" asChild>
            <Link href="/settings">
              <Settings className="size-5" />
              Settings
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="size-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
