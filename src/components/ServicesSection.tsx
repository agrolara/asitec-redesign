import React from 'react';
import { 
  Layers, 
  Package, 
  Cpu, 
  FlaskConical, 
  ArrowRight, 
  Factory, 
  CheckCircle2 
} from 'lucide-react';
import { companyInfo } from '../data/company';

interface Props {
  onOpenQuote: () => void;
}

export const ServicesSection: React.FC<Props> = ({ onOpenQuote }) => {
  const iconMap: Record<string, React.ElementType> = {
    Layers,
    Package,
    Cpu,
    FlaskConical
  };

  return (
    <section id="servicios" className="py-20 bg-slate-100/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100/60 px-3 py-1 rounded-full border border-amber-200">
            Capacidad Fabril & Maquilas
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
            Servicios Industriales para la Industria Alimentaria
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Ponemos a disposición de su empresa nuestra planta productiva en Maipú, certificaciones sanitarias y líneas automatizadas de procesamiento y envasado.
          </p>
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companyInfo.services.map((srv) => {
            const Icon = iconMap[srv.icon] || Factory;

            return (
              <div
                key={srv.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center mb-5 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Estándar HACCP
                  </span>
                  <button
                    onClick={onOpenQuote}
                    className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
                  >
                    <span>Cotizar</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Industrial Banner */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-white">
              ¿Necesitas una formulación exclusiva o maquila personalizada?
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              Desarrollamos premezclas a medida para optimizar el costo por kilo, color, tolerancia fermentativa y vida útil en anaquel de tus líneas de panificación y pastelería.
            </p>
          </div>
          <button
            onClick={onOpenQuote}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide shadow-md transition-all shrink-0 active:scale-95"
          >
            Contactar a Ingeniería de Procesos
          </button>
        </div>

      </div>
    </section>
  );
};
