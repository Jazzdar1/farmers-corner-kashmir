
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Plus, Trash2, Globe, Languages, Leaf } from 'lucide-react';
import { getExpertAdvice } from '../services/gemini';
import { Message } from '../types';

const ExpertChat: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'ur' | 'hi'>('ur');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "As-Salamu Alaykum! I'm your Kashmiri Agricultural Expert AI. How can I help you today? \n\n السلام علیکم! میں آپ کا کشمیری زرعی ماہر اے آئی ہوں۔ آج میں آپ کی کیا مدد کر سکتا ہوں؟",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
      
      const botResponse = await getExpertAdvice(history, input, language);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse || "I'm sorry, I couldn't process that. \n\n معذرت، میں اس پر کارروائی نہیں کر سکا۔",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "I'm having trouble connecting. \n\n مجھے جڑنے میں دشواری ہو رہی ہے۔",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] lg:h-[calc(100vh-120px)] animate-in fade-in zoom-in-95 duration-700">
      <header className="flex items-center justify-between mb-6 bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-800 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <Bot className="w-6 h-6 text-emerald-100" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-slate-900 leading-none">Agri-Expert AI</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                {language === 'ur' ? 'آن لائن • تصدیق شدہ' : 'Online • Verified'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-100 flex gap-1">
             {(['en', 'ur', 'hi'] as const).map(lang => (
               <button
                 key={lang}
                 onClick={() => setLanguage(lang)}
                 className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${language === lang ? 'bg-emerald-800 text-white' : 'text-slate-400 hover:text-emerald-800'}`}
               >
                 {lang}
               </button>
             ))}
           </div>
           <button 
            onClick={() => setMessages([messages[0]])}
            className="p-3 bg-slate-50 text-slate-500 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100"
            title="Clear Conversation"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-emerald-50 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
           <Leaf className="absolute top-20 left-10 w-48 h-48 -rotate-12" />
           <Leaf className="absolute bottom-40 right-10 w-64 h-64 rotate-45" />
        </div>

        <div ref={scrollRef} className="flex-1 p-6 lg:p-10 overflow-y-auto space-y-8 scroll-smooth relative z-10 no-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[90%] md:max-w-[75%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  msg.sender === 'user' ? 'bg-emerald-800' : 'bg-slate-100 border border-slate-200'
                }`}>
                  {msg.sender === 'user' ? <User className="w-5 h-5 text-emerald-100" /> : <Bot className="w-5 h-5 text-slate-600" />}
                </div>
                <div className={`space-y-2`}>
                  <div className={`p-5 rounded-[2rem] shadow-sm text-sm lg:text-base leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-emerald-800 text-white rounded-tr-none' 
                      : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none'
                  }`}>
                    <p className={`whitespace-pre-wrap font-medium ${language !== 'en' ? 'text-lg leading-loose' : ''}`}>{msg.text}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-1 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.sender === 'bot' && (
                       <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                         <Globe className="w-3 h-3" /> Grounded
                       </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-4 max-w-[90%] md:max-w-[75%]">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center animate-pulse border border-emerald-100">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="bg-slate-50 p-6 rounded-[2rem] rounded-tl-none border border-slate-100 flex items-center gap-2 shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-300"></span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 uppercase ml-2 tracking-widest">Consulting Knowledge Base...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50/80 backdrop-blur-md border-t border-slate-100 relative z-10">
          <div className="max-w-4xl mx-auto flex gap-4 items-end">
            <div className="flex-1 relative group">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={language === 'ur' ? 'زرعی ماہر سے پوچھیں...' : language === 'hi' ? 'विशेषज्ञ से पूछें...' : 'Message your Agri-Expert...'}
                className={`w-full bg-white border border-slate-200 rounded-[2rem] px-6 py-4 pr-16 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none resize-none shadow-sm transition-all min-h-[64px] max-h-32 text-slate-800 font-medium ${language !== 'en' ? 'text-right' : ''}`}
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className={`absolute right-2.5 bottom-2.5 p-3 rounded-2xl transition-all duration-300 ${
                  input.trim() && !loading 
                    ? 'bg-emerald-800 text-white shadow-xl shadow-emerald-200 scale-100 rotate-0 translate-y-0' 
                    : 'bg-slate-100 text-slate-300 scale-90 translate-y-1'
                }`}
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest">
            AI-POWERED CONSULTANT • {language.toUpperCase()} ASSISTANT ENABLED
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpertChat;
