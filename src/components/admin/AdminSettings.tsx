import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Save, 
  Loader2, 
  Check, 
  AlertCircle, 
  ExternalLink
} from 'lucide-react';
import { getSettings, saveSettings } from '../../services/api';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'empresa' | 'contacto' | 'banco' | 'distribuidor'>('empresa');

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await getSettings();
        setSettings(data);
      } catch {
        setStatusMessage({ type: 'error', text: 'Error al cargar las configuraciones del sistema.' });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      await saveSettings(settings);
      setStatusMessage({ type: 'success', text: '¡Configuraciones guardadas y sincronizadas en la base de datos con éxito!' });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar configuración.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200/80">
        <Loader2 className="w-8 h-8 text-asitec-blue animate-spin mb-3" />
        <p className="text-sm text-slate-500 font-medium">Cargando datos corporativos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-asitec-blue rounded-xl border border-blue-200/60">
              <Building2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-800">Ajustes Generales de la Empresa</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Modifica en tiempo real los teléfonos, cuentas bancarias para pagos, WhatsApp y datos de distribución.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-asitec-blue hover:bg-blue-900 text-white font-medium rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Guardando...' : 'Guardar Todo'}</span>
        </button>
      </div>

      {/* Alert toast */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <Check className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600" />
            )}
            <span className="text-sm font-medium">{statusMessage.text}</span>
          </div>
        </div>
      )}

      {/* Navegación por pestañas */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 pt-2 rounded-t-2xl overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('empresa')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'empresa'
              ? 'border-asitec-blue text-asitec-blue'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Identidad y Resumen</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contacto')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'contacto'
              ? 'border-asitec-blue text-asitec-blue'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Contacto y Sucursal</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('banco')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'banco'
              ? 'border-asitec-blue text-asitec-blue'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Datos Bancarios Oficiales</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('distribuidor')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'distribuidor'
              ? 'border-asitec-blue text-asitec-blue'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Distribuidor Norte (Ataelqui)</span>
        </button>
      </div>

      {/* Formulario Principal */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-b-2xl border-x border-b border-slate-200/80 shadow-sm space-y-6">
        {/* PESTAÑA 1: IDENTIDAD */}
        {activeTab === 'empresa' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">
              Identidad de la Marca
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Razón Social / Nombre Comercial
                </label>
                <input
                  type="text"
                  value={settings.company_name || 'ASITEC S.A.'}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Eslogan / Tagline
                </label>
                <input
                  type="text"
                  value={settings.company_tagline || 'Innovación, Tecnología & Servicio'}
                  onChange={(e) => handleChange('company_tagline', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                Descripción Institucional
              </label>
              <textarea
                rows={3}
                value={settings.company_description || ''}
                onChange={(e) => handleChange('company_description', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Años de Trayectoria
                </label>
                <input
                  type="text"
                  placeholder="ej. +26 años"
                  value={settings.years_experience || '+26 años'}
                  onChange={(e) => handleChange('years_experience', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Contador de Clientes
                </label>
                <input
                  type="text"
                  placeholder="ej. +850 panaderías y molinos"
                  value={settings.clients_count || '+850 panaderías y molinos'}
                  onChange={(e) => handleChange('clients_count', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Fórmulas Desarrolladas
                </label>
                <input
                  type="text"
                  placeholder="ej. +45 fórmulas industriales"
                  value={settings.products_count || '+45 fórmulas industriales'}
                  onChange={(e) => handleChange('products_count', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: CONTACTO Y SUCURSAL */}
        {activeTab === 'contacto' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">
              Canales de Contacto Directo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  Dirección Casa Central
                </label>
                <input
                  type="text"
                  value={settings.contact_address || 'Chañarcillo # 691, Maipú, Santiago de Chile'}
                  onChange={(e) => handleChange('contact_address', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  Email de Contacto General
                </label>
                <input
                  type="email"
                  value={settings.contact_email || 'info@asitec.cl'}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  Teléfono Fijo Central
                </label>
                <input
                  type="text"
                  placeholder="ej. 22 616 0200"
                  value={settings.contact_phone || '22 616 0200'}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  WhatsApp de Ventas / Consultas
                </label>
                <input
                  type="text"
                  placeholder="+56992671171"
                  value={settings.contact_whatsapp || '+56992671171'}
                  onChange={(e) => handleChange('contact_whatsapp', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Horario de Atención
                </label>
                <input
                  type="text"
                  value={settings.contact_working_hours || 'Lunes a Viernes: 08:30 - 18:00 hrs'}
                  onChange={(e) => handleChange('contact_working_hours', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  Enlace Google Maps
                </label>
                <input
                  type="url"
                  value={settings.contact_maps_url || ''}
                  onChange={(e) => handleChange('contact_maps_url', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: BANCO DE CHILE & CIBERSEGURIDAD */}
        {activeTab === 'banco' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-900">Seguridad Financiera y Recaudación</h4>
                <p className="text-xs text-amber-800/90 mt-1">
                  Esta información aparece en la sección pública de Ciberseguridad para proteger a los clientes de posibles fraudes o suplantaciones.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Institución Bancaria
                </label>
                <input
                  type="text"
                  value={settings.bank_name || 'Banco de Chile'}
                  onChange={(e) => handleChange('bank_name', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Titular de la Cuenta
                </label>
                <input
                  type="text"
                  value={settings.bank_account_holder || 'Asitec S.A.'}
                  onChange={(e) => handleChange('bank_account_holder', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Tipo de Cuenta
                </label>
                <input
                  type="text"
                  value={settings.bank_account_type || 'Cuenta Corriente'}
                  onChange={(e) => handleChange('bank_account_type', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Número de Cuenta Corriente
                </label>
                <input
                  type="text"
                  value={settings.bank_account_number || '463260301'}
                  onChange={(e) => handleChange('bank_account_number', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  RUT Titular
                </label>
                <input
                  type="text"
                  value={settings.bank_rut || '96.852.140-5'}
                  onChange={(e) => handleChange('bank_rut', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Email Oficial de Envío de Pagos
                </label>
                <input
                  type="email"
                  value={settings.bank_payment_email || 'pagos@asitec.cl'}
                  onChange={(e) => handleChange('bank_payment_email', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 4: DISTRIBUIDOR NORTE */}
        {activeTab === 'distribuidor' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
              <Truck className="w-6 h-6 text-asitec-blue shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-asitec-blue">Red de Distribución Regional</h4>
                <p className="text-xs text-blue-800/90 mt-1">
                  Información mostrada para clientes de la 3ª y 4ª Región (Atacama y Coquimbo).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Empresa Distribuidora
                </label>
                <input
                  type="text"
                  value={settings.distributor_company || 'Sociedad Comercial Ataelqui'}
                  onChange={(e) => handleChange('distributor_company', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Zona / Región
                </label>
                <input
                  type="text"
                  value={settings.distributor_region || 'Tercera y Cuarta Región (Atacama y Coquimbo)'}
                  onChange={(e) => handleChange('distributor_region', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Contacto Comercial
                </label>
                <input
                  type="text"
                  value={settings.distributor_contact || 'Carlos González'}
                  onChange={(e) => handleChange('distributor_contact', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Teléfono / Móvil
                </label>
                <input
                  type="text"
                  value={settings.distributor_phone || '+56 9 9267 1171'}
                  onChange={(e) => handleChange('distributor_phone', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Email Distribuidor
                </label>
                <input
                  type="email"
                  value={settings.distributor_email || 'cgonzalez@ataelqui.cl'}
                  onChange={(e) => handleChange('distributor_email', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Enlace al Catálogo Ataelqui
                </label>
                <input
                  type="url"
                  value={settings.distributor_catalog_url || 'https://vercatalogo.com/ataelqui'}
                  onChange={(e) => handleChange('distributor_catalog_url', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-asitec-blue focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer con botón de guardar */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-asitec-blue hover:bg-blue-900 text-white font-medium text-sm rounded-xl shadow-sm transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando cambios...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Guardar Configuraciones</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
