
import React, { useState } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden my-4 border border-gray-700">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800">
        <span className="text-xs font-semibold text-gray-400 uppercase">{language}</span>
        <button onClick={handleCopy} className="bg-gray-700 hover:bg-indigo-600 text-white p-2 rounded-lg transition text-sm flex items-center">
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4 mr-1" />
              Copied!
            </>
          ) : (
             <>
              <CopyIcon className="w-4 h-4 mr-1" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="text-sm text-indigo-200 p-4 overflow-x-auto max-h-[50vh]">
        <code>{code}</code>
      </pre>
    </div>
  );
};