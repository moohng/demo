import React from 'react';
import { Heart } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface FooterProps {
  lang: Language;
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
  const currentYear = new Date().getFullYear();
  const t = TRANSLATIONS[lang];

  return (
    <footer className="mt-20 pb-8 border-t border-glassBorder pt-8">
      <div className="flex flex-col items-center justify-center gap-4 text-gray-400">
        <div className="flex items-center gap-2 text-sm">
          <span>&copy; {currentYear} DevStart. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-1.5 text-sm bg-glass px-4 py-2 rounded-full border border-glassBorder hover:border-primary/30 transition-colors">
          <span>{t.builtWith}</span>
          <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
