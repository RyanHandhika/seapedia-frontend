import { useState } from "react";
import { useAdminVouchers, useCreateVoucher } from "./hooks";
import {
  Card, CardBody, Button, Modal, Input, Select, Badge, Pagination,
  Table, type Column,
} from "@/components/ui";
import { idr, formatDate, num } from "@/lib/utils";
import type { Voucher } from "@/types";

export function AdminVouchersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminVouchers(page);
  const createVoucher = useCreateVoucher();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", discountType: "PERCENT", value: "", expiryDate: "", usageLimit: "" });

  async function submit() {
    await createVoucher.mutateAsync({
      code: form.code,
      discountType: form.discountType as "PERCENT" | "FIXED",
      value: Number(form.value),
      expiryDate: new Date(form.expiryDate).toISOString(),
      usageLimit: Number(form.usageLimit),
    });
    setOpen(false);
    setForm({ code: "", discountType: "PERCENT", value: "", expiryDate: "", usageLimit: "" });
  }

  const columns: Column<Voucher>[] = [
    { key: "code", header: "Code", render: (v) => <span className="font-mono font-medium text-ink-900">{v.code}</span> },
    { key: "type", header: "Type", render: (v) => <Badge tone="brand">{v.discountType}</Badge> },
    { key: "value", header: "Value", render: (v) => v.discountType === "PERCENT" ? `${num(v.value)}%` : idr(v.value) },
    { key: "usage", header: "Usage", render: (v) => `${v.usedCount}/${v.usageLimit}` },
    { key: "expiry", header: "Expires", render: (v) => <span className="text-ink-500">{formatDate(v.expiryDate)}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink-900">Vouchers</h1>
        <Button onClick={() => setOpen(true)}>+ Create voucher</Button>
      </div>

      <Table columns={columns} data={data?.data ?? []} isLoading={isLoading} rowKey={(v) => v.id} />
      {data && <Pagination page={page} totalPages={data.pagination.totalPages} total={data.pagination.total} onPageChange={setPage} />}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create voucher"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} loading={createVoucher.isPending} disabled={!form.code || !form.value || !form.expiryDate || !form.usageLimit}>
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Code" placeholder="SAVE20" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Discount type" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
              <option value="PERCENT">Percent (%)</option>
              <option value="FIXED">Fixed (IDR)</option>
            </Select>
            <Input label="Value" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Expiry date" type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
            <Input label="Usage limit" type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
