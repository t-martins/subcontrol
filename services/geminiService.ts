
import { GoogleGenAI } from "@google/genai";
import { AspectRatio, ScannedDNA } from "../types";

export const fileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const parseDataUrl = (dataUrl: string) => {
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    return null;
  }
  try {
    const [header, data] = dataUrl.split(',');
    const mimeType = header.split(';')[0].split(':')[1];
    return { mimeType, data };
  } catch (e) {
    return null;
  }
};

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2, initialDelay = 1000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const isQuotaError = err.message?.includes('429') || err.status === 429 || err.code === 429;
      
      if (isQuotaError && i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

export const scanImageDNA = async (imageBase64: string): Promise<ScannedDNA> => {
  const parsed = parseDataUrl(imageBase64);
  if (!parsed) throw new Error("Imagem inválida para scan.");

  const prompt = `Analise esta imagem de referência e extraia o seu "DNA Visual".
  Retorne um JSON estritamente com:
  - colors: lista de cores hexadecimais (até 5) predominantes.
  - typography: descrição das fontes.
  - elements: elementos gráficos (sombras, texturas, ícones).
  - description: resumo da narrativa visual.`;

  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { 
        parts: [
          { inlineData: { data: parsed.data, mimeType: parsed.mimeType } },
          { text: prompt }
        ] 
      },
      config: { responseMimeType: "application/json" }
    });

    const text = response.text || '{}';
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedJson = JSON.parse(cleanJson);
    
    return {
      colors: Array.isArray(parsedJson.colors) ? parsedJson.colors : [],
      typography: parsedJson.typography || "Padrão",
      elements: Array.isArray(parsedJson.elements) ? parsedJson.elements : [],
      description: parsedJson.description || ""
    } as ScannedDNA;
  });
};

export const generateArt = async (
  prompt: string, 
  aspectRatio: AspectRatio,
  brandContext?: string,
  referenceImages?: string | string[],
  isLaunchImpact: boolean = false,
  scannedDNA?: ScannedDNA,
  includeWatermark: boolean = false
) => {
  const impactInstructions = isLaunchImpact ? `
    --- MODO IMPACTO ATIVADO ---
    Setas 3D, badges vibrantes, tipografia pesada.
  ` : '';

  const dnaContext = scannedDNA ? `
    --- DNA VISUAL ---
    Cores: ${(scannedDNA.colors || []).join(', ')}
    Estilo: ${scannedDNA.description || ''}
  ` : '';

  const watermarkInstruction = includeWatermark 
    ? `ADICIONE discretamente a marca d'água "Jana's Cakes".`
    : `NÃO adicione marca d'água.`;

  const commonContext = `Crie uma arte de CONFEITARIA DE LUXO.
  BRANDING: ${brandContext}
  ${dnaContext}
  ${impactInstructions}
  REGRAS: ${watermarkInstruction}. Apenas português real.`;

  const imageParts: any[] = [];
  if (referenceImages) {
    const refs = Array.isArray(referenceImages) ? referenceImages : [referenceImages];
    refs.forEach(ref => {
      const p = parseDataUrl(ref);
      if (p) imageParts.push({ inlineData: { data: p.data, mimeType: p.mimeType } });
    });
  }

  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const parts = [...imageParts, { text: `${commonContext}\nOBJETIVO: ${prompt}\nFORMATO: ${aspectRatio}` }];
    
    const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: { imageConfig: { aspectRatio: aspectRatio as any } }
    });

    let url = '';
    for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        url = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
    if (!url) throw new Error("Geração falhou");

    const captionResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Escreva uma legenda curta e irresistível para o post: "${prompt}".`,
    });

    return { imageUrls: [url], description: captionResponse.text || "" };
  });
};
