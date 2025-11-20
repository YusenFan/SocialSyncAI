import React, { useState } from 'react';
import { Platform, SocialPostContent, UploadedImage } from '../types';
import TwitterCard from './TwitterCard';
import XiaohongshuCard from './XiaohongshuCard';
import { Twitter, Check, Send, Sparkles } from 'lucide-react';

// A simple red book icon for XHS since Lucide doesn't have one
const XHSIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zM18 18H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V8h12v2z" />
  </svg>
);

interface PreviewProps {
  generatedContent: SocialPostContent | null;
  images: UploadedImage[];
  onRefine: (instruction: string) => void;
  isRefining: boolean;
}

const Preview: React.FC<PreviewProps> = ({ generatedContent, images, onRefine, isRefining }) => {
  const [activeTab, setActiveTab] = useState<Platform>(Platform.TWITTER);
  const [publishedState, setPublishedState] = useState<Record<Platform, boolean>>({
    [Platform.TWITTER]: false,
    [Platform.XIAOHONGSHU]: false
  });
  const [refineInput, setRefineInput] = useState('');

  const handlePublish = () => {
    // Mock publish action
    setPublishedState(prev => ({...prev, [activeTab]: true}));
    setTimeout(() => {
      setPublishedState(prev => ({...prev, [activeTab]: false}));
      alert(`Successfully published to ${activeTab === Platform.TWITTER ? 'Twitter' : 'Xiaohongshu'}!`);
    }, 1500);
  };

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (refineInput.trim() && !isRefining) {
      onRefine(refineInput);
      setRefineInput('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
      {/* Tab Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
        <div className="flex bg-slate-200 rounded-lg p-1">
          <button
            onClick={() => setActiveTab(Platform.TWITTER)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === Platform.TWITTER
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Twitter size={16} className={activeTab === Platform.TWITTER ? 'text-[#1da1f2]' : ''} />
            Twitter
          </button>
          <button
            onClick={() => setActiveTab(Platform.XIAOHONGSHU)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === Platform.XIAOHONGSHU
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className={activeTab === Platform.XIAOHONGSHU ? 'text-[#ff2442]' : ''}>
               <XHSIcon />
            </span>
            Xiaohongshu
          </button>
        </div>

        <button 
           onClick={handlePublish}
           disabled={!generatedContent}
           className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors flex items-center gap-2 ${
             !generatedContent ? 'bg-slate-300 cursor-not-allowed' : 
             activeTab === Platform.TWITTER 
               ? 'bg-[#1da1f2] hover:bg-[#1a91da]' 
               : 'bg-[#ff2442] hover:bg-[#e01f3a]'
           }`}
        >
           {publishedState[activeTab] ? <Check size={16} /> : null}
           {publishedState[activeTab] ? 'Posted' : `Post to ${activeTab === Platform.TWITTER ? 'Twitter' : 'XHS'}`}
        </button>
      </div>

      {/* Preview Area */}
      <div className="flex-grow bg-slate-100/50 p-6 overflow-y-auto flex items-center justify-center relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 w-full">
          {activeTab === Platform.TWITTER ? (
            <TwitterCard 
              content={generatedContent?.twitter.content || ''} 
              hashtags={generatedContent?.twitter.hashtags || []}
              images={images}
            />
          ) : (
            <XiaohongshuCard 
              title={generatedContent?.xiaohongshu.title || ''}
              content={generatedContent?.xiaohongshu.content || ''}
              tags={generatedContent?.xiaohongshu.tags || []}
              images={images}
            />
          )}
        </div>
      </div>

      {/* Refinement Input Area */}
      <div className="p-4 border-t border-slate-100 bg-white flex-shrink-0">
        <form onSubmit={handleRefineSubmit} className="relative">
          <input
            type="text"
            value={refineInput}
            onChange={(e) => setRefineInput(e.target.value)}
            placeholder={generatedContent ? "Suggest changes (e.g., 'Add more emojis', 'Make it shorter')..." : "Generate content first to refine..."}
            disabled={!generatedContent || isRefining}
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-700 placeholder-slate-400 transition-all"
          />
          <button
            type="submit"
            disabled={!generatedContent || !refineInput.trim() || isRefining}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-colors ${
               !generatedContent || !refineInput.trim() || isRefining 
               ? 'text-slate-300 cursor-not-allowed' 
               : 'text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            {isRefining ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
        {generatedContent && (
          <div className="mt-2 flex gap-2 text-xs text-slate-500 overflow-x-auto pb-1">
            <button onClick={() => onRefine("Make it shorter")} className="whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors flex items-center gap-1">
              <Sparkles size={10} /> Shorter
            </button>
            <button onClick={() => onRefine("Make it more professional")} className="whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors flex items-center gap-1">
              <Sparkles size={10} /> Professional
            </button>
            <button onClick={() => onRefine("Add more emojis")} className="whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors flex items-center gap-1">
              <Sparkles size={10} /> More Emojis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
