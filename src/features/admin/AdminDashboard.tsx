import { Link } from "react-router-dom";
import { useAdminDashboard, useAdminTime } from "./hooks";
import {
  Card, CardBody, CardHeader, MetricCard, Badge, Button, Skeleton,
} from "@/components/ui";
import { formatDate } from "@/lib/utils";

export function AdminDashboard() {
  const { data, isLoading } = useAdminDashboard();
  const { data: time } = useAdminTime();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Platform overview</h1>
          <p className="text-sm text-ink-500">Live snapshot of the SEAPEDIA marketplace.</p>
        </div>
        {time && (
          <Badge tone={time.isSimulated ? "amber" : "gray"}>
            {time.isSimulated ? "⏱ Simulated time" : "Real time"}: {formatDate(time.simulatedDate)}
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Users" value={data.users} tone="brand" />
            <MetricCard label="Stores" value={data.stores} tone="coral" />
            <MetricCard label="Products" value={data.products} tone="ink" />
            <MetricCard label="Orders" value={data.orders} tone="brand" />
            <MetricCard label="Vouchers" value={data.vouchers} tone="ink" />
            <MetricCard label="Promos" value={data.promos} tone="ink" />
            <MetricCard label="Delivery jobs" value={data.deliveryJobs} tone="coral" />
            <MetricCard label="Overdue orders" value={data.overdueOrders} tone={data.overdueOrders > 0 ? "coral" : "ink"} />
          </div>

          {data.overdueOrders > 0 && (
            <Card className="border-coral-200 bg-coral-50">
              <CardBody className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-coral-800">
                    {data.overdueOrders} order{data.overdueOrders > 1 ? "s are" : " is"} overdue
                  </p>
                  <p className="text-sm text-coral-700">Orders past their delivery SLA need attention.</p>
                </div>
                <Button variant="danger"><Link to="/admin/orders">Review orders</Link></Button>
              </CardBody>
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickLink to="/admin/users" title="Users" desc="Browse and inspect accounts" />
            <QuickLink to="/admin/stores" title="Stores" desc="Monitor seller stores" />
            <QuickLink to="/admin/delivery-jobs" title="Deliveries" desc="Track all delivery jobs" />
            <QuickLink to="/admin/vouchers" title="Vouchers" desc="Create & manage vouchers" />
            <QuickLink to="/admin/promos" title="Promos" desc="Create & manage promos" />
            <QuickLink to="/admin/system" title="System" desc="Simulate time for demos" />
          </div>
        </>
      ) : null}
    </div>
  );
}

function QuickLink({ to, title, desc }: { to: string; title: string; desc: string }) {
  return (
    <Link to={to}>
      <Card interactive>
        <CardHeader title={title} subtitle={desc} />
      </Card>
    </Link>
  );
}
