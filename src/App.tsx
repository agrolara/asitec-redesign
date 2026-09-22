import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CatalogSection } from './components/CatalogSection';
import { CertificationsSection } from './components/CertificationsSection';
import { RecipesSection } from './components/RecipesSection';
import { ServicesSection } from './components/ServicesSection';
import { TrustAndSecuritySection } from './components/TrustAndSecuritySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { QuoteDrawer } from './components/QuoteDrawer';

// Admin Components & Services
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { 
  checkAuth, 
  getProducts, 
  getCertifications, 
  getRecipes, 
  getSettings,
  type AdminUser 
} from './services/api';

import type { Product, QuoteItem, Certification, Recipe } from './types';
import { products as initialProducts } from './data/products';
import { initialCertifications } from './data/certifications';
import { recipes as initialRecipes } from './data/recipes';

export const App: React.FC = () => {
  // Routing State (/admin o #admin)
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return window.location.pathname.endsWith('/admin') || 
           window.location.pathname === '/admin' || 
           window.location.hash === '#admin';
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // Dynamic Data States (from MySQL API with fallback)
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [_settings, setSettings] = useState<Record<string, string>>({});

  // Public UI States
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState<boolean>(false);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);

  // Escuchar cambios de URL o Hash para navegación a /admin
  useEffect(() => {
    const handleUrlChange = () => {
      const isAdm = window.location.pathname.endsWith('/admin') || 
                    window.location.pathname === '/admin' || 
                    window.location.hash === '#admin';
      setIsAdminRoute(isAdm);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Verificar sesión y cargar datos al iniciar
  useEffect(() => {
    const initApp = async () => {
      // 1. Verificar sesión activa
      try {
        const user = await checkAuth();
        setAdminUser(user);
      } catch {
        setAdminUser(null);
      } finally {
        setCheckingAuth(false);
      }

      // 2. Cargar datos dinámicos desde API / MySQL (con fallback silencioso)
      try {
        const [prodsData, certsData, recsData, setsData] = await Promise.all([
          getProducts(),
          getCertifications(),
          getRecipes(),
          getSettings()
        ]);
        if (prodsData && prodsData.length > 0) setProducts(prodsData);
        if (certsData && certsData.length > 0) setCertifications(certsData);
        if (recsData && recsData.length > 0) setRecipes(recsData);
        if (setsData) setSettings(setsData);
      } catch (err) {
        console.warn('Uso de datos estáticos de respaldo debido a desconexión del backend:', err);
      }
    };

    initApp();
  }, []);

  const handleGoToSite = () => {
    if (window.location.hash === '#admin') {
      window.location.hash = '';
    } else if (window.location.pathname.endsWith('/admin')) {
      window.history.pushState(null, '', '/');
    }
    setIsAdminRoute(false);
  };

  // Carrito de Cotizaciones (RFQ)
  const handleAddToQuote = (product: Product, format: string, qty: number) => {
    setQuoteItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === product.id && item.selectedFormat === format);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += qty;
        return copy;
      }
      return [...prev, { product, selectedFormat: format, quantity: qty }];
    });
  };

  const handleQuickAdd = (product: Product) => {
    const defaultFormat = product.format ? product.format.split(/(?=Saco|Caja|Balde)/g)[0].trim() : 'Formato Estándar Industrial';
    handleAddToQuote(product, defaultFormat, 1);
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setQuoteItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as QuoteItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setQuoteItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearQuote = () => {
    setQuoteItems([]);
  };

  const handleExploreCatalog = () => {
    const el = document.getElementById('catalogo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const totalQuoteCount = quoteItems.reduce((acc, curr) => acc + curr.quantity, 0);

  // -------------------------------------------------------------
  // RENDERIZADO: PANEL DE ADMINISTRACIÓN (/admin o #admin)
  // -------------------------------------------------------------
  if (isAdminRoute) {
    if (checkingAuth) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium text-slate-400">Verificando credenciales de seguridad...</p>
        </div>
      );
    }

    if (adminUser) {
      return (
        <AdminDashboard
          user={adminUser}
          onLogout={() => setAdminUser(null)}
          onGoToSite={handleGoToSite}
        />
      );
    }

    return (
      <AdminLogin
        onLoginSuccess={(user) => setAdminUser(user)}
        onBackToSite={handleGoToSite}
      />
    );
  }

  // -------------------------------------------------------------
  // RENDERIZADO: SITIO WEB PÚBLICO
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      {/* Navigation */}
      <Navbar
        quoteCount={totalQuoteCount}
        onOpenQuote={() => setIsQuoteOpen(true)}
      />

      {/* Main Content Sections con Datos Dinámicos */}
      <main className="flex-1">
        <HeroSection
          onExploreCatalog={handleExploreCatalog}
        />

        <CatalogSection
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onSelectProduct={(p) => setActiveProduct(p)}
          onQuickAdd={handleQuickAdd}
        />

        <CertificationsSection
          certifications={certifications}
        />

        <RecipesSection
          recipes={recipes}
          products={products}
          onQuickAdd={handleQuickAdd}
        />

        <ServicesSection
          onOpenQuote={() => setIsQuoteOpen(true)}
        />

        <TrustAndSecuritySection />

        <ContactSection />
      </main>

      {/* Footer con enlace a Administración */}
      <Footer />

      {/* Product Detail Modal */}
      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToQuote={handleAddToQuote}
      />

      {/* Quote Drawer RFQ Cart */}
      <QuoteDrawer
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        items={quoteItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClear={handleClearQuote}
      />
    </div>
  );
};

export default App;
