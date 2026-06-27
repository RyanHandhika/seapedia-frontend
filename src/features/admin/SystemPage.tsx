import { useAdminTime, useAdvanceDay, useResetTime } from "./hooks";
import {
  Card, CardBody, CardHeader, Button, Badge, PageLoader,
} from "@/components/ui";
import { formatDate } from "@/lib/utils";

// Time simulation drives the overdue-order demo: advancing days pushes orders
// past their SLA so the overdue worker flags them.
export function AdminSystemPage() {
  const { data: time, isLoading } = useAdminTime();
  const advanceDay = useAdvanceDay();
  const resetTime = useResetTime();

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-900">System controls</h1>

      <Card accent>
        <CardHeader title="Simulated time" subtitle="Advance the clock to test overdue-order handling" />
        <CardBody>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-ink-400">Current marketplace time</p>
              <p className="font-display text-xl font-bold text-ink-900">
                {time ? formatDate(time.simulatedDate) : "—"}
              </p>
              <Badge tone={time?.isSimulated ? "amber" : "gray"} className="mt-2">
                {time?.isSimulated ? "Simulated" : "Real time"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => advanceDay.mutate()} loading={advanceDay.isPending}>
                Advance 1 day
              </Button>
              <Button variant="secondary" onClick={() => resetTime.mutate()} loading={resetTime.isPending}>
                Reset time
              </Button>
            </div>
          </div>
          <p className="mt-4 rounded-xl bg-ink-50 p-3 text-xs text-ink-500">
            Advancing a day automatically runs the overdue check. Orders past their delivery SLA
            (Instant 3h · Next-day 24h · Regular 72h) will be flagged on the dashboard.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
