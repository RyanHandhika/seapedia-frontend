import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCart, useAddresses, useCheckoutPreview, useConfirmCheckout,
} from "./hooks";
import {
  Button, Card, CardBody, Input, PageLoader, EmptyState, Badge,
} from "@/components/ui";
import {
  idr, DELIVERY_LABEL, DELIVERY_FEE,
} from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { buyerApi } from "@/api/buyer";
import { toast } from "@/stores/toastStore";
import { ApiException } from "@/api/client";
import type { DeliveryMethod, DiscountValidation } from "@/types";

const METHODS: DeliveryMethod[] = ["INSTANT", "NEXT_DAY", "REGULAR"];

export function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: addresses, isLoading: addrLoading } = useAddresses();
  const preview = useCheckoutPreview();
  const confirm = useConfirmCheckout();

  const [addressId, setAddressId] = useState<string>("");
  const [method, setMethod] = useState<DeliveryMethod>("REGULAR");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState<DiscountValidation | null>(null);
  const debouncedCode = useDebounce(code, 400);

  const subtotal = cart?.subtotal ?? 0;

  // Default to the default address once loaded.
  useEffect(() => {
    if (!addressId && addresses?.length) {
      setAddressId(addresses.find((a) => a.isDefault)?.id ?? addresses[0].id);
    }
  }, [addresses, addressId]);

  // Live discount validation as the buyer types a code.
  useEffect(() => {
    if (!debouncedCode || subtotal <= 0) {
      setDiscount(null);
      return;
    }
    let cancelled = false;
    buyerApi
      .validateDiscount(debouncedCode, subtotal)
      .then((res) => !cancelled && setDiscount(res))
      .catch(() => !cancelled && setDiscount({ valid: false, reason: "Could not validate code" }));
    return () => { cancelled = true; };
  }, [debouncedCode, subtotal]);

  // Compute the live preview whenever inputs change.
  const previewBody = useMemo(
    () => ({
      addressId,
      deliveryMethod: method,
      discountCode: discount?.valid ? debouncedCode : undefined,
    }),
    [addressId, method, discount, debouncedCode],
  );

  useEffect(() => {
    if (!addressId || subtotal <= 0) return;
    preview.mutate(previewBody);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressId, method, discount?.valid, debouncedCode]);

  if (cartLoading || addrLoading) return <PageLoader />;

  if (!cart || cart.cartItems.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="Nothing to checkout"
        description="Your cart is empty."
        action={<Button onClick={() => navigate("/buyer/products")}>Browse products</Button>}
      />
    );
  }

  if (!addresses || addresses.length === 0) {
    return (
      <EmptyState
        icon="📍"
        title="Add a delivery address"
        description="You need at least one address before checking out."
        action={<Button onClick={() => navigate("/buyer/addresses")}>Add address</Button>}
      />
    );
  }

  const totals = preview.data;

  async function placeOrder() {
    try {
      const order = await confirm.mutateAsync(previewBody);
      toast.success("Order placed successfully!");
      navigate(`/buyer/orders/${order.id}`);
    } catch (e) {
      toast.error(e instanceof ApiException ? e.message : "Checkout failed");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-900">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Address */}
          <Card>
            <CardBody>
              <h3 className="font-display font-semibold text-ink-900">Delivery address</h3>
              <div className="mt-3 space-y-2">
                {addresses.map((a) => (
                  <label
                    key={a.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                      addressId === a.id ? "border-brand-400 bg-brand-50/50" : "border-ink-200 hover:bg-ink-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={addressId === a.id}
                      onChange={() => setAddressId(a.id)}
                      className="mt-1 accent-brand-500"
                    />
                    <div>
                      <p className="font-medium text-ink-900">
                        {a.label} {a.isDefault && <Badge tone="brand" className="ml-1">Default</Badge>}
                      </p>
                      <p className="text-sm text-ink-500">{a.recipientName} · {a.phone}</p>
                      <p className="text-sm text-ink-500">{a.fullAddress}</p>
                    </div>
                  </label>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Delivery method */}
          <Card>
            <CardBody>
              <h3 className="font-display font-semibold text-ink-900">Delivery method</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {METHODS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`rounded-xl border p-3 text-left transition-colors ${
                      method === m ? "border-brand-400 bg-brand-50/50" : "border-ink-200 hover:bg-ink-50"
                    }`}
                  >
                    <p className="text-sm font-medium text-ink-900">{DELIVERY_LABEL[m]}</p>
                    <p className="mt-1 font-display font-bold text-brand-600">{idr(DELIVERY_FEE[m])}</p>
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Discount */}
          <Card>
            <CardBody>
              <h3 className="font-display font-semibold text-ink-900">Discount code</h3>
              <div className="mt-3">
                <Input
                  placeholder="e.g. SAVE10, FLAT25K, PROMO15"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
                {discount && (
                  <div className="mt-2">
                    {discount.valid ? (
                      <Badge tone="green">
                        ✓ {discount.type} applied — {idr(discount.discountAmount ?? 0)} off
                      </Badge>
                    ) : (
                      <Badge tone="red">{discount.reason}</Badge>
                    )}
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Summary */}
        <div>
          <Card accent className="sticky top-20">
            <CardBody>
              <h3 className="font-display font-semibold text-ink-900">Payment summary</h3>
              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Subtotal" value={idr(totals?.subtotal ?? subtotal)} />
                {totals && totals.discountAmount > 0 && (
                  <Row label="Discount" value={`− ${idr(totals.discountAmount)}`} tone="brand" />
                )}
                <Row label="Delivery fee" value={idr(totals?.deliveryFee ?? DELIVERY_FEE[method])} />
                <Row label="PPN (12%)" value={idr(totals?.ppnAmount ?? 0)} />
                <div className="border-t border-ink-100 pt-2">
                  <Row label="Total" value={idr(totals?.total ?? 0)} bold />
                </div>
              </dl>
              <Button
                className="mt-5"
                fullWidth
                size="lg"
                loading={confirm.isPending}
                disabled={!addressId || !totals}
                onClick={placeOrder}
              >
                Place order & pay
              </Button>
              <p className="mt-2 text-center text-xs text-ink-400">
                Paid instantly from your wallet balance.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, tone }: { label: string; value: string; bold?: boolean; tone?: "brand" }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={bold ? "font-semibold text-ink-900" : "text-ink-500"}>{label}</dt>
      <dd className={`${bold ? "font-display text-lg font-bold text-ink-900" : tone === "brand" ? "text-brand-600" : "text-ink-900"}`}>
        {value}
      </dd>
    </div>
  );
}
