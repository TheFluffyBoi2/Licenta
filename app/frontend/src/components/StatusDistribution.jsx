import React, { useEffect, useState } from "react";

const STATUSES = [
  {
    key: "completed",
    label: "Completed",
    color: "#4ade80",
    textColor: "#14532d",
  },
  {
    key: "wishlists",
    label: "Wishlist",
    color: "#60a5fa",
    textColor: "#1e3a5f",
  },
  { key: "playing", label: "Playing", color: "#c084fc", textColor: "#4a044e" },
  { key: "dropped", label: "Dropped", color: "#f472b6", textColor: "#500724" },
];

const fmt = (n) => {
  if (!n) return "0";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "k";
  return String(n);
};

export const StatusDistribution = ({ stats }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!stats) return null;

  const total = STATUSES.reduce((sum, s) => sum + (stats[s.key] || 0), 0) || 1;

  return (
    <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl shadow-lg p-6">
      <h3 className="text-sm font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-4">
        Status Distribution
      </h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {STATUSES.map((s) => (
          <span
            key={s.key}
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: s.color, color: s.textColor }}
          >
            {s.label}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1 mb-4">
        {STATUSES.map((s) => (
          <div key={s.key} className="flex flex-col">
            <span className="text-sm font-bold" style={{ color: s.color }}>
              {fmt(stats[s.key])} Users
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Stacked bar */}
      <div className="h-2.5 rounded-full overflow-hidden flex bg-gray-200 dark:bg-[#2a2a2a]">
        {STATUSES.map((s) => (
          <div
            key={s.key}
            className="h-full transition-all duration-1000 ease-out"
            style={{
              width: animated
                ? `${((stats[s.key] || 0) / total) * 100}%`
                : "0%",
              background: s.color,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default StatusDistribution;
