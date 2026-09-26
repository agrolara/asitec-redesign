import React, { useState } from 'react';
import { 
  Layers, 
  Package, 
  Cpu, 
  FlaskConical, 
  ArrowRight, 
  Factory, 
  CheckCircle2,
  Mail,
  Check
} from 'lucide-react';
import { companyInfo } from '../data/company';

interface Props {
  onOpenQuote: () => void;
}

export const ServicesSection: React.FC<Props> = ({ onOpenQuote }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const iconMap: Record<string, React.ElementType> = {
    Layers,
    Package,
    Cpu,
    FlaskConical
  };

  const handleContactEngineering = (_e?: React.MouseEvent) => {
    try {
      navigator.clipboard.writeText('info@asitec.cl');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 3000);
    } catch {
      // ignore
    }
    window.location.href = 'mailto:info@asitec.cl?subject=Contacto%20Ingenier%C3%ADa%20de%20Procesos%20ASITEC';
  };

  return (
    <section id="servicios" className="py-20 bg-gradient-to-b from-white via-orange-50/20 to-white border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-orange-700 uppercase tracking-widest bg-orange-100/80 px-3.5 py-1 rounded-full border border-orange-200">
            Capacidad Fabril & Maquilas
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
            Servicios Industriales para la Industria Alimentaria
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Ponemos a disposición de su empresa nuestra planta productiva en Maipú, certificación internacional FSSC 22000 y líneas automatizadas de procesamiento y envasado.
          </p>
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companyInfo.services.map((srv) => {
            const Icon = iconMap[srv.icon] || Factory;

            return (
              <div
                key={srv.id}
                className="bg-white p-6 rounded-2xl border-2 border-orange-100 shadow-sm hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-orange-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> FSSC 22000
                  </span>
                  <button
                    onClick={onOpenQuote}
                    className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer"
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
        <div className="mt-12 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl shadow-orange-500/10">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              ¿Necesitas una formulación exclusiva o maquila personalizada?
            </h3>
            <p className="text-xs sm:text-sm text-orange-50 max-w-2xl leading-relaxed">
              Desarrollamos premezclas a medida para optimizar el costo por kilo, color, tolerancia fermentativa y vida útil en anaquel de tus líneas de panificación y pastelería.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="mailto:info@asitec.cl?subject=Contacto%20Ingenier%C3%ADa%20de%20Procesos%20ASITEC"
              onClick={handleContactEngineering}
              className="px-6 py-4 rounded-xl bg-white hover:bg-orange-50 text-orange-950 font-black text-xs sm:text-sm tracking-wide shadow-lg transition-all active:scale-95 flex items-center gap-2.5 cursor-pointer"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">¡info@asitec.cl copiado!</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 text-orange-600" />
                  <span>Contactar a Ingeniería de Procesos</span>
                </>
              )}
            </a>
            <span className="text-xs font-mono font-bold text-white bg-black/20 px-3 py-2 rounded-xl border border-white/20">
              info@asitec.cl
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
