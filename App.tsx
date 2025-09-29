
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { LayoutDisplay } from './components/LayoutDisplay';
import { Spinner } from './components/Spinner';
import { Header } from './components/Header';
import { generateLayoutFromImage } from './services/geminiService';
import { LayoutData } from './types';

function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [layoutData, setLayoutData] = useState<LayoutData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setLayoutData(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateLayout = useCallback(async () => {
    if (!imageUrl) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // The base64 URL includes a prefix like "data:image/png;base64,", which we need to remove.
      const base64Data = imageUrl.split(',')[1];
      const mimeType = imageUrl.split(';')[0].split(':')[1];
      
      const generatedLayout = await generateLayoutFromImage(base64Data, mimeType);
      setLayoutData(generatedLayout);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [imageUrl]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
          <ImageUploader onImageUpload={handleImageUpload} imageUrl={imageUrl} />
          
          {imageUrl && (
            <div className="mt-8 text-center">
              <button
                onClick={handleGenerateLayout}
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                {isLoading ? 'Analyzing Contours...' : 'Generate CSS Layout'}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
        </div>
        
        {isLoading && <Spinner />}

        {layoutData && (
          <div className="mt-12">
            <LayoutDisplay originalImageUrl={imageUrl!} layoutData={layoutData} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;