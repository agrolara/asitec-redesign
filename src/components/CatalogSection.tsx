import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Package, 
  Clock, 
  FileText, 
  Check, 
  X
} from 'lucide-react';
import type { Product } from '../types';
import { products } from '../data/products';

interface Props {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectProduct: (p: Product) => void;
  onQuickAdd: (p: Product) => void;
}

export const CatalogSection: React.FC<Props> = ({ 
  selectedCategory, 
  onSelectCategory, 
  onSelectProduct, 
  onQuickAdd 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcat, setSelectedSubcat] = useState('Todos');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  // Unique subcategories based on category
  const availableSubcats = useMemo(() => {
    const relevant = selectedCategory === 'Todos'
      ? products
      : products.filter(p => p.category === selectedCategory);
    const set = new Set(relevant.map(p => p.subcategory));
    return ['Todos', ...Array.from(set)];
  }, [selectedCategory]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category match
      if (selectedCategory !== 'Todos' && p.category !== selectedCategory) {
        return false;
      }
      // Subcategory match
      if (selectedSubcat !== 'Todos' && p.subcategory !== selectedSubcat) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesFormat = p.format.toLowerCase().includes(query);
        const matchesSubcat = p.subcategory.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesFormat || matchesSubcat;
      }
      return true;
    });
  }, [selectedCategory, selectedSubcat, searchQuery]);

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(p);
    setAddedIds(prev => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [p.id]: false }));
    }, 1200);
  };

  return (
    <section id="catalogo" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Description */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/20">
              <Package className="w-3.5 h-3.5 text-amber-600" />
              Catálogo Industrial Unificado
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Materias Primas & Premezclas en Línea
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              Explora nuestras más de 45 soluciones formuladas para panaderías industriales, pastelerías artesanales y molinos harineros de todo el país.
            </p>
          </div>

          {/* Quick Search Bar */}
          <div className="w-full md:w-80 relative">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, formato..."
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Main Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-4">
          {['Todos', 'Pastelería', 'Panadería', 'Insumos para Molinos'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                onSelectCategory(cat);
                setSelectedSubcat('Todos');
              }}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'Todos' ? 'Todos los Productos (45)' : cat}
            </button>
          ))}
        </div>

        {/* Subcategory Pills */}
        {availableSubcats.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs font-semibold text-slate-600 no-scrollbar">
            <span className="text-slate-400 uppercase tracking-wider text-[11px] shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Sublínea:
            </span>
            {availableSubcats.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcat(sub)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  selectedSubcat === sub
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
          <span>
            Mostrando <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> productos
          </span>
          {searchQuery && (
            <span>
              Filtro de búsqueda: &ldquo;<strong className="text-slate-800">{searchQuery}</strong>&rdquo;
            </span>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isAdded = addedIds[product.id];

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group"
                >
                  <div>
                    {/* Image Box */}
                    <div className="relative h-48 bg-gradient-to-b from-slate-50 to-slate-100/60 p-4 flex items-center justify-center overflow-hidden border-b border-slate-100">
                      <img 
                        src={product.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80'} 
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      
                      {/* Subcategory Tag */}
                      <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-slate-700 px-2.5 py-1 rounded-md shadow-xs border border-slate-200">
                        {product.subcategory}
                      </span>

                      {/* Origin pill */}
                      {product.country && product.country !== 'Chile' && (
                        <span className="absolute top-3 right-3 text-[10px] font-bold uppercase bg-amber-500 text-white px-2 py-0.5 rounded shadow-xs">
                          {product.country}
                        </span>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-2">
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Formats Tags */}
                      {product.format && (
                        <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                          <Package className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="truncate">{product.format}</span>
                        </div>
                      )}

                      {/* Shelf life */}
                      {product.shelfLife && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span className="truncate">{product.shelfLife.split('.')[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-5 pt-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>Ficha Técnica</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(product, e)}
                      className={`p-2 rounded-xl transition-all shadow-sm active:scale-90 flex items-center justify-center ${
                        isAdded 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-slate-900 hover:bg-amber-600 text-white'
                      }`}
                      title="Agregar al cotizador"
                    >
                      {isAdded ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-lg font-bold text-slate-800">No se encontraron productos</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No existen productos que coincidan con &ldquo;{searchQuery}&rdquo;. Prueba limpiando los filtros o utilizando términos como &ldquo;bizcocho&rdquo;, &ldquo;marraqueta&rdquo; o &ldquo;levadura&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('Todos');
                setSelectedSubcat('Todos');
              }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
            >
              Restablecer Filtros
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
