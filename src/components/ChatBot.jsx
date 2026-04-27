import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, Sparkles, Scissors, Clock, MapPin } from 'lucide-react';

const BOT_KNOWLEDGE = {
  greetings: ['hola', 'buenos dias', 'buenas tardes', 'buenas', 'hey'],
  services: ['corte', 'tinte', 'mechas', 'balayage', 'barba', 'lavar', 'peinar', 'tratamiento', 'keratina'],
  hours: ['horario', 'abierto', 'cierran', 'cuándo', 'hora', 'agenda'],
  location: ['donde', 'donde estan', 'ubicacion', 'direccion', 'mapa', 'sitio'],
  prices: ['cuanto cuesta', 'precio', 'barato', 'caro', 'dinero', 'tarifas', 'cuanto vale']
};

const RESPONSES = {
  greetings: "¡Hola! Soy tu asistente de Barbería JLR. ¿En qué podemos ayudarte hoy?",
  services: "En JLR somos especialistas en cortes modernos, degradados extremos, coloración técnica y cuidado de barba. ¿Te gustaría reservar una sesión?",
  hours: "Nuestro equipo te espera de Lunes a Sábado de 09:00 a 20:00. ¡Reserva tu hueco ahora!",
  location: "Estamos en el corazón de la ciudad. Consulta el mapa interactivo en la sección de Contacto para guiarnos.",
  prices: "Calidad profesional a precios competitivos: desde 10€ (Barba) hasta servicios completos de color. ¡Consulta el listado en Reservas!",
  default: "Lo siento, no he entendido esa parte. ¿Quieres saber sobre precios, horarios, servicios o dónde estamos?"
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "¡Bienvenido a Barbería JLR! ✂️ Soy tu asistente personal. ¿Tienes alguna duda sobre nuestras citas o servicios premium?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI logic
    setTimeout(() => {
      const lowerInput = inputValue.toLowerCase();
      let response = RESPONSES.default;

      if (BOT_KNOWLEDGE.greetings.some(k => lowerInput.includes(k))) response = RESPONSES.greetings;
      else if (BOT_KNOWLEDGE.services.some(k => lowerInput.includes(k))) response = RESPONSES.services;
      else if (BOT_KNOWLEDGE.hours.some(k => lowerInput.includes(k))) response = RESPONSES.hours;
      else if (BOT_KNOWLEDGE.location.some(k => lowerInput.includes(k))) response = RESPONSES.location;
      else if (BOT_KNOWLEDGE.prices.some(k => lowerInput.includes(k))) response = RESPONSES.prices;

      setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'bot' }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 h-[500px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 card p-0 border-none shadow-2xl">
          {/* Header */}
          <div className="p-4 bg-brand-dark dark:bg-slate-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold">Asistente JLR</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> En línea ahora
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--canvas)]">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.sender === 'user' 
                  ? 'bg-brand-accent text-white rounded-tr-none shadow-md font-bold' 
                  : 'bg-[var(--surface)] border border-[var(--border)] rounded-tl-none shadow-sm text-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[var(--surface)] border border-[var(--border)] p-3 rounded-tl-none animate-pulse">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-3 flex flex-wrap gap-2 border-t border-[var(--border)] bg-[var(--surface)]">
            <button onClick={() => setInputValue('Dime los precios')} className="text-[10px] font-black bg-gray-50 dark:bg-slate-900 border border-[var(--border)] text-gray-500 dark:text-slate-400 hover:bg-brand-accent hover:text-white px-3 py-1.5 rounded-full transition flex items-center gap-1 shadow-sm uppercase tracking-widest"><Sparkles className="w-3 h-3" /> Precios</button>
            <button onClick={() => setInputValue('¿Cuál es vuestro horario?')} className="text-[10px] font-black bg-gray-50 dark:bg-slate-900 border border-[var(--border)] text-gray-500 dark:text-slate-400 hover:bg-brand-accent hover:text-white px-3 py-1.5 rounded-full transition flex items-center gap-1 shadow-sm uppercase tracking-widest"><Clock className="w-3 h-3" /> Horarios</button>
            <button onClick={() => setInputValue('¿Dónde estáis?')} className="text-[10px] font-black bg-gray-50 dark:bg-slate-900 border border-[var(--border)] text-gray-500 dark:text-slate-400 hover:bg-brand-accent hover:text-white px-3 py-1.5 rounded-full transition flex items-center gap-1 shadow-sm uppercase tracking-widest"><MapPin className="w-3 h-3" /> Dirección</button>
          </div>

          {/* Footer Input */}
          <div className="p-4 border-t flex gap-2" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu duda..."
              className="input-field py-2"
            />
            <button 
              onClick={handleSend}
              className="bg-brand-accent text-white p-2 rounded-xl shadow-lg shadow-brand-accent/30 hover:scale-105 transition active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-brand-accent text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition duration-300 active:scale-90 group relative"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
        )}
      </button>
    </div>
  );
}
