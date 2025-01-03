/* eslint-disable */
"use client"; // This is a client component
import { SetStateAction, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Image from "next/image";

export default function Home() {
  const [messages, setMessages] = useState(['']);
  const [messageInput, setMessageInput] = useState("");
  const [userName, setUserName] = useState("");
  const [lobby, setLobby] = useState("");
  const [socket, setSocket] = useState<any>(null); // State for the socket instance
  const [joined, setJoined] = useState(false); // State to track if the user has joined
  const [buttonArray, setButtonArray] = useState<Array<string>>(Array(9).fill('-')); // State for button array

  // Handle message input change
  const handleMessageInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setMessageInput(e.target.value);
  };

  // Handle name input change
  const handleNameInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setUserName(e.target.value);
  };

  // Handle lobby code input change
  const handleLobbyChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setLobby(e.target.value);
  };

  // Handle joining the room
const handleJoinClick = () => {
  if (userName.trim() !== "" && lobby.trim() !== "") {
    const newSocket = io("https://quack-games-backend.adaptable.app"); // Create a new socket connection
    setSocket(newSocket);

    // Emit 'join-room' with both name and lobby code
    newSocket.emit("join-room", { name: userName, room: lobby });

    setJoined(true); // Mark the user as joined
  }
};


  // Handle submitting the message
  const handleSubmitMessage = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (messageInput.trim() !== "") {
      const message = messageInput;
      setMessages([...messages, `You: ${message}`]);
      socket?.emit("send-chat-message", { message, room: lobby }); // Send message to specific room
      setMessageInput("");
    }
  };

  // Handle the connection to the WebSocket server and listening to messages
  useEffect(() => {
    if (socket) {
      // Listen for messages from other users in the same room
      socket.on("chat-message", (data) => {
        setMessages((prevMessages) => [...prevMessages, `${data.name}: ${data.message}`]);
      });

      socket.on("user-connected", (name) => {
        setMessages((prevMessages) => [...prevMessages, `${name} connected`]);
      });

      socket.on("user-disconnected", (name) => {
        setMessages((prevMessages) => [...prevMessages, `${name} disconnected`]);
      });

      // Listen for updated button array and update the grid for this room
      socket.on("update-array", (data) => {
        setButtonArray(data.newArray);
      });

      // Cleanup socket on component unmount
      return () => {
        socket.disconnect();
      };
    }
  }, [socket]); // Effect depends on socket instance

  // Handle button click (toggle between 'O' and 'X')
  const handleButtonClick = (index: number) => {
    const newArray = [...buttonArray];
    newArray[index] = newArray[index] === 'O' ? 'X' : 'O'; // Toggle between 'O' and 'X'
    setButtonArray(newArray);

    // Send the updated array to the server for this room
    socket?.emit("update-array", { newArray, room: lobby });
  };

  // Handle reset button click
  const resetButtonClick = () => {
    const newArray = Array(9).fill('-');
    setButtonArray(newArray);

    // Send the reset array to the server for this room
    socket?.emit("update-array", { newArray, room: lobby });
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        {/* Username Input */}
        {!joined ? (
          <div>
            <input
              type="text"
              color="black"
              id="message-input"
              value={userName}
              onChange={handleNameInputChange}
              className="flex-grow border rounded p-2"
              placeholder="Type your Name..."
            />

            <button
              onClick={handleJoinClick}
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
              disabled={!userName.trim() || !lobby.trim()}
            >
              Join
            </button>
          </div>
        ) : (
          <div className="mb-4">Welcome, {userName}!</div>
        )}

        {/* Lobby Code Input */}
        {!joined && (
          <input
            type="text"
            color="black"
            id="lobby-input"
            value={lobby}
            onChange={handleLobbyChange}
            className="flex-grow border rounded p-2"
            placeholder="Lobby Code..."
          />
        )}

        {/* Messages Container */}
        <div id="message-container" className="w-full max-w-3xl bg-white border-2 p-4 rounded-lg">
          {messages.map((message, index) => (
            <div key={index} className={`p-2 ${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}`}>
              {message}
            </div>
          ))}
        </div>

        {/* Game Button Array (Array of Buttons) */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {buttonArray.map((buttonValue, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(index)}
              className="w-12 h-12 bg-gray-200 border rounded text-lg font-semibold"
            >
              {buttonValue}
            </button>
          ))}
        </div>
        <button onClick={resetButtonClick} id="reset-button" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
          Reset
        </button>

        {/* Message Input & Send Button */}
        {joined && (
          <form onSubmit={handleSubmitMessage} className="flex w-full max-w-3xl mt-4">
            <input
              type="text"
              id="message-input"
              value={messageInput}
              onChange={handleMessageInputChange}
              className="flex-grow border rounded p-2"
              placeholder="Type your message..."
            />
            <button type="submit" id="send-button" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
              Send
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
