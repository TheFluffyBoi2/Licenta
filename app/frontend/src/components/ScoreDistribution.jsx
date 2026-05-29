// ScoreDistribution.jsx
import React, { useEffect, useState } from "react";

const BAR_COLORS = ["#f87171", "#fb923c", "#facc15", "#4ade80", "#34d399"];

export const ScoreDistribution = ({ reviews }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl shadow-lg p-6 flex items-center justify-center">
        <p className="text-gray-400 text-sm">No reviews yet.</p>
      </div>
    );
  }

  // Count ratings 1–5 (review.rating este 1-5 din backend)
  const counts = [1, 2, 3, 4, 5].map(
    (star) => reviews.filter((r) => r.rating === star).length,
  );
  const maxCount = Math.max(...counts, 1);

  return (
    <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl shadow-lg p-6">
      <h3 className="text-sm font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-4">
        Score Distribution
      </h3>

      <div className="flex items-end gap-2 h-32 mt-2">
        {counts.map((count, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-1 h-full justify-end"
          >
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {count > 0 ? count : ""}
            </span>
            <div
              className="w-full rounded-t-md transition-all duration-700 ease-out"
              style={{
                height: animated
                  ? `${Math.round((count / maxCount) * 100)}%`
                  : "0%",
                background: BAR_COLORS[i],
                minHeight: count > 0 ? "4px" : "0px",
                transitionDelay: `${i * 80}ms`,
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="flex-1 text-center text-xs text-gray-400">
            {"★".repeat(star)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreDistribution;
