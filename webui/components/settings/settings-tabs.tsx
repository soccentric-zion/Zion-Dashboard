"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/settings/general", label: "General" },
  { href: "/settings/ota-host", label: "OTA - Host" },
  { href: "/settings/ota-device", label: "OTA - Device" },
];

export function SettingsTabs() {
  const pathname = usePathname();

  return (
    <nav className="inline-flex rounded-full border border-zinc-300 bg-white/70 p-1 dark:border-zinc-700 dark:bg-zinc-900/70">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={clsx(
            "rounded-full px-4 py-1.5 text-sm font-medium",
            pathname === tab.href
              ? "bg-sky-600 text-white"
              : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
