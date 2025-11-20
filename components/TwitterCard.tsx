import React from 'react';
import { MessageCircle, Repeat2, Heart, Share, BarChart2, MoreHorizontal, BadgeCheck } from 'lucide-react';
import { UploadedImage } from '../types';

interface TwitterCardProps {
  content: string;
  hashtags: string[];
  images: UploadedImage[];
}

const TwitterCard: React.FC<TwitterCardProps> = ({ content, hashtags, images }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl max-w-[400px] w-full mx-auto overflow-hidden font-sans text-[15px]">
      <div className="p-4 pb-2 flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
            <img src="https://picsum.photos/200" alt="User Avatar" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Content Column */}
        <div className="flex-grow min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 truncate">
              <span className="font-bold text-gray-900">SocialSync User</span>
              <BadgeCheck size={16} className="text-blue-500 fill-blue-500 text-white" />
              <span className="text-gray-500">@socialsync · 1m</span>
            </div>
            <button className="text-gray-400 hover:text-blue-500 rounded-full p-1 hover:bg-blue-50 transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Text */}
          <div className="mt-1 text-gray-900 whitespace-pre-wrap leading-normal">
            {content || "Your generated tweet will appear here..."}
            {hashtags && hashtags.length > 0 && (
              <div className="mt-2 text-blue-500">
                {hashtags.map((tag, i) => (
                  <span key={i} className="mr-2">#{tag.replace('#', '')}</span>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          {images && images.length > 0 && (
            <div className={`mt-3 grid gap-1 rounded-2xl overflow-hidden border border-gray-200 ${
              images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
            }`}>
              {images.slice(0, 4).map((img, idx) => (
                <div key={idx} className={`relative bg-gray-100 overflow-hidden ${images.length === 1 ? 'aspect-[16/9]' : 'aspect-square'}`}>
                  <img src={img.previewUrl} alt="Post attachment" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Action Bar */}
          <div className="flex justify-between items-center mt-3 text-gray-500 max-w-[350px]">
            <button className="group flex items-center gap-2 hover:text-blue-500 transition-colors">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <MessageCircle size={18} />
              </div>
              <span className="text-xs">24</span>
            </button>
            <button className="group flex items-center gap-2 hover:text-green-500 transition-colors">
              <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                <Repeat2 size={18} />
              </div>
              <span className="text-xs">5</span>
            </button>
            <button className="group flex items-center gap-2 hover:text-pink-500 transition-colors">
              <div className="p-2 rounded-full group-hover:bg-pink-50 transition-colors">
                <Heart size={18} />
              </div>
              <span className="text-xs">182</span>
            </button>
            <button className="group flex items-center gap-2 hover:text-blue-500 transition-colors">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <BarChart2 size={18} />
              </div>
              <span className="text-xs">1.2k</span>
            </button>
            <button className="group flex items-center gap-2 hover:text-blue-500 transition-colors">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <Share size={18} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterCard;