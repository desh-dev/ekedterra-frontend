import imageCompression from 'browser-image-compression';

export interface ImageCompressionOptions {
  maxSizeMB?: number; // (default: Number.POSITIVE_INFINITY)
  maxWidthOrHeight?: number; // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
  useWebWorker?: boolean; // optional, use multi-thread web worker, fallback to run in main-thread (default: true)
  maxIteration?: number; // optional, max number of iteration to compress the image (default: 10)
  fileType?: string; // optional, fileType override e.g., 'image/jpeg', 'image/png' (default: file.type)
  initialQuality?: number; // optional, initial quality value between 0 and 1 (default: 1)
  alwaysKeepResolution?: boolean; // optional, only compress images with higher resolution than maxWidthOrHeight (default: false)
}

/**
 * Compresses an image file with the given options
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns A promise that resolves to the compressed File object
 */
export async function compressImage(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<File> {
  const defaultOptions: ImageCompressionOptions = {
    maxSizeMB: 1, // Maximum file size in MB (1MB)
    maxWidthOrHeight: 1920, // Maximum width or height
    useWebWorker: true, // Use web worker for better performance
    initialQuality: 0.8, // Initial quality (0.8 = 80%)
    ...options,
  };

  try {
    const compressedFile = await imageCompression(file, defaultOptions);
    
    // Create a new file with the compressed data
    return new File([compressedFile], file.name, {
      type: file.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('Error compressing image:', error);
    // Return original file if compression fails
    return file;
  }
}

/**
 * Checks if a file is an image
 * @param file - The file to check
 * @returns boolean indicating if the file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}
