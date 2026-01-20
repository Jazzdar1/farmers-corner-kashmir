import React, { useState } from "react";

type Msg = {
  sender: "user" | "bot";
  text: string;
};

export default function ExpertChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { sender: "user", text: userText }]);

    try {
      const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message })
});
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.text || "No response" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Connection error. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 16 }}>
      <h2>AI Expert Chat</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 300,
          overflowY: "auto",
          marginBottom: 10,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.sender === "user" ? "right" : "left",
              margin: "6px 0",
            }}
          >
            <b>{m.sender === "user" ? "You" : "AI"}:</b> {m.text}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Ask something..."
        style={{ width: "75%", padding: 8 }}
      />

      <button
        onClick={sendMessage}
        disabled={loading}
        style={{ padding: 8, marginLeft: 8 }}
      >
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}
