import { useSellerOrders } from "./hooks";
import { Card, CardBody, CardHeader, MetricCard, PageLoader } from "@/components/ui";
import { idr, num } from "@/lib/utils";
import type { OrderStatus } from "@/types";

// Lightweight analytics derived from the seller's order list. (The backend
// also exposes /seller/reports/income for deeper reporting.)
export function AnalyticsPage() {
  const { data, isLoading } = useSellerOrders({ page: 1 });

  if (isLoading) return <PageLoader />;
  const orders = data?.data ?? [];

  const completed = orders.filter((o) => o.status === "PESANAN_SELESAI");
  const revenue = completed.reduce((s, o) => s + num(o.total), 0);
  const avgOrder = completed.length ? revenue / completed.length : 0;

  const byStatus = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});
  const maxCount = Math.max(1, ...Object.values(byStatus));

  const STATUS_LABEL: Record<OrderStatus, string> = {
    SEDANG_DIKEMAS: "Packing",
    MENUNGGU_PENGIRIM: "Awaiting driver",
    SEDANG_DIKIRIM: "In delivery",
    PESANAN_SELESAI: "Completed",
    DIKEMBALIKAN: "Returned",
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-900">Income & analytics</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Completed revenue" value={idr(revenue)} tone="brand" />
        <MetricCard label="Completed orders" value={completed.length} tone="ink" />
        <MetricCard label="Avg. order value" value={idr(avgOrder)} tone="coral" />
      </div>

      <Card>
        <CardHeader title="Orders by status" subtitle="Distribution across the current page" />
        <CardBody className="space-y-3">
          {(Object.keys(byStatus) as OrderStatus[]).map((s) => (
            <div key={s}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-ink-600">{STATUS_LABEL[s]}</span>
                <span className="font-medium text-ink-900">{byStatus[s]}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                <div className="h-full rounded-full bg-brand-400" style={{ width: `${(byStatus[s] / maxCount) * 100}%` }} />
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
