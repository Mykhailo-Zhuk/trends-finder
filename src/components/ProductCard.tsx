"use client";

import { useState } from "react";
import { Star, ShoppingCart, ExternalLink, Package } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice, formatOrders, truncate, cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  index: number;
}

export function ProductCard({ product, onClick, index }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => onClick(product)}
      className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/6 backdrop-blur-sm
        hover:bg-white/10 hover:border-teal-500/30 cursor-pointer
        transition-all duration-300 hover:shadow-lg hover:shadow-teal-900/20
        hover:-translate-y-0.5 overflow-hidden animate-slide-up"
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: "both" }}
    >
      {/* Platform badge */}
      <div className="absolute top-2.5 left-2.5 z-10">
        <span
          className={cn(
            "text-[10px] font-medium px-2 py-0.5 rounded-full border",
            product.platform === "aliexpress"
              ? "bg-orange-500/15 border-orange-400/30 text-orange-300"
              : "bg-teal-500/15 border-teal-400/30 text-teal-300"
          )}
        >
          {product.platform === "aliexpress" ? "AliExpress" : "Alibaba"}
        </span>
      </div>

      {/* Image */}
      <div className="relative h-44 bg-white/4 overflow-hidden flex-shrink-0">
        {!imgError && product.imageUrl && !product.imageUrl.includes("placeholder") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={36} className="text-white/15" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-3.5 flex-1">
        <h3 className="text-sm font-medium text-white/90 leading-snug font-body line-clamp-2 min-h-[2.6rem]">
          {truncate(product.title, 80)}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-white/40">
          <span className="truncate">{truncate(product.seller, 28)}</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-base font-semibold text-teal-300 font-mono">
            {formatPrice(product.price, product.currency)}
          </span>

          <div className="flex items-center gap-2 text-xs text-white/45">
            <span className="flex items-center gap-0.5">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              {product.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-0.5">
              <ShoppingCart size={11} />
              {formatOrders(product.orders)}
            </span>
          </div>
        </div>
      </div>

      {/* Hover overlay link indicator */}
      <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="p-1 rounded-lg bg-black/30 backdrop-blur-sm">
          <ExternalLink size={12} className="text-white/60" />
        </div>
      </div>
    </div>
  );
}
