import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  ShieldCheck, 
  Phone, 
  Download
} from 'lucide-react';
import { companyInfo } from '../data/company';

interface Props {
  quoteCount: number;
  onOpenQuote: () => void;
}

export const Navbar: React.FC<Props> = ({ quoteCount, onOpenQuote }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top micro banner institucional */}
      <div className="bg-orange-50/80 text-orange-950 text-xs py-1.5 px-4 border-b border-orange-200/60 font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-orange-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
              Inocuidad Mundial FSSC 22000 (Versión 6 - GFSI)
            </span>
            <span className="hidden md:inline text-orange-200">|</span>
            <span className="hidden md:inline text-slate-600 text-[11px]">
              Casa Matriz: Chañarcillo #691, Maipú, Santiago
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-700 text-xs">
            <a 
              href={`tel:${companyInfo.contact.phoneRaw}`} 
              className="hover:text-orange-600 transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-orange-500" />
              <span className="font-semibold">{companyInfo.contact.phone}</span>
            </a>
            <span className="text-orange-200">|</span>
            <a 
              href={companyInfo.catalogs[0].url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-orange-600 transition-colors flex items-center gap-1 font-medium text-orange-700"
            >
              <Download className="w-3 h-3 text-orange-500" />
              <span>Catálogos PDF</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main sticky navigation bar */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-orange-100 py-3' 
          : 'bg-white border-b border-orange-50 py-3.5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Brand Oficial */}
          <a href="#" className="flex items-center group py-0.5">
            <img 
              src="https://www.asitec.cl/wp-content/uploads/2021/03/logo721.png" 
              alt="ASITEC S.A." 
              className="h-9 sm:h-11 md:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <a href="#catalogo" className="hover:text-orange-600 transition-colors">
              Catálogo de Productos
            </a>
            <a href="#certificaciones" className="hover:text-orange-600 transition-colors">
              Acreditaciones
            </a>
            <a href="#recetario" className="hover:text-orange-600 transition-colors">
              Recetas en Video
            </a>
            <a href="#servicios" className="hover:text-orange-600 transition-colors">
              Servicios Industriales
            </a>
            <a href="#seguridad" className="hover:text-orange-600 transition-colors flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Seguridad Bancaria
            </a>
            <a href="#contacto" className="hover:text-orange-600 transition-colors">
              Contacto
            </a>
          </nav>

          {/* Action CTAs: Quote Cart & Mobile Toggle */}
          <div className="flex items-center gap-3">
            
            {/* Quote Cart Button */}
            <button
              onClick={onOpenQuote}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-orange-500/20 active:scale-95 group cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Cotizador</span>
              
              {quoteCount > 0 && (
                <span className="ml-0.5 inline-flex items-center justify-center px-2 py-0.5 text-xs font-black leading-none text-orange-950 bg-amber-300 rounded-full animate-bounce shadow">
                  {quoteCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-orange-50 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-orange-100 bg-white px-4 py-6 space-y-4 shadow-xl animate-fade-in">
            <nav className="flex flex-col space-y-3 font-semibold text-slate-800 text-sm">
              <a 
                href="#catalogo" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2.5 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors"
              >
                Catálogo de Productos
              </a>
              <a 
                href="#certificaciones" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2.5 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors"
              >
                Acreditaciones & Certificaciones
              </a>
              <a 
                href="#recetario" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2.5 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors"
              >
                Recetas en Video
              </a>
              <a 
                href="#servicios" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2.5 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors"
              >
                Servicios Industriales y Maquilas
              </a>
              <a 
                href="#seguridad" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2.5 hover:bg-orange-50 rounded-xl flex items-center gap-2 text-emerald-700"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Cuenta Oficial Banco de Chile
              </a>
              <a 
                href="#contacto" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2.5 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors"
              >
                Contacto & Casa Matriz
              </a>
            </nav>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Tel: {companyInfo.contact.phone}</span>
              <span>{companyInfo.contact.email}</span>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
