import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Navbar from './Navbar';
import Footer from './Footer';

export const MainLayout = ({ children, language, setLanguage }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col w-full antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Top Announcement Bar */}
      <Topbar />

      {/* Glassy Top Navigation Bar */}
      <Navbar
        onToggleMobile={() => setIsMobileOpen((prev) => !prev)}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Drawer Sidebar untuk Mobile & Tablet (lg:hidden) */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Backdrop overlay saat drawer sidebar mobile terbuka */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Konten Utama Full-Width di Laptop */}
      <main className="flex-1 w-full overflow-x-hidden">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
