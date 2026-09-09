import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  ArrowUpRight, 
  Cpu, 
  Gauge, 
  FileCheck,
  PackageCheck
} from 'lucide-react';
import { labEquipments, sagCertification } from '../data/equipments';
import type { LabEquipment } from '../types';

interface Props {
  onQuoteEquipment: (eq: LabEquipment) => void;
}

export const SagLabSection: React.FC<Props> = ({ onQuoteEquipment }) => {
  const [selectedEq, setSelectedEq] = useState<LabEquipment>(labEquipments[0]);

  return (
    <section id="laboratorio" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Certification Announcement Banner */}
        <div className="bg-gradient-to-r from-amber-500/20 via-slate-800 to-blue-500/20 border border-amber-500/30 rounded-2xl p-6 mb-12 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    Acreditación Oficial
                  </span>
                  <span className="text-xs text-slate-300 font-semibold">{sagCertification.institution}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white mt-1">
                  Laboratorio Calibrado y Certificado: {sagCertification.resolution}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  {sagCertification.detail}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Estándar SAG</span>
                <span className="text-sm font-extrabold text-emerald-400 flex items-center justify-center gap-1">
                  <FileCheck className="w-4 h-4" /> 100% Vigente
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            División de Molinos & Análisis
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
            Equipamiento de Precisión & Laboratorio SAG
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Equipos analíticos certificados para determinar calidad de harinas, actividad enzimática, gluten y humedad con trazabilidad oficial.
          </p>
        </div>

        {/* Interactive Equipment Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Equipment Navigation Selector */}
          <div className="lg:col-span-5 space-y-3">
            {labEquipments.map((eq) => {
              const isSelected = selectedEq.id === eq.id;

              return (
                <button
                  key={eq.id}
                  onClick={() => setSelectedEq(eq)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-slate-800 border-amber-500 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400">{eq.brand}</span>
                      {eq.model && (
                        <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                          {eq.model}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-white">
                      {eq.name}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {eq.tagline}
                    </p>
                  </div>

                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Equipment Detailed Card */}
          <div className="lg:col-span-7 bg-slate-800/90 rounded-2xl border border-slate-700 p-6 sm:p-8 shadow-2xl relative">
            
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                    {selectedEq.brand} &bull; Modelo {selectedEq.model}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Acreditado SAG
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white mt-1">
                  {selectedEq.name}
                </h3>
              </div>

              <button
                onClick={() => onQuoteEquipment(selectedEq)}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Cotizar Este Equipo</span>
              </button>
            </div>

            <div className="mt-6 space-y-6">
              
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60">
                <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider text-amber-400 mb-1">
                  Principio de Operación:
                </p>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {selectedEq.description}
                </p>
              </div>

              {/* Technical Specifications */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  Especificaciones Técnicas & Normativas:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedEq.specs.map((spec, i) => (
                    <div 
                      key={i} 
                      className="p-3 bg-slate-900/40 rounded-lg border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advisory note */}
              <div className="p-4 bg-blue-950/40 border border-blue-800/50 rounded-xl flex items-center justify-between text-xs text-blue-200">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Incluye servicio de instalación, capacitación a operadores y certificación de calibración anual.</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
