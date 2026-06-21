import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { formatRupiah } from "@utils/currency";
import { StarRating } from "../StarRating/StarRating";
import type { Product } from "@features/product/types/product.types";
import { cn } from "@utils/cn";

interface ProductCardProps {
  product: Product;
  showAddCart?: boolean; // Show "Add to cart" button (only for logged-in buyers)
  onAddCart?: (product: Product) => void;
}

export function ProductCard({
  product,
  showAddCart = false,
  onAddCart,
}: ProductCardProps) {
  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col">
      {/* Image */}
      <Link
        to={`/products/${product.id}`}
        className="relative block overflow-hidden aspect-[4/3]"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Store badge overlaid on image */}
        <span className="absolute bottom-2 left-2 bg-teal-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
          {product.storeName}
        </span>
        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">Stok Habis</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link
          to={`/products/${product.id}`}
          className="hover:text-teal-600 transition-colors"
        >
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        <p className="text-base font-bold text-teal-700 font-display">
          {formatRupiah(product.price)}
        </p>

        <StarRating
          rating={product.rating}
          count={product.reviewCount}
          size="sm"
        />

        {/* Add to cart — visible on mobile always, on desktop via hover */}
        {showAddCart && product.stock > 0 && (
          <button
            onClick={() => onAddCart?.(product)}
            className={cn(
              "mt-auto flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-medium",
              "bg-teal-50 text-teal-700 border border-teal-200",
              "hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all duration-150",
              // Desktop: only show on hover
              "opacity-100 md:opacity-0 md:group-hover:opacity-100",
            )}
          >
            <ShoppingCart size={15} />
            Tambah ke Keranjang
          </button>
        )}
      </div>
    </div>
  );
}
