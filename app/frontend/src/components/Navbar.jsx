import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ThemeButton from "./ThemeButton";

const Navbar = () => {
  const { logout } = useAuth();
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div className="px-2 py-2">
      <nav className="bg-white dark:bg-[#1C1C1C] rounded-2xl text-black dark:text-white px-6 py-4 flex justify-between items-center shadow-lg transition-all duration-500 ease-in-out">
        <div className="flex items-center space-x-5">
          <span>
            <img src="/logo.ico" alt="Vidb Games" className="w-10 h-10" />
          </span>
          <div className="h-8 w-px bg-gray-500 items-center" />
          <span className="group hover:bg-[#EDF2F7] dark:hover:text-white dark:hover:bg-[#383838] cursor-pointer flex items-center space-x-1 rounded-full transition">
            <a
              href="#"
              className=" flex p-2 bg-[#EDF2F7] dark:bg-[#383838] rounded-full transition"
            >
              <img
                src="/users-solid-full.svg"
                alt="Users"
                className="w-6 h-6 group-hover:opacity-50 dark:invert dark:opacity-50 dark:group-hover:opacity-100 transition-opacity"
              />
            </a>
            <p className="pr-3 group-hover:opacity-50 dark:opacity-50 dark:group-hover:opacity-100 transition-opacity">
              Users
            </p>
          </span>
        </div>
        <div className="flex items-center space-x-5">
          <ThemeButton />
          <button
            onClick={logout}
            className="flex p-2 bg-[#EDF2F7] dark:bg-[#383838] rounded-full transition"
          >
            <img
              src="/right-from-bracket-solid-full.svg"
              alt="Exit"
              className="w-6 h-6 hover:opacity-50 dark:invert dark:opacity-50 dark:hover:opacity-100 transition-opacity"
            />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
