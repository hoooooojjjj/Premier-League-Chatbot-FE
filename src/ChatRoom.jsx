import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import "./index.css";
export default function ChatRoom() {
  const messagesEndRef = useRef(null);

  // 초기 메시지 로컬 스토리지에서 로드
  const loadMessagesFromLocalStorage = () => {
    const storedMessages = localStorage.getItem("chatMessages");
    return storedMessages
      ? JSON.parse(storedMessages)
      : [
          {
            id: 0,
            sender: "프림이",
            text: `"프리미어리그 실시간 정보" 챗봇에 오신 것을 환영합니다!

      다음과 같은 질문을 할 수 있습니다:

      1. 특정 팀 또는 모든 팀의 순위, 승점, 골득실 등
      2. 특정 팀의 최근 경기 결과
      3. 특정 선수의 통계(득점, 도움 등)나 포지션
      4. 리그 전체 기록 (예: 최다 득점자, 어시스트 순위)
      5. 프리미어리그 득점왕, 우승팀 등 예측 `,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            }),
            isUser: false,
          },
        ];
  };
  const [messages, setMessages] = useState(loadMessagesFromLocalStorage());
  const [newMessage, setNewMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // 메시지를 로컬 스토리지에 저장
  const saveMessagesToLocalStorage = (messages) => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  };

  // 자동 스크롤 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchData = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    // 10분 타임아웃 설정
    const timeout = setTimeout(() => controller.abort(), 600000);

    try {
      const response = await fetch("/initialize", {
        method: "POST",
        signal: signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const sendToServer = async (message) => {
    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: message }),
      });

      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleSend = async () => {
    if (newMessage.trim()) {
      const newMessages = [
        ...messages,
        {
          id: messages.length + 1,
          sender: "나",
          text: newMessage,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          }),
          isUser: true,
        },
      ];

      setMessages(newMessages);
      saveMessagesToLocalStorage(newMessages);
      setNewMessage("");
      setIsProcessing(true);
      setIsTyping(true);

      try {
        const res = await sendToServer(newMessage);
        const answer = res.answer.replace(/\*/g, "");

        const updatedMessages = [
          ...newMessages,
          {
            id: newMessages.length + 1,
            sender: "프림이",
            text: answer,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            }),
            isUser: false,
          },
        ];

        setMessages(updatedMessages);
        saveMessagesToLocalStorage(updatedMessages);
      } catch (error) {
        console.error("메시지 전송 실패:", error);
      } finally {
        setIsProcessing(false);
        setIsTyping(false);
      }
    }
    scrollToBottom(); // 메시지를 보낸 후 스크롤
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="bg-[#640D5F] backdrop-blur-lg text-white p-4 fixed top-0 left-0 right-0 z-10 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4 px-4 sm:px-6 lg:px-8">
          <img
            src="/assets/logo.svg"
            alt="Premier League Logo"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
          />
          <div className="flex-1 min-w-[200px]">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight">
              프리미어리그 실시간 AI 챗봇 : 프림이
            </h1>
            <p className="text-[10px] sm:text-xs md:text-sm font-medium leading-tight opacity-80">
              프리미어리그의 실시간 정보를 제공하는 AI 챗봇과 대화해보세요!
            </p>
          </div>
          <button
            onClick={async () => {
              const res = await fetchData();
              console.log(res);
              if (res.message === "Data initialized successfully") {
                alert("데이터를 성공적으로 가져왔습니다.");
              }
            }}
            className="ml-auto flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-3 lg:px-6 lg:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs sm:text-sm md:text-base font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10l9-6 9 6M4 10v10a1 1 0 001 1h14a1 1 0 001-1V10M12 22v-8m0 0v8m0-8l-3 3m3-3l3 3"
              />
            </svg>
            실시간 데이터 가져오기
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pt-32 pb-24 scroll-smooth bg-[#FFB200]/10">
        <div className="max-w-5xl mx-auto space-y-6  ">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${
                message.isUser ? "justify-end" : "justify-start"
              } animate-in slide-in-from-bottom-2 duration-300 whitespace-pre-wrap `}
            >
              <div
                className={`max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[50%] rounded-lg p-4 mt-6 shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] ${
                  message.isUser
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none"
                    : "bg-gradient-to-br from-white to-gray-50 text-black rounded-bl-none"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[16px] md:text-[18px] font-medium leading-snug">
                    {message.sender}
                  </span>
                  <span className="text-[12px] md:text-[13px] font-medium leading-[18px] opacity-75">
                    {message.timestamp}
                  </span>
                </div>
                <p className="text-sm md:text-base leading-normal pt-2">
                  {message.text}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-3 shadow-lg">
                <p className="text-sm">프림이가 답변을 생각 중이에요!</p>
              </div>
            </div>
          )}
          {/* 스크롤 기준점 */}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <div className="border-t border-gray-200 bg-white/95 backdrop-blur-lg p-4 fixed bottom-0 left-0 right-0 shadow-lg">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
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
