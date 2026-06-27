import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSellerOrders, useSellerOrder, useProcessOrder } from "./hooks";
import {
  Card, CardBody, CardHeader, Badge, Pagination, Skeleton, EmptyState,
  Button, PageLoader, Timeline, type TimelineStep,
} from "@/components/ui";
import {
  idr, formatDate, num, DELIVERY_LABEL,
  ORDER_STATUS_LABEL, ORDER_STATUS_TONE,
} from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const FILTERS = [
  { label: "All", value: "" },
  { label: "To pack", value: "SEDANG_DIKEMAS" },
  { label: "Awaiting driver", value: "MENUNGGU_PENGIRIM" },
  { label: "In delivery", value: "SEDANG_DIKIRIM" },
  { label: "Completed", value: "PESANAN_SELESAI" },
];

export function SellerOrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const { data, isLoading } = useSellerOrders({ page, status: status || undefined });
  const orders = data?.data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-900">Orders</h1>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setStatus(f.value); setPage(1); }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              status === f.value ? "bg-brand-500 text-white" : "border border-ink-200 bg-white text-ink-600 hover:border-brand-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : orders.length === 0 ? (
        <EmptyState icon="📦" title="No orders" description="Orders matching this filter will appear here." />
      ) : (
        <>
          <div className="space-y-3">
            {orders.map((o) => (
              <Link key={o.id} to={`/seller/orders/${o.id}`}>
                <Card interactive>
                  <CardBody className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-ink-900">#{o.id.slice(-8).toUpperCase()}</p>
                        <Badge tone={ORDER_STATUS_TONE[o.status as OrderStatus]}>
                          {ORDER_STATUS_LABEL[o.status as OrderStatus]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-ink-400">{formatDate(o.createdAt)}</p>
                      {o.buyer && <p className="text-sm text-ink-500">Buyer: {o.buyer.username}</p>}
                    </div>
                    <p className="font-display text-lg font-bold text-ink-900">{idr(o.total)}</p>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
          {data && <Pagination page={page} totalPages={data.pagination.totalPages} total={data.pagination.total} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}

const FLOW: OrderStatus[] = ["SEDANG_DIKEMAS", "MENUNGGU_PENGIRIM", "SEDANG_DIKIRIM", "PESANAN_SELESAI"];

function buildTimeline(order: Order): TimelineStep[] {
  const currentIdx = FLOW.indexOf(order.status);
  const historyMap = new Map((order.statusHistory ?? []).map((h) => [h.status, h]));
  return FLOW.map((status, i) => {
    const h = historyMap.get(status);
    return {
      title: ORDER_STATUS_LABEL[status],
      description: h?.note ?? undefined,
      timestamp: h ? formatDate(h.changedAt) : undefined,
      state: i < currentIdx ? "done" : i === currentIdx ? "current" : "upcoming",
    };
  });
}

export function SellerOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, isError } = useSellerOrder(id);
  const processOrder = useProcessOrder();

  if (isLoading) return <PageLoader />;
  if (isError || !order) {
    return <EmptyState icon="🔍" title="Order not found" action={<Button onClick={() => navigate("/seller/orders")}>Back</Button>} />;
  }

  const items = order.orderItems ?? [];
  const canProcess = order.status === "SEDANG_DIKEMAS";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/seller/orders" className="text-sm text-ink-400 hover:text-brand-600">← All orders</Link>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink-900">#{order.id.slice(-8).toUpperCase()}</h1>
        </div>
        <Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>
      </div>

      {canProcess && (
        <Card accent>
          <CardBody className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium text-ink-900">Ready to pack?</p>
              <p className="text-sm text-ink-500">Mark as packed to create a delivery job for drivers.</p>
            </div>
            <Button onClick={() => processOrder.mutate(order.id)} loading={processOrder.isPending}>
              Mark as packed
            </Button>
          </CardBody>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Fulfillment" subtitle={DELIVERY_LABEL[order.deliveryMethod]} />
            <CardBody><Timeline steps={buildTimeline(order)} /></CardBody>
          </Card>

          <Card>
            <CardHeader title="Items" />
            <CardBody className="space-y-3">
              {items.map((it) => (
                <div key={it.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-900">{it.product?.name ?? "Product"}</p>
                    <p className="text-xs text-ink-400">{idr(it.priceAtPurchase)} × {it.quantity}</p>
                  </div>
                  <p className="font-medium text-ink-900">{idr(num(it.priceAtPurchase) * it.quantity)}</p>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card accent>
            <CardHeader title="Order total" />
            <CardBody>
              <dl className="space-y-2 text-sm">
                <Row label="Subtotal" value={idr(order.subtotal)} />
                {num(order.discountAmount) > 0 && <Row label="Discount" value={`− ${idr(order.discountAmount)}`} tone="brand" />}
                <Row label="Delivery" value={idr(order.deliveryFee)} />
                <Row label="PPN (12%)" value={idr(order.ppnAmount)} />
                <div className="border-t border-ink-100 pt-2"><Row label="Total" value={idr(order.total)} bold /></div>
              </dl>
            </CardBody>
          </Card>

          {order.address && (
            <Card>
              <CardHeader title="Ship to" />
              <CardBody>
                <p className="font-medium text-ink-900">{order.address.recipientName}</p>
                <p className="text-sm text-ink-500">{order.address.phone}</p>
                <p className="text-sm text-ink-500">{order.address.fullAddress}</p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, tone }: { label: string; value: string; bold?: boolean; tone?: "brand" }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={bold ? "font-semibold text-ink-900" : "text-ink-500"}>{label}</dt>
      <dd className={bold ? "font-display text-lg font-bold text-ink-900" : tone === "brand" ? "text-brand-600" : "text-ink-900"}>{value}</dd>
    </div>
  );
}
