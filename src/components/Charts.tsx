"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { Product } from "@/types";
import { getPriceRanges, truncate } from "@/lib/utils";

interface ChartsProps {
  products: Product[];
}

const TEAL_SHADES = ["#05c8b6", "#00a196", "#1de4cf", "#057f78", "#0a6460"];
const PLATFORM_COLORS = { aliexpress: "#fb923c", alibaba: "#05c8b6" };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a1a1a]/95 border border-white/15 rounded-xl px-3 py-2 text-xs backdrop-blur-sm shadow-xl">
      <p className="text-white/60 mb-1">{label}</p>
      {payload.map((p: { name: string; value: number; color: string }, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <span className="font-mono font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export function TopRatingChart({ products }: ChartsProps) {
  const top = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8)
    .map((p) => ({ name: truncate(p.title, 22), rating: +p.rating.toFixed(1) }));

  if (!top.length) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 backdrop-blur-sm p-5">
      <h3 className="text-sm font-semibold text-white/70 mb-4 font-display tracking-wide uppercase text-xs">
        Топ за рейтингом
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={top} margin={{ top: 4, right: 4, bottom: 40, left: -20 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            domain={[3.5, 5]}
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="rating" name="Рейтинг" radius={[6, 6, 0, 0]}>
            {top.map((_, i) => (
              <Cell key={i} fill={TEAL_SHADES[i % TEAL_SHADES.length]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PriceRangeChart({ products }: ChartsProps) {
  const ranges = getPriceRanges(products.map((p) => p.price));

  if (!ranges.length) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 backdrop-blur-sm p-5">
      <h3 className="text-xs font-semibold text-white/70 mb-4 font-display tracking-wide uppercase">
        Ціновий діапазон
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={ranges} margin={{ top: 4, right: 4, bottom: 10, left: -20 }}>
          <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="count" name="Товарів" fill="#05c8b6" fillOpacity={0.75} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PlatformChart({ products }: ChartsProps) {
  const ae = products.filter((p) => p.platform === "aliexpress").length;
  const ab = products.filter((p) => p.platform === "alibaba").length;

  if (ae === 0 || ab === 0) return null;

  const data = [
    { name: "AliExpress", value: ae },
    { name: "Alibaba", value: ab },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 backdrop-blur-sm p-5">
      <h3 className="text-xs font-semibold text-white/70 mb-2 font-display tracking-wide uppercase">
        Розподіл платформ
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={PLATFORM_COLORS[entry.name === "AliExpress" ? "aliexpress" : "alibaba"]}
                fillOpacity={0.8}
              />
            ))}
          </Pie>
          <Legend
            formatter={(v) => <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{v}</span>}
          />
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
