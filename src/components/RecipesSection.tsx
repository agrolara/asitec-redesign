import React, { useState } from 'react';
import { 
  Play, 
  Clock, 
  ChefHat, 
  X, 
  ShoppingCart, 
  ArrowRight
} from 'lucide-react';
import { recipes as staticRecipes } from '../data/recipes';
import type { Recipe, Product } from '../types';
import { products as staticProducts } from '../data/products';

interface Props {
  recipes?: Recipe[];
  products?: Product[];
  onQuickAdd: (p: Product) => void;
}

export const RecipesSection: React.FC<Props> = ({ 
  recipes = staticRecipes, 
  products = staticProducts, 
  onQuickAdd 
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleAddIngredient = (recipe: Recipe) => {
    // find matching product
    const prod = products.find(p => p.name.toLowerCase().includes(recipe.recommendedProduct.toLowerCase()) || 
      recipe.recommendedProduct.toLowerCase().includes(p.name.toLowerCase())) || products[0];
    onQuickAdd(prod);
  };

  return (
    <section id="recetario" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100/60 px-3 py-1 rounded-full border border-amber-200">
              Academia Culinaria & Talleres
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
              Recetas & Técnicas de Aplicación en Video
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl">
              Nuestros chefs técnicos demuestran el rendimiento, estabilidad y versatilidad de las bases y premezclas Asitec en preparaciones comerciales de alto estándar.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
            💡 Videos demostrativos oficiales de Asitec S.A.
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="bg-slate-50 rounded-2xl border border-slate-200/90 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Video con primer frame original */}
                <div className="relative h-48 overflow-hidden bg-slate-950 flex items-center justify-center">
                  <video 
                    src={`${recipe.videoUrl}#t=0.001`} 
                    preload="metadata"
                    muted
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-slate-950/25 group-hover:bg-slate-950/5 transition-colors" />

                  {/* Play Button Icon */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-amber-400 transition-all">
                      <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs pointer-events-none">
                    <span className="bg-slate-950/80 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> {recipe.duration}
                    </span>
                    <span className="bg-amber-500/90 text-slate-950 font-bold px-2 py-0.5 rounded-md">
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">
                    {recipe.category}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>
              </div>

              {/* Recommended Product Footer */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-800 truncate">
                    ⭐ {recipe.recommendedProduct}
                  </span>
                  <span className="text-amber-600 font-bold flex items-center gap-0.5 shrink-0">
                    Ver video <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Video Modal Player */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <ChefHat className="w-4 h-4" />
                <span>Video Masterclass &bull; {selectedRecipe.title}</span>
              </div>
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Box */}
            <div className="bg-black aspect-video w-full relative">
              <video 
                src={selectedRecipe.videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full object-contain"
              >
                Tu navegador no soporta reproducción de video HTML5.
              </video>
            </div>

            {/* Content Details */}
            <div className="p-6 max-h-[40vh] overflow-y-auto space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-slate-900">{selectedRecipe.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    Tiempo: {selectedRecipe.duration}
                  </span>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                    Nivel: {selectedRecipe.difficulty}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedRecipe.description}
              </p>

              {/* Key Steps */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Pasos Clave de Elaboración:
                </h4>
                <div className="space-y-1.5">
                  {selectedRecipe.keySteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-xs text-slate-600">
                  Producto Utilizado: <strong>{selectedRecipe.recommendedProduct}</strong>
                </div>
                <button
                  onClick={() => {
                    handleAddIngredient(selectedRecipe);
                    setSelectedRecipe(null);
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cotizar Ingrediente</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
