import { Search, AlertTriangle, PackageSearch, Wifi } from "lucide-react";

export function EmptyState({ query }: { query?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="p-5 rounded-full bg-white/6 border border-white/10 mb-4">
        <PackageSearch size={32} className="text-white/25" />
      </div>
      <p className="text-white/50 font-body">
        {query ? `Нічого не знайдено за запитом «${query}»` : "Немає результатів"}
      </p>
      <p className="text-white/25 text-sm mt-1">Спробуйте інший запит або платформу</p>
    </div>
  );
}

export function InitialState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <div className="p-5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4">
        <Search size={32} className="text-teal-400/60" />
      </div>
      <p className="text-white/40 font-body">Введіть запит, щоб знайти трендові товари</p>
      <p className="text-white/20 text-sm mt-1">AliExpress · Alibaba · Актуальні дані</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const isRateLimit = message?.toLowerCase().includes("too many");

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="p-5 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
        {isRateLimit ? (
          <Wifi size={32} className="text-red-400/60" />
        ) : (
          <AlertTriangle size={32} className="text-red-400/60" />
        )}
      </div>
      <p className="text-white/60 font-body">
        {isRateLimit ? "Забагато запитів" : "Помилка завантаження"}
      </p>
      <p className="text-white/35 text-sm mt-1 max-w-xs">
        {message ?? "Сталася непередбачена помилка. Спробуйте ще раз."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 rounded-xl bg-white/8 border border-white/12
            text-white/60 text-sm hover:bg-white/14 hover:text-white/80 transition-all duration-150"
        >
          Спробувати знову
        </button>
      )}
    </div>
  );
}

export function DemoBanner() {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs animate-fade-in">
      <AlertTriangle size={13} className="flex-shrink-0" />
      <span>
        <strong>Demo mode</strong> — APIFY_API_TOKEN не встановлено. Показуються тестові дані.
      </span>
    </div>
  );
}
