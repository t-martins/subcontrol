
import React from 'react';
import { GeneratedArt } from '../types';

interface ImageCardProps {
  art: GeneratedArt;
  onDelete?: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ art, onDelete }) => {
  const handleDownload = () => {
    if (!art.urls?.[0]) return;
    const link = document.createElement('a');
    link.href = art.urls[0];
    link.download = `post-${art.id}.png`;
    link.click();
  };

  const copyText = () => {
    if (art.description) {
      navigator.clipboard.writeText(art.description);
      alert("Copiado!");
    }
  };

  return (
    <div className={`bg-white rounded-[2rem] border overflow-hidden shadow-lg animate-fadeIn transition-all ${art.isRejected ? 'border-red-100 opacity-80 grayscale-[0.5]' : 'border-brand-soft'}`}>
      <div className="aspect-square bg-brand-light relative">
        {art.urls?.[0] && <img src={art.urls[0]} className="w-full h-full object-cover" />}
        
        {/* Selo de Rejeição */}
        {art.isRejected && (
          <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center pointer-events-none">
            <div className="bg-red-500 text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 -rotate-12 border-2 border-white">
              <i className="fas fa-thumbs-down"></i> Não Gostei
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4 flex gap-2">
           {!art.isRejected && (
             <button onClick={handleDownload} className="w-8 h-8 bg-white/90 text-brand-deep rounded-lg flex items-center justify-center shadow hover:bg-white transition-all">
               <i className="fas fa-download text-xs"></i>
             </button>
           )}
           {onDelete && (
             <button onClick={onDelete} className="w-8 h-8 bg-white/90 text-red-500 rounded-lg flex items-center justify-center shadow hover:bg-white transition-all">
               <i className="fas fa-trash-alt text-xs"></i>
             </button>
           )}
        </div>
      </div>
      <div className="p-6 space-y-4">
        <p className={`text-[12px] font-bold italic leading-relaxed ${art.isRejected ? 'text-brand-primary line-through opacity-50' : 'text-brand-deep'}`}>
          {art.description}
        </p>
        <div className="flex justify-between items-center pt-4 border-t border-brand-light">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase text-brand-soft">{new Date(art.timestamp).toLocaleDateString()}</span>
            {art.isRejected && <span className="text-[8px] font-black uppercase text-red-400">Feedback Negativo Enviado</span>}
          </div>
          {!art.isRejected && (
            <button onClick={copyText} className="text-brand-accent text-xs hover:scale-110 transition-transform">
              <i className="fas fa-copy"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
