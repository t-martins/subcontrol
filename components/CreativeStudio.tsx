
import React, { useState, useEffect } from 'react';
import { BrandProfile, GeneratedArt, AspectRatio, VisualStyle } from '../types';
import { generateArt } from '../services/geminiService';
import ImageCard from './ImageCard';

interface CreativeStudioProps {
  brand: BrandProfile;
  history: GeneratedArt[];
  preSelectedStyle?: VisualStyle | null;
  onArtGenerated: (art: GeneratedArt) => void;
  onDeleteArt: (id: string) => void;
  onReorderArt: (id: string) => void;
  onClearHistory: () => void;
  onBack: () => void;
}

const CreativeStudio: React.FC<CreativeStudioProps> = ({ 
  brand, 
  history, 
  preSelectedStyle, 
  onArtGenerated, 
  onDeleteArt, 
  onBack 
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [useImpact, setUseImpact] = useState(brand.useLaunchImpact || false);
  const [selectedStyle, setSelectedStyle] = useState<VisualStyle | null>(null);
  const [viewingStyle, setViewingStyle] = useState<VisualStyle | null>(null); // State for the Detail Modal
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [includeWatermark, setIncludeWatermark] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedArt | null>(null);

  useEffect(() => {
    if (brand.expertReferences && brand.expertReferences.length > 0 && !selectedExpert) {
      setSelectedExpert(brand.expertReferences[0]);
    }
  }, [brand.expertReferences]);

  useEffect(() => {
    if (preSelectedStyle) setSelectedStyle(preSelectedStyle);
  }, [preSelectedStyle]);

  const toggleProduct = (url: string) => {
    setSelectedProducts(prev => 
      prev.includes(url) ? prev.filter(p => p !== url) : [...prev, url]
    );
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const brandContext = `Estilo: ${brand.visualStyle}. ${selectedStyle ? `DNA: ${selectedStyle.name} - ${selectedStyle.dna?.description || ''}` : ''}`;
      const refs = [...(selectedExpert ? [selectedExpert] : []), ...selectedProducts];

      const res = await generateArt(
        prompt, 
        selectedFormat, 
        brandContext, 
        refs.length > 0 ? refs : undefined,
        useImpact,
        selectedStyle?.dna,
        includeWatermark
      );
      
      const newArt: GeneratedArt = {
        id: `art-${Math.random().toString(36).substr(2, 5)}`,
        urls: res.imageUrls,
        prompt: prompt,
        description: res.description,
        timestamp: Date.now()
      };
      
      setResult(newArt);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro na geração da imagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (result) {
      onArtGenerated({ ...result, isRejected: false });
      setResult(null);
      setPrompt('');
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  const handleDiscard = () => {
    if (result) {
      onArtGenerated({ ...result, isRejected: true });
      setResult(null);
      setPrompt('');
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  const formats = [
    { label: 'Feed (1:1)', value: AspectRatio.SQUARE, icon: 'fa-square', tip: 'Ideal para posts de grade no Instagram e Facebook.' },
    { label: 'Retrato (3:4)', value: AspectRatio.PORTRAIT, icon: 'fa-rectangle-vertical', tip: 'Perfeito para fotos de produtos que ocupam mais tela no Feed.' },
    { label: 'Stories (9:16)', value: AspectRatio.STORIES, icon: 'fa-mobile-screen', tip: 'Otimizado para Stories e Reels verticais.' },
    { label: 'Vídeo (16:9)', value: AspectRatio.YOUTUBE, icon: 'fa-tv', tip: 'Formato cinematográfico para vídeos de Youtube ou Capas.' },
  ];

  return (
    <div className="flex flex-col gap-12 animate-fadeIn pb-20">
      <section className="bg-white border border-brand-soft rounded-[3.5rem] p-10 shadow-2xl space-y-10 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-brand-soft pb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-deep rounded-2xl flex items-center justify-center shadow-lg">
              <i className="fas fa-wand-magic-sparkles text-white text-xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-black text-brand-deep uppercase tracking-tighter">Estúdio Criativo</h2>
              <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">IA personalizada para sua marca</p>
            </div>
          </div>
          <button onClick={onBack} className="px-6 py-2 bg-brand-light text-brand-deep rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-soft transition-all flex items-center gap-2">
             <i className="fas fa-arrow-left"></i> Voltar à Galeria
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-brand-deep uppercase tracking-widest ml-1">O que vamos criar?</label>
              <textarea 
                value={prompt} 
                onChange={e => setPrompt(e.target.value)} 
                placeholder="Ex: Foto de um bolo de cenoura com calda escorrendo, estilo rústico e acolhedor..." 
                className="w-full bg-brand-light/30 border border-brand-soft rounded-[2rem] px-8 py-6 outline-none focus:border-brand-accent text-brand-deep font-bold min-h-[160px] resize-none shadow-inner" 
              />
            </div>
            
            <div className="space-y-4">
              <label className="text-xs font-black text-brand-deep uppercase tracking-widest ml-1">Formato da Arte</label>
              <div className="grid grid-cols-4 gap-3">
                {formats.map(f => (
                  <div key={f.value} className="group relative">
                    <button 
                      onClick={() => setSelectedFormat(f.value)} 
                      className={`w-full flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all ${selectedFormat === f.value ? 'border-brand-accent bg-brand-light/50 text-brand-deep shadow-inner' : 'border-brand-soft text-brand-primary opacity-60 hover:opacity-100 hover:bg-white'}`}
                    >
                      <i className={`fas ${f.icon} mb-1 text-sm`}></i>
                      <span className="text-[8px] font-black uppercase">{f.label.split(' ')[0]}</span>
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-brand-deep text-white text-[9px] font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-normal w-32 z-50 shadow-2xl text-center">
                      {f.tip}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-brand-deep"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => setIncludeWatermark(!includeWatermark)}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${includeWatermark ? 'bg-brand-light/50 border-brand-accent' : 'bg-white border-brand-soft'}`}
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-brand-deep">Marca d'água</span>
                </div>
                <div className={`w-10 h-6 rounded-full relative transition-all ${includeWatermark ? 'bg-brand-accent' : 'bg-brand-soft'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${includeWatermark ? 'left-5' : 'left-1'}`}></div>
                </div>
              </div>

              <div 
                onClick={() => setUseImpact(!useImpact)}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${useImpact ? 'bg-brand-deep border-brand-accent text-white' : 'bg-white border-brand-soft'}`}
              >
                <span className={`text-[10px] font-black uppercase ${useImpact ? 'text-white' : 'text-brand-deep'}`}>Modo Impacto</span>
                <div className={`w-10 h-6 rounded-full relative transition-all ${useImpact ? 'bg-brand-accent' : 'bg-brand-soft'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${useImpact ? 'left-5' : 'left-1'}`}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 bg-brand-light/20 p-8 rounded-[2.5rem] border border-brand-soft">
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-brand-deep uppercase tracking-widest">DNA de Estilo</label>
                <span className="text-[8px] font-bold text-brand-primary uppercase italic">Role para o lado</span>
              </div>
              
              {/* Carrossel de Estilos Aprimorado */}
              <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-hide snap-x snap-mandatory">
                <div className="snap-start flex-shrink-0">
                  <button 
                    onClick={() => setSelectedStyle(null)} 
                    className={`w-24 h-24 rounded-[1.5rem] border-2 flex flex-col items-center justify-center gap-1 transition-all ${!selectedStyle ? 'border-brand-accent bg-white shadow-xl scale-105 z-10' : 'border-brand-soft bg-white/50 opacity-40 hover:opacity-100'}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-soft flex items-center justify-center">
                       <i className="fas fa-magic text-brand-deep text-[10px]"></i>
                    </div>
                    <span className="text-[8px] font-black uppercase">Padrão</span>
                  </button>
                </div>
                
                {(brand.savedStyles || []).map(s => (
                  <div key={s.id} className="snap-start flex-shrink-0 relative">
                    <button 
                      onClick={() => setViewingStyle(s)} 
                      className={`w-24 h-24 rounded-[1.5rem] border-2 overflow-hidden relative transition-all group ${selectedStyle?.id === s.id ? 'border-brand-accent scale-105 shadow-xl z-10' : 'border-brand-soft opacity-40 hover:opacity-100 hover:scale-[1.02]'}`}
                    >
                      <img src={s.image} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-brand-deep/20 group-hover:bg-transparent transition-all"></div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-deep/80 to-transparent p-2">
                        <p className="text-[7px] font-black text-white uppercase text-center truncate">{s.name}</p>
                      </div>
                      
                      {selectedStyle?.id === s.id && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-brand-accent rounded-full flex items-center justify-center shadow-lg border border-white">
                           <i className="fas fa-check text-white text-[6px]"></i>
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {selectedStyle && (
                <div className="mt-2 p-3 bg-white/60 rounded-xl border border-brand-accent/30 flex items-center justify-between animate-fadeIn">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse"></div>
                      <span className="text-[9px] font-black text-brand-deep uppercase">Ativo: {selectedStyle.name}</span>
                   </div>
                   <button onClick={() => setSelectedStyle(null)} className="text-[8px] font-black text-brand-primary hover:text-red-500 uppercase">Remover</button>
                </div>
              )}
            </div>

            {/* SEÇÃO SEPARADA: EXPERT */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <i className="fas fa-user-tie text-[10px] text-brand-primary"></i>
                <label className="text-[10px] font-black text-brand-deep uppercase tracking-widest">Sua Expert</label>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                <div className="snap-start">
                  <button 
                    onClick={() => setSelectedExpert(null)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 flex items-center justify-center text-[8px] font-black transition-all ${!selectedExpert ? 'border-brand-accent bg-white shadow-md' : 'border-brand-soft opacity-40'}`}
                  >
                    NENHUMA
                  </button>
                </div>
                {(brand.expertReferences || []).map((url, i) => (
                  <div key={i} className="snap-start">
                    <button 
                      onClick={() => setSelectedExpert(url === selectedExpert ? null : url)} 
                      className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden transition-all ${selectedExpert === url ? 'border-brand-accent scale-105 shadow-md' : 'border-brand-soft opacity-40 hover:opacity-100'}`}
                    >
                      <img src={url} className="w-full h-full object-cover" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SEÇÃO SEPARADA: PRODUTOS */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <i className="fas fa-box-open text-[10px] text-brand-primary"></i>
                <label className="text-[10px] font-black text-brand-deep uppercase tracking-widest">Seus Produtos</label>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                {(brand.productReferences || []).map((url, i) => (
                  <div key={`p-${i}`} className="snap-start">
                    <button 
                      onClick={() => toggleProduct(url)} 
                      className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden transition-all relative ${selectedProducts.includes(url) ? 'border-brand-accent scale-105 shadow-md' : 'border-brand-soft opacity-40 hover:opacity-100'}`}
                    >
                      <img src={url} className="w-full h-full object-cover" />
                      {selectedProducts.includes(url) && (
                        <div className="absolute inset-0 bg-brand-accent/40 flex items-center justify-center">
                          <i className="fas fa-check text-white text-xs"></i>
                        </div>
                      )}
                    </button>
                  </div>
                ))}
                {(!brand.productReferences || brand.productReferences.length === 0) && (
                  <div className="text-[8px] text-brand-primary font-bold uppercase italic py-4">Nenhum produto cadastrado</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button 
            onClick={handleGenerate} 
            disabled={loading || !prompt} 
            className={`w-full max-w-2xl py-6 rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl transition-all ${loading || !prompt ? 'bg-brand-soft text-brand-primary cursor-not-allowed' : 'bg-brand-accent text-white hover:scale-[1.02] active:scale-95 shadow-brand-accent/30'}`}
          >
            {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i> Criando Arte...</> : 'Gerar Postagem'}
          </button>
        </div>
      </section>

      {/* Modal de Detalhes do Estilo */}
      {viewingStyle && (
        <div className="fixed inset-0 z-[120] bg-brand-deep/80 backdrop-blur-xl flex items-center justify-center p-6 sm:p-12" onClick={() => setViewingStyle(null)}>
          <div className="bg-white rounded-[3.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scaleIn shadow-2xl border border-brand-soft flex flex-col md:flex-row overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="md:w-1/2 h-[300px] md:h-auto relative">
              <img src={viewingStyle.image} className="w-full h-full object-cover" alt={viewingStyle.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/40 to-transparent pointer-events-none"></div>
            </div>
            
            <div className="md:w-1/2 p-10 flex flex-col justify-between space-y-8 bg-dots relative">
              <button onClick={() => setViewingStyle(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-deep hover:bg-brand-soft transition-all">
                <i className="fas fa-times"></i>
              </button>
              
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.3em]">Mergulho no DNA</span>
                  <h3 className="text-4xl font-black text-brand-deep uppercase tracking-tighter mt-1">{viewingStyle.name}</h3>
                </div>

                {viewingStyle.dna && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Paleta Cromática</p>
                      <div className="flex gap-3">
                        {viewingStyle.dna.colors.map(c => (
                          <div key={c} className="group relative">
                             <div className="w-10 h-10 rounded-xl shadow-lg border-2 border-white" style={{backgroundColor: c}}></div>
                             <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-brand-deep text-white px-1.5 py-0.5 rounded uppercase">{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Tipografia Detectada</p>
                      <p className="text-lg font-black text-brand-deep italic">{viewingStyle.dna.typography}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Essência Visual</p>
                      <div className="bg-brand-light/50 p-6 rounded-3xl border-l-4 border-brand-accent italic text-sm text-brand-deep leading-relaxed shadow-inner">
                        "{viewingStyle.dna.description}"
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => { setSelectedStyle(viewingStyle); setViewingStyle(null); }} 
                className="w-full py-5 bg-brand-accent text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-brand-accent/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                <i className="fas fa-check-circle"></i> Aplicar ao Estúdio
              </button>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-white p-10 rounded-[3.5rem] border-4 border-brand-accent shadow-2xl animate-scaleIn flex flex-col items-center gap-8 max-w-2xl mx-auto w-full relative">
          <img src={result.urls[0]} className="w-full rounded-[2rem] shadow-2xl border border-brand-soft" alt="Arte" />
          <div className="flex gap-4 w-full">
            <button 
              onClick={handleDiscard} 
              className="flex-1 py-4 bg-brand-light text-red-500 rounded-2xl font-black uppercase text-xs hover:bg-red-50 transition-all flex items-center justify-center gap-2"
            >
              <i className="fas fa-thumbs-down"></i> Descartar
            </button>
            <button 
              onClick={handleSave} 
              className="flex-[2] py-4 bg-brand-deep text-white rounded-2xl font-black uppercase text-xs shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <i className="fas fa-thumbs-up"></i> Confirmar e Salvar
            </button>
          </div>
        </div>
      )}

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-center">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {history.map(art => <ImageCard key={art.id} art={art} onDelete={() => onDeleteArt(art.id)} />)}
      </div>
    </div>
  );
};

export default CreativeStudio;
