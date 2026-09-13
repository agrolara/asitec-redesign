import type { Certification } from '../types';

export const initialCertifications: Certification[] = [
  {
    id: 'sag-6805-2016',
    badge: 'Acreditación Oficial',
    institution: 'Servicio Agrícola y Ganadero (SAG)',
    resolution: 'Laboratorio Calibrado y Certificado: Resolución Exenta Nº 6805 / 2016',
    detail: 'Asitec S.A. se encuentra registrado como laboratorio certificado y calibrado para nuestra línea de análisis de molinería y panificación en todo el territorio nacional.',
    status: '100% Vigente',
    year: '2016',
    documentUrl: 'https://www.asitec.cl/catalogos/Catalogo_Industrial_Asitec.pdf'
  },
  {
    id: 'inocuidad-haccp',
    badge: 'Inocuidad Alimentaria',
    institution: 'Estándares HACCP / BPM',
    resolution: 'Buenas Prácticas de Manufactura en Plantas de Mezclado',
    detail: 'Procesos de formulación, dosificación y envasado de premezclas bajo rigurosos protocolos de inocuidad alimentaria y trazabilidad de lotes.',
    status: '100% Vigente',
    year: '2024'
  }
];
