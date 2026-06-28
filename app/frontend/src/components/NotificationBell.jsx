import { useState } from "react";
import { Bell, ExternalLink, Tag } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";

export const NotificationBell = () => {
  const { notifications, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const count = notifications.length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-lg text-gray-500 hover:text-[#50FCBC]
                   hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors"
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-[#50FCBC] text-black
                           text-xs font-bold rounded-full w-5 h-5 flex
                           items-center justify-center"
          >
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-80 bg-white
                        dark:bg-[#2a2a2a] rounded-2xl shadow-xl border
                        border-gray-200 dark:border-gray-700 z-50"
        >
          <div
            className="flex items-center justify-between px-4 py-3
                          border-b border-gray-200 dark:border-gray-700"
          >
            <span className="font-bold text-gray-900 dark:text-white">
              Discounts wishlist
            </span>
            {count > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-[#50FCBC] hover:underline"
              >
                Marchează toate
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {count === 0 ? (
              <p
                className="text-center text-gray-500 dark:text-gray-400
                            py-8 text-sm"
              >
                No discounts to be displayed.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="px-4 py-3 border-b border-gray-100
                             dark:border-gray-700 last:border-0"
                >
                  <div className="flex items-start justify-between gap-2">
                    <a
                      href={n.dealUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 min-w-0 group"
                      title={`Deschide pe ${n.storeName}`}
                    >
                      <p
                        className="font-semibold text-sm text-gray-900
                                   dark:text-white truncate group-hover:text-[#50FCBC]
                                   transition-colors"
                      >
                        {n.gameName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Tag className="w-3 h-3 text-[#50FCBC]" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {n.storeName}
                        </span>
                        <span className="text-xs font-bold text-[#50FCBC]">
                          -{n.savingsPercent}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="text-sm font-bold text-gray-900
                                        dark:text-white"
                        >
                          ${n.salePrice}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          ${n.normalPrice}
                        </span>
                      </div>
                      <span className="text-xs text-[#50FCBC] mt-1 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Deschide pe {n.storeName}
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </a>
                    <div className="flex gap-1 flex-shrink-0">
                      <a
                        href={n.dealUrl}
                        target="_blank"
                        rel="noreferrer"
                        title={`Deschide pe ${n.storeName}`}
                        className="p-1.5 rounded-lg text-[#50FCBC]
                                   hover:bg-[#50FCBC]/10 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => markRead(n.id)}
                        className="p-1.5 rounded-lg text-gray-400
                                   hover:text-gray-600 hover:bg-gray-100
                                   dark:hover:bg-[#3a3a3a] transition-colors
                                   text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
