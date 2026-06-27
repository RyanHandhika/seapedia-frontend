import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProduct } from "./hooks";
import {
  Badge,
  Button,
  Card,
  CardBody,
  PageLoader,
  EmptyState,
} from "@/components/ui";
import { idr, num } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useAddToCart } from "@/features/buyer/hooks";
import { toast } from "@/stores/toastStore";

export function ProductDetailPage({
  basePath = "/products",
}: {
  basePath?: string;
}) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(id);
  const status = useAuthStore((s) => s.status);
  const roles = useAuthStore((s) => s.roles);
  const activeRole = useAuthStore((s) => s.activeRole);
  const switchRole = useAuthStore((s) => s.switchRole);
  const addToCart = useAddToCart();
  const [qty, setQty] = useState(1);
  const [switching, setSwitching] = useState(false);

  const isLoggedIn = status === "authenticated";
  const isBuyer = activeRole === "BUYER";
  const canBecomeBuyer = roles.includes("BUYER"); // seller/driver juga punya BUYER

  // Pindah ke mode buyer lalu user bisa langsung belanja (tanpa logout-login).
  async function switchToBuyer() {
    setSwitching(true);
    try {
      await switchRole("BUYER");
      toast.success("Switched to buyer mode — happy shopping!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not switch role");
    } finally {
      setSwitching(false);
    }
  }

  if (isLoading) return <PageLoader />;
  if (isError || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon="🔍"
          title="Product not found"
          description="It may have been removed or is no longer available."
          action={
            <Button onClick={() => navigate(basePath)}>Back to browse</Button>
          }
        />
      </div>
    );
  }

  const stock = product.stock;
  const inStock = stock > 0;
  const lineTotal = num(product.price) * qty;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <nav className="mb-5 text-sm text-ink-400">
        <Link to={basePath} className="hover:text-brand-600">
          Browse
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-600">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-ink-100 bg-gradient-to-br from-brand-100 to-brand-50">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-brand-300">
                <svg
                  viewBox="0 0 64 64"
                  className="h-20 w-20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    d="M8 38c8-12 20-17 32-17 9 0 16 5 16 5s-4 12-17 17c-12 5-24 1-31-5z"
                    opacity="0.5"
                  />
                  <circle cx="22" cy="31" r="3" />
                </svg>
              </div>
            )}
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 backdrop-blur">
              {inStock ? "Fresh · in stock" : "Out of stock"}
            </span>
          </div>
        </div>

        {/* Details */}
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-900">
            {product.name}
          </h1>
          {product.store && (
            <Link
              to={`${basePath}?storeId=${product.store.id}`}
              className="mt-2 inline-flex items-center gap-2 text-sm text-ink-500 hover:text-brand-600"
            >
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-ink-100 text-xs font-bold">
                {product.store.storeName.slice(0, 1)}
              </span>
              {product.store.storeName}
            </Link>
          )}

          <p className="mt-5 font-display text-3xl font-bold text-ink-900">
            {idr(product.price)}
          </p>
          <div className="mt-2">
            <Badge tone={inStock ? "green" : "red"}>
              {inStock ? `${stock} units available` : "Sold out"}
            </Badge>
          </div>

          {product.description && (
            <div className="mt-6">
              <h3 className="mb-1 text-sm font-semibold text-ink-700">
                Description
              </h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink-600">
                {product.description}
              </p>
            </div>
          )}

          {/* Purchase box */}
          <Card className="mt-6" accent>
            <CardBody>
              {isBuyer ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-ink-700">
                      Quantity
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-ink-200 text-ink-600 hover:bg-ink-50"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium">{qty}</span>
                      <button
                        onClick={() => setQty((q) => Math.min(stock, q + 1))}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-ink-200 text-ink-600 hover:bg-ink-50"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4">
                    <span className="text-sm text-ink-500">Subtotal</span>
                    <span className="font-display text-lg font-bold text-ink-900">
                      {idr(lineTotal)}
                    </span>
                  </div>
                  <Button
                    className="mt-4"
                    fullWidth
                    size="lg"
                    disabled={!inStock}
                    loading={addToCart.isPending}
                    onClick={() =>
                      addToCart.mutate({ productId: product.id, quantity: qty })
                    }
                  >
                    {inStock ? "Add to cart" : "Out of stock"}
                  </Button>
                </>
              ) : !isLoggedIn ? (
                // Belum login → arahkan ke login
                <div className="text-center">
                  <p className="text-sm text-ink-500">
                    Log in as a buyer to purchase this item.
                  </p>
                  <Button
                    className="mt-3"
                    fullWidth
                    onClick={() => navigate("/auth/login")}
                  >
                    Log in to buy
                  </Button>
                </div>
              ) : canBecomeBuyer ? (
                // Login & punya role buyer, tapi sedang aktif sbg seller/driver
                // → tawarkan switch ke buyer agar bisa belanja.
                <div className="text-center">
                  <p className="text-sm text-ink-500">
                    You're in {activeRole?.toLowerCase()} mode. Switch to buyer
                    to purchase.
                  </p>
                  <Button
                    className="mt-3"
                    fullWidth
                    loading={switching}
                    onClick={switchToBuyer}
                  >
                    Switch to buyer to purchase
                  </Button>
                </div>
              ) : (
                // Login tapi tidak punya role buyer sama sekali (mis. admin)
                <div className="text-center">
                  <p className="text-sm text-ink-500">
                    Purchasing is available for buyer accounts.
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
