import type { Product, LabEquipment, Recipe } from '../types';
import { products as staticProducts } from '../data/products';
import { labEquipments as staticEquipments } from '../data/equipments';
import { recipes as staticRecipes } from '../data/recipes';
import { companyInfo as staticCompanyInfo } from '../data/company';

const API_BASE = '/api';

// -------------------------------------------------------------
// GESTIÓN DE SESIÓN LOCAL
// -------------------------------------------------------------
const TOKEN_KEY = 'asitec_auth_token';
const USER_KEY = 'asitec_auth_user';

export interface AdminUser {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: string;
}

export const authStorage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getUser: (): AdminUser | null => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (user: AdminUser) => localStorage.setItem(USER_KEY, JSON.stringify(user))
};

function getAuthHeaders(): HeadersInit {
  const token = authStorage.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

/**
 * Validador seguro de respuestas HTTP.
 * Detecta si el servidor web devolvió código fuente PHP sin procesar
 * (lo cual ocurre cuando se ejecuta en Vite dev o hosting estático sin Apache/PHP).
 */
async function safeParseJson(res: Response): Promise<{ isPhp: boolean; json: any }> {
  try {
    const text = await res.text();
    const trimmed = text.trim();
    if (trimmed.startsWith('<?php') || trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html')) {
      return { isPhp: true, json: null };
    }
    const json = JSON.parse(text);
    return { isPhp: false, json };
  } catch {
    return { isPhp: true, json: null };
  }
}

// -------------------------------------------------------------
// 1. PRODUCTOS (Con Fallback Híbrido)
// -------------------------------------------------------------
export async function getProducts(category?: string, query?: string): Promise<Product[]> {
  try {
    const url = new URL(`${API_BASE}/products.php`, window.location.origin);
    if (category && category !== 'Todos') url.searchParams.set('category', category);
    if (query) url.searchParams.set('q', query);

    const res = await fetch(url.toString());
    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && json.success && Array.isArray(json.products) && json.products.length > 0) {
      return json.products;
    }
  } catch (err) {
    console.warn('API /api/products.php no disponible. Usando datos locales de respaldo.', err);
  }

  // Fallback estático
  let filtered = [...staticProducts];
  if (category && category !== 'Todos') {
    filtered = filtered.filter(p => p.category === category);
  }
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q)
    );
  }
  return filtered;
}

export async function saveProduct(product: Partial<Product>, isNew: boolean): Promise<Product> {
  try {
    const method = isNew ? 'POST' : 'PUT';
    const res = await fetch(`${API_BASE}/products.php`, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(product)
    });

    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && json.success && json.product) {
      return json.product;
    }
  } catch {
    // Entorno local sin backend PHP
  }

  // Fallback local
  return {
    id: product.id || `prod-${Date.now()}`,
    name: product.name || 'Producto Nuevo',
    category: product.category || 'Pastelería',
    subcategory: product.subcategory || 'General',
    description: product.description || '',
    format: product.format || 'Formato Industrial',
    shelfLife: product.shelfLife || '12 meses',
    country: product.country || 'Chile',
    image: product.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    popular: product.popular || false
  };
}

export async function deleteProduct(productId: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/products.php?id=${encodeURIComponent(productId)}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && !json.success) {
      throw new Error(json.error || 'Error al eliminar el producto.');
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('Error al')) throw err;
  }
}

// -------------------------------------------------------------
// 2. EQUIPOS DE LABORATORIO SAG
// -------------------------------------------------------------
export async function getEquipments(): Promise<LabEquipment[]> {
  try {
    const res = await fetch(`${API_BASE}/equipments.php`);
    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && json.success && Array.isArray(json.equipments) && json.equipments.length > 0) {
      return json.equipments;
    }
  } catch (err) {
    console.warn('API /api/equipments.php no disponible. Usando datos locales de respaldo.', err);
  }
  return staticEquipments;
}

export async function saveEquipment(eq: Partial<LabEquipment>, isNew: boolean): Promise<LabEquipment> {
  try {
    const method = isNew ? 'POST' : 'PUT';
    const res = await fetch(`${API_BASE}/equipments.php`, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(eq)
    });

    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && json.success && json.equipment) {
      return json.equipment;
    }
  } catch {
    // Entorno local sin backend PHP
  }

  return {
    id: eq.id || `eq-${Date.now()}`,
    name: eq.name || 'Equipo Analítico',
    brand: eq.brand || 'Bastak',
    model: eq.model || '',
    tagline: eq.tagline || '',
    description: eq.description || '',
    specs: eq.specs || [],
    sagCertified: eq.sagCertified ?? true,
    image: eq.image || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'
  };
}

export async function deleteEquipment(eqId: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/equipments.php?id=${encodeURIComponent(eqId)}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && !json.success) {
      throw new Error(json.error || 'Error al eliminar el equipo.');
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('Error al')) throw err;
  }
}

// -------------------------------------------------------------
// 3. RECETARIO Y VIDEOS
// -------------------------------------------------------------
export async function getRecipes(): Promise<Recipe[]> {
  try {
    const res = await fetch(`${API_BASE}/recipes.php`);
    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && json.success && Array.isArray(json.recipes) && json.recipes.length > 0) {
      return json.recipes;
    }
  } catch (err) {
    console.warn('API /api/recipes.php no disponible. Usando datos locales de respaldo.', err);
  }
  return staticRecipes;
}

export async function saveRecipe(rec: Partial<Recipe>, isNew: boolean): Promise<Recipe> {
  try {
    const method = isNew ? 'POST' : 'PUT';
    const res = await fetch(`${API_BASE}/recipes.php`, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(rec)
    });

    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && json.success && json.recipe) {
      return json.recipe;
    }
  } catch {
    // Entorno local sin backend PHP
  }

  return {
    id: rec.id || `rec-${Date.now()}`,
    title: rec.title || 'Nueva Receta Técnica',
    category: rec.category || 'Pastelería',
    duration: rec.duration || '30 min',
    difficulty: rec.difficulty || 'Fácil',
    videoUrl: rec.videoUrl || '',
    thumbnail: rec.thumbnail || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    description: rec.description || '',
    recommendedProduct: rec.recommendedProduct || '',
    keySteps: rec.keySteps || []
  };
}

export async function deleteRecipe(recId: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/recipes.php?id=${encodeURIComponent(recId)}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && !json.success) {
      throw new Error(json.error || 'Error al eliminar la receta.');
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('Error al')) throw err;
  }
}

// -------------------------------------------------------------
// 4. CONFIGURACIÓN GENERAL
// -------------------------------------------------------------
export async function getSettings(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${API_BASE}/settings.php`);
    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && json.success && json.settings) {
      return json.settings;
    }
  } catch (err) {
    console.warn('API /api/settings.php no disponible. Usando datos de respaldo.', err);
  }

  // Fallback con datos actuales de company.ts
  return {
    company_name: staticCompanyInfo.name,
    company_tagline: staticCompanyInfo.tagline,
    company_description: staticCompanyInfo.description,
    contact_address: staticCompanyInfo.contact.address,
    contact_phone: staticCompanyInfo.contact.phone,
    contact_phone_raw: staticCompanyInfo.contact.phoneRaw,
    contact_whatsapp: '+56992671171',
    contact_email: staticCompanyInfo.contact.email,
    contact_working_hours: staticCompanyInfo.contact.workingHours,
    contact_maps_url: staticCompanyInfo.contact.googleMapsUrl,
    bank_name: staticCompanyInfo.bankSecurity.bankName,
    bank_account_holder: staticCompanyInfo.bankSecurity.accountHolder,
    bank_account_type: staticCompanyInfo.bankSecurity.accountType,
    bank_account_number: staticCompanyInfo.bankSecurity.accountNumber,
    bank_rut: staticCompanyInfo.bankSecurity.rut,
    bank_payment_email: staticCompanyInfo.bankSecurity.paymentEmail,
    distributor_region: staticCompanyInfo.distributor.region,
    distributor_company: staticCompanyInfo.distributor.company,
    distributor_contact: staticCompanyInfo.distributor.contactPerson,
    distributor_phone: staticCompanyInfo.distributor.phone,
    distributor_phone_raw: staticCompanyInfo.distributor.phoneRaw,
    distributor_email: staticCompanyInfo.distributor.email,
    distributor_catalog_url: staticCompanyInfo.distributor.catalogUrl
  };
}

export async function saveSettings(settings: Record<string, string>): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/settings.php`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });

    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && !json.success) {
      throw new Error(json.error || 'Error al guardar la configuración.');
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('Error al')) throw err;
  }
}

// -------------------------------------------------------------
// 5. SUBIDA DE IMÁGENES
// -------------------------------------------------------------
export async function uploadImage(file: File): Promise<string> {
  try {
    const token = authStorage.getToken();
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/upload.php`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData
    });

    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && json.success && json.url) {
      return json.url;
    }
  } catch {
    // Si no hay backend PHP, usar Data URL local
  }

  // Conversor Data URL para preview inmediato en local o demo
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Error al procesar la imagen localmente.'));
    reader.readAsDataURL(file);
  });
}

// -------------------------------------------------------------
// 6. AUTENTICACIÓN
// -------------------------------------------------------------
export async function login(username: string, password: string): Promise<AdminUser> {
  let isPhp = false;
  let json: any = null;

  try {
    const res = await fetch(`${API_BASE}/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const parsed = await safeParseJson(res);
    isPhp = parsed.isPhp;
    json = parsed.json;
  } catch {
    isPhp = true;
  }

  // Si estamos en Vite Dev Server o hosting estático sin Apache/PHP:
  if (isPhp || !json) {
    const validUser = username.trim().toLowerCase() === 'admin';
    const validPass = password === 'Asitec2026!Admin' || password === 'admin';

    if (validUser && validPass) {
      const demoUser: AdminUser = {
        id: 1,
        username: 'admin',
        full_name: 'Administrador Asitec',
        email: 'admin@asitec.cl',
        role: 'admin'
      };
      authStorage.setToken('demo_token_' + Date.now());
      authStorage.setUser(demoUser);
      return demoUser;
    } else {
      throw new Error('Credenciales inválidas. Usa: admin / Asitec2026!Admin');
    }
  }

  if (!json.success) {
    throw new Error(json.error || 'Credenciales inválidas.');
  }

  authStorage.setToken(json.token);
  authStorage.setUser(json.user);
  return json.user;
}

export async function checkAuth(): Promise<AdminUser | null> {
  const token = authStorage.getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/auth_check.php`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && json.success && json.user) {
      authStorage.setUser(json.user);
      return json.user;
    }
  } catch {
    // Si la API no responde, recurrir a sesión local
  }

  return authStorage.getUser();
}

export async function logout(): Promise<void> {
  const token = authStorage.getToken();
  if (token) {
    try {
      await fetch(`${API_BASE}/auth_check.php?logout=1`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch {
      // Ignorar error al desconectar
    }
  }
  authStorage.removeToken();
}
