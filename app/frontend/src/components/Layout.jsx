import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white font-sans transition-colors duration-500">
      <header>
        <Navbar />
      </header>
      <main className="grow w-full px-4 sm:px-6 py-4">
        {children}
      </main>
      <footer className="bg-gray-100 dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-white/5 py-8 text-center text-gray-600 dark:text-gray-500 transition-colors duration-500">
        <p>&copy; 2026 Vidb Games. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
