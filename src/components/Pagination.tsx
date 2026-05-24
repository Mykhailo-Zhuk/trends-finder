"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <div className="flex items-center justify-center gap-1.5 py-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-xl bg-white/6 border border-white/10 text-white/50
          hover:bg-white/12 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed
          transition-all duration-150"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={cn(
            "w-9 h-9 rounded-xl text-sm font-medium transition-all duration-150",
            p === page
              ? "bg-teal-500/25 border border-teal-500/40 text-teal-300"
              : "bg-white/6 border border-white/10 text-white/45 hover:bg-white/12 hover:text-white/70"
          )}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded-xl bg-white/6 border border-white/10 text-white/50
          hover:bg-white/12 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed
          transition-all duration-150"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
