// src/pages/public/ProductListPage.tsx
import React, { useState } from "react";
import { Search } from "lucide-react";
import { useProducts } from "@features/product/hooks/useProducts";
import { ProductCard } from "@components/shared/ProductCard/ProductCard";
import { ProductCardSkeleton } from "@components/ui/Skeleton/Skeleton";
import { EmptyState } from "@components/ui/EmptyState/EmptyState";
import { Button } from "@components/ui/Button/Button";
import { useDebounce } from "@/hooks/useDebounce";

// Simple pagination component (inline for this page)
function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center gap-2 justify-center mt-10">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        ← Prev
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-teal-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
        >
          {p}
        </button>
      ))}
      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next →
      </Button>
    </div>
  );
}

export default function ProductListPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<
    "relevance" | "price_asc" | "price_desc" | "rating"
  >("relevance");
  const [page, setPage] = useState(1);

  // Debounce search — wait 400ms after user stops typing before fetching
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useProducts({
    search: debouncedSearch,
    sortBy,
    page,
    limit: 12,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on new search
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold font-display text-slate-800 mb-8">
        Semua Produk
      </h1>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={handleSearch}
            placeholder="Cari produk, toko, atau kategori..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          />
        </div>
        <Button
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value as typeof sortBy);
            setPage(1);
          }}
          className="w-full sm:w-48"
        >
          <option value="relevance">Paling Relevan</option>
          <option value="price_asc">Harga: Terendah</option>
          <option value="price_desc">Harga: Tertinggi</option>
          <option value="rating">Rating Terbaik</option>
        </Button>
      </div>

      {/* Result count */}
      {!isLoading && data && (
        <p className="text-sm text-slate-500 mb-5">
          Menampilkan{" "}
          <span className="font-medium text-slate-700">
            {data.items.length}
          </span>{" "}
          dari <span className="font-medium text-slate-700">{data.total}</span>{" "}
          produk
          {debouncedSearch && (
            <>
              {" "}
              untuk "<span className="text-teal-600">{debouncedSearch}</span>"
            </>
          )}
        </p>
      )}

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))
        ) : data?.items.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={<Search size={40} />}
              title="Produk tidak ditemukan"
              description={`Tidak ada produk untuk "${debouncedSearch}". Coba kata kunci lain.`}
            />
          </div>
        ) : (
          data?.items.map((p) => <ProductCard key={p.id} product={p} />)
        )}
      </div>

      <Pagination
        page={page}
        totalPages={data?.totalPages ?? 1}
        onChange={setPage}
      />
    </div>
  );
}
