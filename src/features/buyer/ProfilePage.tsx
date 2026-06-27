import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/auth";
import { useAuthStore } from "@/stores/authStore";
import {
  Card, CardBody, CardHeader, Button, Modal, Input, Textarea, Badge,
} from "@/components/ui";
import { ROLE_LABEL } from "@/lib/utils";
import { toast } from "@/stores/toastStore";
import { ApiException } from "@/api/client";

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const roles = useAuthStore((s) => s.roles);
  const refreshIdentity = useAuthStore((s) => s.refreshIdentity);
  const navigate = useNavigate();

  const [sellerModal, setSellerModal] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [storeDesc, setStoreDesc] = useState("");
  const [busy, setBusy] = useState(false);

  const isSeller = roles.includes("SELLER");
  const isDriver = roles.includes("DRIVER");

  async function becomeSeller() {
    setBusy(true);
    try {
      await authApi.becomeSeller({ storeName, description: storeDesc || undefined });
      await refreshIdentity();
      toast.success("Store opened! Switch to Seller mode to manage it.");
      setSellerModal(false);
    } catch (e) {
      toast.error(e instanceof ApiException ? e.message : "Could not open store");
    } finally {
      setBusy(false);
    }
  }

  async function becomeDriver() {
    setBusy(true);
    try {
      await authApi.becomeDriver();
      await refreshIdentity();
      toast.success("You're now a driver! Switch to Driver mode to take jobs.");
    } catch (e) {
      toast.error(e instanceof ApiException ? e.message : "Could not activate driver");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-900">Profile</h1>

      {/* Identity card */}
      <Card>
        <CardBody className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-500 font-display text-xl font-bold text-white">
            {user?.username?.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-ink-900">{user?.username}</p>
            <p className="text-sm text-ink-500">{user?.email}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {roles.map((r) => (
                <Badge key={r} tone={r === "ADMIN" ? "violet" : r === "SELLER" ? "red" : r === "DRIVER" ? "blue" : "green"}>
                  {ROLE_LABEL[r]}
                </Badge>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Role upgrades */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader title="Open a store" subtitle="Sell products on SEAPEDIA" />
          <CardBody>
            {isSeller ? (
              <Button variant="secondary" fullWidth onClick={() => navigate("/seller/dashboard")}>
                Go to store dashboard
              </Button>
            ) : (
              <Button fullWidth onClick={() => setSellerModal(true)}>Open store</Button>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Join as driver" subtitle="Earn by delivering orders" />
          <CardBody>
            {isDriver ? (
              <Button variant="secondary" fullWidth onClick={() => navigate("/driver/dashboard")}>
                Go to driver dashboard
              </Button>
            ) : (
              <Button fullWidth onClick={becomeDriver} loading={busy}>Become a driver</Button>
            )}
          </CardBody>
        </Card>
      </div>

      <Modal
        open={sellerModal}
        onClose={() => setSellerModal(false)}
        title="Open your store"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSellerModal(false)}>Cancel</Button>
            <Button onClick={becomeSeller} loading={busy} disabled={!storeName.trim()}>Open store</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Store name" placeholder="e.g. Samudera Fresh" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          <Textarea label="Description (optional)" value={storeDesc} onChange={(e) => setStoreDesc(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
