import { LogOut } from "lucide-react";

import { signOutAction } from "@/app/(auth)/auth/actions";
import { Button } from "@/components/ui/button";

export function UserMenu({ name }: { name: string }) {
  return (
    <form action={signOutAction} className="flex items-center gap-2">
      <span className="text-muted-foreground max-w-[10rem] truncate text-sm">{name}</span>
      <Button type="submit" variant="ghost" size="icon" aria-label="Sign out">
        <LogOut />
      </Button>
    </form>
  );
}
