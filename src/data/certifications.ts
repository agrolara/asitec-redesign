import type { Certification } from '../types';

export const initialCertifications: Certification[] = [
  {
    id: 'fssc-22000',
    badge: 'Inocuidad Mundial GFSI',
    institution: 'FSSC 22000 (Versión 6) • Zenith Quality Assessors & IAS',
    resolution: 'Certificación Internacional de Inocuidad Alimentaria FSSC 22000 (Certificado Nº FSSC/91/R/I/3139)',
    detail: 'Certificación internacional de clase mundial bajo ISO 22000:2018, ISO/TS 22002-1:2009 y requisitos adicionales FSSC 22000 (Versión 6). Alcance: Elaboración de Premezclas (Tamizado, Molienda, Mezclado), Mejoradores y Aditivos, y Envasado en Contenedores de Polietileno y Polipropileno para la Industria de Alimentos. Casa Matriz Chañarcillo Nº 691, Maipú, Santiago.',
    status: '100% Vigente (Hasta 2029)',
    year: '2026 - 2029',
    documentUrl: '/uploads/certificado-fssc-22000-asitec.jpg'
  },
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
