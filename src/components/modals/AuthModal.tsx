import React, { useState } from 'react';
import { X, Mail, Lock, LogIn, UserPlus, Loader2, Github } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Language } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, lang }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
       const { error } = await supabase.auth.signInWithOAuth({
         provider: 'github',
       });
       if (error) throw error;
    } catch (err: any) {
        setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8 animate-scale-in">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
             {isLogin ? <LogIn className="text-blue-400" size={32} /> : <UserPlus className="text-blue-400" size={32} />}
          </div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            {isLogin ? (lang === 'cn' ? '登录账户' : 'Welcome Back') : (lang === 'cn' ? '创建账户' : 'Create Account')}
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            {lang === 'cn' ? '同步您的书签到云端' : 'Sync your bookmarks to the cloud'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
             <div className="relative">
               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
               <input 
                 type="email" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder={lang === 'cn' ? "邮箱地址" : "Email Address"}
                 className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                 required
               />
             </div>
          </div>
          
          <div>
             <div className="relative">
               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
               <input 
                 type="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder={lang === 'cn' ? "密码" : "Password"}
                 className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                 required
                 minLength={6}
               />
             </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : (isLogin ? (lang === 'cn' ? '登录' : 'Sign In') : (lang === 'cn' ? '注册' : 'Sign Up'))}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-4">
           {/* GitHub Login - Optional if user enables it in Supabase */}
           <button 
             type="button"
             onClick={handleGithubLogin}
             className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2"
           >
             <Github size={20} />
             {lang === 'cn' ? '使用 GitHub 登录' : 'Continue with GitHub'}
           </button>

           <div className="text-center">
             <button
               type="button"
               onClick={() => setIsLogin(!isLogin)}
               className="text-slate-400 hover:text-white text-sm transition-colors"
             >
               {isLogin 
                 ? (lang === 'cn' ? '没有账号？立即注册' : "Don't have an account? Sign up") 
                 : (lang === 'cn' ? '已有账号？立即登录' : "Already have an account? Sign in")}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};
