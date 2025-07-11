// src/Chatbot.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chatbot.css";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { text: userInput, sender: "user" }];
    setMessages(newMessages);
    setUserInput("");
    setIsTyping(true);

    try {
      const res = await axios.post("http://localhost:5001/chat", {
        message: userInput,
      });
      setMessages((prev) => [...prev, { text: res.data.response, sender: "bot" }]);
    } catch (err) {
      setMessages((prev) => [...prev, { text: "Error connecting to server.", sender: "bot" }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <>
      <div className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        💬
      </div>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-card">
            <h2 className="chatbot-title">🌿 <span>EcoBot</span></h2>
            <div className="chatbox">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-wrapper ${
                    msg.sender === "user" ? "user" : "bot"
                  }`}
                >
                  <div className="avatar">
                    {msg.sender === "user" ? "🧑" : "🤖"}
                  </div>
                  <div
                    className={`message-text ${
                      msg.sender === "user" ? "user-message" : "bot-message"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="message-wrapper bot">
                  <div className="avatar">🤖</div>
                  <div className="message-text bot-message typing-indicator">
                    <div className="typing-dots">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="input-container">
              <input
                type="text"
                value={userInput}
                placeholder="Let’s chat about going green..."
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="chat-input"
              />
              <button onClick={handleSend} className="chat-send-button">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
