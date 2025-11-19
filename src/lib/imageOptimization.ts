import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

export interface ImageOptimizationResult {
  url: string;
  width: number;
  height: number;
}

/**
 * Optimize an image buffer and save to disk
 * @param buffer - Image buffer from file upload
 * @param filename - Desired filename (without extension)
 * @returns URL and dimensions of optimized image
 */
export async function optimizeAndSaveImage(
  buffer: Buffer,
  filename: string
): Promise<ImageOptimizationResult> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  // Ensure upload directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  // Get original image metadata
  const image = sharp(buffer);
  const metadata = await image.metadata();

  // Optimize and convert to WebP
  const optimizedFilename = `${filename}.webp`;
  const optimizedPath = path.join(uploadDir, optimizedFilename);

  await image
    .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(optimizedPath);

  // Get dimensions of optimized image
  const optimizedMetadata = await sharp(optimizedPath).metadata();

  return {
    url: `/uploads/${optimizedFilename}`,
    width: optimizedMetadata.width || 0,
    height: optimizedMetadata.height || 0,
  };
}

/**
 * Get image dimensions from buffer
 */
export async function getImageDimensions(
  buffer: Buffer
): Promise<{ width: number; height: number }> {
  const metadata = await sharp(buffer).metadata();
  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
  };
}

/**
 * Delete an image file
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  if (!imageUrl.startsWith('/uploads/')) {
    return; // Only delete local uploads
  }

  const imagePath = path.join(process.cwd(), 'public', imageUrl);
  try {
    await fs.unlink(imagePath);
  } catch (error) {
    console.error('Failed to delete image:', error);
    // Don't throw - image might already be deleted
  }
}
