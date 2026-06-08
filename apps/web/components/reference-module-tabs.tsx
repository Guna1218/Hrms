"use client";

import * as React from "react";

export function ReferenceModuleTabs({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: string[];
  activeTab: string;
  onTabChange?: (tab: string) => void;
}) {
  return (
    <div className="flex flex-wrap rounded-full bg-[#eef3f8] p-1">
      {tabs.map((tab) => (
        <button
          className={`min-h-9 rounded-full px-4 text-sm font-semibold ${
            tab === activeTab ? "bg-white text-[#172033] shadow-sm" : "text-[#6d7f98]"
          }`}
          key={tab}
          type="button"
          onClick={() => onTabChange?.(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
