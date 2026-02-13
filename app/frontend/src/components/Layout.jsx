import React from 'react';

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        {/* You can add a navbar or header content here */}
        <h1>Vidb Games</h1>
      </header>
      <main>
        {children}
      </main>
      <footer>
        {/* You can add footer content here */}
        <p>&copy; 2026 Vidb Games</p>
      </footer>
    </div>
  );
};

export default Layout;
