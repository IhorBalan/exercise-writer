import { LogOut } from "lucide-react";

import { signOutAction } from "@/app/(auth)/auth/actions";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function UserMenu({ name }: { name: string }) {
  return (
    <form action={signOutAction} className="flex items-center gap-1">
      <span className="text-muted-foreground mr-1 max-w-[9rem] truncate text-sm">{name}</span>
      <ThemeToggle />
      <Button type="submit" variant="ghost" size="icon" aria-label="Sign out">
        <LogOut />
      </Button>
    </form>
  );
}
