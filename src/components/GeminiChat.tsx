import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import { Message, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface GeminiChatProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const GeminiChat: React.FC<GeminiChatProps> = ({ isOpen, onClose, lang }) => {
  const t = TRANSLATIONS[lang];
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: t.aiWelcome, timestamp: Date.now() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevLangRef = useRef(lang);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Reset/Update initial message when language changes if it's the only message
  useEffect(() => {
    if (prevLangRef.current !== lang) {
       if (messages.length === 1 && messages[0].role === 'model') {
         setMessages([{ role: 'model', text: TRANSLATIONS[lang].aiWelcome, timestamp: Date.now() }]);
       }
       prevLangRef.current = lang;
    }
  }, [lang, messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      text: inputValue.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseText = await getGeminiResponse(userMsg.text, lang);
      setMessages(prev => [...prev, {
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'model',
        text: t.aiError,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed z-50 transition-all duration-300 shadow-2xl border border-glassBorder bg-[#0f172a]/95 backdrop-blur-xl flex flex-col
      ${isExpanded 
        ? 'inset-4 rounded-2xl' 
        : 'bottom-6 right-6 w-96 h-[600px] rounded-2xl'
      }
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/50 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-primary to-secondary p-1.5 rounded-lg">
             <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">{t.aiName}</h3>
            <p className="text-xs text-gray-400">{t.aiSubtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-gray-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700'
              }`}
            >
              {/* Simple Markdown-like rendering could go here, for now just text with whitespace preservation */}
              <p className="whitespace-pre-wrap font-light">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-gray-800 rounded-2xl rounded-bl-none px-4 py-3 border border-gray-700 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-primary" />
                <span className="text-xs text-gray-400">{t.aiThinking}</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800 bg-gray-900/30 rounded-b-2xl">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.aiInputPlaceholder}
            className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent placeholder-gray-500 text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-2 p-2 bg-primary hover:bg-primary/90 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiChat;