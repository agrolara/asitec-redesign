import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Upload, 
  X, 
  Check, 
  AlertCircle, 
  Loader2, 
  FlaskConical, 
  ShieldCheck, 
  Layers
} from 'lucide-react';
import type { LabEquipment } from '../../types';
import { getEquipments, saveEquipment, deleteEquipment, uploadImage } from '../../services/api';

export const AdminEquipments: React.FC = () => {
  const [equipments, setEquipments] = useState<LabEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [editingEq, setEditingEq] = useState<Partial<LabEquipment>>({
    name: '',
    brand: '',
    model: '',
    tagline: '',
    description: '',
    specs: [''],
    sagCertified: true,
    image: ''
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getEquipments();
      setEquipments(data);
    } catch {
      setStatusMessage({ type: 'error', text: 'Error al cargar equipos de laboratorio.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setIsNew(true);
    setEditingEq({
      id: '',
      name: '',
      brand: 'Bastak',
      model: '',
      tagline: '',
      description: '',
      specs: ['Molienda regulable con ajuste de precisión', 'Cumple con estándares SAG'],
      sagCertified: true,
      image: ''
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (eq: LabEquipment) => {
    setIsNew(false);
    setEditingEq({ ...eq, specs: [...eq.specs] });
    setModalOpen(true);
  };

  const handleDelete = async (eqId: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el equipo "${name}"?`)) return;

    try {
      await deleteEquipment(eqId);
      setEquipments(prev => prev.filter(e => e.id !== eqId));
      setStatusMessage({ type: 'success', text: `Equipo "${name}" eliminado.` });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar.';
      setStatusMessage({ type: 'error', text: msg });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setEditingEq(prev => ({ ...prev, image: url }));
      setStatusMessage({ type: 'success', text: 'Imagen de equipo subida con éxito.' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir la imagen.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setUploading(false);
    }
  };

  const handleAddSpec = () => {
    setEditingEq(prev => ({
      ...prev,
      specs: [...(prev.specs || []), '']
    }));
  };

  const handleUpdateSpec = (idx: number, val: string) => {
    setEditingEq(prev => {
      const copy = [...(prev.specs || [])];
      copy[idx] = val;
      return { ...prev, specs: copy };
    });
  };

  const handleRemoveSpec = (idx: number) => {
    setEditingEq(prev => {
      const copy = [...(prev.specs || [])];
      copy.splice(idx, 1);
      return { ...prev, specs: copy };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEq.name?.trim()) {
      alert('El nombre del equipo es obligatorio.');
      return;
    }

    setSaving(true);
    try {
      const cleanSpecs = (editingEq.specs || []).filter(s => s.trim() !== '');
      const saved = await saveEquipment({ ...editingEq, specs: cleanSpecs }, isNew);
      if (isNew) {
        setEquipments(prev => [...prev, saved]);
        setStatusMessage({ type: 'success', text: 'Equipo agregado exitosamente.' });
      } else {
        setEquipments(prev => prev.map(e => e.id === saved.id ? saved : e));
        setStatusMessage({ type: 'success', text: 'Equipo actualizado exitosamente.' });
      }
      setModalOpen(false);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-amber-600" />
            <span>Equipos de Laboratorio SAG ({equipments.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Administra el instrumental analítico certificado según Res. SAG Nº 6805 / 2016.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Nuevo Equipo SAG</span>
        </button>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in ${
          statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {statusMessage.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Listing */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Cargando equipos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {equipments.map((eq) => (
            <div key={eq.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {eq.image ? (
                        <img src={eq.image} alt={eq.name} className="w-full h-full object-cover" />
                      ) : (
                        <FlaskConical className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {eq.brand || 'SAG'} {eq.model ? `• ${eq.model}` : ''}
                        </span>
                        {eq.sagCertified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <ShieldCheck className="w-3 h-3" /> SAG
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{eq.name}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(eq)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(eq.id, eq.name)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {eq.description}
                </p>

                {/* Specs count */}
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>{eq.specs?.length || 0} especificaciones técnicas configuradas</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-mono truncate">
                ID: {eq.id}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">
                {isNew ? 'Nuevo Equipo SAG' : `Editar Equipo: ${editingEq.name}`}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nombre del Equipo *</label>
                  <input
                    type="text"
                    required
                    value={editingEq.name || ''}
                    onChange={(e) => setEditingEq({ ...editingEq, name: e.target.value })}
                    placeholder="Ej: Molino Experimental Mill C-4000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marca</label>
                  <input
                    type="text"
                    value={editingEq.brand || ''}
                    onChange={(e) => setEditingEq({ ...editingEq, brand: e.target.value })}
                    placeholder="Ej: Bastak / Honeywell"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Modelo</label>
                  <input
                    type="text"
                    value={editingEq.model || ''}
                    onChange={(e) => setEditingEq({ ...editingEq, model: e.target.value })}
                    placeholder="Ej: C-4000 / TB-1000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Frase Destacada / Tagline</label>
                  <input
                    type="text"
                    value={editingEq.tagline || ''}
                    onChange={(e) => setEditingEq({ ...editingEq, tagline: e.target.value })}
                    placeholder="Ej: El equipo más vendido en Chile"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción de Operación *</label>
                <textarea
                  rows={3}
                  required
                  value={editingEq.description || ''}
                  onChange={(e) => setEditingEq({ ...editingEq, description: e.target.value })}
                  placeholder="Explica qué mide y cómo opera..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Dynamic Specs Editor */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">
                    Especificaciones Técnicas & Normativas
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Especificación
                  </button>
                </div>

                <div className="space-y-2">
                  {(editingEq.specs || []).map((spec, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={spec}
                        onChange={(e) => handleUpdateSpec(i, e.target.value)}
                        placeholder="Ej: Rango térmico: 40°C a 1000°C"
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(i)}
                        className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                        title="Quitar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Manager */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="block font-bold text-slate-800">Foto del Equipo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {editingEq.image ? (
                      <img src={editingEq.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <FlaskConical className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={editingEq.image || ''}
                      onChange={(e) => setEditingEq({ ...editingEq, image: e.target.value })}
                      placeholder="URL de la imagen o subir desde tu equipo"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>{uploading ? 'Subiendo...' : 'Subir Imagen...'}</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* SAG switch */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="sagCert"
                  checked={editingEq.sagCertified !== false}
                  onChange={(e) => setEditingEq({ ...editingEq, sagCertified: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="sagCert" className="font-semibold text-slate-800 cursor-pointer">
                  Acreditado oficialmente por el SAG (Resolución Exenta Nº 6805 / 2016)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Guardar Equipo</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
