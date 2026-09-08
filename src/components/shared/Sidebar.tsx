"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, LogOut, Monitor, Moon, Search, Sun, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLogout } from "@/hooks/useLogout";
import { cn } from "@/lib/utils";
import type { Theme } from "@/lib/theme";
import {
  PRIMARY_NAV,
  SECONDARY_NAV,
  type NavItem,
} from "@/constants/navigation";

// TODO(api-contract): replace with the authenticated admin profile query once
// the backend `/me` shape is confirmed. Hardcoded like the previous header.
const ADMIN_PROFILE = {
  name: "Admin User",
  email: "admin@pennpromise.ng",
  initials: "AU",
};

const THEME_OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
        active && "bg-sidebar-accent text-sidebar-foreground shadow-sm",
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function ProfileMenu() {
  const { theme, setTheme } = useTheme();
  const logout = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-md border-t border-sidebar-border px-2 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
        <Avatar className="size-8">
          <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
            {ADMIN_PROFILE.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-medium text-sidebar-foreground">
            {ADMIN_PROFILE.name}
          </p>
          <p className="truncate text-[11px] text-sidebar-foreground/70">
            {ADMIN_PROFILE.email}
          </p>
        </div>
        <LogOut
          className="size-4 shrink-0 text-sidebar-foreground/70"
          aria-hidden
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-56">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="size-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Theme
        </DropdownMenuLabel>
        {THEME_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={(event) => {
                event.preventDefault();
                setTheme(option.value);
              }}
            >
              <Icon className="size-4" />
              <span className="flex-1">{option.label}</span>
              {theme === option.value ? <Check className="size-4" /> : null}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => logout()}>
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * The sidebar's inner content. Rendered inside the fixed desktop rail
 * (<Sidebar>) and inside the mobile <Sheet> (<MobileNav>) — keep it layout
 * agnostic.
 */
export function SidebarContent() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="flex h-full flex-col gap-5 px-4 py-6">
      <div className="flex items-center gap-2 px-2">
        <span className="grid size-8 place-items-center rounded-md bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
          PP
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-sidebar-foreground">
            PennPromise
          </p>
          <p className="text-[11px] text-sidebar-foreground/70">Capital</p>
        </div>
      </div>

      <div className="relative px-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-sidebar-foreground/60" />
        {/* TODO(search): wire to global admin search once the feature is specced. */}
        <Input
          type="search"
          placeholder="Search…"
          aria-label="Search"
          className="border-sidebar-border bg-sidebar-accent pl-9 text-sidebar-foreground placeholder:text-sidebar-foreground/60 focus-visible:ring-sidebar-ring"
        />
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {PRIMARY_NAV.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </nav>

      <div className="flex flex-col gap-1">
        {SECONDARY_NAV.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}
        <ProfileMenu />
      </div>
    </div>
  );
}

/** Fixed desktop navigation rail. Hidden below `md` — see <MobileNav>. */
export function Sidebar() {
  return (
    <aside className="bg-sidebar-gradient hidden w-72 shrink-0 md:block">
      <SidebarContent />
    </aside>
  );
}
