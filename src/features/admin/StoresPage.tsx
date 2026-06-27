import { useState } from "react";
import { useAdminStores } from "./hooks";
import { Pagination, Table, type Column } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import type { Store } from "@/types";

type StoreRow = Store & { seller?: { username: string }; _count?: { products: number } };

export function AdminStoresPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminStores(page);

  const columns: Column<StoreRow>[] = [
    { key: "name", header: "Store", render: (s) => <span className="font-medium text-ink-900">{s.storeName}</span> },
    { key: "seller", header: "Seller", render: (s) => <span className="text-ink-600">{s.seller?.username ?? "—"}</span> },
    { key: "products", header: "Products", render: (s) => s._count?.products ?? "—" },
    { key: "created", header: "Opened", render: (s) => <span className="text-ink-500">{formatDate(s.createdAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-900">Stores</h1>
      <Table columns={columns} data={(data?.data as StoreRow[]) ?? []} isLoading={isLoading} rowKey={(s) => s.id} />
      {data && <Pagination page={page} totalPages={data.pagination.totalPages} total={data.pagination.total} onPageChange={setPage} />}
    </div>
  );
}
