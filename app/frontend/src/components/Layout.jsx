import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div class="min-h-screen flex flex-col bg-linear-to-tr from-[#FF4D4D] via-[#FFD700] to-[#4DFFBC]">
      <header>{<Navbar />}</header>
      <main>{children}</main>
      <footer>
        {}
        <p>&copy; 2026 Vidb Games</p>
      </footer>
    </div>
  );
};

export default Layout;
