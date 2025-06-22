import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <h1 className="text-4xl font-bold mb-2 text-blue-700">Welcome to AI Study Buddy</h1>
      <p className="mb-8 text-lg text-gray-700">Your personal AI-powered study companion. Ask anything below!</p>
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6 flex flex-col">
        <div className="flex-1 mb-4 overflow-y-auto max-h-64 border-b pb-4">
          {messages.length === 0 ? (
            <div className="text-gray-400 text-center">No messages yet. Start the conversation!</div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className="mb-2 text-gray-800 bg-blue-50 rounded p-2">
                <span className="font-semibold">You:</span> {msg}
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleSend} className="flex gap-2 mt-2">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type your question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
