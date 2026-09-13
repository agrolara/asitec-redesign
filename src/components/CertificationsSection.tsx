import React, { useState } from 'react';
import { 
  Award, 
  FileCheck, 
  ShieldCheck, 
  ExternalLink, 
  Calendar,
  ZoomIn,
  X,
  Eye
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
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

  const isImageUrl = (url?: string) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|webp|gif|svg)($|\?)/i.test(url) || url.includes('/uploads/');
  };

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
            Garantía técnica y cumplimiento de estándares internacionales y nacionales en inocuidad alimentaria, formulación y trazabilidad.
          </p>
        </div>

        {/* Dynamic Certification Cards List */}
        <div className="space-y-6">
          {certList.map((cert) => {
            const hasImage = isImageUrl(cert.documentUrl);

            return (
              <div 
                key={cert.id}
                className="bg-gradient-to-r from-amber-500/15 via-slate-850 to-blue-500/15 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-amber-400/50 relative overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  
                  {/* Main Info */}
                  <div className="flex items-start gap-4 sm:gap-5 flex-1">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                      <Award className="w-8 h-8" />
                    </div>

                    <div className="space-y-2 flex-1">
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
                            {cert.year}
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

                  {/* Right side: Thumbnail preview & Action buttons */}
                  <div className="flex sm:flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-700/60">
                    
                    {/* Status Badge */}
                    <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-center shrink-0">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                        Estado Oficial
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-emerald-400 flex items-center justify-center gap-1">
                        <FileCheck className="w-4 h-4" /> {cert.status || '100% Vigente'}
                      </span>
                    </div>

                    {/* Preview thumbnail if image exists */}
                    {hasImage && cert.documentUrl && (
                      <div 
                        onClick={() => setSelectedImage({ url: cert.documentUrl!, title: cert.resolution })}
                        className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-amber-400/40 bg-slate-950 hover:border-amber-400 transition-all shadow-md hover:shadow-amber-500/20 w-24 h-16 sm:w-28 sm:h-20 shrink-0"
                        title="Clic para ver el certificado en alta resolución"
                      >
                        <img 
                          src={cert.documentUrl} 
                          alt={cert.resolution} 
                          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
                          <span className="bg-amber-500/90 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                            <ZoomIn className="w-3 h-3" /> Ver
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Document Action Button */}
                    {cert.documentUrl && (
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                        {hasImage ? (
                          <button
                            type="button"
                            onClick={() => setSelectedImage({ url: cert.documentUrl!, title: cert.resolution })}
                            className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors py-2 px-3.5 rounded-xl shadow-lg hover:shadow-amber-400/20 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver Certificado Oficial</span>
                          </button>
                        ) : (
                          <a
                            href={cert.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors py-2 px-3.5 rounded-xl shadow-lg hover:shadow-amber-400/20"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Ver Documento Oficial</span>
                          </a>
                        )}
                        <a
                          href={cert.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1 text-[11px] font-medium text-slate-400 hover:text-amber-300 transition-colors text-center"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Abrir en pestaña nueva</span>
                        </a>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox Modal for Certificate Preview */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl max-h-[92vh] w-full flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/90 shrink-0">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-xl">
                  {selectedImage.title}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={selectedImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-xs font-bold text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Pestaña nueva</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  aria-label="Cerrar vista previa"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable Certificate Preview */}
            <div className="flex-1 overflow-auto p-4 bg-slate-950 flex items-center justify-center">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.title} 
                className="max-h-[78vh] w-auto object-contain rounded shadow-lg border border-slate-800"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
