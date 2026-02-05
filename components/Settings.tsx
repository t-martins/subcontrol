

import React, { useState, useEffect } from 'react';

interface SettingsProps {
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    // Carregar chave salva do localStorage
    const key = localStorage.getItem('gemini_api_key');
    if (key) {
      setSavedKey(key);
    }
  }, []);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'Por favor, insira uma chave válida.' });
      return;
    }

    // Validação básica do formato da chave
    if (!apiKey.startsWith('AI') || apiKey.length < 20) {
      setMessage({ type: 'error', text: 'Formato de chave inválido. A chave deve começar com "AI".' });
      return;
    }

    try {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setSavedKey(apiKey.trim());
      setApiKey('');
      setMessage({ type: 'success', text: 'Chave salva com sucesso! ✓' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar a chave.' });
    }
  };

  const handleRemoveKey = () => {
    if (confirm('Tem certeza que deseja remover a chave da API?')) {
      localStorage.removeItem('gemini_api_key');
      setSavedKey('');
      setMessage({ type: 'success', text: 'Chave removida com sucesso.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
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

        <div className="bg-brand-light/40 rounded-[2.5rem] p-8 border border-brand-soft space-y-6">
          <p className="text-sm text-brand-deep font-medium leading-relaxed">
            O Estúdio Criativo utiliza o Google Gemini para gerar suas artes e analisar o DNA visual. Para garantir o funcionamento, você deve configurar uma chave de API válida de um projeto faturado.
          </p>

          {savedKey ? (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border-2 border-green-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Chave Configurada</span>
                  </div>
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="text-[9px] font-bold text-brand-primary hover:text-brand-deep uppercase"
                  >
                    {showKey ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <p className="font-mono text-sm text-brand-deep break-all">
                  {showKey ? savedKey : maskKey(savedKey)}
                </p>
              </div>
              <button
                onClick={handleRemoveKey}
                className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-black text-xs uppercase tracking-widest border border-red-200 hover:bg-red-100 transition-all"
              >
                Remover Chave
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-brand-deep uppercase tracking-widest ml-1">
                  Cole sua chave da API aqui
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIza..."
                  className="w-full px-6 py-4 bg-white border-2 border-brand-soft rounded-2xl outline-none focus:border-brand-accent text-brand-deep font-mono text-sm transition-all"
                />
              </div>
              <button
                onClick={handleSaveKey}
                disabled={!apiKey.trim()}
                className="w-full py-5 bg-brand-deep text-white rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-brand-deep/30 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                Salvar Chave da API
              </button>
            </div>
          )}

          {message && (
            <div className={`p-4 rounded-xl border-2 ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} font-bold text-sm text-center animate-fadeIn`}>
              {message.text}
            </div>
          )}

          <div className="flex flex-col gap-2 pt-4 border-t border-brand-soft">
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              className="text-[10px] font-black text-brand-accent uppercase hover:underline flex items-center gap-2 justify-center"
            >
              Obter Chave da API <i className="fas fa-external-link-alt text-[8px]"></i>
            </a>
            <a
              href="https://ai.google.dev/gemini-api/docs/billing"
              target="_blank"
              className="text-[10px] font-black text-brand-primary uppercase hover:underline flex items-center gap-2 justify-center"
            >
              Documentação de Faturamento <i className="fas fa-external-link-alt text-[8px]"></i>
            </a>
            <p className="text-[9px] font-bold text-brand-primary uppercase opacity-60 italic text-center mt-2">
              A chave é armazenada de forma segura no seu navegador.
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

