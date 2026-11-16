import React from 'react';
import { Menu, Mail } from 'lucide-react';

const Topbar = ({ onToggleMobile }) => {
  return (
    <header className="sticky top-0 z-40 w-full flex items-center justify-between px-4 lg:px-8 py-2.5 bg-gradient-to-r from-[#1F5BA6] to-[#5C2180] border-b border-[#1D3D63] text-white shadow-sm">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onToggleMobile}
          aria-label="Buka Menu Navigasi"
          className="lg:hidden p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-900/80 border border-blue-400/30 text-[11px] font-bold text-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Portal Resmi
          </div>
          <span className="hidden sm:inline text-xs text-slate-200 font-medium">
            Pemerintah Provinsi Sulawesi Tengah • <span className="text-amber-300 font-semibold">Bumi Seribu Megalit</span>
          </span>
        </div>
      </div>

      {/* Kanal Pengaduan info */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-200">
        <Mail className="w-3.5 h-3.5 text-amber-300 shrink-0" />
        <span className="hidden md:inline text-slate-300">Email Resmi:</span>
        <a
          href="mailto:dispar@sultengprov.go.id"
          className="font-medium hover:text-amber-300 text-blue-100 transition-colors"
        >
          dispar@sultengprov.go.id
        </a>
      </div>
    </header>
  );
};

export default Topbar;
