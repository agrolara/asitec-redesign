import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Phone, 
  Download,
  ChevronDown
} from 'lucide-react';
import { companyInfo } from '../data/company';

interface Props {
  quoteCount: number;
  onOpenQuote: () => void;
  onOpenPitch: () => void;
}

export const Navbar: React.FC<Props> = ({ quoteCount, onOpenQuote, onOpenPitch }) => {
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
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Laboratorio Certificado SAG Res. Exenta Nº 6805 / 2016
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">
              Casa Matriz: Chañarcillo #691, Maipú, Santiago
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <a 
              href={`tel:${companyInfo.contact.phoneRaw}`} 
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span className="font-semibold">{companyInfo.contact.phone}</span>
            </a>
            <span className="text-slate-600">|</span>
            <a 
              href={companyInfo.catalogs[0].url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-amber-400 transition-colors flex items-center gap-1 font-medium"
            >
              <Download className="w-3 h-3 text-amber-400" />
              <span>Catálogos PDF</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main sticky navigation bar */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/80 py-3' 
          : 'bg-white border-b border-slate-100 py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Brand */}
          <a href="#" className="flex items-center gap-3 group">
            <img 
              src="https://www.asitec.cl/wp-content/uploads/2021/03/logo721.png" 
              alt="Asitec Logo" 
              className="h-11 md:h-12 w-auto object-contain transition-transform group-hover:scale-105"
              onError={(e) => {
                // Fallback elegant logo text if network blocks image
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900 font-sans">
                  ASITEC<span className="text-amber-600">.</span>
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
                  S.A.
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">
                Innovación, Tecnología & Servicio
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <a href="#catalogo" className="hover:text-amber-600 transition-colors">
              Catálogo de Productos
            </a>
            <a href="#certificaciones" className="hover:text-amber-600 transition-colors">
              Acreditaciones
            </a>
            <a href="#recetario" className="hover:text-amber-600 transition-colors">
              Recetas en Video
            </a>
            <a href="#servicios" className="hover:text-amber-600 transition-colors">
              Servicios Industriales
            </a>
            <a href="#seguridad" className="hover:text-amber-600 transition-colors flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Seguridad Bancaria
            </a>
            <a href="#contacto" className="hover:text-amber-600 transition-colors">
              Contacto
            </a>
          </nav>

          {/* Action CTAs: Pitch Button & Quote Cart */}
          <div className="flex items-center gap-3">
            
            {/* Pitch for Managers button */}
            <button
              onClick={onOpenPitch}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-600/20 hover:from-amber-500/25 hover:to-amber-600/30 text-amber-900 border border-amber-300 font-bold text-xs transition-all shadow-sm hover:shadow active:scale-95"
              title="Abrir dossier de propuesta para gerencia"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
              <span>Propuesta Gerencial</span>
            </button>

            {/* Quote Cart Button */}
            <button
              onClick={onOpenQuote}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all shadow-sm active:scale-95 group"
            >
              <ShoppingCart className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Cotizador</span>
              
              {quoteCount > 0 && (
                <span className="ml-0.5 inline-flex items-center justify-center px-2 py-0.5 text-xs font-black leading-none text-slate-900 bg-amber-400 rounded-full animate-bounce">
                  {quoteCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-6 space-y-4 shadow-xl animate-fade-in">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPitch();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-500/15 border border-amber-300 text-amber-900 font-bold text-sm"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Ver Propuesta para Gerentes (Antes vs Después)</span>
              </div>
              <ChevronDown className="w-4 h-4 -rotate-90 text-amber-700" />
            </button>

            <nav className="flex flex-col space-y-3 font-semibold text-slate-800 text-sm">
              <a 
                href="#catalogo" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2 hover:bg-slate-50 rounded-lg"
              >
                Catálogo de Productos
              </a>
              <a 
                href="#certificaciones" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2 hover:bg-slate-50 rounded-lg"
              >
                Acreditaciones & Certificaciones
              </a>
              <a 
                href="#recetario" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2 hover:bg-slate-50 rounded-lg"
              >
                Recetas en Video
              </a>
              <a 
                href="#servicios" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2 hover:bg-slate-50 rounded-lg"
              >
                Servicios Industriales y Maquilas
              </a>
              <a 
                href="#seguridad" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2 hover:bg-slate-50 rounded-lg flex items-center gap-2 text-emerald-700"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Cuenta Oficial Banco de Chile
              </a>
              <a 
                href="#contacto" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2 hover:bg-slate-50 rounded-lg"
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
