"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  // Random passages
  const passages: string[] = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Enim mollis dui morbi augue parturient sapien dictumst pretium. Conubia justo habitant luctus tellus lacus duis.",
    "Tellus non pellentesque elementum porta ligula montes mauris. Nunc per blandit condimentum hac curae mi suscipit.",
  ];

  // State variables with types
  const [inputValue, setInputValue] = useState<string>('');
  const [randomPassage, setRandomPassage] = useState<string>('');
  const [seconds, setSeconds] = useState<number>(0);
  const [started, setStarted] = useState<boolean>(false);
  const [inputAndText, setInputAndText] = useState<boolean>(true);
  const [showWPM, setShowWPM] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Store interval ID

  // Select random passage when the component mounts
  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * passages.length);
    setRandomPassage(passages[randomNumber]);
  }, []);

  // Handle input change
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    autoResize();

    if (!started) {
      setStarted(true);
    }

    const lengthOfInput = newValue.length;
    const partOfPassage = randomPassage.slice(0, lengthOfInput);

    if (lengthOfInput !== randomPassage.length) {
      setInputAndText(partOfPassage === newValue);
    } else if (randomPassage === newValue) {
      setInputAndText(true);
      setStarted(false);
      setShowWPM(true);
      if (intervalRef.current) clearInterval(intervalRef.current); // Stop the timer
    }
  };

  // Start the timer when typing starts
  useEffect(() => {
    if (started) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current); // Cleanup on unmount or when `started` changes
    };
  }, [started]);

  // Auto-resize the textarea
  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height based on content
    }
  };

  // Format time as mm:ss
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Calculate words per minute
  const calculateWPM = () => {
    const words = inputValue.trim().split(/\s+/).filter(Boolean).length; // Filter out empty strings
    const minutes = seconds / 60;
    return minutes > 0 ? Math.floor(words / minutes) : 0; // Avoid division by zero
  };

  // Reset the typing test
  const resetTest = () => {
    setInputValue('');
    setSeconds(0);
    setShowWPM(false);
    setStarted(false);
    setInputAndText(true);
    const randomNumber = Math.floor(Math.random() * passages.length);
    setRandomPassage(passages[randomNumber]);
  };

  // Prevent copy, paste, and cut actions
  const preventCopyPaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
  };

  // Determine background color based on input correctness
  const condition = inputAndText ? 'bg-white' : 'bg-red-400';

  return (
    <div className="flex flex-col justify-center items-center my-10">
      {showWPM && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col justify-center items-center z-50">
          <div className="text-white text-6xl mb-6">
            Your WPM: {calculateWPM()}
          </div>
          <button
            onClick={resetTest}
            className="bg-white text-black text-xl py-2 px-4 rounded-lg hover:bg-gray-300"
          >
            Restart
          </button>
        </div>
      )}

      <div className="border-2 shadow-lg w-1/2 p-10 mb-6 rounded-lg">
        <p className="text-2xl">{randomPassage}</p>
      </div>
      <div className="w-1/2 text-2xl">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleChange}
          onCopy={preventCopyPaste}
          onPaste={preventCopyPaste}
          onCut={preventCopyPaste}
          disabled={showWPM}
          className={`w-full min-h-[30px] max-h-[150px] overflow-hidden resize-none p-2 border rounded shadow-lg px-3 py-4 ${condition}`}
          style={{ height: "auto" }}
        />
        <div className="w-1/2 mt-4">
          <p className="text-xl">Time: {formatTime(seconds)}</p>
        </div>
      </div>
    </div>
  );
}
