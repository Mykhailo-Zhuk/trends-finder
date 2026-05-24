"use client";

import { useState, useCallback } from "react";
import { TrendingUp, LayoutGrid, Table2, BarChart2 } from "lucide-react";
import { SearchForm } from "@/components/SearchForm";
import { ProductCard } from "@/components/ProductCard";
import { ProductsTable } from "@/components/ProductsTable";
import { ProductModal } from "@/components/ProductModal";
import { Pagination } from "@/components/Pagination";
import { TopRatingChart, PriceRangeChart, PlatformChart } from "@/components/Charts";
import {
  ProductCardSkeleton,
  ChartSkeleton,
  TableSkeleton,
} from "@/components/Skeletons";
import { EmptyState, InitialState, ErrorState, DemoBanner } from "@/components/States";
import { useSearch } from "@/hooks/useSearch";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "table" | "charts";

export default function HomePage() {
  const { query, platform, page, setPage, search, data, isLoading, isFetching, error, refetch } = useSearch();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const handleSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const isInitial = !query;
  const isEmpty = !isLoading && data && data.products.length === 0;
  const hasData = !!data?.products?.length;
  const showSkeleton = isLoading && !data;

  const VIEW_MODES = [
    { id: "grid" as ViewMode, icon: <LayoutGrid size={15} />, label: "Картки" },
    { id: "table" as ViewMode, icon: <Table2 size={15} />, label: "Таблиця" },
    { id: "charts" as ViewMode, icon: <BarChart2 size={15} />, label: "Графіки" },
  ];

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 bg-[#071212] -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-teal-800/15 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="min-h-screen text-white font-body">
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* Header */}
          <header className="mb-8 animate-slide-up">
            <div className="flex items-center gap-3 mb-1.5">
              <div className="p-2 rounded-xl bg-teal-500/15 border border-teal-500/25">
                <TrendingUp size={20} className="text-teal-400" />
              </div>
              <h1 className="text-2xl font-bold font-display tracking-tight text-white/95">
                Trend Finder
              </h1>
            </div>
            <p className="text-sm text-white/35 ml-14">
              Дослідження трендових товарів · AliExpress & Alibaba
            </p>
          </header>

          {/* Search */}
          <div className="mb-6 animate-slide-up" style={{ animationDelay: "60ms" }}>
            <SearchForm
              onSearch={search}
              isLoading={isLoading || isFetching}
              defaultQuery={query}
              defaultPlatform={platform}
            />
          </div>

          {/* Demo banner */}
          {data?.demo && (
            <div className="mb-4">
              <DemoBanner />
            </div>
          )}

          {/* Results header + view toggle */}
          {(hasData || showSkeleton) && (
            <div className="flex items-center justify-between mb-4 animate-fade-in">
              <div className="text-sm text-white/40">
                {data && (
                  <>
                    <span className="text-white/70 font-medium">{data.total}</span> товарів
                    {data.totalPages > 1 && (
                      <span> · стор. {page}/{data.totalPages}</span>
                    )}
                  </>
                )}
              </div>

              <div className="flex gap-1 p-1 rounded-xl bg-white/6 border border-white/10">
                {VIEW_MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setViewMode(m.id)}
                    title={m.label}
                    className={cn(
                      "p-2 rounded-lg transition-all duration-150 text-xs",
                      viewMode === m.id
                        ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                        : "text-white/35 hover:text-white/60 hover:bg-white/6"
                    )}
                  >
                    {m.icon}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Initial state */}
          {isInitial && <InitialState />}

          {/* Error state */}
          {!isInitial && error && (
            <ErrorState
              message={error instanceof Error ? error.message : undefined}
              onRetry={() => refetch()}
            />
          )}

          {/* Empty state */}
          {!isInitial && isEmpty && <EmptyState query={query} />}

          {/* Grid view */}
          {viewMode === "grid" && (
            <>
              {showSkeleton && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <ProductCardSkeleton key={i} index={i} />
                  ))}
                </div>
              )}
              {hasData && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {data.products.map((product, i) => (
                    <ProductCard key={product.id} product={product} onClick={handleSelect} index={i} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Table view */}
          {viewMode === "table" && (
            <>
              {showSkeleton && <TableSkeleton />}
              {hasData && (
                <>
                  <ProductsTable products={data.products} onSelect={handleSelect} />
                  <div className="md:hidden grid grid-cols-2 gap-3">
                    {data.products.map((product, i) => (
                      <ProductCard key={product.id} product={product} onClick={handleSelect} index={i} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* Charts view */}
          {viewMode === "charts" && (
            <>
              {showSkeleton && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <ChartSkeleton key={i} />
                  ))}
                </div>
              )}
              {hasData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <TopRatingChart products={data.products} />
                  <PriceRangeChart products={data.products} />
                  <PlatformChart products={data.products} />
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {hasData && data.totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                page={page}
                totalPages={data.totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}

        </div>
      </div>

      {/* Product modal */}
      <ProductModal product={selectedProduct} onClose={handleCloseModal} />
    </>
  );
}
