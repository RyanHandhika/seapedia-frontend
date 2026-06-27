import { useState } from "react";
import { useWallet, useWalletTransactions, useTopup } from "./hooks";
import {
  Card, CardBody, CardHeader, Button, Modal, Input, Badge, Pagination,
  Skeleton, EmptyState,
} from "@/components/ui";
import { idr, formatDate, num } from "@/lib/utils";
import type { WalletTransactionType } from "@/types";

const TX_TONE: Record<WalletTransactionType, "green" | "red" | "blue"> = {
  TOPUP: "green",
  PAYMENT: "red",
  REFUND: "blue",
};
const QUICK = [50000, 100000, 250000, 500000];

export function WalletPage() {
  const { data: wallet, isLoading } = useWallet();
  const [page, setPage] = useState(1);
  const { data: tx, isLoading: txLoading } = useWalletTransactions(page);
  const topup = useTopup();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");

  async function submitTopup() {
    const value = Number(amount);
    if (!value || value <= 0) return;
    await topup.mutateAsync(value);
    setOpen(false);
    setAmount("");
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-900">Wallet</h1>

      {/* Balance card */}
      <Card className="overflow-hidden bg-gradient-to-br from-ink-800 to-ink-900 text-white">
        <CardBody className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-ink-300">Available balance</p>
            {isLoading ? (
              <Skeleton className="mt-1 h-10 w-48 bg-white/10" />
            ) : (
              <p className="mt-1 font-display text-4xl font-bold">{idr(wallet?.balance ?? 0)}</p>
            )}
          </div>
          <Button
            variant="secondary"
            className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            onClick={() => setOpen(true)}
          >
            + Top up
          </Button>
        </CardBody>
      </Card>

      {/* Transactions */}
      <Card>
        <CardHeader title="Transaction history" />
        <CardBody>
          {txLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
            </div>
          ) : !tx || tx.data.length === 0 ? (
            <EmptyState icon="💳" title="No transactions yet" description="Top up your wallet to get started." />
          ) : (
            <>
              <div className="divide-y divide-ink-100">
                {tx.data.map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Badge tone={TX_TONE[t.type]}>{t.type}</Badge>
                      <div>
                        <p className="text-sm text-ink-700">{t.description ?? t.type}</p>
                        <p className="text-xs text-ink-400">{formatDate(t.createdAt)}</p>
                      </div>
                    </div>
                    <p className={`font-display font-bold ${t.type === "PAYMENT" ? "text-coral-600" : "text-brand-600"}`}>
                      {t.type === "PAYMENT" ? "−" : "+"} {idr(num(t.amount))}
                    </p>
                  </div>
                ))}
              </div>
              {tx && (
                <Pagination page={page} totalPages={tx.pagination.totalPages} total={tx.pagination.total} onPageChange={setPage} />
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* Top-up modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Top up wallet"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submitTopup} loading={topup.isPending} disabled={!amount}>
              Top up {amount && idr(Number(amount))}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input
            label="Amount (IDR)"
            type="number"
            placeholder="100000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => setAmount(String(q))}
                className="rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-600 hover:border-brand-300 hover:text-brand-700"
              >
                {idr(q)}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
