import React, { useState } from "react";
import { getExpertAdvice } from "@/services/ai";
import { Send, Loader2 } from "lucide-react";

type ChatMsg = {
  role: "user" | "ai";
  text: string;
};

const ExpertChat: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await getExpertAdvice(input);

      const aiText =
        typeof res === "string"
          ? res
          : typeof res?.answer === "string"
          ? res.answer
          : "Expert response unavailable.";

      setMessages(prev => [...prev, { role: "ai", text: aiText }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "Expert service is temporarily unavailable." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Ask an Agriculture Expert</h2>

      <div className="bg-white border rounded-2xl p-4 h-[400px] overflow-y-auto space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[80%] ${
              m.role === "user"
                ? "bg-emerald-600 text-white ml-auto"
                : "bg-slate-100 text-slate-900"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            Expert is typing…
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Type your question…"
          className="flex-1 border rounded-xl px-4 py-3"
        />
        <button
          onClick={handleSend}
          className="bg-emerald-600 text-white px-5 rounded-xl"
        >
          <Send />
        </button>
      </div>
    </div>
  );
};

export default ExpertChat;
