import { useState } from "react";
import {
  useSellerProducts, useCreateProduct, useUpdateProduct, useDeleteProduct,
} from "./hooks";
import {
  Card, CardBody, Button, Modal, Input, Textarea, Badge, Pagination,
  Skeleton, EmptyState, ConfirmModal, Table, type Column,
} from "@/components/ui";
import { idr } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import type { Product } from "@/types";

interface FormState {
  name: string;
  description: string;
  price: string;
  stock: string;
  isActive: boolean;
  image: File | null;
}
const EMPTY: FormState = { name: "", description: "", price: "", stock: "", isActive: true, image: null };

export function SellerProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 350);
  const { data, isLoading } = useSellerProducts({ page, search: debounced || undefined });

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [toDelete, setToDelete] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setModalOpen(true);
  }
  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description ?? "",
      price: String(p.price),
      stock: String(p.stock),
      isActive: p.isActive,
      image: null,
    });
    setModalOpen(true);
  }

  async function submit() {
    const fd = new FormData();
    fd.append("name", form.name);
    if (form.description) fd.append("description", form.description);
    fd.append("price", form.price);
    fd.append("stock", form.stock);
    if (editing) fd.append("isActive", String(form.isActive));
    if (form.image) fd.append("image", form.image);

    if (editing) {
      await updateProduct.mutateAsync({ id: editing.id, form: fd });
    } else {
      await createProduct.mutateAsync(fd);
    }
    setModalOpen(false);
    setForm(EMPTY);
  }

  const columns: Column<Product>[] = [
    {
      key: "name",
      header: "Product",
      render: (p) => (
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-brand-100 to-brand-50">
            {p.imageUrl ? <img src={p.imageUrl} alt="" className="h-full w-full rounded-lg object-cover" /> : "🐟"}
          </span>
          <span className="font-medium text-ink-900">{p.name}</span>
        </div>
      ),
    },
    { key: "price", header: "Price", render: (p) => idr(p.price) },
    { key: "stock", header: "Stock", render: (p) => p.stock },
    {
      key: "status",
      header: "Status",
      render: (p) => <Badge tone={p.isActive ? "green" : "gray"}>{p.isActive ? "Active" : "Hidden"}</Badge>,
    },
    {
      key: "actions",
      header: "",
      render: (p) => (
        <div className="flex justify-end gap-1">
          <Button size="sm" variant="ghost" onClick={() => openEdit(p)}>Edit</Button>
          <Button size="sm" variant="ghost" onClick={() => setToDelete(p.id)}>Delete</Button>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink-900">Products</h1>
        <Button onClick={openCreate}>+ Add product</Button>
      </div>

      <Card>
        <CardBody>
          <Input
            placeholder="Search your products…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            prefix={
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
              </svg>
            }
          />
        </CardBody>
      </Card>

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : !data || data.data.length === 0 ? (
        <EmptyState icon="📦" title="No products yet" description="Add your first product to start selling." action={<Button onClick={openCreate}>Add product</Button>} />
      ) : (
        <>
          <Table columns={columns} data={data.data} rowKey={(p) => p.id} />
          <Pagination page={page} totalPages={data.pagination.totalPages} total={data.pagination.total} onPageChange={setPage} />
        </>
      )}

      {/* Product form modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit product" : "Add product"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={submit} loading={createProduct.isPending || updateProduct.isPending} disabled={!form.name || !form.price || !form.stock}>
              {editing ? "Save changes" : "Create product"}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price (IDR)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files?.[0] ?? null })}
              className="block w-full text-sm text-ink-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-700"
            />
          </div>
          {editing && (
            <label className="flex items-center gap-2 text-sm text-ink-600">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-brand-500" />
              Active (visible to buyers)
            </label>
          )}
        </div>
      </Modal>

      <ConfirmModal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={async () => { if (toDelete) await deleteProduct.mutateAsync(toDelete); setToDelete(null); }}
        title="Delete product?"
        message="This product will be permanently removed from your store."
        confirmLabel="Delete"
        danger
        loading={deleteProduct.isPending}
      />
    </div>
  );
}
