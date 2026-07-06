import { useState } from "react";
import ChatList from "./ChatList";
import ChatRoom from "./ChatRoom";
// import ChatList from "./components/ChatList";
// import ChatRoom from "./components/ChatRoom";

export default function ChatHome() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const userId = "64123abcde1234567890abcd"; // current user

  return (
    <div className="flex h-screen">
      <ChatList onSelectRoom={setSelectedRoom} />
      {selectedRoom ? (
        <ChatRoom roomId={selectedRoom} userId={userId} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a room to chat
        </div>
      )}
    </div>
  );
}
