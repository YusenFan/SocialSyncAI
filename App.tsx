import React, { useState } from 'react';
import { UploadedImage, SocialPostContent } from './types';
import { generateSocialAdaptations } from './services/geminiService';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { Layers } from 'lucide-react';

const App: React.FC = () => {
  const [baseText, setBaseText] = useState('');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [generatedContent, setGeneratedContent] = useState<SocialPostContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const content = await generateSocialAdaptations(baseText, images);
      setGeneratedContent(content);
    } catch (err) {
      console.error(err);
      setError("Failed to generate content. Please check your API Key or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async (instruction: string) => {
    setIsGenerating(true);
    setError(null);
    try {
      const content = await generateSocialAdaptations(baseText, images, instruction);
      setGeneratedContent(content);
    } catch (err) {
      console.error(err);
      setError("Failed to refine content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Layers size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              SocialSync AI
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full h-[calc(100vh-64px)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Left Panel: Editor */}
          <div className="lg:col-span-5 h-full">
            <Editor 
              baseText={baseText}
              setBaseText={setBaseText}
              images={images}
              setImages={setImages}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>

          {/* Right Panel: Preview */}
          <div className="lg:col-span-7 h-full">
            <Preview 
              generatedContent={generatedContent}
              images={images}
              onRefine={handleRefine}
              isRefining={isGenerating}
            />
          </div>

        </div>
      </main>
      
      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg shadow-lg border border-red-200 flex items-center gap-2 animate-bounce">
          <span className="font-bold">Error:</span> {error}
          <button onClick={() => setError(null)} className="ml-2 hover:text-red-800">&times;</button>
        </div>
      )}
    </div>
  );
};

export default App;