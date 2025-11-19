import { useState } from 'react';

interface UploadResponse {
  url: string;
  width: number;
  height: number;
}

interface UseImageUploadReturn {
  uploadImage: (file: File) => Promise<UploadResponse>;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  reset: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function useImageUpload(): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
  };

  const uploadImage = async (file: File): Promise<UploadResponse> => {
    setError(null);
    setUploadProgress(0);

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      const error = '只支持 JPEG、PNG 和 WebP 格式的图片';
      setError(error);
      throw new Error(error);
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const error = '图片大小不能超过 10MB';
      setError(error);
      throw new Error(error);
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '上传失败');
      }

      const data = await response.json();
      setIsUploading(false);

      return {
        url: data.url,
        width: data.width,
        height: data.height,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '上传失败，请重试';
      setError(errorMessage);
      setIsUploading(false);
      setUploadProgress(0);
      throw new Error(errorMessage);
    }
  };

  return {
    uploadImage,
    isUploading,
    uploadProgress,
    error,
    reset,
  };
}
