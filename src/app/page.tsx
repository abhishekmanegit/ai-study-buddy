"use client";

import { useEffect, useState } from "react";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load chat history + theme on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("study-chat");
    const savedTheme = localStorage.getItem("study-theme");
    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  // Save chat + theme to localStorage
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
    const userMessage = { sender: "user" as const, text: input };
    setMessages((prev) => [...prev, userMessage]);
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
      setMessages((prev) => [...prev, { sender: "ai", text: aiText }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "ai", text: "Error contacting AI agent." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-3xl font-bold">AI Study Buddy</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-gray-300 dark:bg-gray-700 text-sm px-3 py-1 rounded hover:opacity-90 transition"
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="flex flex-col items-center p-4">
        <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col">
          <div className="flex-1 mb-4 overflow-y-auto max-h-[60vh] border-b pb-4 space-y-2">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400">No messages yet. Start the conversation!</div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.sender === "user"
                      ? "self-end bg-blue-500 text-white"
                      : "self-start bg-green-500 text-white"
                  }`}
                >
                  <strong>{msg.sender === "user" ? "You" : "AI"}:</strong> {msg.text}
                </div>
              ))
            )}
            {loading && (
              <div className="self-start text-gray-500 italic animate-pulse">AI is thinking...</div>
            )}
          </div>
          <form onSubmit={handleSend} className="flex gap-2 mt-2">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
