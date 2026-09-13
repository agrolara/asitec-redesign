export interface Product {
  id: string;
  name: string;
  category: 'Pastelería' | 'Panadería' | 'Insumos para Molinos';
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

export interface Certification {
  id: string;
  badge: string;
  institution: string;
  resolution: string;
  detail: string;
  status: string;
  documentUrl?: string;
  year?: string;
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
