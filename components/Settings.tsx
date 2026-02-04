
import React from 'react';

interface SettingsProps {
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const handleOpenKeySelection = async () => {
    // @ts-ignore
    if (window.aistudio?.openSelectKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    } else {
      alert("Configuração de chave não suportada neste ambiente.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-brand-deep uppercase tracking-tighter">Configurações de Sistema</h1>
          <p className="text-brand-primary font-medium text-sm mt-2 uppercase tracking-widest">Integrações e chaves de acesso</p>
        </div>
        <button onClick={onBack} className="px-6 py-2 bg-brand-light text-brand-deep rounded-xl text-[10px] font-black uppercase tracking-widest border border-brand-soft">
          Voltar ao Início
        </button>
      </div>

      <section className="bg-white rounded-[3.5rem] p-12 border border-brand-soft shadow-xl space-y-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-brand-accent/20 rounded-3xl flex items-center justify-center text-brand-accent">
            <i className="fas fa-key text-2xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-black text-brand-deep uppercase tracking-tighter">Gemini API Token</h2>
            <p className="text-xs font-bold text-brand-primary uppercase tracking-widest">Integração Principal de IA</p>
          </div>
        </div>

        <div className="bg-brand-light/40 rounded-[2.5rem] p-8 border border-brand-soft flex flex-col items-center text-center gap-6">
          <p className="text-sm text-brand-deep font-medium leading-relaxed max-w-lg">
            O Estúdio Criativo utiliza o Google Gemini para gerar suas artes e analisar o DNA visual. Para garantir o funcionamento, você deve selecionar uma chave de API válida de um projeto faturado.
          </p>

          <button 
            onClick={handleOpenKeySelection}
            className="px-10 py-5 bg-brand-deep text-white rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-brand-deep/30 hover:-translate-y-1 transition-all active:scale-95"
          >
            Configurar Token do Gemini
          </button>

          <div className="flex flex-col gap-2">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              className="text-[10px] font-black text-brand-accent uppercase hover:underline flex items-center gap-2"
            >
              Documentação de Faturamento <i className="fas fa-external-link-alt text-[8px]"></i>
            </a>
            <p className="text-[9px] font-bold text-brand-primary uppercase opacity-60 italic">
              A chave selecionada será mantida de forma segura pelo navegador.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-60 pointer-events-none">
        <div className="bg-white/50 rounded-[2.5rem] p-8 border border-brand-soft">
           <h4 className="font-black text-xs text-brand-deep uppercase mb-4">Meta Ads (Em breve)</h4>
           <div className="h-2 bg-brand-soft rounded-full w-full"></div>
        </div>
        <div className="bg-white/50 rounded-[2.5rem] p-8 border border-brand-soft">
           <h4 className="font-black text-xs text-brand-deep uppercase mb-4">Agendamento (Em breve)</h4>
           <div className="h-2 bg-brand-soft rounded-full w-2/3"></div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
