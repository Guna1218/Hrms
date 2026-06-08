"use client";

import { Bell, LockKeyhole, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { AuthActions } from "./auth-actions";
import { nav } from "./nav-items";
import { hasPlanAccess, moduleKeyFromHref, requiredPlanForModule } from "../lib/plan-access";
import type { PlanName } from "../lib/plan-access";
import { useActiveRole } from "../lib/role";

export function AppShellFrame({
  children,
  title,
  subtitle,
  activePlan,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  activePlan: PlanName;
}) {
  const [open, setOpen] = React.useState(false);
  const { role, toggleRole } = useActiveRole();

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      {open ? <button aria-label="Close menu overlay" className="fixed inset-0 z-30 bg-[#172033]/35" onClick={() => setOpen(false)} type="button" /> : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[255px] border-r border-[#dce2eb] bg-white text-[#172033] shadow-xl transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex min-h-[68px] items-center justify-between border-b border-[#dce2eb] px-5">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <img src="/skylinx-logo-display.png" alt="SKYLINX Global Solutions" className="h-10 w-32 object-contain" />
          </Link>
          <button aria-label="Close menu" className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#eef5ff]" onClick={() => setOpen(false)} type="button">
            <X className="h-5 w-5 text-[#49637f]" />
          </button>
        </div>
        <nav className="grid max-h-[calc(100vh-68px)] gap-1 overflow-auto p-3">
          {nav.map(({ href, label, icon: Icon }) => {
            const requiredPlan = requiredPlanForModule(moduleKeyFromHref(href));
            const allowed = hasPlanAccess(requiredPlan, activePlan);
            return (
              <Link
                className={`flex min-h-10 items-center gap-3 rounded-lg px-3 text-left text-sm hover:bg-[#eef5ff] hover:text-brand ${allowed || href === "/saas" ? "text-[#34465f]" : "text-[#8ca0bf]"}`}
                href={href}
                key={href}
                onClick={() => setOpen(false)}
                title={allowed ? `${label} included in ${activePlan}` : `${label} requires ${requiredPlan} plan`}
              >
                <Icon className={`h-4 w-4 ${allowed || href === "/saas" ? "text-[#38a7f4]" : "text-[#aab8ca]"}`} />
                <span className="min-w-0 flex-1">{label}</span>
                {!allowed && href !== "/saas" ? <LockKeyhole className="h-3.5 w-3.5 text-[#ba3d37]" /> : null}
              </Link>
            );
          })}
        </nav>
      </aside>

      <section className="min-w-0">
        <header className="flex min-h-[68px] items-center gap-5 bg-[#1f2a44] px-8 text-white max-lg:px-5">
          <button aria-label="Open menu" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20" onClick={() => setOpen(true)} type="button">
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/dashboard" className="flex shrink-0 items-center">
            <img src="/skylinx-logo-display.png" alt="SKYLINX Global Solutions" className="h-10 w-32 object-contain brightness-0 invert" />
          </Link>
          <div className="text-xl font-semibold max-xl:hidden">Hi SKYLINX!</div>
          <div className="flex max-w-[520px] flex-1 items-center rounded-lg border border-white/35 bg-white/5">
            <input className="min-h-11 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-white/55 outline-none" placeholder="Search Employees" />
            <button className="flex h-11 w-12 items-center justify-center rounded-r-lg bg-white text-[#1f2a44]" type="button">
              <Search className="h-5 w-5" />
            </button>
          </div>
          <div className="ml-auto flex items-center gap-4">
            {/* HR / Admin switch */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/15 text-xs font-semibold select-none max-sm:hidden">
              <button
                type="button"
                className={`px-3 py-1 rounded-md transition ${role === "hr" ? "bg-brand text-white shadow-sm" : "text-white/60 hover:text-white"}`}
                onClick={() => toggleRole("hr")}
              >
                HR View
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded-md transition ${role === "admin" ? "bg-brand text-white shadow-sm" : "text-white/60 hover:text-white"}`}
                onClick={() => toggleRole("admin")}
              >
                Admin View
              </button>
            </div>
            
            <Link className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase text-white" href="/saas">
              {activePlan} Plan
            </Link>
            <div className="text-xs font-bold uppercase max-xl:hidden">Mon 01, Jun 2026</div>
            <Bell className="h-5 w-5" />
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dff7ff] text-sm font-bold text-brand">SG</div>
            <AuthActions />
          </div>
        </header>

        <div className="p-8 max-lg:p-5">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="m-0 text-2xl font-semibold">{title}</h1>
              <p className="mt-1 text-sm text-muted">{subtitle}</p>
            </div>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
