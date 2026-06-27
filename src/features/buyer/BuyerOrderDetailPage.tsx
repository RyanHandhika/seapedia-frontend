import { Link, useNavigate, useParams } from "react-router-dom";
import { useBuyerOrder } from "./hooks";
import {
  Card, CardBody, CardHeader, Badge, Timeline, PageLoader, EmptyState, Button,
  type TimelineStep,
} from "@/components/ui";
import {
  idr, formatDate, num, DELIVERY_LABEL,
  ORDER_STATUS_LABEL, ORDER_STATUS_TONE,
} from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

// Build the tracking timeline from the order's status history + the canonical
// flow, so even an order with sparse history shows the full journey.
const FLOW: OrderStatus[] = [
  "SEDANG_DIKEMAS",
  "MENUNGGU_PENGIRIM",
  "SEDANG_DIKIRIM",
  "PESANAN_SELESAI",
];

function buildTimeline(order: Order): TimelineStep[] {
  if (order.status === "DIKEMBALIKAN") {
    return [
      { title: "Order placed", state: "done", timestamp: formatDate(order.createdAt) },
      { title: "Returned", description: "This order was returned.", state: "current" },
    ];
  }
  const currentIdx = FLOW.indexOf(order.status);
  const historyMap = new Map(
    (order.statusHistory ?? []).map((h) => [h.status, h]),
  );
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

export function BuyerOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, isError } = useBuyerOrder(id);

  if (isLoading) return <PageLoader />;
  if (isError || !order) {
    return (
      <EmptyState
        icon="🔍"
        title="Order not found"
        action={<Button onClick={() => navigate("/buyer/orders")}>Back to orders</Button>}
      />
    );
  }

  const items = order.orderItems ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/buyer/orders" className="text-sm text-ink-400 hover:text-brand-600">← All orders</Link>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink-900">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-ink-400">{formatDate(order.createdAt)}</p>
        </div>
        <Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: tracking + items */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Tracking" subtitle={`Delivery: ${DELIVERY_LABEL[order.deliveryMethod]}`} />
            <CardBody>
              <Timeline steps={buildTimeline(order)} />
              {order.dueAt && order.status !== "PESANAN_SELESAI" && (
                <p className="mt-2 text-xs text-ink-400">
                  Estimated due by {formatDate(order.dueAt)}
                </p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Items" subtitle={order.store?.storeName} />
            <CardBody className="space-y-3">
              {items.map((it) => (
                <div key={it.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br from-brand-100 to-brand-50">
                      {it.product?.imageUrl ? (
                        <img src={it.product.imageUrl} alt="" className="h-full w-full rounded-lg object-cover" />
                      ) : "🐟"}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink-900">{it.product?.name ?? "Product"}</p>
                      <p className="text-xs text-ink-400">
                        {idr(it.priceAtPurchase)} × {it.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-ink-900">{idr(num(it.priceAtPurchase) * it.quantity)}</p>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* Right: payment + address */}
        <div className="space-y-6">
          <Card accent>
            <CardHeader title="Payment" />
            <CardBody>
              <dl className="space-y-2 text-sm">
                <Row label="Subtotal" value={idr(order.subtotal)} />
                {num(order.discountAmount) > 0 && (
                  <Row label="Discount" value={`− ${idr(order.discountAmount)}`} tone="brand" />
                )}
                <Row label="Delivery fee" value={idr(order.deliveryFee)} />
                <Row label="PPN (12%)" value={idr(order.ppnAmount)} />
                <div className="border-t border-ink-100 pt-2">
                  <Row label="Total" value={idr(order.total)} bold />
                </div>
              </dl>
            </CardBody>
          </Card>

          {order.address && (
            <Card>
              <CardHeader title="Delivery address" />
              <CardBody>
                <p className="font-medium text-ink-900">{order.address.label}</p>
                <p className="text-sm text-ink-500">{order.address.recipientName} · {order.address.phone}</p>
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
      <dd className={bold ? "font-display text-lg font-bold text-ink-900" : tone === "brand" ? "text-brand-600" : "text-ink-900"}>
        {value}
      </dd>
    </div>
  );
}
