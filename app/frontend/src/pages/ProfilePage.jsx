import { useState, useEffect, useRef, useCallback } from "react";
import {
  Pencil,
  Camera,
  Star,
  Gamepad2,
  TrendingUp,
  BarChart2,
  Layers,
  Map,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../api/axios";

const API_URL = "http://localhost:8080";

const getUserFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
};

const getAvatarUrl = (userData) => {
  if (userData?.profilePictureUrl) {
    const p = userData.profilePictureUrl.startsWith("/")
      ? userData.profilePictureUrl
      : `/${userData.profilePictureUrl}`;
    return `${API_URL}${p}`;
  }
  return `${API_URL}/default_avatar.png`;
};

const GENRE_COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#FF4757",
  "#6E4C8A",
  "#28B463",
  "#F7C600",
  "#900C3F",
  "#581845",
  "#F3F4F6",
  "#F5DEB3",
  "#CD853F",
];

const THEME_COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#FF4757",
  "#6E4C8A",
  "#28B463",
  "#F7C600",
  "#900C3F",
  "#581845",
  "#F3F4F6",
  "#F5DEB3",
  "#CD853F",
];

// ─── Stat card ──────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl p-4 flex items-center gap-4">
    <div className="p-3 rounded-lg" style={{ backgroundColor: `${accent}22` }}>
      <Icon className="w-5 h-5" style={{ color: accent }} />
    </div>
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

// ─── Custom pie tooltip ─────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm shadow-lg">
        <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
        <p className="text-gray-500 dark:text-gray-400">{value} games</p>
      </div>
    );
  }
  return null;
};

// ─── UMAP scatter plot (canvas) ─────────────────────────────────────────────

const UMAPMap = ({ points }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!points || points.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const pad = 40;
    const toCanvasX = (x) => pad + ((x - minX) / (maxX - minX)) * (W - 2 * pad);
    const toCanvasY = (y) => pad + ((y - minY) / (maxY - minY)) * (H - 2 * pad);

    // background
    const isDark = document.documentElement.classList.contains("dark");
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = isDark ? "#1a1a1a" : "#f9fafb";
    ctx.fillRect(0, 0, W, H);

    // grid lines
    ctx.strokeStyle = isDark ? "#2a2a2a" : "#e5e7eb";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const gx = pad + (i / 5) * (W - 2 * pad);
      const gy = pad + (i / 5) * (H - 2 * pad);
      ctx.beginPath();
      ctx.moveTo(gx, pad);
      ctx.lineTo(gx, H - pad);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pad, gy);
      ctx.lineTo(W - pad, gy);
      ctx.stroke();
    }

    // points
    points.forEach((p) => {
      const cx = toCanvasX(p.x);
      const cy = toCanvasY(p.y);

      // glow
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 10);
      grd.addColorStop(0, "#50FCBC55");
      grd.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // dot
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#50FCBC";
      ctx.fill();
      ctx.strokeStyle = isDark ? "#222222" : "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // hover labels via mousemove (handled in component)
  }, [points]);

  const [hovered, setHovered] = useState(null);

  const handleMouseMove = useCallback(
    (e) => {
      if (!points || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const W = canvasRef.current.width;
      const H = canvasRef.current.height;
      const pad = 40;

      const xs = points.map((p) => p.x);
      const ys = points.map((p) => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      const toCanvasX = (x) =>
        pad + ((x - minX) / (maxX - minX)) * (W - 2 * pad);
      const toCanvasY = (y) =>
        pad + ((y - minY) / (maxY - minY)) * (H - 2 * pad);

      const scaleX = rect.width / W;
      const scaleY = rect.height / H;

      let closest = null;
      let minDist = Infinity;
      points.forEach((p) => {
        const cx = toCanvasX(p.x) * scaleX;
        const cy = toCanvasY(p.y) * scaleY;
        const d = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);
        if (d < minDist) {
          minDist = d;
          closest = { ...p, cx, cy };
        }
      });

      setHovered(minDist < 20 ? closest : null);
    },
    [points],
  );

  if (!points || points.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400 text-sm">
        No embedding data available yet.
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
      <canvas
        ref={canvasRef}
        width={900}
        height={500}
        className="w-full h-full rounded-xl"
        style={{ display: "block" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
      />
      {hovered && (
        <div
          className="absolute pointer-events-none bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm shadow-xl z-10 max-w-50"
          style={{ left: hovered.cx + 12, top: hovered.cy - 10 }}
        >
          <p className="font-semibold text-gray-900 dark:text-white line-clamp-2">
            {hovered.name}
          </p>
          {hovered.score != null && (
            <p className="text-[#50FCBC] text-xs mt-0.5">
              Score: {Math.round(hovered.score * 20)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main component ─────────────────────────────────────────────────────────

const ProfilePage = () => {
  const fileInputRef = useRef(null);
  const usernameInputRef = useRef(null);

  const [userData, setUserData] = useState(getUserFromStorage);
  const [imgUrl, setImgUrl] = useState(() =>
    getAvatarUrl(getUserFromStorage()),
  );
  const [avatarLoading, setAvatarLoading] = useState(false);

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(userData?.username || "");
  const [nameSaving, setNameSaving] = useState(false);

  const [stats, setStats] = useState(null);
  const [genreData, setGenreData] = useState([]);
  const [themeData, setThemeData] = useState([]);
  const [umapPoints, setUmapPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── fetch profile data ────────────────────────────────────────────────────

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get("api/user/profile");
        const data = res.data;

        if (data.stats) setStats(data.stats);

        // genres
        if (data.genre_distribution) {
          setGenreData(
            Object.entries(data.genre_distribution)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 12)
              .map(([name, value]) => ({ name, value })),
          );
        }

        // themes
        if (data.theme_distribution) {
          setThemeData(
            Object.entries(data.theme_distribution)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 12)
              .map(([name, value]) => ({ name, value })),
          );
        }

        // umap
        if (data.umap_points) {
          setUmapPoints(data.umap_points);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ── avatar upload ─────────────────────────────────────────────────────────

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImgUrl(previewUrl);

    try {
      setAvatarLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("api/user/upload_avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newUrl = res.data?.profilePictureUrl;
      if (newUrl) {
        const updated = { ...userData, profilePictureUrl: newUrl };
        setUserData(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        setImgUrl(getAvatarUrl(updated));
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
      setImgUrl(getAvatarUrl(userData));
    } finally {
      setAvatarLoading(false);
      e.target.value = "";
    }
  };

  // ── username edit ─────────────────────────────────────────────────────────

  const handleNameEdit = () => {
    setIsEditingName(true);
    setTimeout(() => usernameInputRef.current?.focus(), 50);
  };

  const handleNameSave = async () => {
    const trimmed = nameValue.trim();
    if (!trimmed || trimmed === userData?.username) {
      setIsEditingName(false);
      return;
    }
    try {
      setNameSaving(true);
      await api.put("api/user/update_username", { username: trimmed });
      const updated = { ...userData, username: trimmed };
      setUserData(updated);
      localStorage.setItem("user", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to update username:", err);
      setNameValue(userData?.username || "");
    } finally {
      setNameSaving(false);
      setIsEditingName(false);
    }
  };

  const handleNameKeyDown = (e) => {
    if (e.key === "Enter") handleNameSave();
    if (e.key === "Escape") {
      setNameValue(userData?.username || "");
      setIsEditingName(false);
    }
  };

  // ── section label ─────────────────────────────────────────────────────────

  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-3 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      <div className="h-1 grow bg-linear-to-r from-[#50FCBC] to-transparent rounded" />
      <Icon className="w-5 h-5 text-[#50FCBC]" />
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto pb-12 sm:px-2">
      {/* ── Profile header card ── */}
      <div className="bg-white dark:bg-[#222222] rounded-2xl shadow-lg p-6 mb-6 transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative group shrink-0">
            <img
              src={imgUrl}
              alt="User Avatar"
              className="w-24 h-24 rounded-xl object-cover border-2 border-[#50FCBC] transition-all"
            />

            {/* overlay on hover */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarLoading}
              className="absolute inset-0 rounded-xl bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              {avatarLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Camera className="w-6 h-6 text-white" />
                  <span className="text-white text-xs mt-1 font-medium">
                    Schimbă
                  </span>
                </>
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Name + edit */}
          <div className="grow min-w-0">
            <div className="flex items-center gap-3">
              {isEditingName ? (
                <input
                  ref={usernameInputRef}
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={handleNameKeyDown}
                  disabled={nameSaving}
                  className="text-2xl font-bold bg-transparent border-b-2 border-[#50FCBC] text-gray-900 dark:text-white focus:outline-none w-full max-w-xs"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {userData?.username || "User"}
                </h1>
              )}

              <button
                onClick={handleNameEdit}
                className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-[#50FCBC] hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors"
                title="Edit username"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {userData?.email || ""}
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      {!loading && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Gamepad2}
            label="Games in List"
            value={stats.total_games ?? 0}
            accent="#50FCBC"
          />
          <StatCard
            icon={Star}
            label="Mean Score"
            value={
              stats.mean_score != null
                ? `${Math.round(stats.mean_score * 20)}/100`
                : "N/A"
            }
            accent="#FFD700"
          />
          <StatCard
            icon={TrendingUp}
            label="Completed"
            value={stats.completed ?? 0}
            accent="#3b82f6"
          />
          <StatCard
            icon={BarChart2}
            label="Reviews"
            value={stats.total_reviews ?? 0}
            accent="#a78bfa"
          />
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20 text-gray-500 dark:text-gray-400">
          Loading statistics...
        </div>
      )}

      {!loading && (
        <>
          {/* ── Pie charts row ── */}
          {(genreData.length > 0 || themeData.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Genres pie */}
              {genreData.length > 0 && (
                <div className="bg-white dark:bg-[#222222] rounded-2xl shadow-lg p-6 transition-colors">
                  <SectionHeader icon={Layers} title="Genres" />
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={genreData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {genreData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={GENRE_COLORS[i % GENRE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        formatter={(value) => (
                          <span className="text-xs text-gray-700 dark:text-gray-300">
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Themes pie */}
              {themeData.length > 0 && (
                <div className="bg-white dark:bg-[#222222] rounded-2xl shadow-lg p-6 transition-colors">
                  <SectionHeader icon={Layers} title="Themes" />
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={themeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {themeData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={THEME_COLORS[i % THEME_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        formatter={(value) => (
                          <span className="text-xs text-gray-700 dark:text-gray-300">
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* ── UMAP map ── */}
          <div className="bg-white dark:bg-[#222222] rounded-2xl shadow-lg p-6 mb-6 transition-colors">
            <SectionHeader icon={Map} title="Games Map" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 -mt-2">
              Vizualizare UMAP a embedding-urilor jocurilor din lista ta.
              Jocurile similare apar mai aproape.
            </p>
            <UMAPMap points={umapPoints} />
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
