import React from "react";
import { FaUserFriends } from "react-icons/fa";

interface ParticipantsProps {
  participants: Record<string, string>;
  currentUserSid: string;
}

const Participants: React.FC<ParticipantsProps> = ({
  participants,
  currentUserSid,
}) => {
  return (
    <div className="participants-container">
      <div className="participants-content">
        <h3 className="participants-title">
          <FaUserFriends className="participants-icon" /> Participants
        </h3>
        <ul className="participants-list">
          {Object.entries(participants).map(([sid, name]) => {
            const isYou = sid === currentUserSid;
            return (
              <li
                key={sid}
                className={`participant-item ${isYou ? "you" : ""}`}
              >
                {name} {isYou && <span className="you-badge">(You)</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Participants;