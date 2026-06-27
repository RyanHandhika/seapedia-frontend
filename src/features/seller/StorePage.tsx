import { useEffect, useState } from "react";
import { useSellerStore, useUpdateStore } from "./hooks";
import {
  Card, CardBody, CardHeader, Button, Input, Textarea, PageLoader, EmptyState,
} from "@/components/ui";
import { formatDate } from "@/lib/utils";

export function StorePage() {
  const { data: store, isLoading, isError } = useSellerStore();
  const updateStore = useUpdateStore();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    if (store) {
      setName(store.storeName);
      setDesc(store.description ?? "");
    }
  }, [store]);

  if (isLoading) return <PageLoader />;
  if (isError || !store) {
    return <EmptyState icon="🏪" title="No store found" description="Open a store from your buyer profile first." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-900">Store settings</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Store profile" subtitle="This is how buyers see your store" />
          <CardBody className="space-y-4">
            <Input label="Store name" value={name} onChange={(e) => setName(e.target.value)} />
            <Textarea label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
            <div className="flex justify-end">
              <Button
                onClick={() => updateStore.mutate({ storeName: name, description: desc })}
                loading={updateStore.isPending}
                disabled={!name.trim()}
              >
                Save changes
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Store info" />
          <CardBody className="space-y-3 text-sm">
            <div>
              <p className="text-ink-400">Store ID</p>
              <p className="font-mono text-xs text-ink-700">{store.id}</p>
            </div>
            <div>
              <p className="text-ink-400">Opened</p>
              <p className="text-ink-700">{formatDate(store.createdAt)}</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
