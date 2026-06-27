import { Link } from "react-router-dom";
import type { Product } from "@/types";
import { idr } from "@/lib/utils";
import { Card } from "@/components/ui";

// Product card with the brand's "freshness" signature — a stock pill and a
// store tag. The image area uses a generated marine gradient when no image.
export function ProductCard({
  product,
  to,
  footer,
}: {
  product: Product;
  to: string;
  footer?: React.ReactNode;
}) {
  const low = product.stock > 0 && product.stock <= 5;
  return (
    <Card accent interactive className="group flex flex-col overflow-hidden">
      <Link to={to} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-brand-100 to-brand-50">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center text-brand-300">
              <svg viewBox="0 0 48 48" className="h-12 w-12" fill="currentColor" aria-hidden>
                <path d="M6 28c6-9 15-13 24-13 7 0 12 4 12 4s-3 9-13 13c-9 4-18 1-23-4z" opacity="0.5" />
                <circle cx="16" cy="23" r="2" />
              </svg>
            </div>
          )}
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-brand-700 backdrop-blur">
            {low ? `Only ${product.stock} left` : "In stock"}
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link to={to}>
          <h3 className="line-clamp-1 font-medium text-ink-900 group-hover:text-brand-700">
            {product.name}
          </h3>
        </Link>
        {product.store && (
          <p className="mt-0.5 line-clamp-1 text-xs text-ink-400">{product.store.storeName}</p>
        )}
        <p className="mt-2 font-display text-lg font-bold text-ink-900">{idr(product.price)}</p>
        {footer && <div className="mt-3">{footer}</div>}
      </div>
    </Card>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
      <div className="aspect-[4/3] animate-pulse bg-ink-100" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-ink-100" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-ink-100" />
        <div className="h-5 w-1/3 animate-pulse rounded bg-ink-100" />
      </div>
    </div>
  );
}
