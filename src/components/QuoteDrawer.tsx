import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Mail, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { QuoteItem } from '../types';
import { companyInfo } from '../data/company';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClear: () => void;
}

export const QuoteDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClear
}) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    city: '',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const generateQuoteText = () => {
    let msg = `SOLICITUD DE COTIZACIÓN - ASITEC S.A.\n`;
    msg += `------------------------------------\n`;
    msg += `Cliente: ${formData.name || 'Sin especificar'}\n`;
    msg += `Empresa / Panadería: ${formData.company || 'Sin especificar'}\n`;
    msg += `Teléfono: ${formData.phone || 'Sin especificar'}\n`;
    msg += `Email: ${formData.email || 'Sin especificar'}\n`;
    msg += `Ciudad/Región: ${formData.city || 'Sin especificar'}\n\n`;
    msg += `PRODUCTOS SOLICITADOS:\n`;
    
    items.forEach((item, index) => {
      msg += `${index + 1}. ${item.product.name}\n`;
      msg += `   • Cantidad: ${item.quantity}\n`;
      msg += `   • Formato: ${item.selectedFormat}\n`;
      msg += `   • Categoría: ${item.product.category}\n`;
    });

    if (formData.notes) {
      msg += `\nDetalles adicionales:\n${formData.notes}\n`;
    }

    msg += `\n------------------------------------\n`;
    msg += `Solicitado formalmente desde la plataforma web oficial de ASITEC S.A.`;
    return msg;
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const text = generateQuoteText();
    const mailto = `mailto:${companyInfo.contact.email}?subject=Cotización%20Asitec%20-%20${encodeURIComponent(formData.company || formData.name || 'Web')}&body=${encodeURIComponent(text)}`;
    window.location.href = mailto;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-fade-in flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-slide-left">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Cotizador B2B en Línea
              </h3>
              <p className="text-xs text-slate-400">
                {totalItems} {totalItems === 1 ? 'ítem seleccionado' : 'ítems seleccionados'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">Tu cotizador está vacío</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explora el catálogo de productos y añade insumos con el botón &ldquo;Añadir a Cotización&rdquo;.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl"
              >
                Volver al Catálogo
              </button>
            </div>
          ) : (
            <>
              {/* Product list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase">
                  <span>Productos a Cotizar ({items.length})</span>
                  <button
                    onClick={onClear}
                    className="text-red-500 hover:text-red-700 text-[11px] font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Vaciar
                  </button>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                  {items.map((item) => (
                    <div key={item.product.id} className="p-3.5 flex items-center justify-between gap-3 bg-white">
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] uppercase font-bold text-amber-700">
                          {item.product.category}
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 truncate">
                          {item.product.name}
                        </h5>
                        <div className="text-[11px] text-slate-500 truncate">
                          Formato: <span className="font-semibold text-slate-700">{item.selectedFormat}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.product.id, -1)}
                            className="p-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.product.id, 1)}
                            className="p-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Contact Form */}
              <form onSubmit={handleSendEmail} className="space-y-3 pt-4 border-t border-slate-200 text-xs">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Datos de Contacto para la Cotización:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nombre y Apellido *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Juan Pérez"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Empresa / Panadería *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Panadería San José"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Teléfono Móvil *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+56 9 1234 5678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      placeholder="contacto@panaderia.cl"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ciudad o Región de Despacho</label>
                  <input
                    type="text"
                    placeholder="Ej: Santiago / Valparaíso / La Serena / Concepción"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Notas o Requerimientos Especiales</label>
                  <textarea
                    rows={2}
                    placeholder="Detalles sobre volumen mensual, frecuencia de entrega, etc."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Submission Success Toast */}
                {submitted && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>¡Solicitud preparada exitosamente! Abriendo tu correo oficial...</span>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95 group"
                  >
                    <Mail className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Enviar Cotización por Correo Oficial (info@asitec.cl)</span>
                  </button>
                </div>
              </form>
            </>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Respuesta comercial estimada: &lt; 2 horas hábiles</span>
          <span className="font-bold text-slate-700">Asitec S.A.</span>
        </div>

      </div>
    </div>
  );
};
