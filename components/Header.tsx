
import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

export const Header: React.FC = () => {
  return (
    <header className="py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
            <LogoIcon className="w-12 h-12 text-indigo-400" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Contour to CSS
            </h1>
        </div>
      <p className="max-w-2xl mx-auto text-lg text-gray-400">
        Upload an image and watch AI transform its contours into a fully structured CSS layout.
      </p>
    </header>
  );
};
