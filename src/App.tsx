import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryNav } from './components/CategoryNav';
import { CatalogSection } from './components/CatalogSection';
import { SagLabSection } from './components/SagLabSection';
import { RecipesSection } from './components/RecipesSection';
import { ServicesSection } from './components/ServicesSection';
import { TrustAndSecuritySection } from './components/TrustAndSecuritySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { QuoteDrawer } from './components/QuoteDrawer';
import { ExecutivePitchModal } from './components/ExecutivePitchModal';

import type { Product, QuoteItem, LabEquipment } from './types';

export const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState<boolean>(false);
  const [isPitchOpen, setIsPitchOpen] = useState<boolean>(false);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);

  // Add product with specific format & qty
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

  // Quick 1-click add from catalog card
  const handleQuickAdd = (product: Product) => {
    const defaultFormat = product.format ? product.format.split(/(?=Saco|Caja|Balde)/g)[0].trim() : 'Formato Estándar Industrial';
    handleAddToQuote(product, defaultFormat, 1);
  };

  // Update item quantity inside quote cart
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

  // Remove single item from cart
  const handleRemoveItem = (productId: string) => {
    setQuoteItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Clear all items in cart
  const handleClearQuote = () => {
    setQuoteItems([]);
  };

  // Convert lab equipment to quotable item
  const handleQuoteEquipment = (eq: LabEquipment) => {
    const eqProduct: Product = {
      id: `eq-${eq.id}`,
      name: `${eq.name} (${eq.brand || 'SAG'})`,
      category: 'Equipos & Laboratorios',
      subcategory: 'Equipamiento Analítico SAG',
      description: eq.description,
      format: `Unidad Analítica Calibrada SAG (${eq.model || 'Estándar'})`,
      shelfLife: 'Garantía 1 año con servicio técnico oficial',
      country: 'Chile / Alemania',
      image: eq.image
    };
    handleAddToQuote(eqProduct, eqProduct.format, 1);
    setIsQuoteOpen(true);
  };

  const handleExploreCatalog = () => {
    const el = document.getElementById('catalogo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const totalQuoteCount = quoteItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      {/* Navigation */}
      <Navbar
        quoteCount={totalQuoteCount}
        onOpenQuote={() => setIsQuoteOpen(true)}
        onOpenPitch={() => setIsPitchOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection
          onOpenPitch={() => setIsPitchOpen(true)}
          onExploreCatalog={handleExploreCatalog}
        />

        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        <CatalogSection
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onSelectProduct={(p) => setActiveProduct(p)}
          onQuickAdd={handleQuickAdd}
        />

        <SagLabSection
          onQuoteEquipment={handleQuoteEquipment}
        />

        <RecipesSection
          onQuickAdd={handleQuickAdd}
        />

        <ServicesSection
          onOpenQuote={() => setIsQuoteOpen(true)}
        />

        <TrustAndSecuritySection />

        <ContactSection />
      </main>

      {/* Footer */}
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

      {/* Executive Pitch Deck for Managers */}
      <ExecutivePitchModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
      />
    </div>
  );
};

export default App;
