"use client"
// eslint-disable-next-line react-hooks/exhaustive-deps

import { useState } from "react";

export default function mcs() {
  const responses = [
    "As I see it, yes.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "It is certain.",
    "It is decidedly so.",
    "Most likely.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Outlook good.",
    "Reply hazy, try again.",
    "Signs point to yes.",
    "Very doubtful.",
    "Without a doubt.",
    "Yes.",
    "Yes - definitely.",
    "You may rely on it.",
  ];

  const [response, setResponse] = useState("");

  const ask = () => {
    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];
    setResponse(randomResponse);
    
  };



  return (
    <div className="h-screen bg-black flex flex-col justify-center items-center text-white font-helvetica">
      <div className="text-center">
        <h1 className="text-4xl mb-4">{response != '' ? response : "Ask me a yes/no question :D"}</h1>
        <textarea
          id="response"
          className="w-full h-40 bg-transparent text-xl text-white border border-white p-4 mb-4"
        />
        <button
          className="btn bg-yellow-500 text-black py-2 px-4 rounded text-lg"
          onClick={ask}
        >
          Ask
        </button>
      </div>
    </div>
  );
}
