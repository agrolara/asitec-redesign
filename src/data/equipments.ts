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

export const sagCertification = {
  institution: 'Servicio Agrícola y Ganadero (SAG)',
  resolution: 'Resolución Exenta Nº 6805 / 2016',
  detail: 'Asitec S.A. se encuentra registrado como laboratorio certificado y calibrado para nuestra línea de equipos analíticos de molinería y panificación en todo el territorio nacional.'
};

export const labEquipments: LabEquipment[] = [
  {
    id: 'bastak-c4000',
    name: 'Molino Experimental de Laboratorio Mill C-4000',
    brand: 'Bastak',
    model: 'C-4000',
    tagline: 'El equipo analítico más vendido en Chile, registrado en SAG',
    description: 'Apto para molienda de grano seco como húmedo. Separa automáticamente harina y salvado en contenedores independientes tras pasar por rodillos calibrados. Posee frontal de vidrio para inspección y prevención de contaminación cruzada.',
    specs: [
      'Porcentaje de extracción: 50% a 60% según calidad del trigo',
      'Molienda regulable mediante ajuste micrométrico de alimentación',
      'Frontal de vidrio templado para fácil aseo y visualización en tiempo real',
      'Transmisión por correas en V antitrancado',
      'Dimensiones: 300 x 600 x 560 mm | Peso: 42 Kg',
      'Incluye tamiz con tela calibrada 9XX a medida'
    ],
    sagCertified: true,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'glutomatic',
    name: 'Sistema Glutomatic Integral',
    brand: 'Perten / Analytical',
    model: 'Glutomatic System',
    tagline: 'Determinación oficial de cantidad y calidad de gluten en harinas',
    description: 'Consta de 3 módulos de alta precisión: el primer módulo lava la muestra eliminando proteínas hidrosolubles para calcular proteína de gluten; el segundo mide el índice de tenacidad (Gluten Index); y el tercer módulo es un secador de precisión para gluten seco.',
    specs: [
      'Determinación de Gluten Húmedo, Seco y Gluten Index (Tenacidad)',
      'Lavado automatizado con solución salina estandarizada',
      'Centrífuga de tamiz de precisión para separación de fracciones',
      'Secador térmico directo libre de residuos',
      'Cumple normas internacionales ICC 137/1, 155, 158 e ISO 21415'
    ],
    sagCertified: true,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'enzinumber',
    name: 'Analizador de Actividad Enzimática Enzinumber',
    brand: 'Enzinumber Tech',
    model: 'FN-System',
    tagline: 'Medición rápida y certera del Falling Number (Índice de Caída)',
    description: 'Evalúa la actividad enzimática de alfa-amilasas en soluciones de harina sometidas a temperatura de ebullición. Esencial para graduar mezclas en molinos y panaderías.',
    specs: [
      'Rango óptimo estandarizado: ~250 segundos',
      'Detección de déficit amilásico: >330 segundos',
      'Detección de sobrecarga enzimática: ~220 segundos',
      'Control microprocesado de temperatura de baño María a 100°C',
      'Agitación e inmersión mecánica automatizada de doble cabezal'
    ],
    sagCertified: true,
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'termobalanza-honeywell',
    name: 'Termobalanza de Alta Temperatura Honeywell',
    brand: 'Honeywell Analytics',
    model: 'TB-1000',
    tagline: 'Determinación continua de humedad, calcinación y cenizas',
    description: 'Horno termobalanza de precisión operativa entre 40°C y 1000°C con termocupla NiCr-Ni y cerebro electrónico Honeywell. Capaz de operar 100 horas continuas.',
    specs: [
      'Rango térmico: 40°C a 1000°C con sensibilidad de termostato de 1°C',
      'Termocupla industrial NiCr-Ni para alta reproducibilidad',
      'Unidad electrónica digital Honeywell de servicio continuo (100 hrs)',
      'Alimentación: 220V 50Hz, potencia 1.5 kW | Volumen útil: 3 dm³',
      'Dimensiones interiores: 140 x 110 x 200 mm | Exteriores: 320 x 410 x 350 mm | Peso: 20 Kg',
      'Garantía de 1 año y 10 años de disponibilidad en piezas de recambio'
    ],
    sagCertified: true,
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'calador-granos',
    name: 'Calador de Granos Acero Inoxidable 304',
    brand: 'Asitec Industrial',
    model: 'CG-170',
    tagline: 'Muestreo estratificado de trigo en camiones tolva y graneleros',
    description: 'Herramienta de precisión construida en acero inoxidable AISI 304 con fina terminación. Con 1.70 metros y 11 celdas independientes para muestreos homogéneos a diferentes profundidades.',
    specs: [
      'Largo total: 1.70 metros con 11 celdas de muestreo de 85 x 25 mm',
      'Fabricado en Acero Inoxidable 304 de grado alimentario',
      'Manillar en acero calidad 1020 con empuñaduras plásticas antideslizantes',
      'Punta cónica de aluminio desmontable para penetración suave en tolva',
      'Peso liviano balanceado: 4.2 Kg para manipulación ágil en terreno'
    ],
    sagCertified: true,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cernidor-laboratorio',
    name: 'Equipo Cernidor Microprocesado de Laboratorio',
    brand: 'Bastak Lab',
    model: 'Sieve-Pro 8',
    tagline: 'Análisis granulométrico y homogeneidad de partículas en polvo',
    description: 'Equipo electromecánico con timer y apagado automático controlado por microprocesador. Permite estandarizar la distancia de rodillos en molienda y verificar tamices en la producción diaria.',
    specs: [
      'Control microprocesado con temporizador y apagado automático',
      'Set de 8 aros de PVC de alta duración más contenedor y tapa de aluminio',
      'Mallas calibrables intercambiables según requerimiento del cliente',
      'Apto para harinas, almidones, premezclas, minerales y agregados sólidos'
    ],
    sagCertified: true,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
  }
];
