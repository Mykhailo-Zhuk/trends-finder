import { cn } from "@/lib/utils";

function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      style={style}
      className={cn(
        "rounded-lg bg-white/6 relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-r",
        "before:from-transparent before:via-white/8 before:to-transparent",
        "before:animate-shimmer before:bg-[length:400px_100%]",
        className
      )}
    />
  );
}

export function ProductCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="flex flex-col rounded-2xl border border-white/8 bg-white/4 overflow-hidden
        animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Skeleton className="h-44 rounded-none" />
      <div className="p-3.5 flex flex-col gap-2.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2 mt-1" />
        <div className="flex justify-between mt-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-5 animate-fade-in">
      <Skeleton className="h-4 w-32 mb-4" />
      <div className="flex items-end gap-2 h-40">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1"
            style={{ height: `${30 + Math.random() * 70}%` } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-white/8">
        <Skeleton className="h-4 w-48" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-white/5">
          <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-16 flex-shrink-0" />
          <Skeleton className="h-4 w-12 flex-shrink-0 hidden sm:block" />
        </div>
      ))}
    </div>
  );
}
