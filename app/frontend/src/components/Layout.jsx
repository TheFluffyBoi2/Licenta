// import React from "react";
// import Navbar from "./Navbar";

// const Layout = ({ children }) => {
//   return (
//     <div class="min-h-screen flex flex-col bg-linear-to-tr from-[#FF4D4D] via-[#FFD700] to-[#4DFFBC]">
//       <header>{<Navbar />}</header>
//       <main>{children}</main>
//       <footer>
//         {}
//         <p>&copy; 2026 Vidb Games</p>
//       </footer>
//     </div>
//   );
// };

// export default Layout;
import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white font-sans">
      <header>
        <Navbar />
      </header>
      {/* Am mărit max-w ca să aibă loc grid-ul și am dat un padding elegant */}
      <main className="grow px-3 py-4 max-w-400 mx-auto w-full">
        {children}
      </main>
      <footer className="bg-[#1a1a1a] border-t border-white/5 py-8 text-center text-gray-500">
        <p>&copy; 2026 Vidb Games. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
