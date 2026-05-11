import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Star, Plus, Check, Clock, Play, Search } from "lucide-react";
import ThemeButton from "./ThemeButton";

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <div className="px-2 py-2">
      <nav className="bg-white dark:bg-[#1C1C1C] rounded-2xl text-black dark:text-white px-6 py-4 flex justify-between items-center shadow-lg transition-all duration-500 ease-in-out">
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

        <div className="flex-1 max-w-md mx-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300 transition-colors" />
            </div>

            <input
              type="text"
              placeholder="Search games..."
              className="block w-full pl-10 pr-4 py-2
                 bg-gray-100 dark:bg-[#383838]
                 text-black dark:text-white
                 placeholder-gray-400 dark:placeholder-gray-500
                 border border-transparent
                 rounded-full focus:outline-none
                 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600
                 focus:bg-gray-200 dark:focus:bg-[#484848]
                 transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex items-center space-x-5">
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
