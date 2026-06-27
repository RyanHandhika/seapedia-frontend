import { Link, useNavigate } from "react-router-dom";
import {
  useCart, useUpdateCartItem, useRemoveCartItem, useClearCart,
} from "./hooks";
import {
  Button, Card, CardBody, PageLoader, EmptyState, Badge,
} from "@/components/ui";
import { idr, num } from "@/lib/utils";

export function CartPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();

  if (isLoading) return <PageLoader />;

  const items = cart?.cartItems ?? [];
  const empty = items.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Your cart</h1>
          <p className="text-sm text-ink-500">
            {cart?.store ? `From ${cart.store.storeName}` : "One store per order"}
          </p>
        </div>
        {!empty && (
          <Button variant="ghost" size="sm" onClick={() => clearCart.mutate()} loading={clearCart.isPending}>
            Clear cart
          </Button>
        )}
      </div>

      {empty ? (
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          description="Add fresh products and they'll show up here."
          action={<Button><Link to="/buyer/products">Browse products</Link></Button>}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Items */}
          <div className="space-y-3 lg:col-span-2">
            {items.map((item) => {
              const p = item.product;
              const overStock = item.quantity > p.stock;
              return (
                <Card key={item.id}>
                  <CardBody className="flex gap-4">
                    <Link
                      to={`/buyer/products/${p.id}`}
                      className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-100 to-brand-50"
                    >
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-2xl">🐟</span>
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link to={`/buyer/products/${p.id}`} className="line-clamp-1 font-medium text-ink-900 hover:text-brand-600">
                            {p.name}
                          </Link>
                          <p className="text-sm text-ink-500">{idr(p.price)} each</p>
                        </div>
                        <button
                          onClick={() => removeItem.mutate(p.id)}
                          className="text-ink-300 hover:text-coral-500"
                          aria-label="Remove item"
                        >
                          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateItem.mutate({ productId: p.id, quantity: Math.max(1, item.quantity - 1) })}
                            disabled={item.quantity <= 1}
                            className="grid h-8 w-8 place-items-center rounded-lg border border-ink-200 text-ink-600 hover:bg-ink-50 disabled:opacity-40"
                            aria-label="Decrease"
                          >−</button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateItem.mutate({ productId: p.id, quantity: Math.min(p.stock, item.quantity + 1) })}
                            disabled={item.quantity >= p.stock}
                            className="grid h-8 w-8 place-items-center rounded-lg border border-ink-200 text-ink-600 hover:bg-ink-50 disabled:opacity-40"
                            aria-label="Increase"
                          >+</button>
                        </div>
                        <p className="font-display font-bold text-ink-900">
                          {idr(num(p.price) * item.quantity)}
                        </p>
                      </div>
                      {overStock && (
                        <Badge tone="red" className="mt-2">Only {p.stock} left — adjust quantity</Badge>
                      )}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>

          {/* Summary */}
          <div>
            <Card accent className="sticky top-20">
              <CardBody>
                <h3 className="font-display font-semibold text-ink-900">Order summary</h3>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-ink-500">Subtotal ({items.length} items)</span>
                  <span className="font-medium text-ink-900">{idr(cart?.subtotal ?? 0)}</span>
                </div>
                <p className="mt-1 text-xs text-ink-400">
                  Delivery fee, discount, and 12% PPN are calculated at checkout.
                </p>
                <Button className="mt-5" fullWidth size="lg" onClick={() => navigate("/buyer/checkout")}>
                  Proceed to checkout
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
