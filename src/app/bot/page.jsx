"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot } from "lucide-react";

const FAQ = {
  "Track Order": "Go to My Orders in your account to track your shipment in real time.",
  "Cancel Order": "Orders can be cancelled within 15 minutes of placing them. Head to My Orders to cancel.",
  "Return Policy": "You can return most items within 7 days of delivery. Items must be unused and in original packaging.",
  "Customer Support": "You can reach our team at kmart@support.com or call 1800-KMART between 9am – 6pm.",
};

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function JarvisBot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi there! How can I help you today?", time: now() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text, time: now() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = FAQ[text] ?? "I'm not sure about that. Please contact us at kmart@support.com for further help.";
      setMessages((prev) => [...prev, { role: "bot", text: reply, time: now() }]);
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 rounded-2xl border border-gray-200 bg-white shadow-xl z-[9999] flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="bg-orange-600 px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-content-center">
          <Bot size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">Kmart Support</p>
          <p className="text-xs text-orange-100 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Online now
          </p>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
          <X size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-2.5 p-4 min-h-48 max-h-72 overflow-y-auto bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col gap-0.5 max-w-[80%] ${m.role === "user" ? "self-end items-end" : "self-start items-start"}`}>
            <div className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
              m.role === "user"
                ? "bg-orange-600 text-white rounded-br-sm"
                : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
            }`}>
              {m.text}
            </div>
            <span className="text-[10px] text-gray-400">{m.time}</span>
          </div>
        ))}
        {typing && (
          <div className="self-start bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3.5 py-2.5">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="px-4 pb-3 bg-gray-50 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 text-center mb-2">Quick replies</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(FAQ).map((q) => (
            <button key={q} onClick={() => send(q)}
              className="text-xs px-3 py-1.5 rounded-full border border-orange-500 text-orange-600 hover:bg-orange-600 hover:text-white transition-colors">
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2 px-3 py-3 border-t border-gray-200 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Type a message…"
          className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-orange-400 text-gray-800"
        />
        <button onClick={() => send(input)}
          className="w-9 h-9 rounded-lg bg-orange-600 hover:bg-orange-700 flex items-center justify-center transition-colors flex-shrink-0">
          <Send size={15} className="text-white" />
        </button>
      </div>
    </div>
  );
}