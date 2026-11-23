export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-4 py-10">
      <div className="mb-8 text-center">
        <p className="text-2xl font-semibold tracking-tight">Exercise Writer</p>
        <p className="text-muted-foreground mt-1 text-sm">Your Convict Conditioning log</p>
      </div>
      {children}
    </main>
  );
}
