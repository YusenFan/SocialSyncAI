import React from 'react';
import { Heart, Star, MessageCircle } from 'lucide-react';
import { UploadedImage } from '../types';

interface XiaohongshuCardProps {
  title: string;
  content: string;
  tags: string[];
  images: UploadedImage[];
}

const XiaohongshuCard: React.FC<XiaohongshuCardProps> = ({ title, content, tags, images }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-[32px] max-w-[375px] w-full mx-auto overflow-hidden shadow-xl h-[700px] flex flex-col font-sans">
      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto bg-white scrollbar-hide">
        {/* Image Display - Adaptive aspect ratio */}
        <div className="w-full bg-slate-50 relative overflow-hidden min-h-[200px]">
             {images && images.length > 0 ? (
               <img src={images[0].previewUrl} alt="XHS Main" className="w-full h-auto object-contain block" />
             ) : (
               <div className="w-full h-[300px] flex items-center justify-center text-gray-300 bg-slate-50">
                 No Image
               </div>
             )}
             {images.length > 1 && (
               <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                 1/{images.length}
               </div>
             )}
        </div>

        {/* Post Body */}
        <div className="p-4 pb-20">
          <h1 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
            {title || "Your engaging title goes here..."}
          </h1>
          <p className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-wrap mb-4">
             {content || "The AI generated content optimized for lifestyle and storytelling will appear in this section."}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {tags && tags.map((tag, i) => (
              <span key={i} className="text-blue-800 text-sm">#{tag.replace('#', '')}</span>
            ))}
          </div>
          <div className="text-xs text-gray-400 mb-6">09-15 · Edited</div>
          
           {/* Fake Comments Preview */}
           <div className="border-t border-gray-100 pt-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                <div>
                  <div className="text-xs text-gray-500">User123</div>
                  <div className="text-sm text-gray-800">Love this vibe! 😍</div>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="h-16 border-t border-gray-100 flex items-center justify-between px-6 bg-white flex-shrink-0 sticky bottom-0 z-10">
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full flex-grow mr-4">
          <span className="text-gray-400 text-sm">Say something...</span>
        </div>
        <div className="flex items-center gap-5 text-gray-700">
          <div className="flex flex-col items-center">
            <Heart size={22} />
            <span className="text-[10px] font-medium">1.2k</span>
          </div>
          <div className="flex flex-col items-center">
            <Star size={22} />
            <span className="text-[10px] font-medium">540</span>
          </div>
          <div className="flex flex-col items-center">
            <MessageCircle size={22} />
            <span className="text-[10px] font-medium">89</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XiaohongshuCard;