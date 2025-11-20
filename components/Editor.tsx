import React, { useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { UploadedImage } from '../types';

interface EditorProps {
  baseText: string;
  setBaseText: (text: string) => void;
  images: UploadedImage[];
  setImages: (images: UploadedImage[] | ((prev: UploadedImage[]) => UploadedImage[])) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const Editor: React.FC<EditorProps> = ({
  baseText,
  setBaseText,
  images,
  setImages,
  onGenerate,
  isGenerating,
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files) as File[];
      
      const newImagesPromises = newFiles.map((file) => {
        return new Promise<UploadedImage>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve({
              file,
              previewUrl: URL.createObjectURL(file),
              base64Data: base64String,
              mimeType: file.type,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newImagesPromises).then((newUploadedImages) => {
        setImages((prev) => [...prev, ...newUploadedImages]);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerateClick = useCallback(() => {
    if (!baseText.trim() && images.length === 0) return;
    onGenerate();
  }, [baseText, images, onGenerate]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
          Create Draft
        </h2>
        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Step 1</span>
      </div>

      <div className="flex-grow flex flex-col gap-4">
        <textarea
          className="w-full flex-grow p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-slate-700 placeholder-slate-400 transition-all"
          placeholder="What's on your mind? Write your core message here..."
          value={baseText}
          onChange={(e) => setBaseText(e.target.value)}
        />

        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square group">
                <img
                  src={img.previewUrl}
                  alt="preview"
                  className="w-full h-full object-cover rounded-lg border border-slate-200"
                />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors text-sm font-medium">
            <ImageIcon size={18} />
            <span>Add Images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
          
          <div className="flex-grow"></div>

          <button
            onClick={handleGenerateClick}
            disabled={isGenerating || (!baseText && images.length === 0)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white shadow-lg shadow-indigo-200 transition-all transform active:scale-95 ${
              isGenerating || (!baseText && images.length === 0)
                ? 'bg-slate-400 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Adaptifying...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Adapt with AI</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editor;