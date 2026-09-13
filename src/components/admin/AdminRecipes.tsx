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
  BookOpen, 
  Video, 
  Clock, 
  Award, 
  ExternalLink, 
  Copy, 
  Sparkles, 
  Search 
} from 'lucide-react';
import type { Recipe } from '../../types';
import { getRecipes, saveRecipe, deleteRecipe, uploadImage } from '../../services/api';

export const AdminRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'Todos' | 'Pastelería' | 'Panadería'>('Todos');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [editingRecipe, setEditingRecipe] = useState<Partial<Recipe>>({
    title: '',
    category: 'Pastelería',
    duration: '25 min',
    difficulty: 'Fácil',
    videoUrl: '',
    thumbnail: '',
    description: '',
    recommendedProduct: '',
    keySteps: ['']
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getRecipes();
      setRecipes(data);
    } catch {
      setStatusMessage({ type: 'error', text: 'Error al cargar el recetario.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setIsNew(true);
    setEditingRecipe({
      id: '',
      title: '',
      category: 'Pastelería',
      duration: '30 min',
      difficulty: 'Intermedio',
      videoUrl: '',
      thumbnail: '',
      description: '',
      recommendedProduct: 'Pastel Cream Vainilla',
      keySteps: [
        'Disolver en frío la mezcla base.',
        'Batir a velocidad media durante 4 minutos.',
        'Hornear a 180°C hasta obtener dorado uniforme.'
      ]
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (recipe: Recipe) => {
    setIsNew(false);
    setEditingRecipe({
      ...recipe,
      keySteps: Array.isArray(recipe.keySteps) && recipe.keySteps.length > 0 ? [...recipe.keySteps] : ['']
    });
    setModalOpen(true);
  };

  const handleDuplicate = (recipe: Recipe) => {
    setIsNew(true);
    setEditingRecipe({
      ...recipe,
      id: '',
      title: `${recipe.title} (Copia)`,
      keySteps: Array.isArray(recipe.keySteps) ? [...recipe.keySteps] : ['']
    });
    setModalOpen(true);
  };

  const handleDelete = async (recipeId: string, title: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar la receta "${title}"?`)) return;

    try {
      await deleteRecipe(recipeId);
      setRecipes(prev => prev.filter(r => r.id !== recipeId));
      setStatusMessage({ type: 'success', text: `Receta "${title}" eliminada con éxito.` });
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar receta.';
      setStatusMessage({ type: 'error', text: msg });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setEditingRecipe(prev => ({ ...prev, thumbnail: url }));
      setStatusMessage({ type: 'success', text: 'Portada de video subida con éxito.' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir la imagen.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setUploading(false);
    }
  };

  const handleAddStep = () => {
    setEditingRecipe(prev => ({
      ...prev,
      keySteps: [...(prev.keySteps || []), '']
    }));
  };

  const handleRemoveStep = (index: number) => {
    setEditingRecipe(prev => ({
      ...prev,
      keySteps: (prev.keySteps || []).filter((_, i) => i !== index)
    }));
  };

  const handleStepChange = (index: number, val: string) => {
    setEditingRecipe(prev => {
      const updated = [...(prev.keySteps || [])];
      updated[index] = val;
      return { ...prev, keySteps: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecipe.title?.trim()) {
      setStatusMessage({ type: 'error', text: 'El título de la receta es obligatorio.' });
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<Recipe> = {
        ...editingRecipe,
        keySteps: (editingRecipe.keySteps || []).filter(s => s.trim().length > 0)
      };

      const saved = await saveRecipe(payload, isNew);

      if (isNew) {
        setRecipes(prev => [saved, ...prev]);
        setStatusMessage({ type: 'success', text: '¡Receta creada exitosamente!' });
      } else {
        setRecipes(prev => prev.map(r => (r.id === saved.id ? saved : r)));
        setStatusMessage({ type: 'success', text: '¡Receta actualizada con éxito!' });
      }

      setModalOpen(false);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar la receta.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  const filteredRecipes = recipes.filter(r => {
    const matchesCategory = categoryFilter === 'Todos' || r.category === categoryFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      (r.recommendedProduct && r.recommendedProduct.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header con estadísticas y botón nuevo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200/60">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-800">Recetario Técnico y Masterclass</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona videos paso a paso, productos clave recomendados e instrucciones técnicas para clientes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Receta</span>
          </button>
        </div>
      </div>

      {/* Mensaje de estado flotante / Toast */}
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
          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por título, descripción o insumo recomendado..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {(['Todos', 'Pastelería', 'Panadería'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Recetas */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200/80">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin mb-3" />
          <p className="text-sm text-slate-500 font-medium">Cargando recetas técnicas...</p>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No se encontraron recetas</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery || categoryFilter !== 'Todos'
              ? 'Prueba ajustando los términos de búsqueda o filtros de categoría.'
              : 'Comienza agregando la primera receta técnica con video instructivo.'}
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Receta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => (
            <div
              key={recipe.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Miniatura del video / Imagen */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  {recipe.thumbnail ? (
                    <img
                      src={recipe.thumbnail}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 text-amber-800/60 p-4">
                      <Video className="w-10 h-10 mb-2" />
                      <span className="text-xs font-medium">Sin miniatura personalizada</span>
                    </div>
                  )}

                  {/* Badge de Categoría */}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md ${
                      recipe.category === 'Pastelería'
                        ? 'bg-purple-600/90 text-white'
                        : 'bg-amber-600/90 text-white'
                    }`}
                  >
                    {recipe.category}
                  </span>

                  {/* Badge de Dificultad */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/80 text-white backdrop-blur-md">
                    {recipe.difficulty}
                  </span>

                  {/* Indicador de duración sobre imagen */}
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-mono bg-black/75 text-white flex items-center gap-1 backdrop-blur-sm">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {recipe.duration}
                  </span>
                </div>

                {/* Contenido */}
                <div className="p-5">
                  <h3 className="font-bold text-slate-800 text-base line-clamp-1 mb-1.5" title={recipe.title}>
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {recipe.description || 'Sin descripción detallada.'}
                  </p>

                  {/* Insumo Recomendado */}
                  {recipe.recommendedProduct && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50/80 border border-amber-200/50 rounded-lg text-xs text-amber-900 mb-3">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">
                        <strong>Insumo:</strong> {recipe.recommendedProduct}
                      </span>
                    </div>
                  )}

                  {/* Pasos clave preview */}
                  {recipe.keySteps && recipe.keySteps.length > 0 && (
                    <div className="text-[11px] text-slate-500 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-700 block text-[10px] uppercase tracking-wider">
                        Pasos Principales ({recipe.keySteps.length})
                      </span>
                      <p className="line-clamp-2 italic">
                        1. {recipe.keySteps[0]}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones de acción inferiores */}
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                {recipe.videoUrl ? (
                  <a
                    href={recipe.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Ver Video
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 italic">Sin URL de video</span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDuplicate(recipe)}
                    title="Duplicar receta"
                    className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-white rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(recipe)}
                    title="Editar receta"
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(recipe.id, recipe.title)}
                    title="Eliminar receta"
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Crear / Editar Receta */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                  <BookOpen className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">
                    {isNew ? 'Nueva Receta o Masterclass' : 'Editar Receta Técnica'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isNew ? 'Completa la información para publicar en la plataforma.' : `Editando: ${editingRecipe.title}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
              {/* Título de la Receta */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Título de la Receta *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Tarta de Frutos Rojos con Crema Pastelera Artesanal"
                  value={editingRecipe.title || ''}
                  onChange={(e) => setEditingRecipe(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Categoría, Duración, Dificultad */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Categoría
                  </label>
                  <select
                    value={editingRecipe.category || 'Pastelería'}
                    onChange={(e) => setEditingRecipe(prev => ({ ...prev, category: e.target.value as 'Pastelería' | 'Panadería' }))}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Pastelería">Pastelería</option>
                    <option value="Panadería">Panadería</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Duración Estimada
                  </label>
                  <input
                    type="text"
                    placeholder="ej. 35 min"
                    value={editingRecipe.duration || ''}
                    onChange={(e) => setEditingRecipe(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Dificultad
                  </label>
                  <select
                    value={editingRecipe.difficulty || 'Fácil'}
                    onChange={(e) => setEditingRecipe(prev => ({ ...prev, difficulty: e.target.value as 'Fácil' | 'Intermedio' | 'Avanzado' }))}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Fácil">Fácil</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
              </div>

              {/* URL del Video e Insumo Recomendado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-slate-500" />
                    URL Video (YouTube / Vimeo / MP4)
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={editingRecipe.videoUrl || ''}
                    onChange={(e) => setEditingRecipe(prev => ({ ...prev, videoUrl: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    Insumo Estrella Recomendado
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Pastel Cream Vainilla"
                    value={editingRecipe.recommendedProduct || ''}
                    onChange={(e) => setEditingRecipe(prev => ({ ...prev, recommendedProduct: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Subida de Portada de Video (Thumbnail) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Imagen de Portada (Miniatura)
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <input
                    type="text"
                    placeholder="URL de la imagen o subir archivo"
                    value={editingRecipe.thumbnail || ''}
                    onChange={(e) => setEditingRecipe(prev => ({ ...prev, thumbnail: e.target.value }))}
                    className="flex-1 w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono text-xs"
                  />
                  <label className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl cursor-pointer transition-colors border border-slate-200">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-slate-500" />}
                    <span>{uploading ? 'Subiendo...' : 'Subir Portada'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
                {editingRecipe.thumbnail && (
                  <div className="mt-2.5 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200/80">
                    <img
                      src={editingRecipe.thumbnail}
                      alt="Vista previa"
                      className="w-16 h-12 object-cover rounded-lg border border-slate-200"
                    />
                    <div className="text-xs text-slate-500 truncate flex-1">
                      <span className="font-semibold text-slate-700 block">Vista previa activa</span>
                      <span className="truncate block font-mono text-[10px]">{editingRecipe.thumbnail}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Descripción de la Receta */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Descripción / Breve Reseña
                </label>
                <textarea
                  rows={2}
                  placeholder="Explica el objetivo de esta receta, tips para el maestro pastelero o notas de conservación..."
                  value={editingRecipe.description || ''}
                  onChange={(e) => setEditingRecipe(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Pasos Clave de Elaboración (Lista Dinámica) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Pasos Clave de Preparación ({editingRecipe.keySteps?.length || 0})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-800 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Añadir Paso
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(editingRecipe.keySteps || []).map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        placeholder={`Paso ${idx + 1}...`}
                        value={step}
                        onChange={(e) => handleStepChange(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      {(editingRecipe.keySteps?.length || 0) > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones de Footer Modal */}
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isNew ? 'Crear Receta' : 'Guardar Cambios'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
