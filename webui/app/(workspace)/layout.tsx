import { AppShell } from "@/components/chrome/app-shell";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
