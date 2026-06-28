import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

export const useNotifications = (intervalMs = 60_000) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const res = await api.get("api/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    const id = setInterval(fetch, intervalMs);
    return () => clearInterval(id);
  }, [fetch, intervalMs]);

  const markRead = async (id) => {
    await api.patch(`api/notifications/${id}/read`);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllRead = async () => {
    await api.patch("api/notifications/read-all");
    setNotifications([]);
  };

  return { notifications, loading, markRead, markAllRead };
};
