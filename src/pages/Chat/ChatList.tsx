import { useEffect, useState } from "react";
import axios from "axios";

export default function ChatList({ onSelectRoom }) {
  const [rooms, setRooms] = useState([]);
  console.log(rooms, "room data")

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/rooms"); // API: all rooms
        setRooms(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="w-1/4 border-r border-gray-300 p-4">
      <h2 className="text-lg font-bold mb-4">Chat Rooms</h2>
      <ul>
        {rooms?.map((room) => (
          <li
            key={room._id}
            onClick={() => onSelectRoom(room.roomId)}
            className="p-2 cursor-pointer hover:bg-gray-100 rounded mb-2"
          >
            <p className="font-medium">{room.roomId}</p>
            <p className="text-sm text-gray-500">{room.lastMessage?.text || "No messages"}</p>
            
          </li>
        ))}
      </ul>
    </div>
  );
}
