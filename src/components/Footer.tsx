import React from 'react';
import { 
  Download, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowUp,
  Award,
  Lock
} from 'lucide-react';
import { companyInfo } from '../data/company';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      
      {/* Upper Download Strip */}
      <div className="border-b border-slate-800/80 py-10 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center lg:text-left">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                Documentación Técnica & Catálogos Oficiales
              </span>
              <h3 className="text-xl font-bold text-white">
                Descarga nuestros catálogos completos en formato PDF
              </h3>
              <p className="text-xs text-slate-400">
                Líneas de pastelería, panadería Rapidox, fichas de mejoradores y equipamiento de molienda.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {companyInfo.catalogs.map((cat, i) => (
                <a
                  key={i}
                  href={cat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <FileText className="w-4 h-4 text-orange-400" />
                  <span>{cat.name}</span>
                  <Download className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white font-sans">
                ASITEC<span className="text-orange-500">.</span>
              </span>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded border border-orange-500/30">
                S.A.
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Empresa chilena dedicada a la innovación, desarrollo y comercialización de materias primas para la alimentación, mejoradores de panificación y servicio de laboratorio para la industria molinera.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <Award className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Certificación Internacional FSSC 22000 (GFSI)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Navegación</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#catalogo" className="hover:text-orange-400 transition-colors">Catálogo de Productos</a></li>
              <li><a href="#certificaciones" className="hover:text-orange-400 transition-colors">Acreditaciones & Certificaciones</a></li>
              <li><a href="#recetario" className="hover:text-orange-400 transition-colors">Recetas & Videos</a></li>
              <li><a href="#servicios" className="hover:text-orange-400 transition-colors">Servicios Industriales</a></li>
              <li><a href="#seguridad" className="hover:text-orange-400 transition-colors">Canal de Pago Banco de Chile</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Líneas de Producto</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Pastelería (Bases y Premezclas)</li>
              <li>Mejoradores Rapidox</li>
              <li>Levadura Instantánea Up Bakery</li>
              <li>Mix Vitamínico & Enzimas para Harinas</li>
            </ul>
          </div>

          {/* Contact Summary */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Contacto Directo</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>22 616 0200</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>info@asitec.cl</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                <span>Chañarcillo #691, Maipú</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} ASITEC S.A. Todos los derechos reservados. Rediseño moderno de alto rendimiento.
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#admin"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-orange-400 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Acceso Administración</span>
            </a>
            <span className="text-slate-800">|</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-orange-400 transition-colors cursor-pointer"
            >
              <span>Subir</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
