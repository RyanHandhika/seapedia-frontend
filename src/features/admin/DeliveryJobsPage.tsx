import { useState } from "react";
import { useAdminDeliveryJobs } from "./hooks";
import { Badge, Pagination, Table, type Column } from "@/components/ui";
import { idr, formatDate } from "@/lib/utils";
import type { DeliveryJob, DeliveryJobStatus } from "@/types";

const JOB_TONE: Record<DeliveryJobStatus, "blue" | "violet" | "green"> = {
  AVAILABLE: "blue", TAKEN: "violet", COMPLETED: "green",
};
type JobRow = DeliveryJob & { driver?: { username: string }; order?: { total: string | number; status: string } };

export function AdminDeliveryJobsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminDeliveryJobs(page);

  const columns: Column<JobRow>[] = [
    { key: "id", header: "Order", render: (j) => <span className="font-mono text-xs text-ink-700">#{j.orderId.slice(-8).toUpperCase()}</span> },
    { key: "status", header: "Status", render: (j) => <Badge tone={JOB_TONE[j.status]}>{j.status}</Badge> },
    { key: "driver", header: "Driver", render: (j) => j.driver?.username ?? "—" },
    { key: "value", header: "Order value", render: (j) => (j.order ? idr(j.order.total) : "—") },
    { key: "created", header: "Created", render: (j) => <span className="text-ink-500">{formatDate(j.createdAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-900">Delivery jobs</h1>
      <Table columns={columns} data={(data?.data as JobRow[]) ?? []} isLoading={isLoading} rowKey={(j) => j.id} />
      {data && <Pagination page={page} totalPages={data.pagination.totalPages} total={data.pagination.total} onPageChange={setPage} />}
    </div>
  );
}
