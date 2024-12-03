import { Send } from "lucide-react";
import React, { useState } from "react";
import "./index.css";
export default function ChatRoom() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "User",
      text: "What are Mohamed Salah's stats this season?",
      timestamp: "2:30 PM",
      isUser: true,
    },
    {
      id: 2,
      sender: "AI",
      text: "Mohamed Salah has scored 14 goals and provided 8 assists in 20 Premier League appearances this season. He maintains a shot accuracy of 68% and has created 45 chances for his teammates.",
      timestamp: "2:31 PM",
      isUser: false,
    },
    {
      id: 3,
      sender: "User",
      text: "What was the score in the last Manchester derby?",
      timestamp: "2:32 PM",
      isUser: true,
    },
    {
      id: 4,
      sender: "AI",
      text: "The last Manchester derby was played on October 29, 2023, where Manchester City won 3-0 against Manchester United at Old Trafford. Erling Haaland scored twice and Phil Foden added another goal.",
      timestamp: "2:33 PM",
      isUser: false,
    },
    {
      id: 5,
      sender: "User",
      text: "Who do you predict will win the Premier League this season?",
      timestamp: "2:34 PM",
      isUser: true,
    },
    {
      id: 6,
      sender: "AI",
      text: "Based on current form and statistics, Manchester City and Liverpool are the strongest contenders. Arsenal also has a good chance given their defensive record and improved attacking performance. However, City's experience in title races gives them a slight edge.",
      timestamp: "2:35 PM",
      isUser: false,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (newMessage.trim()) {
      setIsProcessing(true);
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: "User",
          text: newMessage,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          }),
          isUser: true,
        },
      ]);
      setNewMessage("");
      setIsTyping(true);
      setTimeout(() => {
        setIsProcessing(false);
        setIsTyping(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="bg-[#37003c]/95 backdrop-blur-lg text-white p-4 fixed top-0 left-0 right-0 z-10 border-b border-white/10 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <img
            src="/api/placeholder/48/48"
            alt="Premier League Logo"
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold leading-loose">
              Premier League Live Information
            </h1>
            <p className="text-xs font-medium leading-tight opacity-80">
              Your AI Assistant for Premier League Stats
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 pt-28 pb-24 scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isUser ? "justify-end" : "justify-start"
              } animate-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] ${
                  message.isUser
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none"
                    : "bg-gradient-to-br from-white to-gray-50 text-black rounded-bl-none"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-medium leading-snug">
                    {message.sender}
                  </span>
                  <span className="text-[10.20px] font-medium leading-[18px] opacity-75">
                    {message.timestamp}
                  </span>
                </div>
                <p className="text-xs leading-normal">{message.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-3 shadow-lg">
                <p className="text-sm">AI is typing...</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="border-t border-gray-200 bg-white/95 backdrop-blur-lg p-4 fixed bottom-0 left-0 right-0 shadow-lg">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask about Premier League statistics, matches, or predictions..."
            className="flex-1 rounded-lg border border-gray-200 p-3 text-[15px] font-medium focus:outline-none focus:border-[#37003c] focus:ring-2 focus:ring-[#37003c]/20"
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={isProcessing}
            className={`bg-[#37003c] text-white p-3 rounded-lg hover:bg-[#37003c]/90 transition-all hover:scale-105 disabled:opacity-70 ${
              isProcessing ? "animate-pulse" : ""
            }`}
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
