import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Copy, 
  Check, 
  CreditCard, 
  ExternalLink, 
  Phone, 
  Mail
} from 'lucide-react';
import { companyInfo } from '../data/company';

export const TrustAndSecuritySection: React.FC = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section id="seguridad" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
            Confianza Institucional & Ciberseguridad
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
            Canales Oficiales Verificados & Red de Distribución
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Verifica nuestras cuentas oficiales de recaudación y contacta a nuestra red autorizada para el norte del país.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Official Bank Account Card (Anti Fraud) */}
          <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-2xl p-7 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Alert Header */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-6">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>
                  <strong>AVISO DE SEGURIDAD:</strong> ASITEC S.A. nunca solicitará transferencias a personas naturales ni cuentas de terceros.
                </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Canal Único Oficial</span>
                    <h3 className="text-xl font-bold text-white">{companyInfo.bankSecurity.bankName}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verificado</span>
                </div>
              </div>

              {/* Bank Account Data Table */}
              <div className="space-y-2.5 mt-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs">
                
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Titular de la Cuenta:</span>
                  <span className="font-bold text-white text-sm">{companyInfo.bankSecurity.accountHolder}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">R.U.T. Empresa:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm">{companyInfo.bankSecurity.rut}</span>
                    <button
                      onClick={() => copyToClipboard(companyInfo.bankSecurity.rut, 'rut')}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Copiar RUT"
                    >
                      {copiedField === 'rut' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Tipo de Cuenta:</span>
                  <span className="font-semibold text-slate-200">{companyInfo.bankSecurity.accountType}</span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-400">Número de Cuenta:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-amber-400 text-base">{companyInfo.bankSecurity.accountNumber}</span>
                    <button
                      onClick={() => copyToClipboard(companyInfo.bankSecurity.accountNumber, 'cta')}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Copiar Número de Cuenta"
                    >
                      {copiedField === 'cta' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{companyInfo.bankSecurity.instruction}</span>
              <a 
                href={`mailto:${companyInfo.bankSecurity.paymentEmail}`}
                className="text-amber-400 hover:underline font-semibold"
              >
                {companyInfo.bankSecurity.paymentEmail}
              </a>
            </div>

          </div>

          {/* Authorized Regional Distributor Card (Ataelqui) */}
          <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                  Distribuidor Oficial Autorizado
                </span>
                <span className="text-xs text-slate-400 font-medium">3ª y 4ª Región</span>
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                {companyInfo.distributor.company}
              </h3>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Distribución exclusiva para las regiones de <strong>Atacama</strong> y <strong>Coquimbo</strong>. Abastecimiento ágil de premezclas de pastelería, levaduras y mejoradores Rapidox con despacho local.
              </p>

              <div className="mt-6 space-y-3 text-xs text-slate-700">
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                  <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Teléfono de Contacto</span>
                    <a href={`tel:${companyInfo.distributor.phoneRaw}`} className="font-semibold text-slate-900 hover:text-amber-600">
                      {companyInfo.distributor.phone}
                    </a>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                  <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Correo Electrónico</span>
                    <a href={`mailto:${companyInfo.distributor.email}`} className="font-semibold text-slate-900 hover:text-amber-600">
                      {companyInfo.distributor.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <a
                href={companyInfo.distributor.catalogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Ver Catálogo Ataelqui</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
