import type { Product, Recipe, Certification } from '../types';
import { products as staticProducts } from '../data/products';
import { recipes as staticRecipes } from '../data/recipes';
import { companyInfo as staticCompanyInfo } from '../data/company';
import { initialCertifications as staticCertifications } from '../data/certifications';

const API_BASE = '/api';

// -------------------------------------------------------------
// CLAVES DE ALMACENAMIENTO LOCAL DUAL-LAYER
// -------------------------------------------------------------
const TOKEN_KEY = 'asitec_auth_token';
const USER_KEY = 'asitec_auth_user';
const SETTINGS_KEY = 'asitec_custom_settings';
const PRODUCTS_KEY = 'asitec_custom_products';
const CERTS_KEY = 'asitec_custom_certs';
const RECIPES_KEY = 'asitec_custom_recipes';

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
// 1. PRODUCTOS (Con Arquitectura Híbrida: API + LocalStorage + Static)
// -------------------------------------------------------------
export async function getProducts(category?: string, query?: string): Promise<Product[]> {
  let list: Product[] = [];
  let apiSucceeded = false;

  // 1. Intentar API MySQL
  try {
    const url = new URL(`${API_BASE}/products.php`, window.location.origin);
    if (category && category !== 'Todos') url.searchParams.set('category', category);
    if (query) url.searchParams.set('q', query);

    const res = await fetch(url.toString());
    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && json.success && Array.isArray(json.products) && json.products.length > 0) {
      list = json.products;
      apiSucceeded = true;
      try {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
      } catch {}
    }
  } catch (err) {
    // API no disponible
  }

  // 2. Si API no respondió, usar LocalStorage o Static
  if (!apiSucceeded) {
    try {
      const raw = localStorage.getItem(PRODUCTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed;
        }
      }
    } catch {}

    if (list.length === 0) {
      list = [...staticProducts];
    }
  }

  // 3. Filtrar
  if (category && category !== 'Todos') {
    list = list.filter(p => p.category === category);
  }
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q)
    );
  }
  return list;
}

export async function saveProduct(product: Partial<Product>, isNew: boolean): Promise<Product> {
  const newProduct: Product = {
    id: product.id || `prod-${Date.now()}`,
    name: product.name || 'Producto Nuevo',
    category: product.category || 'Pastelería',
    subcategory: product.subcategory || 'General',
    description: product.description || '',
    format: product.format || 'Formato Industrial',
    shelfLife: product.shelfLife || '12 meses a partir de la fecha de elaboración.',
    country: product.country || 'Chile',
    image: product.image || 'https://www.asitec.cl/wp-content/uploads/2021/04/Productos-Asitec-2021-01-1.png',
    popular: product.popular || false
  };

  // 1. Guardar de inmediato en LocalStorage
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    let currentList: Product[] = raw ? JSON.parse(raw) : [...staticProducts];
    if (isNew) {
      currentList = [newProduct, ...currentList.filter(p => p.id !== newProduct.id)];
    } else {
      currentList = currentList.map(p => p.id === newProduct.id ? newProduct : p);
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(currentList));
    window.dispatchEvent(new CustomEvent('asitec_products_updated', { detail: currentList }));
  } catch (e) {
    console.warn('Error al guardar producto localmente:', e);
  }

  // 2. Sincronizar en segundo plano con API MySQL
  try {
    const method = isNew ? 'POST' : 'PUT';
    const res = await fetch(`${API_BASE}/products.php`, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(newProduct)
    });

    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && json.success && json.product) {
      return json.product;
    }
  } catch {
    // Si no hay backend PHP disponible, el guardado local ya garantizó persistencia
  }

  return newProduct;
}

export async function deleteProduct(productId: string): Promise<void> {
  // 1. Eliminar de LocalStorage
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    let currentList: Product[] = raw ? JSON.parse(raw) : [...staticProducts];
    currentList = currentList.filter(p => p.id !== productId);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(currentList));
    window.dispatchEvent(new CustomEvent('asitec_products_updated', { detail: currentList }));
  } catch (e) {
    console.warn('Error al eliminar producto localmente:', e);
  }

  // 2. Sincronizar con API MySQL
  try {
    const res = await fetch(`${API_BASE}/products.php?id=${encodeURIComponent(productId)}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && !json.success) {
      console.warn('Aviso al eliminar en servidor:', json.error);
    }
  } catch {
    // Sincronización offline
  }
}

// -------------------------------------------------------------
// 2. CERTIFICACIONES Y ACREDITACIONES OFICIALES
// -------------------------------------------------------------
export async function getCertifications(): Promise<Certification[]> {
  let list: Certification[] = [];
  let apiSucceeded = false;

  try {
    const res = await fetch(`${API_BASE}/certifications.php`);
    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && json.success && Array.isArray(json.certifications) && json.certifications.length > 0) {
      list = json.certifications;
      apiSucceeded = true;
      try {
        localStorage.setItem(CERTS_KEY, JSON.stringify(list));
      } catch {}
    }
  } catch (err) {
    // API no disponible
  }

  if (!apiSucceeded) {
    try {
      const raw = localStorage.getItem(CERTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed;
        }
      }
    } catch {}

    if (list.length === 0) {
      list = [...staticCertifications];
    }
  }

  return list;
}

export async function saveCertification(cert: Partial<Certification>, isNew: boolean): Promise<Certification> {
  const newCert: Certification = {
    id: cert.id || `cert-${Date.now()}`,
    badge: cert.badge || 'Acreditación Oficial',
    institution: cert.institution || 'Servicio Agrícola y Ganadero (SAG)',
    resolution: cert.resolution || 'Resolución Exenta',
    detail: cert.detail || '',
    status: cert.status || '100% Vigente',
    documentUrl: cert.documentUrl || '',
    year: cert.year || '2024'
  };

  try {
    const raw = localStorage.getItem(CERTS_KEY);
    let currentList: Certification[] = raw ? JSON.parse(raw) : [...staticCertifications];
    if (isNew) {
      currentList = [newCert, ...currentList.filter(c => c.id !== newCert.id)];
    } else {
      currentList = currentList.map(c => c.id === newCert.id ? newCert : c);
    }
    localStorage.setItem(CERTS_KEY, JSON.stringify(currentList));
    window.dispatchEvent(new CustomEvent('asitec_certs_updated', { detail: currentList }));
  } catch (e) {
    console.warn('Error al guardar certificación localmente:', e);
  }

  try {
    const method = isNew ? 'POST' : 'PUT';
    const res = await fetch(`${API_BASE}/certifications.php`, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(newCert)
    });

    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && json.success && json.certification) {
      return json.certification;
    }
  } catch {
    // Offline
  }

  return newCert;
}

export async function deleteCertification(certId: string): Promise<void> {
  try {
    const raw = localStorage.getItem(CERTS_KEY);
    let currentList: Certification[] = raw ? JSON.parse(raw) : [...staticCertifications];
    currentList = currentList.filter(c => c.id !== certId);
    localStorage.setItem(CERTS_KEY, JSON.stringify(currentList));
    window.dispatchEvent(new CustomEvent('asitec_certs_updated', { detail: currentList }));
  } catch (e) {
    console.warn('Error al eliminar certificación localmente:', e);
  }

  try {
    await fetch(`${API_BASE}/certifications.php?id=${encodeURIComponent(certId)}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  } catch {}
}

// -------------------------------------------------------------
// 3. RECETARIO Y VIDEOS
// -------------------------------------------------------------
export async function getRecipes(): Promise<Recipe[]> {
  let list: Recipe[] = [];
  let apiSucceeded = false;

  try {
    const res = await fetch(`${API_BASE}/recipes.php`);
    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && json.success && Array.isArray(json.recipes) && json.recipes.length > 0) {
      list = json.recipes;
      apiSucceeded = true;
      try {
        localStorage.setItem(RECIPES_KEY, JSON.stringify(list));
      } catch {}
    }
  } catch (err) {
    // API no disponible
  }

  if (!apiSucceeded) {
    try {
      const raw = localStorage.getItem(RECIPES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed;
        }
      }
    } catch {}

    if (list.length === 0) {
      list = [...staticRecipes];
    }
  }

  return list;
}

export async function saveRecipe(rec: Partial<Recipe>, isNew: boolean): Promise<Recipe> {
  const newRec: Recipe = {
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

  try {
    const raw = localStorage.getItem(RECIPES_KEY);
    let currentList: Recipe[] = raw ? JSON.parse(raw) : [...staticRecipes];
    if (isNew) {
      currentList = [newRec, ...currentList.filter(r => r.id !== newRec.id)];
    } else {
      currentList = currentList.map(r => r.id === newRec.id ? newRec : r);
    }
    localStorage.setItem(RECIPES_KEY, JSON.stringify(currentList));
    window.dispatchEvent(new CustomEvent('asitec_recipes_updated', { detail: currentList }));
  } catch (e) {
    console.warn('Error al guardar receta localmente:', e);
  }

  try {
    const method = isNew ? 'POST' : 'PUT';
    const res = await fetch(`${API_BASE}/recipes.php`, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(newRec)
    });

    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && json.success && json.recipe) {
      return json.recipe;
    }
  } catch {
    // Offline
  }

  return newRec;
}

export async function deleteRecipe(recId: string): Promise<void> {
  try {
    const raw = localStorage.getItem(RECIPES_KEY);
    let currentList: Recipe[] = raw ? JSON.parse(raw) : [...staticRecipes];
    currentList = currentList.filter(r => r.id !== recId);
    localStorage.setItem(RECIPES_KEY, JSON.stringify(currentList));
    window.dispatchEvent(new CustomEvent('asitec_recipes_updated', { detail: currentList }));
  } catch (e) {
    console.warn('Error al eliminar receta localmente:', e);
  }

  try {
    await fetch(`${API_BASE}/recipes.php?id=${encodeURIComponent(recId)}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  } catch {}
}

// -------------------------------------------------------------
// 4. CONFIGURACIÓN GENERAL (Ajustes de Empresa, Horarios, Teléfonos, Banco)
// -------------------------------------------------------------
export const DEFAULT_SETTINGS: Record<string, string> = {
  company_name: staticCompanyInfo.name,
  company_tagline: staticCompanyInfo.tagline,
  company_description: staticCompanyInfo.description,
  years_experience: '+26 años',
  clients_count: '+850 panaderías y molinos',
  products_count: '+45 fórmulas industriales',
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

export async function getSettings(): Promise<Record<string, string>> {
  let localSettings: Record<string, string> = {};

  // 1. Leer LocalStorage primero para tener respuesta inmediata
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      localSettings = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error al leer settings locales:', e);
  }

  // 2. Intentar API MySQL
  try {
    const res = await fetch(`${API_BASE}/settings.php`);
    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && json.success && json.settings) {
      const merged = { ...DEFAULT_SETTINGS, ...localSettings, ...json.settings };
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
      } catch {}
      return merged;
    }
  } catch (err) {
    // API no disponible
  }

  // 3. Devolver combinación de valores por defecto con ajustes locales guardados
  return { ...DEFAULT_SETTINGS, ...localSettings };
}

export async function saveSettings(settings: Record<string, string>): Promise<void> {
  // 1. Persistencia INMEDIATA en LocalStorage para garantizar que el usuario nunca pierda sus cambios
  let merged: Record<string, string> = { ...DEFAULT_SETTINGS, ...settings };
  try {
    const currentRaw = localStorage.getItem(SETTINGS_KEY);
    const prev = currentRaw ? JSON.parse(currentRaw) : DEFAULT_SETTINGS;
    merged = { ...prev, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent('asitec_settings_updated', { detail: merged }));
  } catch (e) {
    console.warn('Error al guardar ajustes en localStorage:', e);
  }

  // 2. Sincronizar con API MySQL si está disponible en cPanel
  try {
    const res = await fetch(`${API_BASE}/settings.php`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(merged)
    });

    const { isPhp, json } = await safeParseJson(res);
    if (!isPhp && json && !json.success) {
      console.warn('Aviso servidor al guardar settings:', json.error);
    }
  } catch (err) {
    // Si la base de datos de cPanel aún no está creada, los datos ya quedaron 100% seguros en localStorage
    console.info('Guardado local activo (Backend en espera de conexión a BD MySQL):', err);
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
    // Si no hay backend PHP disponible, generar Data URL base64
  }

  // Conversor Data URL para preview y guardado inmediato sin depender de carpetas del servidor
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

  // Fallback demo / sin conexión de base de datos
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
    // Modo offline
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
