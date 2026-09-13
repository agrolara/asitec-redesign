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

// -------------------------------------------------------------
// 1. PRODUCTOS (Con Fallback Híbrido)
// -------------------------------------------------------------
export async function getProducts(category?: string, query?: string): Promise<Product[]> {
  try {
    const url = new URL(`${API_BASE}/products.php`, window.location.origin);
    if (category && category !== 'Todos') url.searchParams.set('category', category);
    if (query) url.searchParams.set('q', query);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.products) && data.products.length > 0) {
      return data.products;
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
  const method = isNew ? 'POST' : 'PUT';
  const res = await fetch(`${API_BASE}/products.php`, {
    method,
    headers: getAuthHeaders(),
    body: JSON.stringify(product)
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Error al guardar el producto.');
  }
  return data.product;
}

export async function deleteProduct(productId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/products.php?id=${encodeURIComponent(productId)}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Error al eliminar el producto.');
  }
}

// -------------------------------------------------------------
// 2. EQUIPOS DE LABORATORIO SAG
// -------------------------------------------------------------
export async function getEquipments(): Promise<LabEquipment[]> {
  try {
    const res = await fetch(`${API_BASE}/equipments.php`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.equipments) && data.equipments.length > 0) {
      return data.equipments;
    }
  } catch (err) {
    console.warn('API /api/equipments.php no disponible. Usando datos locales de respaldo.', err);
  }
  return staticEquipments;
}

export async function saveEquipment(eq: Partial<LabEquipment>, isNew: boolean): Promise<LabEquipment> {
  const method = isNew ? 'POST' : 'PUT';
  const res = await fetch(`${API_BASE}/equipments.php`, {
    method,
    headers: getAuthHeaders(),
    body: JSON.stringify(eq)
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Error al guardar el equipo.');
  }
  return data.equipment;
}

export async function deleteEquipment(eqId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/equipments.php?id=${encodeURIComponent(eqId)}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Error al eliminar el equipo.');
  }
}

// -------------------------------------------------------------
// 3. RECETARIO Y VIDEOS
// -------------------------------------------------------------
export async function getRecipes(): Promise<Recipe[]> {
  try {
    const res = await fetch(`${API_BASE}/recipes.php`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.recipes) && data.recipes.length > 0) {
      return data.recipes;
    }
  } catch (err) {
    console.warn('API /api/recipes.php no disponible. Usando datos locales de respaldo.', err);
  }
  return staticRecipes;
}

export async function saveRecipe(rec: Partial<Recipe>, isNew: boolean): Promise<Recipe> {
  const method = isNew ? 'POST' : 'PUT';
  const res = await fetch(`${API_BASE}/recipes.php`, {
    method,
    headers: getAuthHeaders(),
    body: JSON.stringify(rec)
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Error al guardar la receta.');
  }
  return data.recipe;
}

export async function deleteRecipe(recId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/recipes.php?id=${encodeURIComponent(recId)}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Error al eliminar la receta.');
  }
}

// -------------------------------------------------------------
// 4. CONFIGURACIÓN GENERAL
// -------------------------------------------------------------
export async function getSettings(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${API_BASE}/settings.php`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success && data.settings) {
      return data.settings;
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
  const res = await fetch(`${API_BASE}/settings.php`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(settings)
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Error al guardar la configuración.');
  }
}

// -------------------------------------------------------------
// 5. SUBIDA DE IMÁGENES
// -------------------------------------------------------------
export async function uploadImage(file: File): Promise<string> {
  const token = authStorage.getToken();
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/upload.php`, {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body: formData
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Error al subir la imagen.');
  }
  return data.url;
}

// -------------------------------------------------------------
// 6. AUTENTICACIÓN
// -------------------------------------------------------------
export async function login(username: string, password: string): Promise<AdminUser> {
  const res = await fetch(`${API_BASE}/login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Credenciales inválidas.');
  }

  authStorage.setToken(data.token);
  authStorage.setUser(data.user);
  return data.user;
}

export async function checkAuth(): Promise<AdminUser | null> {
  const token = authStorage.getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/auth_check.php`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      authStorage.removeToken();
      return null;
    }
    const data = await res.json();
    if (data.success && data.user) {
      authStorage.setUser(data.user);
      return data.user;
    }
  } catch {
    // Si la API no está en línea, verificamos si hay sesión previa en localStorage
    return authStorage.getUser();
  }
  return null;
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
