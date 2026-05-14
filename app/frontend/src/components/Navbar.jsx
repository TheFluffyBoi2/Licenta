import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search } from "lucide-react";
import ThemeButton from "./ThemeButton";
import { useEffect, useRef, useState } from "react";
import api from "../api/axios";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);

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
        const { data } = await api.get("/api/game/search", {
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
  }, [query]);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
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

  const onSubmit = (e) => {
    e.preventDefault();
    const first = results[0];
    if (first?.id != null) {
      goToGame(first.id);
    }
  };

  return (
    <div className="px-2 py-2">
      <nav className="bg-white dark:bg-[#1C1C1C] rounded-2xl text-black dark:text-white px-6 py-4 flex justify-between items-center shadow-lg transition-all duration-500 ease-in-out gap-4 flex-wrap md:flex-nowrap">
        <div className="flex items-center space-x-5">
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
            to="/users"
            className="group hover:bg-gray-100 dark:hover:bg-[#383838] cursor-pointer flex items-center space-x-1 rounded-full transition"
          >
            <span className="flex p-2 bg-gray-100 dark:bg-[#383838] rounded-full transition">
              <img
                src="/users-solid-full.svg"
                alt="Users"
                className="w-6 h-6 group-hover:opacity-50 dark:invert dark:opacity-50 dark:group-hover:opacity-100 transition-opacity"
              />
            </span>
            <p className="pr-3 group-hover:opacity-50 dark:opacity-50 dark:group-hover:opacity-100 transition-opacity">
              Users
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

        <div
          ref={wrapRef}
          className="flex-1 min-w-[200px] max-w-md mx-4 order-last md:order-none w-full md:w-auto"
        >
          <form onSubmit={onSubmit} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-[#50FCBC] transition-colors" />
            </div>

            <input
              type="search"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setOpen(true)}
              placeholder="Search games..."
              className="block w-full pl-10 pr-4 py-2
                 bg-gray-100 dark:bg-[#383838]
                 text-black dark:text-white
                 placeholder-gray-400 dark:placeholder-gray-500
                 border border-transparent
                 rounded-full focus:outline-none
                 focus:ring-2 focus:ring-[#50FCBC]/60 dark:focus:ring-[#50FCBC]/40
                 focus:bg-gray-200 dark:focus:bg-[#484848]
                 transition-all duration-200"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls="game-search-results"
            />

            {open && (
              <ul
                id="game-search-results"
                role="listbox"
                className="absolute left-0 right-0 top-full mt-2 z-50 max-h-80 overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] shadow-xl py-1"
              >
                {loading && query.trim().length >= 2 && (
                  <li className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    Searching…
                  </li>
                )}
                {!loading &&
                  query.trim().length >= 2 &&
                  results.length === 0 && (
                    <li className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      No games found.
                    </li>
                  )}
                {!loading &&
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
              </ul>
            )}
          </form>
        </div>

        <div className="flex items-center space-x-5 shrink-0">
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
