
import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering && password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light px-4 font-sans relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full bg-dots pointer-events-none"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-soft/50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl opacity-50"></div>

      <div className="w-full max-w-lg space-y-10 p-12 bg-white rounded-[3rem] border border-brand-soft shadow-2xl relative overflow-hidden">
        <div className="text-center space-y-4 relative">
          <div className="flex justify-center items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-brand-deep rounded-3xl flex items-center justify-center shadow-2xl shadow-brand-deep/30 -rotate-6 transform hover:rotate-0 transition-transform">
              <i className="fas fa-wand-magic-sparkles text-white text-3xl"></i>
            </div>
            <span className="text-5xl font-black tracking-tighter text-brand-deep uppercase text-left leading-none">Jana's <br/><span className="text-brand-primary">Cakes</span></span>
          </div>
          <h2 className="text-3xl font-black text-brand-deep tracking-tight">
            {isRegistering ? 'Sua jornada criativa começa aqui' : 'Bem-vindo ao Estúdio'}
          </h2>
          <p className="text-brand-primary font-medium">
            {isRegistering ? 'Crie posts incríveis com inteligência artificial' : 'Sua identidade visual, potencializada por IA'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-brand-primary uppercase tracking-[0.25em] ml-2">E-mail corporativo</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@exemplo.com"
              className="w-full bg-brand-light border border-brand-soft rounded-[1.5rem] px-6 py-5 text-brand-deep focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all placeholder:text-brand-primary/30 font-medium"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end px-2">
              <label className="text-[10px] font-black text-brand-primary uppercase tracking-[0.25em]">Sua Senha</label>
              {!isRegistering && (
                <button type="button" className="text-[10px] text-brand-primary hover:text-brand-deep transition-colors font-black uppercase tracking-widest">Esqueceu?</button>
              )}
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-brand-light border border-brand-soft rounded-[1.5rem] px-6 py-5 text-brand-deep focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all placeholder:text-brand-primary/30 font-medium"
            />
          </div>

          {isRegistering && (
            <div className="space-y-2 animate-fadeIn">
              <label className="text-[10px] font-black text-brand-primary uppercase tracking-[0.25em] ml-2">Confirmar senha</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-light border border-brand-soft rounded-[1.5rem] px-6 py-5 text-brand-deep focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all placeholder:text-brand-primary/30 font-medium"
              />
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-5 bg-brand-deep hover:bg-brand-deep/90 text-white font-black text-xl rounded-[1.5rem] transition-all shadow-2xl shadow-brand-deep/20 active:scale-95"
            >
              {isRegistering ? 'Criar Conta' : 'Entrar no Estúdio'}
            </button>
          </div>
        </form>

        <div className="text-center pt-8 border-t border-brand-light relative">
          <p className="text-brand-primary font-medium text-sm">
            {isRegistering ? 'Já faz parte da comunidade?' : 'Não possui acesso?'} 
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-brand-accent hover:text-brand-accent/80 font-black ml-2 transition-colors uppercase tracking-widest text-[11px]"
            >
              {isRegistering ? 'Login' : 'Cadastre-se'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
