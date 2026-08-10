"use client";

import { useEffect, useRef } from "react";

const SHORTCUTS = [
  { key: "Space", description: "Start/Stop current test" },
  { key: "1 2 3 4", description: "Switch One-shot/Monitoring/Event/Long-run" },
  { key: "Ctrl+K or Cmd+K", description: "Focus module search" },
  { key: "[ / ]", description: "Collapse / expand sidebar" },
  { key: "?", description: "Open this help" },
];

/** Selector for everything we treat as focusable in the dialog. */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function HelpShortcutsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  // Remember the element that had focus when the dialog opened so we
  // can return focus on close. Without this, keyboard users land back
  // at the top of the document after dismissing.
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    triggerRef.current = (document.activeElement as HTMLElement | null) ?? null;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    // Focus trap: keep Tab cycling inside the dialog while it is open.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
      if (focusables.length === 0) {
        // Nothing focusable inside; pin focus to the panel itself so
        // Tab has no escape.
        event.preventDefault();
        panelRef.current.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey && (active === first || !panelRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onEscape);
    window.addEventListener("keydown", onKeyDown);

    // Move initial focus into the dialog. Use a microtask so the panel
    // has been rendered into the DOM first.
    const focusTarget = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusTarget) focusTarget.focus();
    else panelRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onEscape);
      window.removeEventListener("keydown", onKeyDown);
      // Return focus to whatever was focused before the dialog opened.
      const trigger = triggerRef.current;
      if (trigger && typeof trigger.focus === "function") {
        trigger.focus();
      }
      triggerRef.current = null;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-shortcuts-title"
        tabIndex={-1}
        className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-lg outline-none"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="help-shortcuts-title" className="mb-1 text-lg font-semibold">
          Keyboard shortcuts
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Quick actions from anywhere in the console.
        </p>
        <ul className="space-y-1.5">
          {SHORTCUTS.map((item) => (
            <li
              key={item.key}
              className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm"
            >
              <span className="text-foreground">{item.description}</span>
              <kbd className="rounded border border-border bg-background px-2 py-0.5 font-mono text-xs text-muted-foreground">
                {item.key}
              </kbd>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}