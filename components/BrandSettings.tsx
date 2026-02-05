

import React, { useRef, useState } from 'react';
import { BrandProfile, ScannedDNA, VisualStyle } from '../types';
import { scanImageDNA, fileToBase64 } from '../services/geminiService';

// Função para normalizar estilos antigos (image) para novo formato (images)
const normalizeStyle = (style: VisualStyle): VisualStyle => {
  if (style.image && !style.images) {
    return { ...style, images: [style.image] };
  }
  return style;
};

// Função para obter a primeira imagem de um estilo
const getStyleImage = (style: VisualStyle): string => {
  return style.images?.[0] || style.image || '';
};

interface BrandSettingsProps {
  brand: BrandProfile;
  setBrand: React.Dispatch<React.SetStateAction<BrandProfile>>;
  onProceed: (style?: VisualStyle) => void;
  onExportBackup?: () => void;
  onImportBackup?: (file: File) => void;
}

const BrandSettings: React.FC<BrandSettingsProps> = ({ brand, setBrand, onProceed, onExportBackup, onImportBackup }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const styleInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const [uploadType, setUploadType] = useState<'expert' | 'product'>('product');
  const [isProcessing, setIsProcessing] = useState(false);
  const [styleName, setStyleName] = useState('');
  const [viewingStyle, setViewingStyle] = useState<VisualStyle | null>(null);

  const handleAddRef = (type: 'expert' | 'product') => {
    setUploadType(type);
    fileInputRef.current?.click();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const b64 = await fileToBase64(file);
      setBrand(prev => {
        const key = uploadType === 'expert' ? 'expertReferences' : 'productReferences';
        return { ...prev, [key]: [...(prev[key] || []), b64] };
      });
    }
  };

  const handleStyleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (!styleName.trim()) {
        alert("Por favor, insira um nome para o estilo antes de carregar a imagem.");
        return;
      }

      if (brand.savedStyles?.some(s => s.name.toLowerCase() === styleName.trim().toLowerCase())) {
        alert("Um estilo com este nome já existe. Por favor, escolha um nome diferente.");
        return;
      }

      setIsProcessing(true);
      try {
        // Processar todas as imagens
        const imagePromises = Array.from(files).map((file: File) => fileToBase64(file));
        const images = await Promise.all(imagePromises);

        // Extrair DNA da primeira imagem
        const dna = await scanImageDNA(images[0]);

        const newStyle: VisualStyle = {
          id: Math.random().toString(36).substr(2, 9),
          name: styleName,
          images,
          dna
        };
        setBrand(prev => ({ ...prev, savedStyles: [...(prev.savedStyles || []), newStyle] }));
        setStyleName('');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-20">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFile} />
      <input type="file" ref={styleInputRef} className="hidden" accept="image/*" multiple onChange={handleStyleFile} />
      <input type="file" ref={importInputRef} className="hidden" accept=".json" onChange={(e) => {
        const f = e.target.files?.[0];
        if (f && onImportBackup) onImportBackup(f);
      }} />

      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-brand-deep uppercase tracking-tighter">Biblioteca de Marca</h1>
        <button onClick={() => onProceed()} className="px-8 py-3 bg-brand-accent text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl">
          Ir para o Estúdio
        </button>
      </div>

      <section className="bg-brand-deep rounded-[2.5rem] p-8 text-white flex justify-between items-center">
        <h3 className="text-xl font-black uppercase">Backups</h3>
        <div className="flex gap-4">
          <button onClick={onExportBackup} className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20">Exportar</button>
          <button onClick={() => importInputRef.current?.click()} className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20">Importar</button>
        </div>
      </section>

      <section className="bg-white rounded-[3rem] p-10 border border-brand-soft shadow-xl space-y-10">
        <h2 className="text-2xl font-black text-brand-deep uppercase tracking-tighter">DNAs de Post Único</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {(brand.savedStyles || []).map((style) => {
            const normalizedStyle = normalizeStyle(style);
            const imageCount = normalizedStyle.images?.length || 0;
            return (
              <div key={style.id} onClick={() => setViewingStyle(normalizedStyle)} className="group relative aspect-square rounded-[2rem] overflow-hidden border-2 border-brand-soft cursor-pointer">
                <img src={getStyleImage(normalizedStyle)} className="w-full h-full object-cover" />
                {imageCount > 1 && (
                  <div className="absolute top-2 right-2 bg-brand-accent text-white px-2 py-1 rounded-lg text-[8px] font-black">
                    {imageCount} fotos
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-brand-deep/80 p-2">
                  <p className="text-[10px] font-black text-white uppercase text-center truncate">{style.name}</p>
                </div>
              </div>
            );
          })}
          <div className="aspect-square rounded-[2rem] border-2 border-dashed border-brand-soft p-4 flex flex-col gap-2">
            <input type="text" value={styleName} onChange={e => setStyleName(e.target.value)} placeholder="Nome do estilo" className="text-[10px] p-2 bg-brand-light rounded-lg outline-none font-bold" />
            <button onClick={() => styleInputRef.current?.click()} disabled={!styleName || isProcessing} className="flex-1 bg-brand-soft text-brand-deep rounded-xl font-black text-[10px] uppercase hover:bg-brand-primary/20 transition-all disabled:opacity-50">
              {isProcessing ? 'Extraindo...' : 'Add DNA'}
            </button>
          </div>
        </div>
      </section>

      {viewingStyle && (
        <div className="fixed inset-0 z-[110] bg-brand-deep/60 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setViewingStyle(null)}>
          <div className="bg-white rounded-[3rem] p-10 max-w-2xl w-full animate-scaleIn max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-3xl font-black text-brand-deep uppercase mb-6">{viewingStyle.name}</h3>

            {/* Galeria de Imagens */}
            {viewingStyle.images && viewingStyle.images.length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-3">
                  Referências ({viewingStyle.images.length} {viewingStyle.images.length === 1 ? 'foto' : 'fotos'})
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {viewingStyle.images.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden border-2 border-brand-soft">
                      <img src={img} className="w-full h-full object-cover" alt={`Referência ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewingStyle.dna && (
              <div className="space-y-6">
                <div className="flex gap-2">
                  {viewingStyle.dna.colors.map(c => <div key={c} className="w-10 h-10 rounded-xl shadow-md border border-brand-soft" style={{ backgroundColor: c }}></div>)}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Tipografia Detectada</p>
                  <p className="text-sm font-bold text-brand-deep">{viewingStyle.dna.typography}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Narrativa Visual</p>
                  <p className="text-sm text-brand-deep leading-relaxed italic border-l-4 border-brand-accent pl-4">{viewingStyle.dna.description}</p>
                </div>
                <button onClick={() => onProceed(viewingStyle)} className="w-full py-4 bg-brand-accent text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all">Aplicar no Estúdio</button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {['Expert', 'Produtos'].map((title, idx) => {
          const key = idx === 0 ? 'expertReferences' : 'productReferences';
          return (
            <div key={title} className="bg-white rounded-[2.5rem] p-8 border border-brand-soft shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-sm text-brand-deep uppercase tracking-widest">{title}</h3>
                <button onClick={() => handleAddRef(idx === 0 ? 'expert' : 'product')} className="text-[9px] font-black text-brand-accent bg-brand-light px-3 py-1.5 rounded-lg">Add +</button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {(brand[key] as string[] || []).slice(0, 8).map((url, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden border border-brand-soft relative group">
                    <img src={url} className="w-full h-full object-cover" />
                    <button onClick={() => setBrand(prev => ({ ...prev, [key]: (prev[key] as string[]).filter((_, idx) => idx !== i) }))} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><i className="fas fa-trash-alt text-[8px]"></i></button>
                  </div>
                ))}
                <button onClick={() => handleAddRef(idx === 0 ? 'expert' : 'product')} className="aspect-square rounded-xl border-2 border-dashed border-brand-soft flex items-center justify-center text-brand-primary"><i className="fas fa-plus text-xs"></i></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BrandSettings;
