export interface Product {
  id: string;
  name: string;
  category: 'Pastelería' | 'Panadería' | 'Insumos para Molinos' | 'Equipos & Laboratorios';
  subcategory: string;
  description: string;
  format: string;
  shelfLife: string;
  country: string;
  image: string;
  popular?: boolean;
  sourceUrl?: string;
}

export interface QuoteItem {
  product: Product;
  selectedFormat: string;
  quantity: number;
  notes?: string;
}

export interface LabEquipment {
  id: string;
  name: string;
  brand?: string;
  model?: string;
  tagline: string;
  description: string;
  specs: string[];
  sagCertified: boolean;
  image: string;
}

export interface Recipe {
  id: string;
  title: string;
  category: 'Pastelería' | 'Panadería';
  duration: string;
  difficulty: 'Fácil' | 'Intermedio' | 'Avanzado';
  videoUrl: string;
  thumbnail: string;
  description: string;
  recommendedProduct: string;
  keySteps: string[];
}
