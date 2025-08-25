import { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages([...messages, { sender: "user", text: input }]);

    try {
      const res = await axios.post("http://localhost:8000/api/chat", { message: input });
      const botReply = res.data.reply;

      setMessages(prev => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: "bot", text: "⚠️ Server error, try again." }]);
    }

    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block px-3 py-2 rounded-xl ${
                msg.sender === "user" ? "bg-green-500 text-white" : "bg-white shadow"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex p-3 bg-white border-t">
        <input
          className="flex-1 border rounded-xl px-3 py-2 mr-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4 py-2 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}
