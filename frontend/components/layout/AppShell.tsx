import AppShellInner from "./AppShellInner";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return <AppShellInner>{children}</AppShellInner>;
}
