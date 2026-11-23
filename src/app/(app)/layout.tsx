import { BottomNav } from "@/components/bottom-nav";
import { UserMenu } from "@/components/user-menu";
import { requireUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await requireUser();

  return (
    <>
      <header className="bg-background/95 sticky top-0 z-30 border-b pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
          <span className="font-semibold tracking-tight">Exercise Writer</span>
          <UserMenu name={user.name} />
        </div>
      </header>
      <main className="mx-auto w-full max-w-md px-4 pt-4 pb-[calc(5rem+env(safe-area-inset-bottom))]">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
