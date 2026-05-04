import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, Sparkles, Scissors, Clock, MapPin, ShoppingBag, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BOT_KNOWLEDGE = {
  greetings: ['hola', 'buenos dias', 'buenas tardes', 'buenas', 'hey', 'saludos'],
  services: ['corte', 'tinte', 'mechas', 'balayage', 'barba', 'lavar', 'peinar', 'tratamiento', 'keratina', 'degradado', 'skin fade'],
  hours: ['horario', 'abierto', 'cierran', 'cuándo', 'hora', 'la hora', 'mañana', 'tarde'],
  location: ['donde', 'donde estan', 'ubicacion', 'direccion', 'mapa', 'sitio', 'lugar', 'calle'],
  prices: ['cuanto cuesta', 'precio', 'barato', 'caro', 'dinero', 'tarifas', 'cuanto vale', 'oferta', 'descuento'],
  points: ['puntos', 'puntos jlr', 'recompensa', 'fidelidad', 'ganar puntos', 'regalo', 'canjear'],
  products: ['tienda', 'comprar', 'champú', 'cera', 'aceite', 'gel', 'lacas', 'stock', 'productos'],
  booking: ['cita', 'reserva', 'reservar', 'pedir cita', 'turno', 'agendar', 'cancelar']
};

const RESPONSES = {
  greetings: "¡Hola! Soy tu asistente de Barbería JLR. 👋 ¿En qué podemos ayudarte hoy? ¿Buscas cita, productos o info sobre tus puntos?",
  services: "En JLR somos especialistas en cortes modernos, degradados extremos (Skin Fade), coloración técnica y cuidado integral de barba. ¿Te gustaría ver disponibilidad hoy?",
  hours: "Nuestro equipo te espera de Lunes a Sábado de 09:00 a 20:00 de forma ininterrumpida. ¡Te recomendamos reservar con antelación!",
  location: "Estamos en el centro neurálgico de la ciudad. Tienes el mapa interactivo esperándote en la pestaña de 'Contacto'. ¡No tiene pérdida!",
  prices: "Calidad premium desde 10€ (Barba) hasta servicios completos de color y corte. Puedes ver el desglose exacto al seleccionar un servicio en 'Citas'.",
  points: "¡Tu fidelidad tiene premio! Con cada servicio ganas Puntos JLR que puedes ver en tu Perfil. Cada 1€ es 1 punto. ¡Pronto podrás canjearlos por descuentos!",
  products: "En nuestra tienda online tenemos ceras de fijación mate, aceites de argán y packs exclusivos JLR. ¡Te lo preparamos para que te lo lleves tras tu corte!",
  booking: "Es muy fácil: ve a Inicio, elige tu servicio, el barbero que prefieras y la hora. ¡Recibirás una confirmación al instante!",
  default: "Vaya, todavía estoy aprendiendo. 😅 ¿Probamos con algo sobre precios, horarios, servicios, puntos o dónde estamos?"
};

export default function ChatBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "¡Bienvenido a Barbería JLR! ✂️ Soy tu asistente personal. ¿Tienes alguna duda sobre nuestras citas o servicios premium?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // RESET DEL CHAT AL CAMBIAR DE USUARIO O CERRAR SESIÓN
  useEffect(() => {
    setMessages([
      { id: Date.now(), text: `¡Hola de nuevo! ✂️ Soy el asistente de JLR. ¿En qué podemos ayudarte hoy?`, sender: 'bot' }
    ]);
    setIsOpen(false);
  }, [user?.id]); // Solo se dispara si el ID del usuario cambia (logout/login)

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

    setTimeout(() => {
      const lowerInput = inputValue.toLowerCase();
      let response = RESPONSES.default;

      // Prioridad de matching por palabras clave
      if (BOT_KNOWLEDGE.points.some(k => lowerInput.includes(k))) response = RESPONSES.points;
      else if (BOT_KNOWLEDGE.products.some(k => lowerInput.includes(k))) response = RESPONSES.products;
      else if (BOT_KNOWLEDGE.booking.some(k => lowerInput.includes(k))) response = RESPONSES.booking;
      else if (BOT_KNOWLEDGE.services.some(k => lowerInput.includes(k))) response = RESPONSES.services;
      else if (BOT_KNOWLEDGE.hours.some(k => lowerInput.includes(k))) response = RESPONSES.hours;
      else if (BOT_KNOWLEDGE.location.some(k => lowerInput.includes(k))) response = RESPONSES.location;
      else if (BOT_KNOWLEDGE.prices.some(k => lowerInput.includes(k))) response = RESPONSES.prices;
      else if (BOT_KNOWLEDGE.greetings.some(k => lowerInput.includes(k))) response = RESPONSES.greetings;

      setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'bot' }]);
      setIsTyping(false);
    }, 800);
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
            <button onClick={() => setInputValue('¿Cómo canjeo mis puntos?')} className="text-[10px] font-black bg-gray-50 dark:bg-slate-900 border border-[var(--border)] text-gray-500 dark:text-slate-400 hover:bg-brand-accent hover:text-white px-3 py-1.5 rounded-full transition flex items-center gap-1 shadow-sm uppercase tracking-widest"><Gift className="w-3 h-3" /> Puntos</button>
            <button onClick={() => setInputValue('¿Tenéis ceras en la tienda?')} className="text-[10px] font-black bg-gray-50 dark:bg-slate-900 border border-[var(--border)] text-gray-500 dark:text-slate-400 hover:bg-brand-accent hover:text-white px-3 py-1.5 rounded-full transition flex items-center gap-1 shadow-sm uppercase tracking-widest"><ShoppingBag className="w-3 h-3" /> Tienda</button>
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
