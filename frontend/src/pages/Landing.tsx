import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../App.css";
import CustomToast from "../components/Toast";


const LandingPage = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (roomId.trim()) {
      try {
        const res = await fetch(`${apiUrl}api/room/exists/${roomId.trim()}`);
        const data = await res.json();
    
        if (!data.exists) {
          setToastMessage("Room ID not found. Please check again or leave blank to create new one.");
          return;
        }
    
        navigate(`/room/${roomId.trim()}?name=${encodeURIComponent(username)}`);
      } catch (error) {
        setToastMessage("Error checking room existence. Please try again.");
      }
    } else {
      try {
        const response = await fetch(`${apiUrl}api/room/create`, {
          method: "POST",
        });
    
        const data = await response.json();
        const newRoomId = data.roomId;
        navigate(`/room/${newRoomId}?name=${encodeURIComponent(username)}`);
      } catch (error) {
        setToastMessage("Error creating new room. Please try again.");
      }
    }
  };

  return (
    <div className="landing-container">
      <div className="glass-card">
        <h1 className="heading">💻 CodeSync</h1>
        <p className="subtext">Collaborate on code in real time.</p>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-box"
            required
          />

          <input
            placeholder="Enter room ID or leave blank"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="input-box"
          />

          <button type="submit" className="neobutton">
            Join Room
          </button>
        </form>
      </div>

      {toastMessage && (
        <CustomToast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </div>
  );
};

export default LandingPage;