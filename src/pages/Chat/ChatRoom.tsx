import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000"); // singleton

export default function ChatRoom({ roomId, userId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const chatContainerRef = useRef(null);

  // Join room only once per roomId change
  useEffect(() => {
    if (!roomId) return;
    socket.emit("join_room", roomId);
    console.log("Joined room:", roomId);

    return () => {
      socket.emit("leave_room", roomId); // optional but good practice
    };
  }, [roomId]);

  // Fetch previous messages when room changes
  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/chat?roomId=${roomId}`
        );
        setMessages(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();
  }, [roomId]);

  // Real-time message listener + optimistic replacement
  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      if (msg.roomId !== roomId) return;

      setMessages((prev) => {
        // Check if this is response to our optimistic message
        const isOurOptimistic = prev.some(
          (m) =>
            m.isOptimistic &&
            m.message === msg.message &&
            m.senderId === userId
        );

        if (isOurOptimistic) {
          // Replace optimistic message with real one from server
          return prev.map((m) =>
            m.isOptimistic &&
            m.message === msg.message &&
            m.senderId === userId
              ? { ...msg, isOptimistic: false }
              : m
          );
        }

        // New message from others
        return [...prev, msg];
      });
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [roomId, userId]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const optimisticMsg = {
      _id: `temp-${Date.now() + Math.random()}`, // very unique temp id
      roomId,
      senderId: userId,
      senderRole: "user",
      message: text.trim(),
      type: "text",
      createdAt: new Date().toISOString(),
      isOptimistic: true, // flag to identify later
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, optimisticMsg]);
    setText("");

    // Send to server (without temp fields)
    socket.emit("send_message", {
      roomId,
      senderId: userId,
      senderRole: "user",
      message: text.trim(),
      type: "text",
    });
  };

  return (
    <div className="w-3/4 p-4 flex flex-col h-[80vh] border border-gray-300 rounded">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-4 space-y-3 p-2 bg-gray-50"
      >
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`inline-block p-3 rounded-lg max-w-[70%] break-words shadow-sm ${
                msg.senderId === userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } ${msg.isOptimistic ? "opacity-70" : ""}`}
            >
              {msg.message}
              {msg.isOptimistic && (
                <span className="text-xs opacity-60 block mt-1">sending...</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          className="flex-1 border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          className="bg-blue-500 text-white px-6 rounded-r-lg hover:bg-blue-600 transition"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}