import React, { useState } from "react";
import "./RebeccaChat.css";

export default function RebeccaChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  async function sendMessage(text) {
    const res = await fetch
      "https://mydxasjicsfetnglbppp.supabase.co/functions/v1/rebecca-simple",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, user_id: "ian" })
      }
    );
    const data = await res.json();
    setMessages([...messages, { role: "user", text }, { role: "rebecca", text: data.reply }]);
    speak(data.reply);
  }

  function speak(text) {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    synth.speak(utter);
  }

  function startMic() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-GB";
    recognition.start();
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      sendMessage(text);
    };
    setListening(true);
  }

  return (
    <div className="chat-ui">
      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={m.role}>
            <b>{m.role === "user" ? "You:" : "Rebecca:"}</b> {m.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={() => { sendMessage(input); setInput(""); }}>Send</button>
        <button onClick={startMic}>{listening ? "🎤 Listening..." : "🎘️ Speak"}</button>
      </div>
      <div className="file-drop">
        <input type="file" onChange={(e) => {
          const file = e.target.files[0];
          setMessages([...messages, { role: "user", text: `🔦 Uploaded ${file.name}` }]);
        }} />
      </div>
    </div>
  );
}