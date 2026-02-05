
export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  BRAND_PROFILE = 'BRAND_PROFILE',
  CREATE_ART = 'CREATE_ART',
  PROJECTS = 'PROJECTS',
  SETTINGS = 'SETTINGS'
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '3:4',
  LANDSCAPE = '4:3',
  STORIES = '9:16',
  YOUTUBE = '16:9'
}

export interface ScannedDNA {
  colors: string[];
  typography: string;
  elements: string[];
  description: string;
}

export interface VisualStyle {
  id: string;
  name: string;
  images: string[]; // Array de imagens em base64
  image?: string; // Mantido para compatibilidade retroativa
  dna?: ScannedDNA;
}

export interface BrandProfile {
  name: string;
  logo: string | null;
  expertReferences: string[];
  productReferences: string[];
  references: string[];
  gallery: string[];
  summary: string;
  colors: string[];
  typography: string;
  visualStyle: string;
  scannedDNA?: ScannedDNA;
  useLaunchImpact?: boolean;
  savedStyles?: VisualStyle[];
}

export interface GeneratedArt {
  id: string;
  urls: string[];
  prompt: string;
  description?: string;
  timestamp: number;
  isRejected?: boolean; // Novo campo para feedback
  styleName?: string; // Nome do estilo visual usado
}
