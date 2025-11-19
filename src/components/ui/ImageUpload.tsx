'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Dropzone, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string, width: number, height: number) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, onError, disabled }: ImageUploadProps) {
  const { uploadImage, isUploading, uploadProgress, error, reset } = useImageUpload();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    // Create local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const result = await uploadImage(file);
      onChange(result.url, result.width, result.height);
      setPreviewUrl(null); // Clear local preview, use value prop
    } catch (err) {
      setPreviewUrl(null);
      if (onError) {
        onError(err instanceof Error ? err.message : '上传失败');
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('', 0, 0);
    setPreviewUrl(null);
    reset();
  };

  // Use either the uploaded URL or local preview
  const displayUrl = value || previewUrl;

  return (
    <div className="w-full space-y-2">
      <Dropzone
        accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }}
        maxFiles={1}
        maxSize={10 * 1024 * 1024}
        onDrop={handleDrop}
        onError={(err) => onError?.(err.message)}
        disabled={disabled || isUploading}
        className={cn(
          'relative min-h-[200px] transition-colors',
          displayUrl && 'p-0'
        )}
      >
        {displayUrl ? (
          <div className="relative h-[200px] w-full overflow-hidden rounded-lg">
            <Image
              src={displayUrl}
              alt="预览"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {!isUploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute right-2 top-2 z-10 rounded-full bg-red-500 p-2 text-white shadow-lg transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="删除图片"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                <div className="text-center text-white">
                  <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
                  <p className="text-sm font-medium">上传中...</p>
                  <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-white/30">
                    <div
                      className="h-full bg-white transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                      role="progressbar"
                      aria-valuenow={uploadProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <p className="mt-1 text-xs">{uploadProgress}%</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <DropzoneEmptyState>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <svg
                className="mb-3 h-12 w-12 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mb-2 font-medium text-sm">点击或拖拽图片到此处上传</p>
              <p className="text-muted-foreground text-xs">
                支持 JPEG、PNG、WebP 格式，最大 10MB
              </p>
            </div>
          </DropzoneEmptyState>
        )}
      </Dropzone>

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
