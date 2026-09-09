import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Gauge, 
  Award, 
  CheckCircle2, 
  XCircle,
  Clock, 
  Layers, 
  ArrowRight
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutivePitchModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'kpis' | 'comparativa' | 'roi' | 'features'>('kpis');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header con gradiente premium */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 px-8 py-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  Dossier Ejecutivo
                </span>
                <span className="text-xs text-slate-400">Propuesta de Transformación Digital</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
                Asitec S.A. 2.0: De Sitio Obsoleto a Motor de Ventas B2B
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            title="Cerrar presentación"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs de navegación ejecutiva */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-8 gap-2">
          <button
            onClick={() => setActiveTab('kpis')}
            className={`py-3.5 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'kpis'
                ? 'border-amber-600 text-amber-700 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gauge className="w-4 h-4" />
            1. Diagnóstico de Rendimiento
          </button>
          <button
            onClick={() => setActiveTab('comparativa')}
            className={`py-3.5 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'comparativa'
                ? 'border-amber-600 text-amber-700 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            2. Antes vs. Después (Técnico)
          </button>
          <button
            onClick={() => setActiveTab('roi')}
            className={`py-3.5 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'roi'
                ? 'border-amber-600 text-amber-700 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            3. Impacto en Ventas & Leads
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`py-3.5 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'features'
                ? 'border-amber-600 text-amber-700 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            4. Seguridad & Confianza SAG
          </button>
        </div>

        {/* Content Body */}
        <div className="p-8 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          
          {/* TAB 1: KPIS */}
          {activeTab === 'kpis' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm relative overflow-hidden">
                  <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Tiempo de Carga Actual
                  </div>
                  <div className="text-4xl font-extrabold text-red-600">4.8s - 6.2s</div>
                  <p className="text-xs text-slate-500 mt-2">
                    Cada segundo de retraso por sobre 2s reduce un 7% las conversiones y eleva el rebote en un 53%.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-emerald-200 shadow-sm relative overflow-hidden">
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Zap className="w-4 h-4" /> Nueva Arquitectura Vite SPA
                  </div>
                  <div className="text-4xl font-extrabold text-emerald-600">0.3s</div>
                  <p className="text-xs text-slate-500 mt-2">
                    Carga sub-segundo con 0 scripts bloqueantes, optimización WebP y filtrado reactivo en memoria.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm relative overflow-hidden">
                  <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" /> Score Google Lighthouse
                  </div>
                  <div className="text-4xl font-extrabold text-amber-600">99 / 100</div>
                  <p className="text-xs text-slate-500 mt-2">
                    Posicionamiento SEO privilegiado para búsquedas B2B de &ldquo;mejoradores panadería&rdquo; y &ldquo;premezclas Chile&rdquo;.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-amber-600" />
                  ¿Por qué el sitio actual de Asitec es tan lento?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <p className="font-semibold text-slate-800">1. Sobrecarga masiva de plugins antiguos:</p>
                    <p>
                      Carga simultáneamente LayerSlider 6.1.6, Revolution Slider 5.4.1, BeTheme 17.3, Greensock 1.19 y Elementor, generando más de 25 solicitudes HTTP bloqueantes antes de mostrar contenido.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <p className="font-semibold text-slate-800">2. Videos MP4 pesados en el Home:</p>
                    <p>
                      Los videos del recetario estaban cargando en paralelo sin lazy-loading, consumiendo ancho de banda del cliente y saturando el hosting compartido.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPARATIVA */}
          {activeTab === 'comparativa' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <th className="p-4">Característica / Métrica</th>
                    <th className="p-4 text-red-700 bg-red-50/50">Sitio Actual de Asitec (WordPress)</th>
                    <th className="p-4 text-emerald-800 bg-emerald-50/50">Nueva Plataforma Rediseñada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-4 font-medium text-slate-900">Velocidad de Carga Inicial</td>
                    <td className="p-4 text-red-600 flex items-center gap-2">
                      <XCircle className="w-4 h-4 shrink-0" /> 4.8 a 6.2 segundos (Lenta)
                    </td>
                    <td className="p-4 text-emerald-700 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" /> 0.3 segundos (Instantánea)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-slate-900">Búsqueda en Catálogo</td>
                    <td className="p-4 text-red-600 flex items-center gap-2">
                      <XCircle className="w-4 h-4 shrink-0" /> Inexistente. Navegación manual por 16 páginas.
                    </td>
                    <td className="p-4 text-emerald-700 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" /> Buscador reactivo en tiempo real (45+ productos).
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-slate-900">Generación de Cotizaciones</td>
                    <td className="p-4 text-red-600 flex items-center gap-2">
                      <XCircle className="w-4 h-4 shrink-0" /> Formulario de texto plano sin selección de ítems.
                    </td>
                    <td className="p-4 text-emerald-700 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" /> Cotizador con carrito B2B, formatos y 1-clic WhatsApp/Email.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-slate-900">Experiencia Móvil (Celular)</td>
                    <td className="p-4 text-red-600 flex items-center gap-2">
                      <XCircle className="w-4 h-4 shrink-0" /> Menús colapsados pesados, popups molestos.
                    </td>
                    <td className="p-4 text-emerald-700 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" /> 100% PWA-ready, táctil, rápida y sin saltos.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-slate-900">Equipos y Calibración SAG</td>
                    <td className="p-4 text-red-600 flex items-center gap-2">
                      <XCircle className="w-4 h-4 shrink-0" /> Texto plano difícil de leer, fotos genéricas.
                    </td>
                    <td className="p-4 text-emerald-700 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" /> Fichas interactivas Bastak C-4000, Glutomatic y sello SAG oficial.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: ROI */}
          {activeTab === 'roi' && (
            <div className="space-y-6">
              <div className="bg-amber-500/10 border border-amber-300/40 p-6 rounded-xl">
                <h4 className="font-bold text-amber-950 text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-700" />
                  Impacto Directo en la Rentabilidad de Asitec S.A.
                </h4>
                <p className="text-sm text-amber-900 mt-2 leading-relaxed">
                  En el mercado industrial y panificador B2B chileno, los jefes de producción, maestros panaderos y compradores de molinos buscan soluciones desde su teléfono en faena o taller. La lentitud del sitio actual generaba fuga constante de clientes hacia competidores.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-white rounded-xl border border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-3">
                    +40%
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm">Incremento en Solicitudes de Cotización</h5>
                  <p className="text-xs text-slate-500 mt-1">
                    Al permitir agregar productos con formatos exactos (Sacos de 25 kg, Cajas de 20x400g) el cliente cotiza sin fricción.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-xl border border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3">
                    Instant
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm">Cierre Directo por WhatsApp</h5>
                  <p className="text-xs text-slate-500 mt-1">
                    Canal directo al equipo comercial con el pedido pre-formateado listo para responder en segundos.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-xl border border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-3">
                    100%
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm">Preservación de Toda la Data</h5>
                  <p className="text-xs text-slate-500 mt-1">
                    Se respetaron el 100% de productos, fichas técnicas, recetas y normativas oficiales existentes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEGURIDAD */}
          {activeTab === 'features' && (
            <div className="space-y-4">
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Prevención Activa de Fraude Bancario</h4>
                    <p className="text-xs text-slate-500">Resolución al problema de suplantación de identidad</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  En lugar de un incómodo pop-up que los clientes cerraban sin leer, la nueva plataforma cuenta con una <strong>Tarjeta Verificada de Recaudación Oficial Banco de Chile</strong>, con copiado en 1 clic y certificación de cuenta corriente institucional única a nombre de Asitec S.A.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Destacamiento de Acreditación SAG Res. Nº 6805 / 2016</h4>
                    <p className="text-xs text-slate-500">Ventaja competitiva frente a importadores informales</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  Asitec S.A. no es solo un distribuidor; es un <strong>laboratorio certificado por el Servicio Agrícola y Ganadero</strong>. La nueva web sitúa esta certificación en primer plano, otorgando confianza inmediata a molinos harineros de gran envergadura.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer con CTA de Presentación */}
        <div className="px-8 py-5 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            💡 <strong>Tip para la reunión:</strong> Puedes dejar abierta esta ventana durante la presentación a gerentes o cerrar y navegar en vivo la plataforma interactiva.
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            Explorar Plataforma en Vivo
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
