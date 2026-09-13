import React from 'react';
import { 
  Award, 
  FileCheck, 
  ShieldCheck, 
  ExternalLink, 
  Calendar
} from 'lucide-react';
import type { Certification } from '../types';
import { initialCertifications as staticCertifications } from '../data/certifications';

interface Props {
  certifications?: Certification[];
}

export const CertificationsSection: React.FC<Props> = ({ 
  certifications = staticCertifications 
}) => {
  const certList = certifications && certifications.length > 0 ? certifications : staticCertifications;

  return (
    <section id="certificaciones" className="py-16 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            Respaldo Técnico Institucional
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
            Acreditaciones & Certificaciones Oficiales
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Garantía técnica y cumplimiento de estándares regulatorios chilenos en análisis, inocuidad alimentaria y trazabilidad.
          </p>
        </div>

        {/* Dynamic Certification Cards List */}
        <div className="space-y-6">
          {certList.map((cert) => (
            <div 
              key={cert.id}
              className="bg-gradient-to-r from-amber-500/20 via-slate-800 to-blue-500/20 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-amber-400/50"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                
                {/* Main Info */}
                <div className="flex items-start gap-4 sm:gap-5 flex-1">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                    <Award className="w-8 h-8" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                        {cert.badge}
                      </span>
                      <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                        {cert.institution}
                      </span>
                      {cert.year && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3" />
                          Año {cert.year}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                      {cert.resolution}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
                      {cert.detail}
                    </p>
                  </div>
                </div>

                {/* Status Badge & Document Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-700/60">
                  <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Estado Oficial
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-emerald-400 flex items-center justify-center gap-1">
                      <FileCheck className="w-4 h-4" /> {cert.status || '100% Vigente'}
                    </span>
                  </div>

                  {cert.documentUrl && (
                    <a
                      href={cert.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors py-1 px-3 rounded-lg hover:bg-amber-400/10"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Ver Documento Oficial</span>
                    </a>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
