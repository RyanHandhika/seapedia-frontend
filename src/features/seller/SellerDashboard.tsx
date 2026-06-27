import { Link } from "react-router-dom";
import { useSellerStore, useSellerProducts, useSellerOrders } from "./hooks";
import {
  Card, CardBody, CardHeader, MetricCard, Badge, Button, Skeleton, EmptyState,
} from "@/components/ui";
import { idr, formatDate, num, ORDER_STATUS_LABEL, ORDER_STATUS_TONE } from "@/lib/utils";

export function SellerDashboard() {
  const { data: store, isLoading: storeLoading, isError } = useSellerStore();
  const { data: products } = useSellerProducts({ page: 1 });
  const { data: orders, isLoading: ordersLoading } = useSellerOrders({ page: 1 });

  // Orders awaiting the seller's action (still packing).
  const pending = orders?.data.filter((o) => o.status === "SEDANG_DIKEMAS") ?? [];
  const revenue = orders?.data
    .filter((o) => o.status === "PESANAN_SELESAI")
    .reduce((s, o) => s + num(o.total), 0) ?? 0;

  if (isError) {
    return (
      <EmptyState
        icon="🏪"
        title="No store yet"
        description="You need to open a store before you can sell."
        action={<Button><Link to="/buyer/profile">Open store</Link></Button>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        {storeLoading ? (
          <Skeleton className="h-8 w-48" />
        ) : (
          <h1 className="font-display text-2xl font-bold text-ink-900">{store?.storeName}</h1>
        )}
        <p className="text-sm text-ink-500">{store?.description || "Your store dashboard"}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Completed revenue" value={idr(revenue)} tone="brand" />
        <MetricCard label="Total orders" value={orders?.pagination.total ?? 0} tone="ink" />
        <MetricCard label="Products" value={products?.pagination.total ?? 0} tone="coral" />
        <MetricCard label="Awaiting action" value={pending.length} tone="ink" />
      </div>

      <Card>
        <CardHeader
          title="Orders to pack"
          subtitle="Process these to make them available to drivers"
          action={<Button variant="tertiary" size="sm"><Link to="/seller/orders">All orders →</Link></Button>}
        />
        <CardBody className="space-y-3">
          {ordersLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)
          ) : pending.length === 0 ? (
            <EmptyState icon="✅" title="All caught up" description="No orders waiting to be packed." />
          ) : (
            pending.map((o) => (
              <Link
                key={o.id}
                to={`/seller/orders/${o.id}`}
                className="flex items-center justify-between rounded-xl border border-ink-100 p-4 transition-colors hover:bg-brand-50/40"
              >
                <div>
                  <p className="font-medium text-ink-900">#{o.id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-ink-400">{formatDate(o.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-ink-900">{idr(o.total)}</p>
                  <Badge tone={ORDER_STATUS_TONE[o.status]} className="mt-1">
                    {ORDER_STATUS_LABEL[o.status]}
                  </Badge>
                </div>
              </Link>
            ))
          )}
        </CardBody>
      </Card>
    </div>
  );
}
