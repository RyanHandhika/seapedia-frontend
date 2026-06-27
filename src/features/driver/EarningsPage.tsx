import { useDriverEarnings } from "./hooks";
import {
  Card, CardBody, CardHeader, MetricCard, PageLoader, EmptyState,
} from "@/components/ui";
import { idr, formatDate, num } from "@/lib/utils";

export function DriverEarningsPage() {
  const { data, isLoading } = useDriverEarnings();
  if (isLoading) return <PageLoader />;

  const total = num(data?.total ?? 0);
  const count = data?.count ?? 0;
  const list = data?.earnings ?? [];
  const avg = count ? total / count : 0;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-900">Earnings</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Total earned" value={idr(total)} tone="brand" />
        <MetricCard label="Deliveries" value={count} tone="ink" />
        <MetricCard label="Avg. per trip" value={idr(avg)} tone="coral" />
      </div>

      <Card>
        <CardHeader title="Earnings breakdown" />
        <CardBody>
          {list.length === 0 ? (
            <EmptyState icon="💰" title="No earnings yet" description="Complete deliveries to start earning." />
          ) : (
            <div className="divide-y divide-ink-100">
              {list.map((e) => (
                <div key={e.id} className="flex items-center justify-between py-3">
                  <p className="text-sm text-ink-500">{formatDate(e.createdAt)}</p>
                  <p className="font-display font-bold text-brand-600">+ {idr(num(e.amount))}</p>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
