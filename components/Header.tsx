
import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  userName: string;
  credits: number;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, userName, credits }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-soft px-8 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-10">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setView(AppView.CREATE_ART)}
        >
          <div className="w-10 h-10 bg-brand-deep rounded-xl flex items-center justify-center shadow-lg shadow-brand-deep/20">
            <i className="fas fa-wand-magic-sparkles text-white text-lg"></i>
          </div>
          <span className="text-2xl font-black tracking-tighter text-brand-deep uppercase">Jana's <span className="text-brand-primary">Cakes</span></span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => setView(AppView.CREATE_ART)}
            className={`text-xs font-black uppercase tracking-widest transition-all ${currentView === AppView.CREATE_ART ? 'text-brand-accent' : 'text-brand-primary hover:text-brand-deep'}`}
          >
            Criar Posts
          </button>
          <button 
            onClick={() => setView(AppView.BRAND_PROFILE)}
            className={`text-xs font-black uppercase tracking-widest transition-all ${currentView === AppView.BRAND_PROFILE ? 'text-brand-accent' : 'text-brand-primary hover:text-brand-deep'}`}
          >
            Perfil da Marca
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-brand-light rounded-full border border-brand-soft shadow-inner">
          <span className="text-[10px] font-black text-brand-deep uppercase tracking-tighter">{credits} Créditos</span>
          <div className="w-5 h-5 rounded-full bg-brand-accent flex items-center justify-center">
            <i className="fas fa-bolt text-[10px] text-white"></i>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pl-6 border-l border-brand-soft">
          <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-xs font-bold text-white shadow-md">
            {userName.substring(0, 1)}
          </div>
          <span className="hidden md:inline text-xs font-black text-brand-deep uppercase tracking-tighter">{userName}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
