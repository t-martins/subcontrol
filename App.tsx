
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import BrandSettings from '../components/BrandSettings';
import CreativeStudio from '../components/CreativeStudio';
import Settings from '../components/Settings';
import Login from '../components/Login';
import { AppView, BrandProfile, GeneratedArt, VisualStyle } from './types';
import { dbService } from '../services/dbService';

const MAX_HISTORY_ITEMS = 100;

const INITIAL_BRAND: BrandProfile = {
  name: "Jana's Cakes",
  logo: null,
  expertReferences: [],
  productReferences: [],
  references: [],
  gallery: [],
  summary: "Identidade visual feminina e sofisticada.",
  colors: ['#F9EDED', '#F9D2D2', '#EE989D', '#F2AB36', '#9D5316'],
  typography: "Script elegante.",
  visualStyle: "Feminino e acolhedor.",
  savedStyles: []
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<AppView>(AppView.PROJECTS);
  const [isDbReady, setIsDbReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [brand, setBrand] = useState<BrandProfile>(INITIAL_BRAND);
  const [history, setHistory] = useState<GeneratedArt[]>([]);
  const [preSelectedStyle, setPreSelectedStyle] = useState<VisualStyle | null>(null);

  const loadAllData = async () => {
    setIsDbReady(false);
    try {
      await dbService.init();
      const savedBrand = await dbService.getBrand();
      const savedHistory = await dbService.getHistory();

      if (savedBrand) setBrand(savedBrand);
      if (savedHistory) setHistory(savedHistory.sort((a, b) => b.timestamp - a.timestamp));

      setIsLoaded(true);
      setIsDbReady(true);
    } catch (err) {
      setIsDbReady(true);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (isDbReady && isLoaded) {
      const saveToDb = async () => {
        setIsSaving(true);
        try {
          await dbService.saveBrand(brand);
        } finally {
          setTimeout(() => setIsSaving(false), 800);
        }
      };
      saveToDb();
    }
  }, [brand, isDbReady, isLoaded]);

  const handleBackupExport = async () => {
    const data = await dbService.exportBackup();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-janas-cakes.json`;
    link.click();
  };

  const handleBackupImport = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = e.target?.result as string;
        const result = await dbService.importBackup(json);
        setBrand(result.brand);
        setHistory(result.history);
        alert("Backup restaurado!");
      } catch (err) {
        alert("Erro no backup.");
      }
    };
    reader.readAsText(file);
  };

  const handleCreateArt = async (art: GeneratedArt) => {
    const newHistory = [art, ...history].slice(0, MAX_HISTORY_ITEMS);
    setHistory(newHistory);
    await dbService.saveArt(art);
  };

  if (!isDbReady) return null;
  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="min-h-screen flex bg-brand-light text-brand-deep">
      <Sidebar
        currentView={view}
        setView={(v) => { setView(v); setPreSelectedStyle(null); }}
        userName="JANA'S CAKES"
        email="contato@janascakes.com"
        isOnline={isDbReady}
        isSaving={isSaving}
      />

      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        <main className="flex-1 w-full max-w-7xl mx-auto px-10 py-12 animate-fadeIn relative z-10">

          {view === AppView.PROJECTS && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">Sua Central</span>
                  <h1 className="text-4xl font-black mt-1 text-brand-deep">Galeria de Posts</h1>
                </div>
                <button onClick={() => setView(AppView.CREATE_ART)} className="px-6 py-2.5 bg-brand-accent text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg">
                  <i className="fas fa-sparkles text-xs"></i>
                  <span>Novo Criativo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div onClick={() => setView(AppView.BRAND_PROFILE)} className="bg-white rounded-3xl overflow-hidden border border-brand-soft group hover:border-brand-primary transition-all cursor-pointer shadow-sm hover:shadow-xl">
                  <div className="h-48 bg-brand-soft/30 flex items-center justify-center">
                    <i className="fas fa-palette text-5xl text-brand-primary opacity-40 group-hover:scale-110 transition-transform"></i>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold text-brand-deep text-lg">Perfil da Marca</h3>
                  </div>
                </div>

                <div onClick={() => setView(AppView.CREATE_ART)} className="h-full min-h-[260px] border-2 border-dashed border-brand-soft rounded-3xl flex flex-col items-center justify-center text-brand-primary hover:border-brand-accent hover:text-brand-accent transition-all cursor-pointer bg-white/50 hover:bg-white">
                  <i className="fas fa-plus text-2xl mb-4"></i>
                  <span className="font-bold text-xs uppercase tracking-widest">Criar novo post</span>
                </div>

                {history.slice(0, 1).map((art) => (
                  <div key={art.id} className="bg-white rounded-3xl overflow-hidden border border-brand-soft shadow-sm">
                    <div className="h-48 relative">
                      {art.urls?.[0] && <img src={art.urls[0]} className="w-full h-full object-cover" alt="Último" />}
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-brand-deep text-lg">Última Criação</h3>
                      <p className="text-[10px] text-brand-primary font-semibold uppercase mt-1">{new Date(art.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === AppView.BRAND_PROFILE && (
            <BrandSettings
              brand={brand}
              setBrand={setBrand}
              onProceed={(style) => {
                if (style) setPreSelectedStyle(style);
                setView(AppView.CREATE_ART);
              }}
              onExportBackup={handleBackupExport}
              onImportBackup={handleBackupImport}
            />
          )}

          {view === AppView.CREATE_ART && (
            <CreativeStudio
              brand={brand}
              history={history}
              preSelectedStyle={preSelectedStyle}
              onArtGenerated={handleCreateArt}
              onDeleteArt={(id) => setHistory(h => h.filter(x => x.id !== id))}
              onReorderArt={(id) => { }}
              onClearHistory={() => setHistory([])}
              onBack={() => setView(AppView.PROJECTS)}
            />
          )}

          {view === AppView.SETTINGS && (
            <Settings onBack={() => setView(AppView.PROJECTS)} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
