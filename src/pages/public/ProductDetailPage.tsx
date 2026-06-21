import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Store, ArrowLeft } from "lucide-react";
import { useProduct } from "@features/product/hooks/useProducts";
import { StarRating } from "@components/shared/StarRating/StarRating";
import { Skeleton } from "@components/ui/Skeleton/Skeleton";
import { Button } from "@components/ui/Button/Button";
import { Badge } from "@components/ui/Badge/Badge";
import { formatRupiah } from "@utils/currency";
import { useAuth } from "@hooks/useAuth";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError } = useProduct(id);
  const { isAuthenticated, activeRole } = useAuth();

  if (isError)
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-slate-500">Produk tidak ditemukan.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/products">← Kembali</Link>
        </Button>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 mb-6 transition-colors"
      >
        <ArrowLeft size={15} /> Kembali ke Produk
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div>
          {isLoading ? (
            <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
          ) : (
            <img
              src={product!.imageUrl}
              alt={product!.name}
              className="w-full aspect-[4/3] object-cover rounded-2xl shadow-sm"
            />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-40" />
            </div>
          ) : (
            <>
              {/* Store info */}
              <Link
                to={`/stores/${product!.storeId}`}
                className="inline-flex items-center gap-2 text-sm text-teal-600 hover:underline w-fit"
              >
                <Store size={14} /> {product!.storeName}
              </Link>

              <h1 className="text-2xl font-bold font-display text-slate-800">
                {product!.name}
              </h1>

              <StarRating
                rating={product!.rating}
                count={product!.reviewCount}
              />

              <p className="text-3xl font-extrabold text-teal-700 font-display">
                {formatRupiah(product!.price)}
              </p>

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Stok:</span>
                {product!.stock > 0 ? (
                  <Badge color="green">{product!.stock} tersedia</Badge>
                ) : (
                  <Badge color="red">Habis</Badge>
                )}
              </div>

              <p className="text-slate-600 text-sm leading-relaxed">
                {product!.description}
              </p>

              {/* CTA */}
              {!isAuthenticated ? (
                <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 border border-slate-200">
                  <Link
                    to="/login"
                    className="text-teal-600 font-semibold hover:underline"
                  >
                    Masuk
                  </Link>{" "}
                  untuk menambah produk ke keranjang.
                </div>
              ) : activeRole === "BUYER" ? (
                <Button
                  size="lg"
                  leftIcon={<ShoppingCart size={18} />}
                  disabled={product!.stock === 0}
                >
                  {product!.stock === 0 ? "Stok Habis" : "Tambah ke Keranjang"}
                </Button>
              ) : (
                <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700 border border-blue-200">
                  Aktifkan peran <strong>Pembeli</strong> untuk berbelanja.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
