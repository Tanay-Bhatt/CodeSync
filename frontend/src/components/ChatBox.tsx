import { useEffect, useRef, useState } from "react";
import socket from "../socket";
import { FaPaperPlane } from "react-icons/fa";

interface Message {
  id: string;
  sender: string;
  text: string;
  isYou: boolean;
  timestamp: Date;
}

interface ChatBoxProps {
  roomId: string;
  mySid: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatBox:React.FC<ChatBoxProps> = ({ roomId, mySid, messages, setMessages }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMessage = ({ sender, sender_sid, message }: { 
      sender: string;
      sender_sid: string;
      message: string;
    }) => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender,
          text: message,
          isYou: sender_sid === mySid,
          timestamp: new Date()
        }
      ]);
    };

    socket.on("chat_message", handleMessage);

    return () => {
      socket.off("chat_message", handleMessage);
    };
  }, [mySid]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!input.trim()) return;
    console.log(messages);
    socket.emit("chat_message", {
      room: roomId,
      message: input.trim(),
    });
    setInput("");
  };

  return (
    <div className="chat-container">
      <h3 className="chat-header">
        <span className="chat-icon">💬</span> Chat
      </h3>
      
      <div className="messages-container">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`message ${msg.isYou ? "you" : "other"}`}
          >
            <div className="message-sender">
              {msg.isYou ? "You" : msg.sender}
            </div>
            <div className="message-text">{msg.text}</div>
            <div className="message-time">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button 
          onClick={handleSend} 
          className="send-button"
          disabled={!input.trim()}
        >
          <FaPaperPlane className="send-icon" />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;