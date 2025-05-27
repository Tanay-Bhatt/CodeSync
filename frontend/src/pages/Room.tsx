import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";
import { FaUsers, FaComments, FaCode, FaCopy } from "react-icons/fa";
import CodeEditor from "../components/CodeEditor";
import Participants from "../components/Participants";
import ChatBox from "../components/ChatBox";
import CustomToast from "../components/Toast";
import "../App.css"


interface Message {
	id: string;
	sender: string;
	text: string;
	isYou: boolean;
	timestamp: Date;
  }
  

const Room = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [participants, setParticipants] = useState<Record<string, string>>({});
  const [mySid, setMySid] = useState<string>("");
  const username = useRef<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"editor" | "participants" | "chat">("editor");
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 768);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const name = query.get("name") || "Anonymous";
    username.current = name;

    if (!socket.connected) socket.connect();

    socket.on("connect", () => {
      socket.emit("join", { room: roomId, username: name });
    });

    socket.on("your_sid", ({ sid }) => {
      setMySid(sid);
    });

    socket.on("participants", (users: Record<string, string>) => {
      setParticipants(users);
    });

    socket.on("user_joined", (name: string) => {
      if (name !== username.current) {
        setToastMessage(`🎉 ${name} joined`);
      }
    });

    socket.on("user_left", (name: string) => {
      if (name !== username.current) {
        setToastMessage(`👋 ${name} left`);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId || "");
      setToastMessage("Room ID copied to clipboard!");
    } catch (err) {
      setToastMessage("Failed to copy room ID");
    }
  };

  const togglePanel = (panel: "editor" | "participants" | "chat") => {
    setMobileView(panel);
  };

  return (
    <div className="room-container">
      <header className="room-header">
        <h1 className="room-title">CodeSync</h1>
        <button onClick={copyRoomId} className="copy-room-btn">
          <FaCopy className="copy-icon" />
          <span className="room-id">Copy Room ID</span>
        </button>
      </header>

      {toastMessage && (
        <CustomToast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {!isWideScreen && (
        <div className="mobile-tabs">
          <button
            className={`tab-btn ${mobileView === 'editor' ? 'active' : ''}`}
            onClick={() => togglePanel('editor')}
          >
            <FaCode /> Code
          </button>
          <button
            className={`tab-btn ${mobileView === 'participants' ? 'active' : ''}`}
            onClick={() => togglePanel('participants')}
          >
            <FaUsers /> People
          </button>
          <button
            className={`tab-btn ${mobileView === 'chat' ? 'active' : ''}`}
            onClick={() => togglePanel('chat')}
          >
            <FaComments /> Chat
          </button>
        </div>
      )}

      <div className="room-layout">
        
          <div className={`left-panel ${(mobileView === "participants" || isWideScreen) ? "mobile-visible" : "mobile-hidden"}`}>
            <Participants
              participants={participants}
              currentUserSid={mySid}
            />
          </div>
        

          <div className={`center-panel ${(mobileView === "editor" || isWideScreen) ? "mobile-visible" : "mobile-hidden"}`}>
            <CodeEditor 
              roomId={roomId!} 
            />
          </div>

        <div
			className={`right-panel ${(mobileView === "chat" || isWideScreen) ? "mobile-visible" : "mobile-hidden"}`}
			>
			<ChatBox
				roomId={roomId!}
				mySid={mySid}
				messages={messages}
				setMessages={setMessages}
			/>
		</div>
      </div>
    </div>
  );
};

export default Room;