"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Bot, User } from "lucide-react";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMessages = localStorage.getItem("study-chat");
    const savedTheme = localStorage.getItem("study-theme");
    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("study-chat", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("study-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const aiText = data.reply || "Sorry, I couldn't get a response.";
      const aiMessage: Message = { sender: "ai", text: aiText };
      setMessages((prev: Message[]) => [...prev, aiMessage]);
    } catch {
      const errorMsg: Message = { sender: "ai", text: "Error contacting AI agent." };
      setMessages((prev: Message[]) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 text-gray-900 dark:text-white">
      <header className="flex justify-between items-center p-4 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-300">✨ AI Study Buddy</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2 shadow"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          {darkMode ? "Light" : "Dark"}
        </button>
      </header>

      <main className="flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 flex flex-col h-[75vh]">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
            {messages.length === 0 && (
              <p className="text-center text-gray-400">Ask me anything about your studies 🤓</p>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                    <Bot size={18} />
                  </div>
                )}
                <div
                  className={`rounded-xl px-4 py-2 max-w-[75%] text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && (
                  <div className="p-2 bg-gray-300 dark:bg-gray-600 rounded-full">
                    <User size={18} />
                  </div>
                )}
              </div>
            ))}
            {loading && <p className="text-sm italic text-gray-400 animate-pulse">AI is thinking...</p>}
          </div>

          <form onSubmit={handleSend} className="flex gap-2 mt-auto">
            <input
              type="text"
              className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
            >
              {loading ? "..." : "Send"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
