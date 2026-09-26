import React, { useState } from 'react';
import { 
  X, 
  ShoppingCart, 
  Package, 
  Clock, 
  Globe, 
  Check, 
  Wheat,
  Plus,
  Minus
} from 'lucide-react';
import type { Product } from '../types';

interface Props {
  product: Product | null;
  onClose: () => void;
  onAddToQuote: (product: Product, format: string, qty: number) => void;
}

export const ProductModal: React.FC<Props> = ({ product, onClose, onAddToQuote }) => {
  if (!product) return null;

  // Split formats if multiple
  const formatList = product.format 
    ? product.format.split(/(?=Saco|Caja|Balde)/g).map(s => s.trim()).filter(Boolean)
    : ['Formato Estándar Industrial'];

  const [selectedFormat, setSelectedFormat] = useState<string>(formatList[0] || 'Formato Estándar');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const handleAdd = () => {
    onAddToQuote(product, selectedFormat, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 850);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl max-h-[90vh] sm:max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Modal - Pinned */}
        <div className="shrink-0 px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Wheat className="w-4 h-4 shrink-0" />
            <span className="truncate">{product.category} &bull; {product.subcategory}</span>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-center sm:items-start">
            {/* Product Image / Cuadro en blanco */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-xl bg-slate-50 p-2 border border-slate-200 flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply transition-transform hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-white rounded-lg border border-slate-100 flex flex-col items-center justify-center text-slate-300">
                  <Package className="w-8 h-8 text-slate-200 mb-1" />
                  <span className="text-[10px] font-semibold text-slate-400">Sin fotografía</span>
                </div>
              )}
            </div>

            {/* Main Info */}
            <div className="space-y-1.5 flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                <Globe className="w-3 h-3" />
                <span>Origen: {product.country || 'Chile'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {product.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Formats Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-amber-600" />
              <span>Formato de Presentación:</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {formatList.map((f, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedFormat(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    selectedFormat === f
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Durability & Storage instructions */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs text-slate-700">
            <div className="font-bold flex items-center gap-1.5 text-slate-900">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Duración y Condiciones de Almacenaje:</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              {product.shelfLife || '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y en envase cerrado original.'}
            </p>
          </div>

        </div>

        {/* Modal Sticky Bottom Action Bar - Always in viewport */}
        <div className="shrink-0 px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase hidden xs:inline">Cant:</span>
            <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
                title="Disminuir"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 py-1.5 text-xs font-bold text-slate-900 min-w-[2.5rem] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
                title="Aumentar"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={addedSuccess}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
              addedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Agregado al Cotizador!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                <span>Añadir a Cotización</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
