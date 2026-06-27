import { useState } from "react";
import { useJobHistory } from "./hooks";
import {
  Card, CardBody, Badge, Pagination, Skeleton, EmptyState,
} from "@/components/ui";
import { formatDate } from "@/lib/utils";

export function DriverHistoryPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useJobHistory(page);
  const jobs = data?.data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-900">Delivery history</h1>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : jobs.length === 0 ? (
        <EmptyState icon="📋" title="No completed deliveries yet" description="Your finished trips will appear here." />
      ) : (
        <>
          <div className="space-y-3">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardBody className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-ink-900">#{job.orderId.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-ink-400">
                      {job.completedAt ? `Completed ${formatDate(job.completedAt)}` : formatDate(job.createdAt)}
                    </p>
                  </div>
                  <Badge tone={job.status === "COMPLETED" ? "green" : "blue"}>{job.status}</Badge>
                </CardBody>
              </Card>
            ))}
          </div>
          {data && <Pagination page={page} totalPages={data.pagination.totalPages} total={data.pagination.total} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}
