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

export const recipes: Recipe[] = [
  {
    id: 'crema-chantilly',
    title: 'Crema Chantilly Perfecta',
    category: 'Pastelería',
    duration: '5 min',
    difficulty: 'Fácil',
    videoUrl: 'https://www.asitec.cl/wp-content/uploads/2024/05/Crema-chantilly.mp4',
    thumbnail: '',
    description: 'Aprende a preparar y batir Crema Chantilly con volumen estable, textura tersa y sin desuerar, ideal para decoraciones finas.',
    recommendedProduct: 'Base Crema Chantilly Asitec',
    keySteps: [
      'Disolver la base Chantilly en leche o agua fría (4°C a 6°C).',
      'Batir a velocidad media durante 1 minuto para homogenizar.',
      'Aumentar a velocidad máxima por 3 a 4 minutos hasta obtener picos firmes.',
      'Refrigerar 15 minutos antes de manguear.'
    ]
  },
  {
    id: 'brownie-fudge',
    title: 'Brownie Americano Crocante y Húmedo',
    category: 'Pastelería',
    duration: '25 min',
    difficulty: 'Fácil',
    videoUrl: 'https://www.asitec.cl/wp-content/uploads/2024/05/Brownie.mp4',
    thumbnail: '',
    description: 'Elaboración de Brownie estilo fudge con costra craquelada brillante y centro chocolatoso denso y húmedo.',
    recommendedProduct: 'Premezcla Brownie Asitec',
    keySteps: [
      'Mezclar la Premezcla Brownie con agua y materia grasa según dosificación.',
      'Batir en primera velocidad por 2 minutos hasta integrar sin sobrebatir.',
      'Verter en bandeja con papel mantequilla o desmoldante.',
      'Hornear a 180°C durante 22 a 25 minutos. Enfriar completamente antes de cortar.'
    ]
  },
  {
    id: 'queque-vainilla-chocolate',
    title: 'Queque Marmolado Vainilla y Chocolate',
    category: 'Pastelería',
    duration: '40 min',
    difficulty: 'Intermedio',
    videoUrl: 'https://www.asitec.cl/wp-content/uploads/2024/05/queque-vainilla-chocolate.mp4',
    thumbnail: '',
    description: 'Combinación armoniosa de queque esponjoso sabor vainilla con vetas de chocolate belga.',
    recommendedProduct: 'Premezclas Queques Asitec',
    keySteps: [
      'Elaborar el batido base con Premezcla Queque Vainilla, huevos, aceite y agua.',
      'Dividir una porción del batido e incorporar cacao puro.',
      'Alternar capas en el molde y generar efecto marmolado con espátula.',
      'Hornear a 170°C por 35-40 minutos.'
    ]
  },
  {
    id: 'bizcocho-vainilla',
    title: 'Bizcocho Clásico de Gran Volumen',
    category: 'Pastelería',
    duration: '30 min',
    difficulty: 'Fácil',
    videoUrl: 'https://www.asitec.cl/wp-content/uploads/2024/05/bizcocho-vainilla.mp4',
    thumbnail: '',
    description: 'Técnica profesional para brazos de reina, empolvados y tortas tradicionales con miga ligera y aireada.',
    recommendedProduct: 'Premezcla Bizcocho Vainilla Asitec',
    keySteps: [
      'Incorporar huevos y agua a la Premezcla Bizcocho Asitec.',
      'Batir a velocidad alta durante 8 a 10 minutos para máxima aireación.',
      'Dosificar en moldes circulares o bandejas para brazo de reina.',
      'Hornear a 190°C por 18 a 22 minutos.'
    ]
  },
  {
    id: 'muffins-gourmet',
    title: 'Muffins con Copete Gourmet',
    category: 'Pastelería',
    duration: '25 min',
    difficulty: 'Fácil',
    videoUrl: 'https://www.asitec.cl/wp-content/uploads/2024/05/muffins.mp4',
    thumbnail: '',
    description: 'Muffins de gran desarrollo vertical, corona agrietada dorada y miga excepcionalmente suave.',
    recommendedProduct: 'Premezcla Muffins Vainilla Asitec',
    keySteps: [
      'Mezclar Premezcla Muffins con huevos, aceite y agua.',
      'Opcional: incorporar chips de chocolate, arándanos o nueces.',
      'Dosificar en cápsulas de papel llenando al 80% de capacidad.',
      'Hornear a 190°C durante 20 minutos.'
    ]
  },
  {
    id: 'masas-dulces',
    title: 'Masas Dulces Tradicionales y Facturas',
    category: 'Pastelería',
    duration: '45 min',
    difficulty: 'Intermedio',
    videoUrl: 'https://www.asitec.cl/wp-content/uploads/2024/05/masas-dulces.mp4',
    thumbnail: '',
    description: 'Preparación de trenzas, berlinesas, rollos de canela y donas con miga hilada de excelente conservación.',
    recommendedProduct: 'Premezcla Masas Dulces Asitec',
    keySteps: [
      'Amasar hasta lograr punto de velo o elasticidad completa.',
      'Formar piezas y fermentar en cámara a 30°C con 75% de humedad.',
      'Hornear o freír según la preparación deseada.',
      'Rellenar con Crema Pastelera Asitec.'
    ]
  },
  {
    id: 'queque-berries-naranja',
    title: 'Queque de Berries y Naranja',
    category: 'Pastelería',
    duration: '45 min',
    difficulty: 'Fácil',
    videoUrl: 'https://www.asitec.cl/wp-content/uploads/2024/05/queque-berries-naranja.mp4',
    thumbnail: '',
    description: 'Elaboración de queque esponjoso y aromático combinando notas cítricas de naranja y frutos del bosque.',
    recommendedProduct: 'Premezcla Queque Berries y Naranja Asitec',
    keySteps: [
      'Mezclar Premezcla Queque Berries y Naranja con huevos, aceite y agua.',
      'Batir a velocidad media durante 3 a 4 minutos.',
      'Dosificar en moldes rectangulares o de corona.',
      'Hornear a 170°C durante 40 a 45 minutos.'
    ]
  },
  {
    id: 'cocadas',
    title: 'Cocadas Horneadas Artesanales',
    category: 'Pastelería',
    duration: '20 min',
    difficulty: 'Fácil',
    videoUrl: 'https://www.asitec.cl/wp-content/uploads/2024/05/cocadas.mp4',
    thumbnail: '',
    description: 'Preparación rápida de cocadas tradicionales con dorado parejo, exterior crocante y centro tierno y aromático a coco.',
    recommendedProduct: 'Premezcla Cocadas Asitec',
    keySteps: [
      'Mezclar la Premezcla Cocadas Asitec con agua caliente según dosificación técnica.',
      'Homogenizar con espátula hasta lograr una masa maleable.',
      'Manguear o bolear las porciones sobre lata engrasada.',
      'Hornear a 200°C por 10 a 12 minutos hasta obtener dorado parejo.'
    ]
  }
];
