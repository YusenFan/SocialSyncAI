export interface SocialPostContent {
  twitter: {
    content: string;
    hashtags: string[];
  };
  xiaohongshu: {
    title: string;
    content: string;
    tags: string[];
  };
}

export interface UploadedImage {
  file: File;
  previewUrl: string;
  base64Data?: string;
  mimeType: string;
}

export enum Platform {
  TWITTER = 'TWITTER',
  XIAOHONGSHU = 'XIAOHONGSHU'
}

export interface DraftState {
  baseText: string;
  images: UploadedImage[];
  generatedContent: SocialPostContent | null;
  isGenerating: boolean;
  error: string | null;
}