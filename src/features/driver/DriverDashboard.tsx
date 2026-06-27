import { Link } from "react-router-dom";
import { useActiveJob, useCompleteJob, useDriverEarnings } from "./hooks";
import {
  Card, CardBody, CardHeader, MetricCard, Badge, Button, Skeleton,
  EmptyState, Timeline, type TimelineStep,
} from "@/components/ui";
import { idr, formatDate, num } from "@/lib/utils";
import type { DeliveryJob } from "@/types";

function jobTimeline(job: DeliveryJob): TimelineStep[] {
  return [
    {
      title: "Job created",
      timestamp: formatDate(job.createdAt),
      state: "done",
    },
    {
      title: "Picked up",
      description: job.takenAt ? "On the way to the buyer" : undefined,
      timestamp: job.takenAt ? formatDate(job.takenAt) : undefined,
      state: job.takenAt ? (job.completedAt ? "done" : "current") : "upcoming",
    },
    {
      title: "Delivered",
      timestamp: job.completedAt ? formatDate(job.completedAt) : undefined,
      state: job.completedAt ? "done" : "upcoming",
    },
  ];
}

export function DriverDashboard() {
  const { data: active, isLoading } = useActiveJob();
  const { data: earnings } = useDriverEarnings();
  const completeJob = useCompleteJob();

  const total = num(earnings?.total ?? 0);
  const count = earnings?.count ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-900">Driver dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Total earnings" value={idr(total)} tone="brand" />
        <MetricCard label="Deliveries done" value={count} tone="ink" />
        <MetricCard
          label="Status"
          value={active ? "On a trip" : "Available"}
          tone={active ? "coral" : "brand"}
        />
      </div>

      {/* Active trip */}
      {isLoading ? (
        <Skeleton className="h-64" />
      ) : !active ? (
        <EmptyState
          icon="🚚"
          title="No active trip"
          description="Take a delivery job to start earning."
          action={<Button><Link to="/driver/jobs">Find jobs</Link></Button>}
        />
      ) : (
        <Card accent>
          <CardHeader
            title={`Active trip · #${active.orderId.slice(-8).toUpperCase()}`}
            action={<Badge tone="violet" pulse>In progress</Badge>}
          />
          <CardBody>
            <div className="grid gap-6 lg:grid-cols-2">
              <Timeline steps={jobTimeline(active)} />
              <div className="space-y-3">
                {active.order?.store && (
                  <InfoRow label="Pickup (store)" value={active.order.store.storeName} />
                )}
                {active.order?.address && (
                  <>
                    <InfoRow label="Deliver to" value={active.order.address.recipientName} />
                    <InfoRow label="Phone" value={active.order.address.phone} />
                    <InfoRow label="Address" value={active.order.address.fullAddress} />
                  </>
                )}
                {active.order?.total !== undefined && (
                  <InfoRow label="Order value" value={idr(active.order.total)} />
                )}
                <Button
                  fullWidth
                  size="lg"
                  className="mt-2"
                  onClick={() => completeJob.mutate(active.id)}
                  loading={completeJob.isPending}
                >
                  Confirm delivery
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-ink-50 pb-2 text-sm last:border-0">
      <span className="text-ink-400">{label}</span>
      <span className="text-right font-medium text-ink-800">{value}</span>
    </div>
  );
}
