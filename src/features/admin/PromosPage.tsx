import { useState } from "react";
import { useAdminPromos, useCreatePromo } from "./hooks";
import {
  Button, Modal, Input, Select, Textarea, Badge, Pagination,
  Table, type Column,
} from "@/components/ui";
import { idr, formatDate, num } from "@/lib/utils";
import type { Promo } from "@/types";

export function AdminPromosPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminPromos(page);
  const createPromo = useCreatePromo();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", discountType: "PERCENT", value: "", expiryDate: "", description: "" });

  async function submit() {
    await createPromo.mutateAsync({
      code: form.code,
      discountType: form.discountType as "PERCENT" | "FIXED",
      value: Number(form.value),
      expiryDate: new Date(form.expiryDate).toISOString(),
      description: form.description || undefined,
    });
    setOpen(false);
    setForm({ code: "", discountType: "PERCENT", value: "", expiryDate: "", description: "" });
  }

  const columns: Column<Promo>[] = [
    { key: "code", header: "Code", render: (p) => <span className="font-mono font-medium text-ink-900">{p.code}</span> },
    { key: "type", header: "Type", render: (p) => <Badge tone="coral">{p.discountType}</Badge> },
    { key: "value", header: "Value", render: (p) => p.discountType === "PERCENT" ? `${num(p.value)}%` : idr(p.value) },
    { key: "desc", header: "Description", render: (p) => <span className="text-ink-500">{p.description ?? "—"}</span> },
    { key: "expiry", header: "Expires", render: (p) => <span className="text-ink-500">{formatDate(p.expiryDate)}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink-900">Promos</h1>
        <Button onClick={() => setOpen(true)}>+ Create promo</Button>
      </div>

      <Table columns={columns} data={data?.data ?? []} isLoading={isLoading} rowKey={(p) => p.id} />
      {data && <Pagination page={page} totalPages={data.pagination.totalPages} total={data.pagination.total} onPageChange={setPage} />}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create promo"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} loading={createPromo.isPending} disabled={!form.code || !form.value || !form.expiryDate}>Create</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Code" placeholder="PROMO20" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Discount type" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
              <option value="PERCENT">Percent (%)</option>
              <option value="FIXED">Fixed (IDR)</option>
            </Select>
            <Input label="Value" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          </div>
          <Input label="Expiry date" type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
          <Textarea label="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}
