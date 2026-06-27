import { useState } from "react";
import { Link } from "react-router-dom";
import { useBuyerOrders } from "./hooks";
import {
  Card, CardBody, Badge, Pagination, Skeleton, EmptyState, Button,
} from "@/components/ui";
import {
  idr, formatDate, ORDER_STATUS_LABEL, ORDER_STATUS_TONE,
} from "@/lib/utils";
import type { OrderStatus } from "@/types";

const FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "Packing", value: "SEDANG_DIKEMAS" },
  { label: "Awaiting driver", value: "MENUNGGU_PENGIRIM" },
  { label: "In delivery", value: "SEDANG_DIKIRIM" },
  { label: "Completed", value: "PESANAN_SELESAI" },
];

export function BuyerOrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const { data, isLoading } = useBuyerOrders({ page, status: status || undefined });

  const orders = data?.data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-900">My orders</h1>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setStatus(f.value); setPage(1); }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              status === f.value
                ? "bg-brand-500 text-white"
                : "border border-ink-200 bg-white text-ink-600 hover:border-brand-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No orders here"
          description="Orders with this status will appear here."
          action={<Button><Link to="/buyer/products">Browse products</Link></Button>}
        />
      ) : (
        <>
          <div className="space-y-3">
            {orders.map((o) => (
              <Link key={o.id} to={`/buyer/orders/${o.id}`}>
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
                      {o.store && <p className="text-sm text-ink-500">{o.store.storeName}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg font-bold text-ink-900">{idr(o.total)}</p>
                      <p className="text-xs text-brand-600">View details →</p>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
          {data && (
            <Pagination
              page={page}
              totalPages={data.pagination.totalPages}
              total={data.pagination.total}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
