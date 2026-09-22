import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  Wheat, 
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { companyInfo } from '../data/company';

interface Props {
  onExploreCatalog: () => void;
}

const heroProductSlides = [
  {
    image: 'https://www.asitec.cl/wp-content/uploads/2019/07/levadura-instantanea-rapidox-500g.jpg',
    badge: 'Línea Panadería Rapidox',
    title: 'Levadura Instantánea Up Bakery 500g',
    subtitle: 'Alto Poder Fermentativo'
  },
  {
    image: 'https://www.asitec.cl/wp-content/uploads/2019/07/mejorador-marraqueta.jpg',
    badge: 'Mejoradores Rapidox',
    title: 'Mejorador Marraqueta Tradicional',
    subtitle: 'Fórmula Estandarizada'
  },
  {
    image: 'https://www.asitec.cl/wp-content/uploads/2019/07/mejorador-marraqueta-especial.jpg',
    badge: 'Mejoradores Rapidox',
    title: 'Mejorador Marraqueta Especial',
    subtitle: 'Fermentación Larga Industrial'
  },
  {
    image: 'https://www.asitec.cl/wp-content/uploads/2019/07/mejorador-para-allulla.jpg',
    badge: 'Mejoradores Rapidox',
    title: 'Mejorador Hallulla Tradicional',
    subtitle: 'Miga Suave & Corteza Blanca'
  },
  {
    image: 'https://www.asitec.cl/wp-content/uploads/2021/07/mejorador-marraqueta-reducido-en-50-sodio.jpg',
    badge: 'Salud & Rendimiento',
    title: 'Mejorador Marraqueta -50% Sodio',
    subtitle: 'Cumplimiento Ley Etiquetado'
  },
  {
    image: 'https://www.asitec.cl/wp-content/uploads/2019/07/levadura-instantanea-rapidox-11g.jpg',
    badge: 'Línea Panadería Rapidox',
    title: 'Levadura Instantánea Sachets 11g',
    subtitle: 'Caja Display 360 unidades'
  },
  {
    image: 'https://www.asitec.cl/wp-content/uploads/2021/04/Productos-Asitec-2021-01-1.png',
    badge: 'Bases de Pastelería',
    title: 'Crema Pastelera Asitec',
    subtitle: 'Resiste Horneado y Congelado'
  },
  {
    image: 'https://www.asitec.cl/wp-content/uploads/2021/04/WhatsApp-Image-2022-02-08-at-21.53.18-1.jpeg',
    badge: 'Bases de Pastelería',
    title: 'Crema Pastelera Especial',
    subtitle: 'Repostería y Rellenos Finos'
  },
  {
    image: 'https://www.asitec.cl/wp-content/uploads/2021/04/crema-chantilly-1.jpg',
    badge: 'Bases de Pastelería',
    title: 'Crema Chantilly Clásica',
    subtitle: 'Volumen y Estabilidad'
  },
  {
    image: 'https://www.asitec.cl/wp-content/uploads/2021/04/crema-chantilly-chocolate-1.jpg',
    badge: 'Bases de Pastelería',
    title: 'Crema Chantilly Chocolate',
    subtitle: 'Sabor Intenso a Cacao'
  },
  {
    image: 'https://www.asitec.cl/wp-content/uploads/2021/04/remojo-3-leches.jpg',
    badge: 'Bases de Pastelería',
    title: 'Remojo Torta 3 Leches',
    subtitle: 'Base en Polvo Instantánea'
  },
  {
    image: 'https://www.asitec.cl/wp-content/uploads/2021/04/brillo.jpg',
    badge: 'Bases de Pastelería',
    title: 'Brillo en Polvo para Tartaletas',
    subtitle: 'Acabado Espejo Profesional'
  },
  {
    image: 'https://www.asitec.cl/wp-content/uploads/2021/04/bases-para-preparar-merengue-1.jpg',
    badge: 'Bases de Pastelería',
    title: 'Merengue Tipo Italiano',
    subtitle: 'Decoración y Pie de Limón'
  },
  {
    image: 'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_bizcocho_vainilla.jpg',
    badge: 'Premezclas Industriales',
    title: 'Premezcla Bizcocho Vainilla',
    subtitle: 'Para Tortas y Brazo de Reina'
  },
  {
    image: 'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_queque_vainilla.jpg',
    badge: 'Premezclas Industriales',
    title: 'Premezcla Queque Vainilla',
    subtitle: 'Miga Húmeda y Esponjosa'
  }
];

export const HeroSection: React.FC<Props> = ({ onExploreCatalog }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroProductSlides.length);
    }, 3600);
    return () => clearInterval(timer);
  }, [isHovered]);
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/50 via-white to-amber-50/30 text-slate-900 pt-10 pb-16 md:py-20 border-b border-orange-100">
      {/* Dynamic soft background lighting */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] rounded-full bg-orange-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] rounded-full bg-amber-200/20 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper Announcement Badge */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/70 border border-orange-200/80 text-orange-800 text-xs font-semibold tracking-wide uppercase shadow-sm">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
            Asitec S.A. &bull; Calidad Certificada en Alimentos
          </div>
        </div>

        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
              Innovación, Tecnología & Materias Primas para la <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500">Alimentación</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
              Más de <strong>26 años</strong> liderando el mercado chileno en premezclas de alta gama para panadería y pastelería, núcleos enzimáticos e insumos formulados bajo certificación internacional de inocuidad alimentaria <strong>FSSC 22000 (Versión 6 - GFSI)</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onExploreCatalog}
                className="px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>Explorar Catálogo de Productos</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#certificaciones"
                className="px-5 py-3.5 rounded-xl bg-white hover:bg-orange-50/80 border border-orange-200 text-slate-800 font-semibold text-sm transition-all flex items-center gap-2 shadow-sm active:scale-95"
              >
                <Award className="w-4 h-4 text-orange-500" />
                <span>Certificación FSSC 22000</span>
              </a>

              <a
                href={companyInfo.catalogs[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-xl bg-white hover:bg-orange-50/80 border border-orange-200 text-slate-700 font-medium text-sm transition-all flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Descargar PDF</span>
              </a>
            </div>

            {/* Trust bullet points */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3.5 border-t border-orange-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Formulaciones 100% estandarizadas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Inocuidad Mundial FSSC 22000</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Despacho a todo Chile</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Card with Bakels White & Pastel Styling */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl border border-orange-100 bg-white p-5 sm:p-6 shadow-xl shadow-orange-500/5">
              
              {/* Product Showcase Carousel with 15 Real Products */}
              <div 
                className="relative h-64 rounded-2xl overflow-hidden mb-5 border border-orange-100/90 bg-gradient-to-b from-orange-50/40 via-white to-amber-50/20 group select-none"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {heroProductSlides.map((slide, idx) => (
                  <div 
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-700 flex items-center justify-center p-4 ${
                      currentSlide === idx ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
                    }`}
                  >
                    {/* Real Product Photo */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center pb-8 pt-1">
                      <img 
                        src={slide.image} 
                        alt={slide.title} 
                        className="max-h-48 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] transition-transform duration-500 hover:scale-105" 
                        loading="lazy"
                      />
                    </div>

                    {/* Bottom Info Bar */}
                    <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none gap-2">
                      <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl border border-orange-200/80 text-[11px] font-bold text-orange-700 flex items-center gap-1.5 shadow-sm truncate max-w-[65%]">
                        <Wheat className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span className="truncate">{slide.title}</span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-600 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-orange-100 shadow-sm shrink-0 truncate">
                        {slide.subtitle}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Left & Right Navigation Controls */}
                <button
                  type="button"
                  onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroProductSlides.length - 1 : prev - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/90 hover:bg-orange-500 hover:text-white text-slate-700 border border-orange-200 opacity-0 group-hover:opacity-100 transition-all shadow-md active:scale-95 cursor-pointer"
                  title="Anterior producto"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSlide((prev) => (prev === heroProductSlides.length - 1 ? 0 : prev + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/90 hover:bg-orange-500 hover:text-white text-slate-700 border border-orange-200 opacity-0 group-hover:opacity-100 transition-all shadow-md active:scale-95 cursor-pointer"
                  title="Siguiente producto"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Counter & Slide Indicator Badge */}
                <div className="absolute top-3 right-3 z-30 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-orange-200 text-[11px] font-mono shadow-sm">
                  <span className="font-black text-orange-600">{String(currentSlide + 1).padStart(2, '0')}</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-slate-500 font-semibold">{heroProductSlides.length}</span>
                </div>

                {/* Progress bar along bottom edge */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-100 z-20 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
                    style={{ width: `${((currentSlide + 1) / heroProductSlides.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div className="p-3 sm:p-3.5 rounded-2xl bg-orange-50/40 border border-orange-100 hover:border-orange-300 transition-colors">
                  <div className="text-xl sm:text-2xl font-black text-orange-600">{companyInfo.yearsExperience}</div>
                  <div className="text-[11px] text-slate-600 font-medium mt-0.5">Trayectoria Industrial</div>
                </div>

                <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100 hover:border-emerald-300 transition-colors">
                  <div className="text-xl sm:text-2xl font-black text-emerald-600">+45</div>
                  <div className="text-[11px] text-slate-600 font-medium mt-0.5">Productos en Línea</div>
                </div>

                <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-50/40 border border-amber-100 hover:border-amber-300 transition-colors">
                  <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">FSSC 22000</div>
                  <div className="text-[11px] text-slate-600 font-medium mt-0.5">Versión 6 (GFSI)</div>
                </div>

                <div className="p-3 sm:p-3.5 rounded-2xl bg-orange-50/40 border border-orange-100 hover:border-orange-300 transition-colors">
                  <div className="text-xl sm:text-2xl font-black text-orange-600">+850</div>
                  <div className="text-[11px] text-slate-600 font-medium mt-0.5">Clientes Industriales</div>
                </div>
              </div>

              {/* Verified Payment Micro Card */}
              <div className="mt-4 p-3 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>Recaudación Oficial: <strong>Banco de Chile</strong></span>
                </div>
                <a href="#seguridad" className="text-orange-600 hover:text-orange-700 hover:underline font-bold text-[11px]">
                  Verificar
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
