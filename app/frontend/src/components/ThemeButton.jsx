import { useState, useEffect } from "react";

const ThemeButton = () => {
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
    <button
      onClick={toggleTheme}
      className="w-6 h-6 cursor-pointer hover:opacity-50 dark:invert dark:opacity-50 dark:hover:opacity-100 transition-opacity"
    >
      {isDark ? (
        <img src="/sun-solid-full.svg" alt="Light" />
      ) : (
        <img src="/moon-solid-full.svg" alt="Dark" />
      )}
    </button>
  );
};

export default ThemeButton;
