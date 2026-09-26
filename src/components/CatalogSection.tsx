import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Package, 
  Eye, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Cake,
  Wheat,
  Layers,
  Clock
} from 'lucide-react';
import type { Product } from '../types';
import { products as staticProducts } from '../data/products';

interface Props {
  products?: Product[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectProduct: (p: Product) => void;
  onQuickAdd: (p: Product) => void;
}

interface CategoryPackage {
  id: string;
  title: string;
  badge: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
  images: string[];
  subcategories: string[];
  filterFn: (p: Product) => boolean;
}

export const CatalogSection: React.FC<Props> = ({ 
  products = staticProducts,
  onSelectProduct, 
  onQuickAdd 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryModal, setActiveCategoryModal] = useState<CategoryPackage | null>(null);
  const [modalSearch, setModalSearch] = useState('');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  
  // Independent slide index for each category card carousel
  const [cardSlides, setCardSlides] = useState<Record<string, number>>({
    'cat-pasteleria': 0,
    'cat-panaderia': 0,
    'cat-molinos': 0
  });

  // Category Packages Definition: Exactly 3 Main Product Divisions
  const categoryPackages: CategoryPackage[] = useMemo(() => [
    {
      id: 'cat-pasteleria',
      title: 'Pastelería Fina & Repostería',
      badge: 'Línea Pastelería',
      shortDesc: 'Premezclas para bizcochos, queques y muffins de alto volumen, más bases en polvo para crema pastelera, chantilly, merengue italiano y remojo tres leches.',
      icon: Cake,
      images: [
        'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_bizcocho_vainilla.jpg',
        'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_bizcocho_chocolate.jpg',
        'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_queque_vainilla.jpg',
        'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_muffins_vainilla.jpg',
        'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_queque_chocolate.jpg',
        'https://www.asitec.cl/wp-content/uploads/2021/04/crema-chantilly-1.jpg',
        'https://www.asitec.cl/wp-content/uploads/2021/04/crema-chantilly-chocolate-1.jpg',
        'https://www.asitec.cl/wp-content/uploads/2021/04/remojo-3-leches.jpg',
        'https://www.asitec.cl/wp-content/uploads/2021/04/brillo.jpg',
        'https://www.asitec.cl/wp-content/uploads/2021/04/bases-para-preparar-merengue-1.jpg'
      ],
      subcategories: ['Bizcochos & Queques', 'Muffins', 'Crema Pastelera', 'Chantilly', 'Merengue', 'Tres Leches', 'Brillos'],
      filterFn: (p: Product) => {
        const c = (p.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return c.includes('pasteler');
      }
    },
    {
      id: 'cat-panaderia',
      title: 'Panadería Rapidox & Mejoradores',
      badge: 'Línea Panadería',
      shortDesc: 'Mejoradores enzimáticos para marraqueta y hallulla, levaduras secas instantáneas Up Bakery y premezclas completas con materia grasa incorporada.',
      icon: Wheat,
      images: [
        'https://www.asitec.cl/wp-content/uploads/2019/07/mejorador-marraqueta.jpg',
        'https://www.asitec.cl/wp-content/uploads/2019/07/mejorador-marraqueta-especial.jpg',
        'https://www.asitec.cl/wp-content/uploads/2019/07/mejorador-para-allulla.jpg',
        'https://www.asitec.cl/wp-content/uploads/2019/07/levadura-instantanea-rapidox-500g.jpg',
        'https://www.asitec.cl/wp-content/uploads/2019/07/levadura-instantanea-rapidox-11g.jpg',
        'https://www.asitec.cl/wp-content/uploads/2021/07/mejorador-marraqueta-reducido-en-50-sodio.jpg',
        'https://www.asitec.cl/wp-content/uploads/2021/04/Productos-Asitec-2021-01-1.png'
      ],
      subcategories: ['Mejorador Marraqueta', 'Mejorador Hallulla', 'Levaduras Up Bakery', 'Pan de Molde', 'Pan Amasado', '-50% Sodio'],
      filterFn: (p: Product) => {
        const c = (p.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return c.includes('panader');
      }
    },
    {
      id: 'cat-molinos',
      title: 'Insumos & Aditivos para Molinos',
      badge: 'Línea Molinera',
      shortDesc: 'Mix vitamínico de enriquecimiento para harinas, complejos enzimáticos, blanqueadores, gluten de trigo vital y ácido ascórbico de grado alimentario.',
      icon: Layers,
      images: [
        'https://www.asitec.cl/wp-content/uploads/2021/04/Productos-Asitec-2021-03-1.png',
        'https://www.asitec.cl/wp-content/uploads/2021/04/Productos-Asitec-2021-01-1.png',
        'https://www.asitec.cl/wp-content/uploads/2019/07/mejorador-marraqueta.jpg'
      ],
      subcategories: ['Mix Vitamínico Harinas', 'Complejos Enzimáticos', 'Blanqueadores', 'Gluten Vital', 'Ácido Ascórbico'],
      filterFn: (p: Product) => {
        const c = (p.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return c.includes('molino');
      }
    }
  ], []);

  // Automated card slides rotation every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCardSlides(prev => {
        const next = { ...prev };
        categoryPackages.forEach(pkg => {
          if (pkg.images.length > 1) {
            next[pkg.id] = ((prev[pkg.id] || 0) + 1) % pkg.images.length;
          }
        });
        return next;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, [categoryPackages]);

  const handleNextSlide = (pkgId: string, count: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardSlides(prev => ({
      ...prev,
      [pkgId]: ((prev[pkgId] || 0) + 1) % count
    }));
  };

  const handlePrevSlide = (pkgId: string, count: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardSlides(prev => ({
      ...prev,
      [pkgId]: (prev[pkgId] || 0) === 0 ? count - 1 : (prev[pkgId] || 0) - 1
    }));
  };

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(p);
    setAddedIds(prev => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [p.id]: false }));
    }, 1200);
  };

  // Direct global search results when user types in search bar
  const directSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q) ||
      p.format.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  // Modal filtered products for the active category
  const modalProducts = useMemo(() => {
    if (!activeCategoryModal) return [];
    const categoryItems = products.filter(activeCategoryModal.filterFn);
    if (!modalSearch.trim()) return categoryItems;
    const q = modalSearch.toLowerCase().trim();
    return categoryItems.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q) ||
      p.format.toLowerCase().includes(q)
    );
  }, [products, activeCategoryModal, modalSearch]);

  return (
    <section id="catalogo" className="py-16 sm:py-20 bg-white border-b border-orange-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Clean Bakels Style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-orange-700 uppercase tracking-widest bg-orange-100/70 px-3.5 py-1 rounded-full border border-orange-200 inline-block mb-3">
              Catálogo Industrial por Categorías
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Nuestras Líneas de Soluciones & Materias Primas
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Descubre nuestras formulaciones estandarizadas empaquetadas por especialidad técnica para panaderías industriales, pastelerías artesanales y molinos harineros.
            </p>
          </div>

          {/* Quick Direct Search Input */}
          <div className="w-full md:w-80 relative">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar producto por nombre..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-orange-200 bg-orange-50/30 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {searchQuery && (
              <span className="text-[11px] text-orange-700 font-semibold mt-1 block">
                {directSearchResults.length} resultado(s) encontrado(s)
              </span>
            )}
          </div>
        </div>

        {/* 1. DIRECT SEARCH VIEW (When user types a search term) */}
        {searchQuery.trim() !== '' ? (
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-orange-100">
              <h3 className="text-lg font-bold text-slate-900">
                Resultados para: <span className="text-orange-600">"{searchQuery}"</span>
              </h3>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-orange-600 hover:underline cursor-pointer"
              >
                Volver a las tarjetas de categorías
              </button>
            </div>

            {directSearchResults.length === 0 ? (
              <div className="text-center py-16 bg-orange-50/30 rounded-3xl border border-orange-100">
                <Package className="w-12 h-12 text-orange-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800">No encontramos productos con ese término</h4>
                <p className="text-xs text-slate-500 mt-1">Intenta con términos como "Pastelera", "Marraqueta", "Levadura" o "Bizcocho".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {directSearchResults.map(product => (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="bg-white rounded-2xl border border-orange-100 p-4 shadow-sm hover:shadow-lg hover:border-orange-300 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="h-44 rounded-xl bg-slate-50/80 mb-3 flex items-center justify-center overflow-hidden p-2 border border-slate-100">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="max-h-36 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
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
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-100/60 px-2 py-0.5 rounded-full">
                        {product.subcategory}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1.5 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-slate-500 truncate">
                        {product.format}
                      </span>
                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className="px-2.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      >
                        {addedIds[product.id] ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                        <span>{addedIds[product.id] ? 'Listo' : 'Cotizar'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* 2. PACKAGED CATEGORY CARDS GRID (Bakels Clean Minimalist Style) */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {categoryPackages.map((pkg) => {
              const Icon = pkg.icon;
              const matchingProds = products.filter(pkg.filterFn);
              const prodCount = matchingProds.length;
              const currentSlideIdx = cardSlides[pkg.id] || 0;
              const currentImg = pkg.images[currentSlideIdx] || pkg.images[0];

              return (
                <div
                  key={pkg.id}
                  onClick={() => {
                    setActiveCategoryModal(pkg);
                    setModalSearch('');
                  }}
                  className="bg-gradient-to-br from-white via-orange-50/20 to-amber-50/20 rounded-3xl border border-orange-200/80 p-6 shadow-sm hover:shadow-xl hover:border-orange-400 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
                >
                  <div>
                    {/* Card Top: Icon & Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center border border-orange-200 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-bold text-orange-800 uppercase tracking-wider bg-orange-100/70 px-2.5 py-1 rounded-full border border-orange-200/60">
                          {pkg.badge}
                        </span>
                      </div>

                      <span className="text-xs font-black text-slate-600 bg-white px-2.5 py-1 rounded-full border border-orange-100 shadow-xs">
                        {prodCount} Productos
                      </span>
                    </div>

                    {/* Mini Image Carousel Inside Card */}
                    <div className="relative h-48 rounded-2xl bg-white border border-orange-100 overflow-hidden mb-5 p-3 flex items-center justify-center shadow-inner group/img select-none">
                      <img
                        src={currentImg || 'https://www.asitec.cl/wp-content/uploads/2021/04/Productos-Asitec-2021-01-1.png'}
                        alt={pkg.title}
                        className="max-h-36 w-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = 'https://www.asitec.cl/wp-content/uploads/2021/04/Productos-Asitec-2021-01-1.png';
                        }}
                      />

                      {/* Carousel controls if more than 1 image */}
                      {pkg.images.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => handlePrevSlide(pkg.id, pkg.images.length, e)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-orange-500 hover:text-white text-slate-600 border border-orange-200 opacity-0 group-hover/img:opacity-100 transition-opacity shadow-sm cursor-pointer"
                            title="Anterior"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleNextSlide(pkg.id, pkg.images.length, e)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-orange-500 hover:text-white text-slate-600 border border-orange-200 opacity-0 group-hover/img:opacity-100 transition-opacity shadow-sm cursor-pointer"
                            title="Siguiente"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          {/* Dots */}
                          <div className="absolute bottom-2 flex gap-1">
                            {pkg.images.map((_, i) => (
                              <span
                                key={i}
                                className={`h-1.5 rounded-full transition-all ${
                                  currentSlideIdx === i ? 'w-4 bg-orange-500' : 'w-1.5 bg-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Title & Short Description */}
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {pkg.shortDesc}
                    </p>

                    {/* Subcategories Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {pkg.subcategories.map((sub, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] font-semibold text-slate-600 bg-white/90 px-2 py-0.5 rounded-md border border-orange-100 shadow-2xs"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <div className="mt-6 pt-4 border-t border-orange-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Explorar Línea Completa
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-orange-500 group-hover:bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20 transition-transform group-hover:scale-110">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 3. CATEGORY PRODUCTS EXPLORER MODAL (Packaged View) */}
      {activeCategoryModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveCategoryModal(null)}
        >
          <div 
            className="relative bg-white border border-orange-100 rounded-3xl max-w-5xl max-h-[90vh] w-full flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-orange-100 bg-gradient-to-r from-orange-50/70 via-white to-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-orange-700 uppercase tracking-widest bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                    {activeCategoryModal.badge}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {modalProducts.length} producto(s) disponibles
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {activeCategoryModal.title}
                </h3>
              </div>

              {/* Modal Internal Search & Close */}
              <div className="flex items-center gap-3">
                <div className="relative w-48 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    placeholder="Filtrar en esta categoría..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-orange-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                  {modalSearch && (
                    <button 
                      onClick={() => setModalSearch('')} 
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveCategoryModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-orange-50 transition-colors cursor-pointer"
                  aria-label="Cerrar modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Products Grid in Category */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              {modalProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-600">No se encontraron productos con ese filtro.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {modalProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => onSelectProduct(prod)}
                      className="bg-white rounded-2xl border border-orange-100 p-4 shadow-sm hover:shadow-md hover:border-orange-300 transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image / Cuadro en blanco */}
                        <div className="h-40 rounded-xl bg-slate-50/60 flex items-center justify-center p-2 mb-3 border border-slate-100 overflow-hidden">
                          {prod.image ? (
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="max-h-32 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full rounded-lg bg-white border border-slate-100 flex flex-col items-center justify-center text-slate-300">
                              <Package className="w-8 h-8 text-slate-200 mb-1" />
                              <span className="text-[10px] font-semibold text-slate-400">Sin fotografía</span>
                            </div>
                          )}
                        </div>

                        {/* Subcategory & Name */}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-100/60 px-2 py-0.5 rounded-full">
                          {prod.subcategory}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1.5 group-hover:text-orange-600 transition-colors line-clamp-1">
                          {prod.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {prod.description || 'Fórmula estandarizada de alta calidad técnica para la industria de alimentos.'}
                        </p>

                        {/* Format & Shelf life */}
                        <div className="mt-3 space-y-1 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <Package className="w-3 h-3 text-orange-500 shrink-0" />
                            <span className="truncate">{prod.format}</span>
                          </div>
                          {prod.shelfLife && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-orange-500 shrink-0" />
                              <span className="truncate">{prod.shelfLife.split('.')[0]}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bottom Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectProduct(prod)}
                          className="text-xs font-semibold text-slate-600 hover:text-orange-600 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-orange-50 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Ficha</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(prod, e)}
                          className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          {addedIds[prod.id] ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                          <span>{addedIds[prod.id] ? 'Agregado' : 'Cotizar'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-orange-100 bg-white flex items-center justify-between text-xs text-slate-500">
              <span>ASITEC S.A. &bull; Inocuidad Alimentaria Certificada FSSC 22000</span>
              <button
                type="button"
                onClick={() => setActiveCategoryModal(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
