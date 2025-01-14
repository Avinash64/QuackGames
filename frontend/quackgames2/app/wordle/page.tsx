"use client"
import { useState } from "react";
import { useSearchParams } from 'next/navigation'
import Link from "next/link";
import { Suspense } from 'react'
import { Button } from "@/components/ui/button"
// List of Pokémon names (for fallback)
const pokemon = ["Arbok", "Ekans", "Eevee", "Gloom", "Golem", "Pichu", "Absol", "Paras", "Deino", "Gible", "Bagon", "Ditto", "Tepig", "Hypno", "Lotad", "Ralts", "Snivy", "Doduo", "Numel", "Rotom", "Lugia", "Budew", "Magby", "Shinx", "Toxel", "Burmy", "Goomy", "Riolu", "Throh", "Zorua", "Aipom", "Luxio", "Azelf", "Klink", "Lokix", "Minun", "Yanma", "Entei", "Hoopa", "Inkay", "Klang", "Pawmi", "Pawmo", "Munna", "Nacli", "Unown", "Kubfu", "Klawf"];
const randp = pokemon[Math.floor(Math.random() * pokemon.length)].toUpperCase();

function Search() {
  const searchParams = useSearchParams()
 
  return searchParams.get('h');
}

const Wordle = () => {
  const search = Search();

  let targetWord;

  // Check if 'h' is base64 and decodes to a 5-letter word

  try {
    // Decode the base64 string
    const decoded = atob(search).toUpperCase();  // Decode base64
    console.log(decoded)
    // Check if decoded word is exactly 5 letters long
    if (decoded.length === 5) {
      targetWord = decoded.toUpperCase(); // Use decoded word if valid
    }
  } catch (e) {
    // If there's an error in decoding, just fallback to random Pokémon
    console.error("Invalid base64 string. Falling back to Pokémon.");
    console.log(e)
  }


  // If no valid base64 word, fall back to a random Pokémon
  if (!targetWord) {
    targetWord = randp
  }

  const [guesses, setGuesses] = useState(["", "", "", "", "", ""]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winMsg, setWinMsg] = useState('');
  const [feedback, setFeedback] = useState([]);  // Store feedback after guess is submitted

  const handleInputChange = (e) => {
    if (gameOver) return;
    setCurrentGuess(e.target.value.toUpperCase());
  };

  const handleGuess = () => {
    if (currentGuess.length !== 5) return;

    const updatedGuesses = [...guesses];
    updatedGuesses[currentRow] = currentGuess;

    const guessFeedback = getFeedback(currentGuess);
    const updatedFeedback = [...feedback];
    updatedFeedback[currentRow] = guessFeedback;

    setGuesses(updatedGuesses);
    setFeedback(updatedFeedback);
    setCurrentGuess("");
    setCurrentRow(currentRow + 1);

    if (currentGuess === targetWord) {
      setGameOver(true);
      setWinMsg(`Congratulations! You guessed the word! ${targetWord}`);
    } else if (currentRow === 5) {
      setGameOver(true);
      setWinMsg(`${targetWord}`);
    }
  };

  const getFeedback = (guess) => {
    const feedback = [];
    for (let i = 0; i < 5; i++) {
      if (guess[i] === targetWord[i]) {
        feedback.push("correct");
      } else if (targetWord.includes(guess[i])) {
        feedback.push("misplaced");
      } else {
        feedback.push("wrong");
      }
    }
    return feedback;
  };

  return (
      <Suspense>
    <div suppressHydrationWarning className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-2">
      <h1 className="text-4xl mb-6 font-bold">{gameOver ? `${winMsg}` : "Quackle"}</h1>

      <div className="flex flex-col gap-3 padding-3">
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} className="flex space-x-2">
            {Array.from({ length: 5 }).map((_, colIndex) => {
              const letter = guess[colIndex] || "";
              const currentFeedback = rowIndex < currentRow ? feedback[rowIndex][colIndex] : "";

              return (
                <div
                  key={colIndex}
                  className={`w-16 h-16 flex items-center justify-center border-2 text-xl font-semibold uppercase
                                        ${currentFeedback === "correct" ? "bg-green-500" : ""}
                                        ${currentFeedback === "misplaced" ? "bg-yellow-500" : ""}
                                        ${currentFeedback === "wrong" ? "bg-gray-500" : ""}
                                        ${!letter ? "bg-gray-800" : ""}`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mb-6">
        <input
          type="text"
          maxLength={5}
          value={currentGuess}
          onChange={handleInputChange}
          className="p-2 w-40 text-center border-2 border-white bg-gray-800 text-white rounded"
          disabled={gameOver}
        />
      </div>

      <button
        onClick={handleGuess}
        className="bg-blue-500 text-white p-2 rounded w-40"
        disabled={gameOver || currentGuess.length !== 5}
      >
        Guess
      </button>

      {gameOver && (
        <div className="flex flex-col justify-around py-4">
          <Button variant="secondary">

          <Link
            href="/wordle/generate"
            className="text-yellow-500 hover:underline"
            >
            Generate a wordle to share
          </Link>
            </Button>

          <button
            onClick={() => window.location.replace(location.pathname)}
            className="bg-green-500 text-white p-2 rounded mt-6"
          >
            Play Again
          </button>

        </div>
      )}
    </div>
      </Suspense>
  );
};

export default Wordle;
