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
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header Modal */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Wheat className="w-4 h-4" />
            <span>{product.category} &bull; {product.subcategory}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            {/* Product Image */}
            <div className="w-44 h-44 shrink-0 rounded-2xl bg-slate-100 p-2 border border-slate-200 flex items-center justify-center overflow-hidden">
              <img 
                src={product.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80'} 
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply transition-transform hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80';
                }}
              />
            </div>

            {/* Main Info */}
            <div className="space-y-3 flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                <Globe className="w-3 h-3" />
                Origen: {product.country || 'Chile'}
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                {product.name}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Formats Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-amber-600" />
              Selecciona el Formato de Presentación:
            </label>
            <div className="flex flex-wrap gap-2">
              {formatList.map((f, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedFormat(f)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
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
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-700">
            <div className="font-bold flex items-center gap-1.5 text-slate-900">
              <Clock className="w-4 h-4 text-amber-600" />
              Duración y Condiciones de Almacenaje:
            </div>
            <p className="leading-relaxed">
              {product.shelfLife || '12 meses a partir de la fecha de elaboración. Conservar en un lugar fresco, seco, limpio y en envase cerrado original.'}
            </p>
          </div>

          {/* Quantity and Add to Cart Section */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600 uppercase">Cantidad:</span>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 py-2 text-sm font-bold text-slate-900 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={addedSuccess}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
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
    </div>
  );
};
