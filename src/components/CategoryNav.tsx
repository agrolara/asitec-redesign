import React from 'react';
import { 
  Cake, 
  Wheat, 
  Layers, 
  ChevronRight 
} from 'lucide-react';

interface Props {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CategoryNav: React.FC<Props> = ({ selectedCategory, onSelectCategory }) => {
  const categories = [
    {
      id: 'Pastelería',
      title: 'Pastelería Fina & Premezclas',
      subtitle: '23 productos',
      description: 'Bases en polvo para Crema Pastelera, Chantilly, Queques, Bizcochos, Muffins y Brownies.',
      icon: Cake,
      color: 'from-amber-500 to-amber-600',
      bgLight: 'bg-amber-50',
      borderActive: 'border-amber-500 ring-2 ring-amber-500/20'
    },
    {
      id: 'Panadería',
      title: 'Línea Panadería Rapidox',
      subtitle: '16 productos',
      description: 'Mejoradores enzimáticos para Marraqueta y Hallulla, Levaduras Up Bakery y premezclas.',
      icon: Wheat,
      color: 'from-orange-500 to-amber-600',
      bgLight: 'bg-orange-50',
      borderActive: 'border-orange-500 ring-2 ring-orange-500/20'
    },
    {
      id: 'Insumos para Molinos',
      title: 'Molinería & Materias Primas',
      subtitle: '6 productos',
      description: 'Mixes vitamínicos SAG para harinas, enzimas, ácido ascórbico, gluten vital y blanqueadores.',
      icon: Layers,
      color: 'from-blue-600 to-indigo-600',
      bgLight: 'bg-blue-50',
      borderActive: 'border-blue-500 ring-2 ring-blue-500/20'
    }
  ];

  return (
    <section className="py-12 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-700 tracking-widest uppercase bg-amber-100/60 px-3 py-1 rounded-full border border-amber-200">
            Divisiones Especializadas
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Nuestras Líneas de Soluciones Industriales
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Selecciona una división para explorar el catálogo técnico de materias primas y premezclas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  const el = document.getElementById('catalogo');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-left p-6 rounded-2xl border transition-all duration-300 relative group flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 ${
                  isSelected 
                    ? `bg-white ${cat.borderActive} shadow-lg` 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {cat.subtitle}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {cat.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-amber-600 transition-colors">
                  <span>Ver especificaciones</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
