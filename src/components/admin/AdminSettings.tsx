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
  ExternalLink,
  Images,
  Cake,
  Wheat,
  Layers,
  Plus,
  Trash2,
  Upload,
  Info,
  RotateCcw
} from 'lucide-react';
import { getSettings, saveSettings, uploadImage } from '../../services/api';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'empresa' | 'contacto' | 'banco' | 'distribuidor' | 'carruseles'>('empresa');
  const [uploadingCategory, setUploadingCategory] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState<Record<string, string>>({
    pasteleria: '',
    panaderia: '',
    molinos: ''
  });

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

  const getCarouselImages = (catKey: 'pasteleria' | 'panaderia' | 'molinos'): string[] => {
    const raw = settings[`category_carousel_${catKey}`];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    if (catKey === 'pasteleria') {
      return [
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
      ];
    }
    if (catKey === 'panaderia') {
      return [
        'https://www.asitec.cl/wp-content/uploads/2019/07/mejorador-marraqueta.jpg',
        'https://www.asitec.cl/wp-content/uploads/2019/07/mejorador-marraqueta-especial.jpg',
        'https://www.asitec.cl/wp-content/uploads/2019/07/mejorador-para-allulla.jpg',
        'https://www.asitec.cl/wp-content/uploads/2019/07/levadura-instantanea-rapidox-500g.jpg',
        'https://www.asitec.cl/wp-content/uploads/2019/07/levadura-instantanea-rapidox-11g.jpg',
        'https://www.asitec.cl/wp-content/uploads/2021/07/mejorador-marraqueta-reducido-en-50-sodio.jpg'
      ];
    }
    return [];
  };

  const handleAddCarouselImage = (catKey: 'pasteleria' | 'panaderia' | 'molinos', url: string) => {
    if (!url.trim()) return;
    const current = getCarouselImages(catKey);
    const updated = [...current, url.trim()];
    handleChange(`category_carousel_${catKey}`, JSON.stringify(updated));
    handleChange(`category_carousel_mode_${catKey}`, 'custom');
    setNewImageUrl(prev => ({ ...prev, [catKey]: '' }));
  };

  const handleRemoveCarouselImage = (catKey: 'pasteleria' | 'panaderia' | 'molinos', index: number) => {
    const current = getCarouselImages(catKey);
    const updated = current.filter((_, i) => i !== index);
    handleChange(`category_carousel_${catKey}`, JSON.stringify(updated));
    handleChange(`category_carousel_mode_${catKey}`, 'custom');
  };

  const handleUploadCarouselImage = async (catKey: 'pasteleria' | 'panaderia' | 'molinos', file: File) => {
    setUploadingCategory(catKey);
    try {
      const url = await uploadImage(file);
      handleAddCarouselImage(catKey, url);
      setStatusMessage({ type: 'success', text: 'Imagen subida y agregada al carrusel con éxito.' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir la imagen.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setUploadingCategory(null);
    }
  };

  const handleResetCarousel = (catKey: 'pasteleria' | 'panaderia' | 'molinos') => {
    if (catKey === 'molinos') {
      handleChange(`category_carousel_molinos`, JSON.stringify([]));
      handleChange(`category_carousel_mode_molinos`, 'none');
    } else {
      handleChange(`category_carousel_${catKey}`, '');
      handleChange(`category_carousel_mode_${catKey}`, 'auto');
    }
    setStatusMessage({ type: 'success', text: 'Carrusel restablecido con éxito.' });
    setTimeout(() => setStatusMessage(null), 3000);
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

        <button
          type="button"
          onClick={() => setActiveTab('carruseles')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'carruseles'
              ? 'border-orange-500 text-orange-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Images className="w-4 h-4 text-orange-500" />
          <span>Carruseles de Categorías</span>
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

        {/* PESTAÑA 5: CARRUSELES DE CATEGORÍAS */}
        {activeTab === 'carruseles' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Imágenes y Carruseles de las 3 Divisiones del Catálogo
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configura qué fotografías rotan automáticamente en las tarjetas principales de la página web o mantén el modo técnico para insumos industriales a granel.
              </p>
            </div>

            {/* SECCIÓN 1: PASTELERÍA */}
            <div className="p-5 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Cake className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Pastelería Fina & Repostería</h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {getCarouselImages('pasteleria').length} foto(s) configurada(s)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={settings.category_carousel_mode_pasteleria || 'auto'}
                    onChange={(e) => handleChange('category_carousel_mode_pasteleria', e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    <option value="auto">Automático (Fotos de productos)</option>
                    <option value="custom">Personalizado (Fotos manuales)</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleResetCarousel('pasteleria')}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/70 transition-colors cursor-pointer"
                    title="Restablecer carrusel"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lista de miniaturas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {getCarouselImages('pasteleria').map((imgUrl, idx) => (
                  <div key={idx} className="relative group/thumb rounded-xl border border-slate-200 bg-white p-2 aspect-square flex items-center justify-center overflow-hidden">
                    <img src={imgUrl} alt={`Pastelería ${idx + 1}`} className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => handleRemoveCarouselImage('pasteleria', idx)}
                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-lg opacity-0 group-hover/thumb:opacity-100 transition-opacity shadow-sm cursor-pointer"
                      title="Quitar esta foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Agregar nueva imagen */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Pegar URL de imagen https://..."
                  value={newImageUrl.pasteleria || ''}
                  onChange={(e) => setNewImageUrl(prev => ({ ...prev, pasteleria: e.target.value }))}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleAddCarouselImage('pasteleria', newImageUrl.pasteleria || '')}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar URL</span>
                </button>
                <label className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer flex items-center justify-center gap-1">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>{uploadingCategory === 'pasteleria' ? 'Subiendo...' : 'Subir Imagen'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUploadCarouselImage('pasteleria', f);
                    }}
                    disabled={uploadingCategory === 'pasteleria'}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* SECCIÓN 2: PANADERÍA */}
            <div className="p-5 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Wheat className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Panadería Rapidox & Mejoradores</h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {getCarouselImages('panaderia').length} foto(s) configurada(s)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={settings.category_carousel_mode_panaderia || 'auto'}
                    onChange={(e) => handleChange('category_carousel_mode_panaderia', e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="auto">Automático (Fotos de productos)</option>
                    <option value="custom">Personalizado (Fotos manuales)</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleResetCarousel('panaderia')}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/70 transition-colors cursor-pointer"
                    title="Restablecer carrusel"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lista de miniaturas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {getCarouselImages('panaderia').map((imgUrl, idx) => (
                  <div key={idx} className="relative group/thumb rounded-xl border border-slate-200 bg-white p-2 aspect-square flex items-center justify-center overflow-hidden">
                    <img src={imgUrl} alt={`Panadería ${idx + 1}`} className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => handleRemoveCarouselImage('panaderia', idx)}
                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-lg opacity-0 group-hover/thumb:opacity-100 transition-opacity shadow-sm cursor-pointer"
                      title="Quitar esta foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Agregar nueva imagen */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Pegar URL de imagen https://..."
                  value={newImageUrl.panaderia || ''}
                  onChange={(e) => setNewImageUrl(prev => ({ ...prev, panaderia: e.target.value }))}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleAddCarouselImage('panaderia', newImageUrl.panaderia || '')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar URL</span>
                </button>
                <label className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer flex items-center justify-center gap-1">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>{uploadingCategory === 'panaderia' ? 'Subiendo...' : 'Subir Imagen'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUploadCarouselImage('panaderia', f);
                    }}
                    disabled={uploadingCategory === 'panaderia'}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* SECCIÓN 3: LÍNEA MOLINERA */}
            <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 rounded-2xl space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Insumos & Aditivos para Molinos</h4>
                    <span className="text-[11px] text-amber-300 font-medium">
                      {(settings.category_carousel_mode_molinos === 'custom' && getCarouselImages('molinos').length > 0)
                        ? `${getCarouselImages('molinos').length} foto(s) personalizada(s)`
                        : 'Modo Tarjeta Técnica Industrial Activo (Sin fotos de sacos)'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={settings.category_carousel_mode_molinos || 'none'}
                    onChange={(e) => handleChange('category_carousel_mode_molinos', e.target.value)}
                    className="px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="none">Tarjeta Técnica / Sin Fotos (Recomendado)</option>
                    <option value="custom">Fotos Personalizadas (Planta / Silos / Sacos)</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleResetCarousel('molinos')}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Restablecer modo técnico por defecto"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Explicación de Línea Molinera */}
              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-start gap-3 text-xs text-slate-300">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Nota sobre Línea Molinera:</strong> Los insumos para molinos (gluten vital, ácido ascórbico, complejos enzimáticos y premezcla vitamínica) son aditivos técnicos a granel sin empaque comercial minorista. Al seleccionar <strong>Tarjeta Técnica</strong>, la página web muestra una presentación sobria e institucional sin forzar imágenes de productos de panadería.
                </p>
              </div>

              {/* Si el admin decide habilitar fotos personalizadas para molinos */}
              {settings.category_carousel_mode_molinos === 'custom' && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {getCarouselImages('molinos').map((imgUrl, idx) => (
                      <div key={idx} className="relative group/thumb rounded-xl border border-slate-700 bg-white p-2 aspect-square flex items-center justify-center overflow-hidden">
                        <img src={imgUrl} alt={`Molinos ${idx + 1}`} className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => handleRemoveCarouselImage('molinos', idx)}
                          className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-lg opacity-0 group-hover/thumb:opacity-100 transition-opacity shadow-sm cursor-pointer"
                          title="Quitar esta foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {getCarouselImages('molinos').length === 0 && (
                      <div className="col-span-full py-4 text-center text-xs text-slate-400 border border-dashed border-slate-700 rounded-xl">
                        Aún no has agregado fotos personalizadas para molinos. Sube fotos de la planta o agrega enlaces abajo.
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Pegar URL de foto https://..."
                      value={newImageUrl.molinos || ''}
                      onChange={(e) => setNewImageUrl(prev => ({ ...prev, molinos: e.target.value }))}
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 text-white rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCarouselImage('molinos', newImageUrl.molinos || '')}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar URL</span>
                    </button>
                    <label className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1">
                      <Upload className="w-3.5 h-3.5 text-orange-600" />
                      <span>{uploadingCategory === 'molinos' ? 'Subiendo...' : 'Subir Foto'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleUploadCarouselImage('molinos', f);
                        }}
                        disabled={uploadingCategory === 'molinos'}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
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
