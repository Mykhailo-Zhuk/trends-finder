"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Loader2 } from "lucide-react";
import { searchFormSchema, type SearchFormValues } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const PLATFORMS = [
  { value: "both", label: "Обидві" },
  { value: "aliexpress", label: "AliExpress" },
  { value: "alibaba", label: "Alibaba" },
] as const;

interface SearchFormProps {
  onSearch: (query: string, platform: string) => void;
  isLoading?: boolean;
  defaultQuery?: string;
  defaultPlatform?: string;
}

export function SearchForm({
  onSearch,
  isLoading,
  defaultQuery = "",
  defaultPlatform = "both",
}: SearchFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: { query: defaultQuery, platform: defaultPlatform as SearchFormValues["platform"] },
  });

  const platform = watch("platform");

  function onSubmit(data: SearchFormValues) {
    onSearch(data.query, data.platform);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex flex-col gap-3">
        {/* Search input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400">
            <Search size={18} />
          </div>
          <input
            {...register("query")}
            type="text"
            placeholder="Знайти трендовий товар..."
            autoComplete="off"
            className={cn(
              "w-full pl-11 pr-4 py-3.5 rounded-2xl",
              "bg-white/8 backdrop-blur-sm border",
              "text-white placeholder:text-white/35 text-sm font-body",
              "focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50",
              "transition-all duration-200",
              errors.query
                ? "border-red-400/50 focus:ring-red-400/30"
                : "border-white/10 hover:border-white/20"
            )}
          />
          {errors.query && (
            <p className="mt-1.5 text-xs text-red-400 pl-1">
              {errors.query.message}
            </p>
          )}
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          {/* Platform toggle */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/6 border border-white/10 flex-1 min-w-fit">
            {PLATFORMS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setValue("platform", p.value)}
                className={cn(
                  "flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                  platform === p.value
                    ? "bg-teal-500/25 text-teal-300 border border-teal-500/40 shadow-inner"
                    : "text-white/50 hover:text-white/80 hover:bg-white/6"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium",
              "bg-teal-500/20 border border-teal-500/40 text-teal-300",
              "hover:bg-teal-500/30 hover:border-teal-400/60",
              "focus:outline-none focus:ring-2 focus:ring-teal-500/40",
              "active:scale-[0.98] transition-all duration-150",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "whitespace-nowrap"
            )}
          >
            {isLoading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Search size={15} />
            )}
            {isLoading ? "Пошук..." : "Шукати"}
          </button>
        </div>
      </div>
    </form>
  );
}
