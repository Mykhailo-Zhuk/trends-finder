"use client";

import { useState, useEffect } from "react";
import { X, Star, ShoppingCart, ExternalLink, Package, Tag } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice, formatOrders, cn } from "@/lib/utils";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [product]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div
        className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border border-white/12
          bg-[#0d1f1f]/95 backdrop-blur-xl shadow-2xl
          animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/8 border border-white/10
            hover:bg-white/15 transition-colors text-white/60 hover:text-white"
        >
          <X size={16} />
        </button>

        {/* Image */}
        <div className="relative h-56 bg-white/4 overflow-hidden">
          {!imgError && product.imageUrl && !product.imageUrl.includes("placeholder") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={52} className="text-white/10" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f1f]/90 to-transparent" />

          {/* Platform badge */}
          <div className="absolute bottom-3 left-4">
            <span
              className={cn(
                "text-xs font-medium px-2.5 py-1 rounded-full border",
                product.platform === "aliexpress"
                  ? "bg-orange-500/20 border-orange-400/40 text-orange-300"
                  : "bg-teal-500/20 border-teal-400/40 text-teal-300"
              )}
            >
              {product.platform === "aliexpress" ? "AliExpress" : "Alibaba"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          <div>
            <h2 className="text-base font-semibold text-white/95 leading-snug font-body">
              {product.title}
            </h2>
            <p className="mt-1 text-sm text-white/45">{product.seller}</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <Tag size={14} />, label: "Ціна", value: formatPrice(product.price, product.currency), color: "text-teal-300" },
              { icon: <Star size={14} className="text-amber-400" />, label: "Рейтинг", value: product.rating.toFixed(1), color: "text-white/90" },
              { icon: <ShoppingCart size={14} />, label: "Замовлень", value: formatOrders(product.orders), color: "text-white/90" },
            ].map(({ icon, label, value, color }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/6 border border-white/8">
                <div className="text-white/40">{icon}</div>
                <span className={cn("text-sm font-semibold font-mono", color)}>{value}</span>
                <span className="text-[10px] text-white/35">{label}</span>
              </div>
            ))}
          </div>

          {product.category && (
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Tag size={12} />
              <span>{product.category}</span>
            </div>
          )}

          {/* CTA */}
          <a
            href={product.productUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
              bg-teal-500/20 border border-teal-500/40 text-teal-300 text-sm font-medium
              hover:bg-teal-500/30 hover:border-teal-400/60 transition-all duration-150
              active:scale-[0.98]"
            onClick={(e) => !product.productUrl && e.preventDefault()}
          >
            <ExternalLink size={15} />
            Переглянути товар
          </a>
        </div>
      </div>
    </div>
  );
}
