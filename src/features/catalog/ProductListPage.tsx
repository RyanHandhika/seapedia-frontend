import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "./hooks";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";
import { Button, Input, Pagination, EmptyState } from "@/components/ui";
import { useAuthStore } from "@/stores/authStore";
import { useAddToCart } from "@/features/buyer/hooks";
import { useDebounce } from "@/hooks/useDebounce";

// Shared by the public catalog (/products) and the buyer catalog
// (/buyer/products). The only difference is the link target + add-to-cart.
export function ProductListPage({ basePath = "/products" }: { basePath?: string }) {
  const navigate = useNavigate();
  const activeRole = useAuthStore((s) => s.activeRole);
  const isBuyer = activeRole === "BUYER";
  const addToCart = useAddToCart();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const debouncedSearch = useDebounce(search, 350);

  const { data, isLoading } = useProducts({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });

  const products = data?.data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink-900">Browse products</h1>
        <p className="text-sm text-ink-500">Fresh listings from stores across the marketplace.</p>
      </div>

      {/* Filters */}
      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <Input
          label="Search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          prefix={
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
            </svg>
          }
        />
        <Input
          label="Min price"
          type="number"
          placeholder="0"
          className="sm:w-28"
          value={minPrice}
          onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
        />
        <Input
          label="Max price"
          type="number"
          placeholder="∞"
          className="sm:w-28"
          value={maxPrice}
          onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon="🐟"
          title="No products found"
          description="Try a different search or widen your price range."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                to={`${basePath}/${p.id}`}
                footer={
                  isBuyer ? (
                    <Button
                      size="sm"
                      fullWidth
                      loading={addToCart.isPending && addToCart.variables?.productId === p.id}
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart.mutate({ productId: p.id, quantity: 1 });
                      }}
                    >
                      Add to cart
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" fullWidth onClick={() => navigate(`${basePath}/${p.id}`)}>
                      View
                    </Button>
                  )
                }
              />
            ))}
          </div>
          {data && (
            <Pagination
              page={page}
              totalPages={data.pagination.totalPages}
              total={data.pagination.total}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
