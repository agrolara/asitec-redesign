import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  AlertCircle, 
  Loader2, 
  X, 
  ShieldCheck, 
  ExternalLink,
  Calendar
} from 'lucide-react';
import type { Certification } from '../../types';
import { getCertifications, saveCertification, deleteCertification } from '../../services/api';

export const AdminCertifications: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [editingCert, setEditingCert] = useState<Partial<Certification>>({
    badge: 'Acreditación Oficial',
    institution: '',
    resolution: '',
    detail: '',
    status: '100% Vigente',
    year: new Date().getFullYear().toString(),
    documentUrl: ''
  });
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getCertifications();
      setCertifications(data);
    } catch {
      setStatusMessage({ type: 'error', text: 'Error al cargar certificaciones.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setIsNew(true);
    setEditingCert({
      id: '',
      badge: 'Acreditación Oficial',
      institution: 'Servicio Agrícola y Ganadero (SAG)',
      resolution: '',
      detail: '',
      status: '100% Vigente',
      year: new Date().getFullYear().toString(),
      documentUrl: ''
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cert: Certification) => {
    setIsNew(false);
    setEditingCert({ ...cert });
    setModalOpen(true);
  };

  const handleDelete = async (certId: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar la certificación "${name}"?`)) return;

    try {
      await deleteCertification(certId);
      setCertifications(prev => prev.filter(c => c.id !== certId));
      setStatusMessage({ type: 'success', text: `Certificación "${name}" eliminada.` });
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar.';
      setStatusMessage({ type: 'error', text: msg });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert.institution?.trim() || !editingCert.resolution?.trim()) {
      setStatusMessage({ type: 'error', text: 'La institución y el título de resolución son obligatorios.' });
      return;
    }

    setSaving(true);
    try {
      const saved = await saveCertification(editingCert, isNew);
      if (isNew) {
        setCertifications(prev => [...prev, saved]);
        setStatusMessage({ type: 'success', text: '¡Certificación añadida exitosamente!' });
      } else {
        setCertifications(prev => prev.map(c => c.id === saved.id ? saved : c));
        setStatusMessage({ type: 'success', text: '¡Certificación actualizada con éxito!' });
      }
      setModalOpen(false);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar la certificación.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200/60">
              <Award className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-800">Acreditaciones & Certificaciones Oficiales</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Administra las resoluciones del SAG, normas de inocuidad y certificaciones institucionales de ASITEC S.A.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-asitec-blue hover:bg-blue-900 text-white font-medium rounded-xl shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Certificación</span>
        </button>
      </div>

      {/* Alerta de estado */}
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
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Lista de Certificaciones */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200/80">
          <Loader2 className="w-8 h-8 text-asitec-blue animate-spin mb-3" />
          <p className="text-sm text-slate-500 font-medium">Cargando certificaciones...</p>
        </div>
      ) : certifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No hay certificaciones registradas</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Agrega la resolución exenta del SAG o acreditaciones de inocuidad de la empresa.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-asitec-blue text-white text-sm font-medium rounded-xl hover:bg-blue-900 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Certificación
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                      {cert.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      {cert.institution}
                    </span>
                    {cert.year && (
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {cert.year}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {cert.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {cert.resolution}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 max-w-3xl">
                    {cert.detail}
                  </p>
                  {cert.documentUrl && (
                    <a
                      href={cert.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline pt-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Enlace a documento adjunto
                    </a>
                  )}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => handleOpenEdit(cert)}
                  className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Editar certificación"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cert.id, cert.resolution)}
                  className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Eliminar certificación"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Crear / Editar Certificación */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                  <Award className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    {isNew ? 'Nueva Acreditación o Certificación' : 'Editar Certificación'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Aparecerá en el portal oficial de ASITEC S.A.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                    Etiqueta / Badge
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Acreditación Oficial"
                    value={editingCert.badge || ''}
                    onChange={(e) => setEditingCert(prev => ({ ...prev, badge: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                    Institución Emisora *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Servicio Agrícola y Ganadero (SAG)"
                    value={editingCert.institution || ''}
                    onChange={(e) => setEditingCert(prev => ({ ...prev, institution: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  Título / Número de Resolución *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Laboratorio Calibrado y Certificado: Resolución Exenta Nº 6805 / 2016"
                  value={editingCert.resolution || ''}
                  onChange={(e) => setEditingCert(prev => ({ ...prev, resolution: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  Detalle / Alcance de la Certificación
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe la cobertura, vigencia territorial o normativa técnica amparada..."
                  value={editingCert.detail || ''}
                  onChange={(e) => setEditingCert(prev => ({ ...prev, detail: e.target.value }))}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                    Estado de Vigencia
                  </label>
                  <input
                    type="text"
                    placeholder="ej. 100% Vigente"
                    value={editingCert.status || '100% Vigente'}
                    onChange={(e) => setEditingCert(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                    Año de Obtención / Renovación
                  </label>
                  <input
                    type="text"
                    placeholder="ej. 2016 o 2024"
                    value={editingCert.year || ''}
                    onChange={(e) => setEditingCert(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  URL del Documento o PDF Oficial (Opcional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={editingCert.documentUrl || ''}
                  onChange={(e) => setEditingCert(prev => ({ ...prev, documentUrl: e.target.value }))}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Botones */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-asitec-blue hover:bg-blue-900 text-white font-medium text-sm rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{isNew ? 'Guardar Certificación' : 'Actualizar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
