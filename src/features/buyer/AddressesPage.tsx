import { useState } from "react";
import { useAddresses, useCreateAddress, useDeleteAddress } from "./hooks";
import {
  Card,
  CardBody,
  Button,
  Modal,
  Input,
  Textarea,
  Badge,
  Skeleton,
  EmptyState,
  ConfirmModal,
} from "@/components/ui";

const EMPTY = {
  label: "",
  recipientName: "",
  phone: "",
  fullAddress: "",
  isDefault: false,
};

export function AddressesPage() {
  const { data: addresses, isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const deleteAddress = useDeleteAddress();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [toDelete, setToDelete] = useState<string | null>(null);

  async function submit() {
    await createAddress.mutateAsync(form);
    setOpen(false);
    setForm(EMPTY);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink-900">
          Addresses
        </h1>
        <Button onClick={() => setOpen(true)}>+ Add address</Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : !addresses || addresses.length === 0 ? (
        <EmptyState
          icon="📍"
          title="No addresses yet"
          description="Add a delivery address to start ordering."
          action={<Button onClick={() => setOpen(true)}>Add address</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <Card key={a.id} accent={a.isDefault}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-ink-900">
                      {a.label}{" "}
                      {a.isDefault && (
                        <Badge tone="brand" className="ml-1">
                          Default
                        </Badge>
                      )}
                    </p>
                    <p className="mt-1 text-sm text-ink-500">
                      {a.recipientName} · {a.phone}
                    </p>
                    <p className="text-sm text-ink-500">{a.fullAddress}</p>
                  </div>
                  {!a.isDefault && (
                    <button
                      onClick={() => setToDelete(a.id)}
                      className="text-ink-300 hover:text-coral-500"
                      aria-label="Delete address"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                      </svg>
                    </button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add address"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit} loading={createAddress.isPending}>
              Save address
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input
            label="Label"
            placeholder="Home, Office…"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
          />
          <Input
            label="Recipient name"
            value={form.recipientName}
            onChange={(e) =>
              setForm({ ...form, recipientName: e.target.value })
            }
          />
          <Input
            label="Phone"
            placeholder="08123456789"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Textarea
            label="Full address"
            value={form.fullAddress}
            onChange={(e) => setForm({ ...form, fullAddress: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) =>
                setForm({ ...form, isDefault: e.target.checked })
              }
              className="accent-brand-500"
            />
            Set as default address
          </label>
        </div>
      </Modal>

      <ConfirmModal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (toDelete) await deleteAddress.mutateAsync(toDelete);
          setToDelete(null);
        }}
        title="Delete address?"
        message="This address will be permanently removed."
        confirmLabel="Delete"
        danger
        loading={deleteAddress.isPending}
      />
    </div>
  );
}
