import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Copy, 
  Trash2, 
  Upload, 
  X, 
  Check, 
  AlertCircle, 
  Loader2, 
  Package, 
  Star
} from 'lucide-react';
import type { Product } from '../../types';
import { getProducts, saveProduct, deleteProduct, uploadImage } from '../../services/api';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({
    name: '',
    category: 'Pastelería',
    subcategory: 'Bases para preparar',
    description: '',
    format: '',
    shelfLife: '12 meses a partir de la fecha de elaboración.',
    country: 'Chile',
    image: '',
    popular: false
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      setStatusMessage({ type: 'error', text: 'Error al cargar productos desde la base de datos.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = products.filter(p => {
    const matchCat = categoryFilter === 'Todos' || p.category === categoryFilter;
    const q = search.toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.subcategory.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const handleOpenCreate = () => {
    setIsNew(true);
    setEditingProduct({
      id: '',
      name: '',
      category: 'Pastelería',
      subcategory: 'Bases para preparar',
      description: '',
      format: 'Saco 25 Kg',
      shelfLife: '12 meses a partir de la fecha de elaboración.',
      country: 'Chile',
      image: '',
      popular: false
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setIsNew(false);
    setEditingProduct({ ...product });
    setModalOpen(true);
  };

  const handleDuplicate = (product: Product) => {
    setIsNew(true);
    setEditingProduct({
      ...product,
      id: '',
      name: `${product.name} (Copia)`,
    });
    setModalOpen(true);
  };

  const handleDelete = async (productId: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el producto "${name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      setStatusMessage({ type: 'success', text: `Producto "${name}" eliminado correctamente.` });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar producto.';
      setStatusMessage({ type: 'error', text: msg });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setEditingProduct(prev => ({ ...prev, image: url }));
      setStatusMessage({ type: 'success', text: 'Imagen subida con éxito al servidor.' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir la imagen.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.name?.trim()) {
      alert('El nombre del producto es obligatorio.');
      return;
    }

    setSaving(true);
    try {
      const saved = await saveProduct(editingProduct, isNew);
      if (isNew) {
        setProducts(prev => [saved, ...prev]);
        setStatusMessage({ type: 'success', text: 'Producto creado exitosamente.' });
      } else {
        setProducts(prev => prev.map(p => p.id === saved.id ? saved : p));
        setStatusMessage({ type: 'success', text: 'Producto actualizado exitosamente.' });
      }
      setModalOpen(false);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar el producto.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Catálogo de Productos ({products.length})
          </h2>
          <p className="text-xs text-slate-500">
            Crea, edita, duplica o elimina fórmulas y materias primas disponibles en la plataforma.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Notification banner */}
      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in ${
          statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {statusMessage.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Filters bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, formato o subcategoría..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Categories pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold text-slate-600">
          {['Todos', 'Pastelería', 'Panadería', 'Insumos para Molinos'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Table listing */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Cargando catálogo desde MySQL...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
          No se encontraron productos con los filtros actuales.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                  <th className="p-3.5">Producto</th>
                  <th className="p-3.5">Categoría / Subcategoría</th>
                  <th className="p-3.5">Formatos</th>
                  <th className="p-3.5">Origen</th>
                  <th className="p-3.5 text-center">Destacado</th>
                  <th className="p-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {prod.image ? (
                            <img src={prod.image} alt={prod.name} className="w-full h-full object-contain mix-blend-multiply" />
                          ) : (
                            <Package className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{prod.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{prod.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-800 block">{prod.category}</span>
                      <span className="text-[11px] text-slate-500">{prod.subcategory}</span>
                    </td>
                    <td className="p-3.5 text-slate-600 max-w-xs truncate">
                      {prod.format || 'Estándar'}
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {prod.country || 'Chile'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      {prod.popular ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700" title="Producto Destacado">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(prod)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          title="Duplicar"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">
                {isNew ? 'Crear Nuevo Producto' : `Editar: ${editingProduct.name}`}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nombre del Producto *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="Ej: Crema Pastelera Especial"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoría Principal *</label>
                  <select
                    value={editingProduct.category || 'Pastelería'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as Product['category'] })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Pastelería">Pastelería</option>
                    <option value="Panadería">Panadería</option>
                    <option value="Insumos para Molinos">Insumos para Molinos</option>
                    <option value="Equipos & Laboratorios">Equipos & Laboratorios</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subcategoría *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.subcategory || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                    placeholder="Ej: Premezclas queques / Bases para preparar"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Formatos de Presentación</label>
                  <input
                    type="text"
                    value={editingProduct.format || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, format: e.target.value })}
                    placeholder="Ej: Saco 25 Kg / Caja de 20 dosis de 400 g"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">País de Origen</label>
                  <input
                    type="text"
                    value={editingProduct.country || 'Chile'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, country: e.target.value })}
                    placeholder="Chile / España / Corea"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duración y Almacenaje</label>
                  <input
                    type="text"
                    value={editingProduct.shelfLife || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, shelfLife: e.target.value })}
                    placeholder="12 meses a partir de la fecha de elaboración..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción Técnica / Usos</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Detalles sobre aplicación, horneo, congelación..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Image Manager */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <label className="block font-bold text-slate-800">
                  Fotografía del Producto
                </label>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {editingProduct.image ? (
                      <img src={editingProduct.image} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                      <Package className="w-8 h-8 text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={editingProduct.image || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      placeholder="https://... o sube una imagen desde tu equipo"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />

                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-xs">
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>{uploading ? 'Subiendo imagen...' : 'Examinar foto...'}</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/jpg"
                          onChange={handleFileUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-slate-400">
                        Formatos: JPG, PNG, WEBP (Guardada en /uploads)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Popular checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="popular"
                  checked={editingProduct.popular || false}
                  onChange={(e) => setEditingProduct({ ...editingProduct, popular: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="popular" className="font-semibold text-slate-800 cursor-pointer">
                  Marcar como Producto Destacado en el Home
                </label>
              </div>

              {/* Modal Actions */}
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
                  <span>Guardar Producto</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
