import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>Your Big Six progress will show up here.</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          Logging arrives in M2 and charts in M3.
        </CardContent>
      </Card>
    </div>
  );
}
