import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import { qk } from "@/lib/queryClient";
import { useWallet, useBuyerOrders } from "./hooks";
import { useAuthStore } from "@/stores/authStore";
import {
  Card,
  CardBody,
  CardHeader,
  MetricCard,
  Badge,
  Button,
  Skeleton,
  EmptyState,
} from "@/components/ui";
import {
  idr,
  formatDate,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_TONE,
} from "@/lib/utils";
import { ReviewForm } from "@/features/catalog";
import { StarRating } from "@/features/catalog/StarRating";

export function BuyerDashboard() {
  const user = useAuthStore((s) => s.user);
  const roles = useAuthStore((s) => s.roles);
  const { data: wallet, isLoading: walletLoading } = useWallet();
  const { data: orders, isLoading: ordersLoading } = useBuyerOrders({
    page: 1,
  });
  const { data: summary } = useQuery({
    queryKey: qk.summary,
    queryFn: authApi.summary,
  });

  const recent = orders?.data.slice(0, 4) ?? [];
  const [reviewOpen, setReviewOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">
          Hello, {user?.username} 👋
        </h1>
        <p className="text-sm text-ink-500">
          Here's what's happening with your account.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {walletLoading ? (
          <Skeleton className="h-24" />
        ) : (
          <MetricCard
            label="Wallet balance"
            value={idr(wallet?.balance ?? 0)}
            tone="brand"
            icon={<WalletIcon />}
          />
        )}
        <MetricCard
          label="Total orders"
          value={orders?.pagination.total ?? 0}
          tone="ink"
          icon={<ListIcon />}
        />
        <MetricCard
          label="Roles owned"
          value={roles.length}
          delta={roles.join(" · ")}
          tone="coral"
          icon={<UserIcon />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent orders */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent orders"
            action={
              <Button variant="tertiary" size="sm">
                <Link to="/buyer/orders">View all →</Link>
              </Button>
            }
          />
          <CardBody className="space-y-3">
            {ordersLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))
            ) : recent.length === 0 ? (
              <EmptyState
                icon="🛒"
                title="No orders yet"
                description="Browse the marketplace and place your first order."
                action={
                  <Button size="sm">
                    <Link to="/buyer/products">Start shopping</Link>
                  </Button>
                }
              />
            ) : (
              recent.map((o) => (
                <Link
                  key={o.id}
                  to={`/buyer/orders/${o.id}`}
                  className="flex items-center justify-between rounded-xl border border-ink-100 p-4 transition-colors hover:bg-brand-50/40"
                >
                  <div>
                    <p className="font-medium text-ink-900">
                      Order #{o.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-ink-400">
                      {formatDate(o.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-ink-900">
                      {idr(o.total)}
                    </p>
                    <Badge tone={ORDER_STATUS_TONE[o.status]} className="mt-1">
                      {ORDER_STATUS_LABEL[o.status]}
                    </Badge>
                  </div>
                </Link>
              ))
            )}
          </CardBody>
        </Card>

        {/* Quick actions + role upsell */}
        <div className="space-y-4">
          <Card accent>
            <CardBody>
              <h3 className="font-display font-semibold text-ink-900">
                Quick actions
              </h3>
              <div className="mt-3 grid gap-2">
                <Button variant="secondary" fullWidth>
                  <Link to="/buyer/wallet" className="w-full">
                    Top up wallet
                  </Link>
                </Button>
                <Button variant="secondary" fullWidth>
                  <Link to="/buyer/addresses" className="w-full">
                    Manage addresses
                  </Link>
                </Button>
                <Button variant="secondary" fullWidth>
                  <Link to="/buyer/products" className="w-full">
                    Browse products
                  </Link>
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Rate the app */}
          <Card accent>
            <CardBody>
              <h3 className="font-display font-semibold text-ink-900">
                Enjoying SEAPEDIA?
              </h3>
              <p className="mt-1 text-sm text-ink-500">
                Share your experience — it helps others and helps us improve.
              </p>
              <div className="mt-3 flex items-center justify-between">
                <StarRating value={0} />
                <Button size="sm" onClick={() => setReviewOpen(true)}>
                  Write a review
                </Button>
              </div>
            </CardBody>
          </Card>

          {summary && !roles.includes("SELLER") && (
            <Card className="bg-gradient-to-br from-coral-500 to-coral-600 text-white">
              <CardBody>
                <h3 className="font-display font-semibold">
                  Open your own store
                </h3>
                <p className="mt-1 text-sm text-white/90">
                  Sell on SEAPEDIA and reach buyers across the marketplace.
                </p>
                <Button
                  variant="secondary"
                  className="mt-3 border-white/30 bg-white/10 text-white hover:bg-white/20"
                  fullWidth
                >
                  <Link to="/buyer/profile" className="w-full">
                    Get started
                  </Link>
                </Button>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      <ReviewForm open={reviewOpen} onClose={() => setReviewOpen(false)} />
    </div>
  );
}

function WalletIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 7h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM17 13h.01" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M8 6h12M8 12h12M8 18h12M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  );
}
