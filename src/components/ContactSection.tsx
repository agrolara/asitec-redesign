import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Building2, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { companyInfo } from '../data/company';

export const ContactSection: React.FC = () => {
  return (
    <section id="contacto" className="py-20 bg-gradient-to-b from-white via-orange-50/20 to-white border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-orange-700 uppercase tracking-widest bg-orange-100/80 px-3.5 py-1 rounded-full border border-orange-200">
            Presencia Nacional
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
            Casa Matriz & Atención a Clientes
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Visítanos en nuestras instalaciones industriales de Maipú o comunícate con nuestra central técnica y comercial.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-6 bg-white p-8 rounded-2xl border-2 border-orange-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center font-bold shadow-sm">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{companyInfo.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">Casa Matriz & Planta Industrial Maipú</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-700">
                
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 block uppercase">Dirección</span>
                    <p className="font-semibold text-slate-900">{companyInfo.contact.address}</p>
                    <a
                      href={companyInfo.contact.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-orange-600 hover:underline font-semibold flex items-center gap-1 mt-0.5"
                    >
                      <span>Ver en Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 block uppercase">Central Telefónica</span>
                    <a 
                      href={`tel:${companyInfo.contact.phoneRaw}`}
                      className="font-bold text-slate-900 hover:text-orange-600 text-base"
                    >
                      {companyInfo.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 block uppercase">Correo Electrónico</span>
                    <a 
                      href={`mailto:${companyInfo.contact.email}`}
                      className="font-semibold text-slate-900 hover:text-orange-600"
                    >
                      {companyInfo.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 block uppercase">Horario de Operación</span>
                    <p className="font-semibold text-slate-900">{companyInfo.contact.workingHours}</p>
                  </div>
                </div>

              </div>

            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Instalaciones industriales con certificación internacional de inocuidad FSSC 22000 (GFSI).</span>
            </div>
          </div>

          {/* Plant Visual Photo Card */}
          <div className="lg:col-span-6 rounded-2xl overflow-hidden border-2 border-orange-100 shadow-sm relative group bg-slate-900">
            <img 
              src="https://www.asitec.cl/wp-content/uploads/2024/05/fachada_asitec_nueva.jpg" 
              alt="Casa Matriz Asitec S.A." 
              className="w-full h-full object-cover min-h-[380px] group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest bg-slate-950/80 px-2.5 py-1 rounded">
                Planta Productiva & Laboratorio de Calidad
              </span>
              <h4 className="text-xl font-bold text-white">
                Chañarcillo #691, Maipú, Región Metropolitana
              </h4>
              <p className="text-xs text-slate-300">
                Despacho logístico a molinos y distribuidores en todas las regiones de Chile.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
