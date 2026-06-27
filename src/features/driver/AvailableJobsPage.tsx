import { useState } from "react";
import { useAvailableJobs, useActiveJob, useTakeJob } from "./hooks";
import {
  Card, CardBody, Button, Badge, Pagination, Skeleton, EmptyState,
} from "@/components/ui";
import { idr, formatDate, DELIVERY_LABEL } from "@/lib/utils";

export function AvailableJobsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAvailableJobs(page);
  const { data: active } = useActiveJob();
  const takeJob = useTakeJob();

  const jobs = data?.data ?? [];
  const hasActive = !!active;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Available jobs</h1>
        <p className="text-sm text-ink-500">Take a job to start a delivery. One active trip at a time.</p>
      </div>

      {hasActive && (
        <Card accent>
          <CardBody className="flex items-center justify-between">
            <p className="text-sm text-ink-600">You have an active trip. Complete it before taking a new one.</p>
            <Badge tone="violet" pulse>In progress</Badge>
          </CardBody>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      ) : jobs.length === 0 ? (
        <EmptyState icon="🛟" title="No jobs available" description="Check back soon — new delivery jobs appear as sellers pack orders." />
      ) : (
        <>
          <div className="space-y-3">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardBody className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-ink-900">#{job.orderId.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-ink-400">{formatDate(job.createdAt)}</p>
                    {job.order?.deliveryMethod && (
                      <Badge tone="blue" className="mt-1">{DELIVERY_LABEL[job.order.deliveryMethod]}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    {job.order?.deliveryFee !== undefined && (
                      <div className="text-right">
                        <p className="text-xs text-ink-400">Delivery fee</p>
                        <p className="font-display font-bold text-brand-600">{idr(job.order.deliveryFee)}</p>
                      </div>
                    )}
                    <Button
                      disabled={hasActive}
                      loading={takeJob.isPending && takeJob.variables === job.id}
                      onClick={() => takeJob.mutate(job.id)}
                    >
                      Take job
                    </Button>
                  </div>
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
