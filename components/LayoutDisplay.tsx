
import React, { useState } from 'react';
import { LayoutData, LayoutElement } from '../types';
import { CodeIcon } from './icons/CodeIcon';
import { EyeIcon } from './icons/EyeIcon';
import { CodeBlock } from './CodeBlock';

interface LayoutDisplayProps {
  originalImageUrl: string;
  layoutData: LayoutData;
}

const LayoutRenderer: React.FC<{ layoutData: LayoutData }> = ({ layoutData }) => {
    const { container, elements } = layoutData;
    return (
        <div 
            className="relative w-full h-full overflow-hidden shadow-lg"
            style={{
                width: container.width,
                height: container.height,
                backgroundColor: container.backgroundColor,
                maxWidth: '100%',
                maxHeight: '100%',
                aspectRatio: `${parseInt(container.width)} / ${parseInt(container.height)}`
            }}
        >
            {elements.map((el: LayoutElement) => (
                <div
                    key={el.id}
                    className="absolute flex items-center"
                    style={{
                        top: el.top,
                        left: el.left,
                        width: el.width,
                        height: el.height,
                        // Styling
                        background: el.background,
                        borderRadius: el.borderRadius,
                        border: el.border,
                        boxShadow: el.boxShadow,
                        zIndex: el.zIndex,
                        transform: el.transform,
                        opacity: el.opacity,
                        filter: el.filter,
                        clipPath: el.clipPath,
                        mixBlendMode: el.mixBlendMode as any,
                        // Typography
                        fontFamily: el.fontFamily,
                        fontSize: el.fontSize,
                        fontWeight: el.fontWeight,
                        color: el.color,
                        textAlign: el.textAlign as any,
                        textShadow: el.textShadow,
                        padding: '4px',
                        boxSizing: 'border-box',
                        justifyContent: el.textAlign === 'center' ? 'center' : el.textAlign === 'right' ? 'flex-end' : 'flex-start'
                    }}
                >
                    {el.textContent}
                </div>
            ))}
        </div>
    );
};

const generateHtmlCode = (layoutData: LayoutData): string => {
  const elementsHtml = layoutData.elements
    .map(el => `    <div class="element-${el.id}">${el.textContent}</div>`)
    .join('\n');

  return `<div class="container">
${elementsHtml}
</div>`;
};

const generateCssCode = (layoutData: LayoutData): string => {
  const { container, elements } = layoutData;
  const containerCss = `.container {
  position: relative;
  width: ${container.width};
  height: ${container.height};
  background-color: ${container.backgroundColor};
  overflow: hidden;
}`;

  const elementsCss = elements
    .map(el => `.element-${el.id} {
  position: absolute;
  box-sizing: border-box; /* Include padding in width/height */
  display: flex;
  align-items: center; /* Vertically center text */
  padding: 4px;
  top: ${el.top};
  left: ${el.left};
  width: ${el.width};
  height: ${el.height};
  background: ${el.background};
  border-radius: ${el.borderRadius};
  border: ${el.border};
  box-shadow: ${el.boxShadow};
  color: ${el.color};
  font-family: ${el.fontFamily};
  font-size: ${el.fontSize};
  font-weight: ${el.fontWeight};
  text-align: ${el.textAlign};
  text-shadow: ${el.textShadow};
  opacity: ${el.opacity};
  filter: ${el.filter};
  clip-path: ${el.clipPath};
  mix-blend-mode: ${el.mixBlendMode};
  z-index: ${el.zIndex};
  transform: ${el.transform};
  justify-content: ${
    el.textAlign === 'center' ? 'center' : el.textAlign === 'right' ? 'flex-end' : 'flex-start'
  };
}`)
    .join('\n\n');

  return `${containerCss}\n\n${elementsCss}`;
};


export const LayoutDisplay: React.FC<LayoutDisplayProps> = ({ originalImageUrl, layoutData }) => {
    const [view, setView] = useState<'preview' | 'code'>('preview');

    const htmlCode = generateHtmlCode(layoutData);
    const cssCode = generateCssCode(layoutData);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-center text-gray-300">Original Image</h3>
                <div className="flex justify-center items-center bg-dots p-4 rounded-lg">
                    <img src={originalImageUrl} alt="Original" className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-2xl" />
                </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-300">Generated Layout</h3>
                    <div className="flex items-center space-x-2 bg-gray-700 p-1 rounded-lg">
                        <button onClick={() => setView('preview')} className={`px-3 py-1 rounded-md text-sm transition ${view === 'preview' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-600'}`}>
                            <EyeIcon className="w-5 h-5 inline-block mr-1"/>
                            Preview
                        </button>
                        <button onClick={() => setView('code')} className={`px-3 py-1 rounded-md text-sm transition ${view === 'code' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-600'}`}>
                            <CodeIcon className="w-5 h-5 inline-block mr-1"/>
                            Code
                        </button>
                    </div>
                </div>

                {view === 'preview' ? (
                    <div className="flex justify-center items-center bg-dots p-4 rounded-lg">
                       <LayoutRenderer layoutData={layoutData} />
                    </div>
                ) : (
                    <div className="relative">
                       <CodeBlock language="HTML" code={htmlCode} />
                       <CodeBlock language="CSS" code={cssCode} />
                    </div>
                )}
            </div>
        </div>
    );
};
