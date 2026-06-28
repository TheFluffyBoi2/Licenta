import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search } from "lucide-react";
import ThemeButton from "./ThemeButton";
import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { NotificationBell } from "./NotificationBell";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState("games");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const endpoint =
          searchType === "games" ? "/api/game/search" : "/api/user/search";

        const { data } = await api.get(endpoint, {
          params: { q, limit: 12 },
        });
        const list = Array.isArray(data) ? data : [];
        setResults(list);
        setOpen(q.length >= 2);
      } catch {
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 320);

    return () => clearTimeout(t);
  }, [query, searchType]);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const goToGame = (gameId) => {
    setOpen(false);
    setQuery("");
    setResults([]);
    navigate(`/game/${gameId}`);
  };

  const goToUser = (userId) => {
    setOpen(false);
    setQuery("");
    setResults([]);
    navigate(`/user/${userId}`);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const first = results[0];
    if (!first) return;
    if (searchType === "games" && first.id != null) goToGame(first.id);
    if (searchType === "people" && first.userId != null) goToUser(first.userId);
  };

  return (
    <div className="px-2 py-2">
      <nav className="bg-white dark:bg-[#1C1C1C] rounded-2xl text-black dark:text-white px-6 py-4 flex justify-between items-center shadow-lg transition-all duration-500 ease-in-out gap-4 flex-wrap md:flex-nowrap">
        <div className="flex items-center space-x-5 shrink-0">
          <span>
            <Link to="/" className="cursor-pointer">
              <img src="/logo.ico" alt="Vidb Games" className="w-10 h-10" />
            </Link>
          </span>
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-500" />

          <Link
            to="/mylist"
            className="group hover:bg-gray-100 dark:hover:bg-[#383838] cursor-pointer flex items-center space-x-1 rounded-full transition"
          >
            <span className="flex p-2 bg-gray-100 dark:bg-[#383838] rounded-full transition">
              <img
                src="/list-box.svg"
                alt="My List"
                className="w-6 h-6 group-hover:opacity-50 dark:invert dark:opacity-50 dark:group-hover:opacity-100 transition-opacity"
              />
            </span>
            <p className="pr-3 group-hover:opacity-50 dark:opacity-50 dark:group-hover:opacity-100 transition-opacity">
              My List
            </p>
          </Link>

          <Link
            to="/profile"
            className="group hover:bg-gray-100 dark:hover:bg-[#383838] cursor-pointer flex items-center space-x-1 rounded-full transition"
          >
            <span className="flex p-2 bg-gray-100 dark:bg-[#383838] rounded-full transition">
              <img
                src="/users-solid-full.svg"
                alt="Profile"
                className="w-6 h-6 group-hover:opacity-50 dark:invert dark:opacity-50 dark:group-hover:opacity-100 transition-opacity"
              />
            </span>
            <p className="pr-3 group-hover:opacity-50 dark:opacity-50 dark:group-hover:opacity-100 transition-opacity">
              Profile
            </p>
          </Link>

          <Link
            to="/recommend"
            className="group hover:bg-gray-100 dark:hover:bg-[#383838] cursor-pointer flex items-center space-x-1 rounded-full transition"
          >
            <span className="flex p-2 bg-gray-100 dark:bg-[#383838] rounded-full transition">
              <img
                src="/recommend.svg"
                alt="Recommend"
                className="w-6 h-6 group-hover:opacity-50 dark:invert dark:opacity-50 dark:group-hover:opacity-100 transition-opacity"
              />
            </span>
            <p className="pr-3 group-hover:opacity-50 dark:opacity-50 dark:group-hover:opacity-100 transition-opacity">
              Recommend
            </p>
          </Link>
        </div>

        {/* Center — search bar */}
        <div
          ref={wrapRef}
          className="flex-1 min-w-65 max-w-2xl mx-4 order-last md:order-0 w-full md:w-auto"
        >
          <form onSubmit={onSubmit} className="relative group">
            <div className="flex items-center bg-gray-100 dark:bg-[#383838] rounded-full focus-within:ring-2 focus-within:ring-[#50FCBC]/60 dark:focus-within:ring-[#50FCBC]/40 focus-within:bg-gray-200 dark:focus-within:bg-[#484848] transition-all duration-200">
              {/* Search icon */}
              <div className="pl-4 flex items-center pointer-events-none shrink-0">
                <Search className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-[#50FCBC] transition-colors" />
              </div>

              {/* Input */}
              <input
                type="search"
                autoComplete="off"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setOpen(true)}
                placeholder={`Search ${searchType}...`}
                className="flex-1 min-w-0 pl-3 pr-2 py-2 bg-transparent text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                aria-autocomplete="list"
                aria-expanded={open}
                aria-controls="search-results"
              />

              {/* Divider */}
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 shrink-0" />

              {/* Type selector */}
              <div ref={dropdownRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold tracking-wider text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors rounded-r-full"
                >
                  {searchType === "games" ? "GAMES" : "PEOPLE"}
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-[#2a2a2a] rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden z-50">
                    {["games", "people"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setSearchType(type);
                          setDropdownOpen(false);
                          setResults([]);
                          setOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors
                          ${
                            searchType === type
                              ? "bg-[#50FCBC]/10 text-[#50FCBC]"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#353535]"
                          }`}
                      >
                        {type === "games" ? "Games" : "People"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Results dropdown */}
            {open && (
              <ul
                id="search-results"
                role="listbox"
                className="absolute left-0 right-0 top-full mt-2 z-50 max-h-80 overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] shadow-xl py-1"
              >
                {loading && (
                  <li className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    Searching…
                  </li>
                )}

                {!loading && results.length === 0 && (
                  <li className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    No {searchType} found.
                  </li>
                )}

                {!loading &&
                  searchType === "games" &&
                  results.map((g) => (
                    <li key={g.id} role="option">
                      <button
                        type="button"
                        onClick={() => goToGame(g.id)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-[#353535] transition-colors"
                      >
                        <img
                          src={g.cover?.url || "/placeholder.jpg"}
                          alt=""
                          className="w-10 h-14 object-cover rounded shrink-0 bg-gray-200 dark:bg-gray-600"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                          {g.name}
                        </span>
                      </button>
                    </li>
                  ))}

                {!loading &&
                  searchType === "people" &&
                  results.map((u) => (
                    <li key={u.userId} role="option">
                      <button
                        type="button"
                        onClick={() => goToUser(u.id || u.userId)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-[#353535] transition-colors"
                      >
                        <img
                          src={
                            u.profilePictureUrl
                              ? `http://localhost:8080/${u.profilePictureUrl}`
                              : `http://localhost:8080/default_avatar.png`
                          }
                          alt=""
                          className="w-10 h-10 object-cover rounded-full shrink-0 bg-gray-200 dark:bg-gray-600"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {u.username}
                          </span>
                          {u.reputation != null && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {u.reputation} reputation
                            </span>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </form>
        </div>

        {/* Right — theme + logout */}
        <div className="flex items-center space-x-5 shrink-0">
          <NotificationBell />
          <ThemeButton />
          <button
            onClick={logout}
            className="flex p-2 bg-gray-100 dark:bg-[#383838] rounded-full transition hover:bg-gray-200 dark:hover:bg-[#484848]"
            aria-label="Logout"
          >
            <img
              src="/right-from-bracket-solid-full.svg"
              alt="Exit"
              className="w-6 h-6 hover:opacity-50 dark:invert dark:opacity-50 dark:hover:opacity-100 transition-opacity cursor-pointer"
            />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
