import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Copy, 
  Check, 
  CreditCard, 
  Mail,
  Building2
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
    <section id="seguridad" className="py-16 bg-white border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-orange-700 uppercase tracking-widest bg-orange-100/70 px-3.5 py-1 rounded-full border border-orange-200">
            Seguridad Institucional & Ciberseguridad
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            Canales Oficiales Verificados de Recaudación
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Canal bancario único y verificado para la emisión de pagos de insumos y materias primas industriales.
          </p>
        </div>

        {/* Gran Banner de Aviso de Seguridad ASITEC */}
        <div className="max-w-4xl mx-auto mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-2 border-orange-300 shadow-xl shadow-orange-500/10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <AlertTriangle className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black uppercase tracking-wider border border-orange-300">
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              <span>Comunicado Oficial de Seguridad ASITEC</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              AVISO DE SEGURIDAD ASITEC S.A.
            </h3>
            <p className="text-base sm:text-lg font-bold text-orange-950 leading-snug">
              ASITEC S.A. nunca solicitará transferencias a personas naturales ni cuentas de terceros ajenos a nuestra razón social.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Todos los pagos de facturas deben emitirse única y exclusivamente a nombre de <strong>ASITEC S.A.</strong> en nuestra cuenta corriente oficial verificada de <strong>Banco de Chile</strong> que se detalla a continuación.
            </p>
          </div>
        </div>

        {/* Centered Bank Account Card (Bakels White & Orange Pastel Style) */}
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-white via-orange-50/20 to-amber-50/30 rounded-3xl p-6 sm:p-9 border border-orange-200/80 shadow-xl shadow-orange-500/5 relative overflow-hidden">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-orange-500/10 border border-orange-400/30 flex items-center justify-center text-orange-600 shadow-sm shrink-0">
                <CreditCard className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700">Canal Bancario Oficial</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{companyInfo.bankSecurity.bankName}</h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cuenta Verificada</span>
            </div>
          </div>

          {/* Bank Account Data Table */}
          <div className="space-y-3 bg-white p-5 rounded-2xl border border-orange-100 shadow-sm text-xs sm:text-sm">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-orange-500" />
                Titular de la Cuenta:
              </span>
              <span className="font-bold text-slate-900">{companyInfo.bankSecurity.accountHolder}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
              <span className="text-slate-500 font-medium">R.U.T. Empresa:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900">{companyInfo.bankSecurity.rut}</span>
                <button
                  onClick={() => copyToClipboard(companyInfo.bankSecurity.rut, 'rut')}
                  className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 transition-colors cursor-pointer"
                  title="Copiar RUT"
                >
                  {copiedField === 'rut' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
              <span className="text-slate-500 font-medium">Tipo de Cuenta:</span>
              <span className="font-semibold text-slate-800">{companyInfo.bankSecurity.accountType}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-1">
              <span className="text-slate-500 font-medium">Número de Cuenta:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-orange-600 text-base sm:text-lg">{companyInfo.bankSecurity.accountNumber}</span>
                <button
                  onClick={() => copyToClipboard(companyInfo.bankSecurity.accountNumber, 'cta')}
                  className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 transition-colors cursor-pointer"
                  title="Copiar Número de Cuenta"
                >
                  {copiedField === 'cta' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

          </div>

          {/* Footer Receipt Confirmation */}
          <div className="mt-5 pt-4 border-t border-orange-100/80 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>{companyInfo.bankSecurity.instruction}</span>
            <a 
              href={`mailto:${companyInfo.bankSecurity.paymentEmail}`}
              className="text-orange-600 hover:text-orange-700 hover:underline font-bold flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              {companyInfo.bankSecurity.paymentEmail}
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
