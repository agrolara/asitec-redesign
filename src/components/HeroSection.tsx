import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Download,
  Wheat,
  FlaskConical
} from 'lucide-react';
import { companyInfo } from '../data/company';

interface Props {
  onOpenPitch: () => void;
  onExploreCatalog: () => void;
}

export const HeroSection: React.FC<Props> = ({ onOpenPitch, onExploreCatalog }) => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-20 md:py-24">
      {/* Dynamic background lighting */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper Announcement Badge */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide uppercase shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            Asitec S.A. &bull; Calidad Certificada en Alimentos
          </div>

          <button
            onClick={onOpenPitch}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Presentación Gerencial: Antes vs Después</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Innovación, Tecnología & Materias Primas para la <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">Alimentación</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              Más de <strong>26 años</strong> liderando el mercado chileno en premezclas de alta gama para panadería y pastelería, núcleos enzimáticos para molinos y calibración de instrumental analítico respaldado por el <strong>Servicio Agrícola y Ganadero (SAG)</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onExploreCatalog}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all flex items-center gap-2 active:scale-95"
              >
                <span>Explorar Catálogo de Productos</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#laboratorio"
                className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm transition-all flex items-center gap-2 active:scale-95"
              >
                <FlaskConical className="w-4 h-4 text-amber-400" />
                <span>Línea Equipos SAG</span>
              </a>

              <a
                href={companyInfo.catalogs[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-xl bg-transparent hover:bg-white/5 border border-slate-700/80 text-slate-300 hover:text-white font-medium text-sm transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-slate-400" />
                <span>Descargar PDF</span>
              </a>
            </div>

            {/* Trust bullet points */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800/80 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Formulaciones 100% estandarizadas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Resolución Exenta Nº 6805 / 2016</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Despacho a todo Chile</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Card with High Tech Food Presentation */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-2xl">
              
              {/* Image banner */}
              <div className="relative h-64 rounded-xl overflow-hidden mb-6 border border-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80" 
                  alt="Panadería y Materias Primas Asitec" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <Wheat className="w-3.5 h-3.5" />
                    Línea Rapidox & Premezclas
                  </div>
                  <span className="text-[11px] text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded">
                    Casa Matriz Maipú
                  </span>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-colors">
                  <div className="text-2xl font-extrabold text-amber-400">{companyInfo.yearsExperience}</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">Trayectoria Industrial</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-colors">
                  <div className="text-2xl font-extrabold text-emerald-400">+45</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">Productos en Línea</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-colors">
                  <div className="text-2xl font-extrabold text-white">SAG</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">Res. Nº 6805 / 2016</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-colors">
                  <div className="text-2xl font-extrabold text-blue-400">+850</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">Clientes Industriales</div>
                </div>
              </div>

              {/* Verified Payment Micro Card */}
              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-amber-300">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Recaudación Oficial: <strong>Banco de Chile</strong></span>
                </div>
                <a href="#seguridad" className="text-amber-400 hover:underline font-bold text-[11px]">
                  Verificar
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
