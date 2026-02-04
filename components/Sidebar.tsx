
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  userName: string;
  email: string;
  isOnline?: boolean;
  isSaving?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, userName, email, isOnline, isSaving }) => {
  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-brand-soft flex flex-col z-50 overflow-y-auto shadow-2xl">
      <div className="p-8 pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between mb-1">
             <span className="text-xs font-black text-brand-accent uppercase tracking-widest">Estúdio</span>
             {isOnline && (
               <div className="flex items-center gap-1.5" title={isSaving ? "Salvando no Banco..." : "Banco de Dados Local Ativo"}>
                 <div className={`w-1.5 h-1.5 ${isSaving ? 'bg-brand-accent animate-ping' : 'bg-green-500 rounded-full animate-pulse'}`}></div>
                 <span className={`text-[8px] font-black uppercase ${isSaving ? 'text-brand-accent' : 'text-green-600'}`}>
                   {isSaving ? 'SAVING' : 'DB'}
                 </span>
               </div>
             )}
          </div>
          <span className="text-xl font-black tracking-tighter text-brand-deep leading-tight">
            JANA'S CAKES<br/>
            <span className="text-brand-primary text-sm">CRIADOR</span>
          </span>
        </div>
      </div>

      <div className="px-6 mt-8 mb-8">
        <button 
          onClick={() => setView(AppView.CREATE_ART)}
          className="w-full py-4 bg-brand-deep hover:bg-brand-deep/90 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl"
        >
          <i className="fas fa-plus text-sm"></i>
          <span>Novo Post</span>
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        <button
          onClick={() => setView(AppView.PROJECTS)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
            currentView === AppView.PROJECTS ? 'bg-brand-soft/40 text-brand-deep font-bold' : 'text-brand-primary hover:bg-brand-light'
          }`}
        >
          <i className="fas fa-layer-group text-sm"></i>
          <span className="text-sm">Início</span>
        </button>

        <button
          onClick={() => setView(AppView.BRAND_PROFILE)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
            currentView === AppView.BRAND_PROFILE ? 'bg-brand-soft/40 text-brand-deep font-bold' : 'text-brand-primary hover:bg-brand-light'
          }`}
        >
          <i className="fas fa-star text-sm"></i>
          <span className="text-sm">Perfil da Marca</span>
        </button>

        <button
          onClick={() => setView(AppView.CREATE_ART)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
            currentView === AppView.CREATE_ART ? 'bg-brand-soft/40 text-brand-deep font-bold' : 'text-brand-primary hover:bg-brand-light'
          }`}
        >
          <i className="fas fa-magic text-sm"></i>
          <span className="text-sm">Estúdio Criativo</span>
        </button>

        <button
          onClick={() => setView(AppView.SETTINGS)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
            currentView === AppView.SETTINGS ? 'bg-brand-soft/40 text-brand-deep font-bold' : 'text-brand-primary hover:bg-brand-light'
          }`}
        >
          <i className="fas fa-cog text-sm"></i>
          <span className="text-sm">Configurações</span>
        </button>
      </nav>

      <div className="p-6 border-t border-brand-soft">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-brand-light/30">
          <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-[10px] font-black text-brand-deep">
            JC
          </div>
          <div className="flex flex-col text-left overflow-hidden">
            <span className="text-[11px] font-black text-brand-deep truncate uppercase">{userName}</span>
            <span className="text-[10px] text-brand-primary truncate">{email}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
