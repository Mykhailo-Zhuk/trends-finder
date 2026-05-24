"use client";

import { Star, ShoppingCart, ExternalLink } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice, formatOrders, truncate, cn } from "@/lib/utils";

interface ProductsTableProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

export function ProductsTable({ products, onSelect }: ProductsTableProps) {
  return (
    <div className="hidden md:block rounded-2xl border border-white/10 bg-white/6 backdrop-blur-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/8">
            {["Товар", "Ціна", "Рейтинг", "Замовлень", "Продавець", ""].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-medium text-white/35 uppercase tracking-wider font-display"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((product, i) => (
            <tr
              key={product.id}
              onClick={() => onSelect(product)}
              className={cn(
                "border-b border-white/5 cursor-pointer transition-colors duration-150",
                "hover:bg-white/6 animate-fade-in"
              )}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <td className="px-4 py-3 max-w-xs">
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "text-[9px] font-medium px-1.5 py-0.5 rounded-full border flex-shrink-0",
                      product.platform === "aliexpress"
                        ? "bg-orange-500/15 border-orange-400/30 text-orange-300"
                        : "bg-teal-500/15 border-teal-400/30 text-teal-300"
                    )}
                  >
                    {product.platform === "aliexpress" ? "AE" : "AB"}
                  </span>
                  <span className="text-white/80 text-xs font-body">
                    {truncate(product.title, 55)}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 font-mono text-teal-300 font-semibold whitespace-nowrap">
                {formatPrice(product.price, product.currency)}
              </td>
              <td className="px-4 py-3">
                <span className="flex items-center gap-1 text-white/70">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  {product.rating.toFixed(1)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="flex items-center gap-1 text-white/50 text-xs">
                  <ShoppingCart size={11} />
                  {formatOrders(product.orders)}
                </span>
              </td>
              <td className="px-4 py-3 text-white/40 text-xs">
                {truncate(product.seller, 24)}
              </td>
              <td className="px-4 py-3">
                <ExternalLink size={14} className="text-white/20 group-hover:text-teal-400" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
