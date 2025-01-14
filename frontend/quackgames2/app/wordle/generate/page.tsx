"use client";
import { useState } from "react";

const Generate = () => {
  const [word, setWord] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [error, setError] = useState("");


  // Function to handle the word input change
  const handleInputChange = (e) => {
    const inputWord = e.target.value.toUpperCase();
    if (inputWord.length <= 5 && /^[A-Za-z]*$/.test(inputWord)) {
      setWord(inputWord);
      setError("");
    }
  };

  // Function to generate the URL with base64 encoding
  const generateUrl = () => {
    if (word.length === 5) {
      try {
        const base64Word = btoa(word); // Base64 encode the word
        const newUrl = `${window.location.origin}/wordle?h=${base64Word}`;
        setGeneratedUrl(newUrl);
      } catch (_) {
        setError("Failed to generate URL.");
        
      }
    } else {
      setError("Please enter a 5-letter word.");
    }
  };

  return (
    <div suppressHydrationWarning className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-4">
      <h1 className="text-4xl mb-6 font-bold">Generate Wordle URL</h1>
      
      {/* Word Input Field */}
      <input
        type="text"
        value={word}
        onChange={handleInputChange}
        maxLength={5}
        className="p-2 w-40 text-center border-2 border-white bg-gray-800 text-white rounded"
        placeholder="Enter 5-letter word"
      />
      
      {error && <p className="text-red-500">{error}</p>}
      
      {/* Generate Button */}
      <button
        onClick={generateUrl}
        className="bg-blue-500 text-white p-2 rounded w-40 mt-4"
      >
        Generate URL
      </button>

      {/* Display the generated URL */}
      {generatedUrl && (
        <div className="mt-4">
          <p className="text-lg">Generated URL:</p>
          <a
            href={generatedUrl}
            target="_blank"
            className="text-yellow-500 hover:underline"
          >
            {generatedUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default Generate;
