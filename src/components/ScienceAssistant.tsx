import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Sparkles, Loader2, Bot, Trash2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

// Lazy initialization or guard for API Key
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI(apiKey);
};

const SUGGESTIONS = [
  "Fotosintez nima?",
  "Nega osmon ko'k?",
  "Suvning formulasi qanday?",
  "Eng katta hayvon qaysi?",
  "Inson suyagi haqida ma'lumot",
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ScienceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Salom! Men Tabiiy fanlar bo'yicha yordamchingizman. Sizga qanday yordam bera olaman?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSubmit = messageText || input;
    if (!textToSubmit.trim() || isLoading) return;

    const userMessage = textToSubmit.trim();
    if (!messageText) setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = getAIClient();
      if (!ai) {
        throw new Error("Gemini API key topilmadi. Iltimos, .env faylini tekshiring.");
      }

      const chatHistory = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await ai.getGenerativeModel({
        model: "gemini-3-flash-preview",
        systemInstruction: `Siz "Bilim Platformasi"ning bosh ilmiy xodimi va o'quvchilarning sevimli yordamchisisiz. 
          Vazifangiz: 1-5 sinf o'quvchilariga Tabiiy fanlar (Biologiya, Fizika, Kimyo, Ona tili va Geografiya) bo'yicha yordam berish.
          
          Qoidalar:
          1. O'zbek tilida, bolalar tushunadigan sodda va qiziqarli tilda gapiring.
          2. Markdown orqali muhim tushunchalarni **bold** qiling. Ro'yxatlar va emoji ishlating.
          3. Agar savol fanga oid bo'lmasa (masalan: siyosat, o'yin-kulgi), muloyimlik bilan yo'naltiring.
          4. Neo-brutalist ohang: Ishtiyoqli, intellektual va biroz bold (Neo-brutal) uslubda bo'ling.
          5. Har bir javobingiz oxirida o'quvchini ilhomlantiruvchi qisqa jumlalar ishlating (masalan: "Ilm yo'li - nurli yo'l!").`,
      }).generateContent({
        contents: [...chatHistory, { role: 'user', parts: [{ text: userMessage }] }],
      });

      const result = await response.response;
      const assistantMessage = result.text() || "Kechirasiz, javob topishda xatolik yuz berdi.";
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Xatolik yuz berdi";
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage.includes('key topilmadi') ? errorMessage : "Xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: "Salom! Men Tabiiy fanlar bo'yicha yordamchingizman. Sizga qanday yordam bera olaman?" }]);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="card w-[350px] md:w-[400px] h-[500px] bg-surface flex flex-col mb-4 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-primary p-4 border-b-4 border-border flex justify-between items-center">
              <div className="flex items-center gap-2 font-black uppercase tracking-tight">
                <Bot size={24} />
                <span>Fan Yordamchisi</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={clearChat}
                  title="Suhbatni tozalash"
                  className="p-1 hover:bg-surface/20 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-surface/20 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-bg/30 relative">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[90%] p-4 border-4 border-border font-bold shadow-sm
                    ${msg.role === 'user' ? 'bg-accent text-text' : 'bg-surface text-text'}
                  `}>
                    <Markdown components={{
                      p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({children}) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                      li: ({children}) => <li className="mb-1">{children}</li>,
                    }}>
                      {msg.content}
                    </Markdown>
                  </div>
                </motion.div>
              ))}
              
              {messages.length < 3 && !isLoading && (
                <div className="py-4">
                  <p className="text-xs font-black uppercase mb-3 opacity-50 px-2">Mana ba'zi savollar:</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSend(s)}
                        className="text-xs bg-surface border-2 border-border p-2 font-bold hover:bg-highlight transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-surface border-4 border-border p-3 shadow-sm">
                    <Loader2 className="animate-spin" size={20} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t-4 border-border bg-surface">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Savol bering..."
                  className="input-field flex-grow text-sm"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading}
                  className="btn btn-primary p-3"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-text hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
      >
        {isOpen ? <X size={32} /> : <Sparkles size={32} />}
      </motion.button>
    </div>
  );
}
