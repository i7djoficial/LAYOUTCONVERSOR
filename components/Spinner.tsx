
import React, { useState, useEffect } from 'react';

const messages = [
  "Analyzing image contours...",
  "Mapping shapes to CSS...",
  "Applying color palette...",
  "Finalizing layout...",
];

export const Spinner: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex flex-col justify-center items-center z-50 backdrop-blur-sm">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
      <p className="text-white text-lg mt-4 transition-opacity duration-500">
        {messages[messageIndex]}
      </p>
    </div>
  );
};