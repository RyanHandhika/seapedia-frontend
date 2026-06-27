import { useState } from "react";
import { useAdminOrders } from "./hooks";
import { Badge, Pagination, Table, type Column } from "@/components/ui";
import { idr, formatDate, ORDER_STATUS_LABEL, ORDER_STATUS_TONE } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const FILTERS = [
  { label: "All", value: "" },
  { label: "Packing", value: "SEDANG_DIKEMAS" },
  { label: "Awaiting driver", value: "MENUNGGU_PENGIRIM" },
  { label: "In delivery", value: "SEDANG_DIKIRIM" },
  { label: "Completed", value: "PESANAN_SELESAI" },
];

type OrderRow = Order & { buyer?: { username: string }; store?: { storeName: string; id: string } };

export function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const { data, isLoading } = useAdminOrders(page, status || undefined);

  const columns: Column<OrderRow>[] = [
    { key: "id", header: "Order", render: (o) => <span className="font-mono text-xs text-ink-700">#{o.id.slice(-8).toUpperCase()}</span> },
    { key: "buyer", header: "Buyer", render: (o) => o.buyer?.username ?? "—" },
    { key: "store", header: "Store", render: (o) => o.store?.storeName ?? "—" },
    { key: "total", header: "Total", render: (o) => <span className="font-medium">{idr(o.total)}</span> },
    { key: "status", header: "Status", render: (o) => <Badge tone={ORDER_STATUS_TONE[o.status as OrderStatus]}>{ORDER_STATUS_LABEL[o.status as OrderStatus]}</Badge> },
    { key: "created", header: "Placed", render: (o) => <span className="text-ink-500">{formatDate(o.createdAt)}</span> },
  ];

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
      <Table columns={columns} data={(data?.data as OrderRow[]) ?? []} isLoading={isLoading} rowKey={(o) => o.id} />
      {data && <Pagination page={page} totalPages={data.pagination.totalPages} total={data.pagination.total} onPageChange={setPage} />}
    </div>
  );
}
