/**
 * Image compression utility using HTML Canvas API
 * Compresses images before storage in IndexedDB to reduce storage size
 */

// Configuration constants
export const MAX_IMAGE_WIDTH = 1200; // Maximum width in pixels
export const MAX_IMAGE_SIZE_KB = 500; // Maximum file size in KB
export const DEFAULT_QUALITY = 0.8; // Default JPEG quality (0.0 - 1.0)
export const MIN_QUALITY = 0.5; // Minimum quality (don't compress below this)
const MAX_ITERATIONS = 10; // Maximum compression iterations

export interface CompressionOptions {
  maxWidth?: number;
  quality?: number;
  maxSizeKB?: number;
}

/**
 * Compress an image file using Canvas API
 * @param file - File or Blob to compress
 * @param options - Compression options
 * @returns Promise<Blob> - Compressed image
 */
export async function compressImage(
  file: File | Blob,
  options: CompressionOptions = {}
): Promise<Blob> {
  // Validate input
  if (!file) {
    throw new Error('No file provided');
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Set defaults
  const maxWidth = options.maxWidth ?? MAX_IMAGE_WIDTH;
  let quality = options.quality ?? DEFAULT_QUALITY;
  const maxSizeKB = options.maxSizeKB ?? MAX_IMAGE_SIZE_KB;
  const maxSizeBytes = maxSizeKB * 1024;

  // If file is already small enough, return as-is
  if (file.size <= maxSizeBytes) {
    return file;
  }

  try {
    // Create image from file
    const image = await loadImage(file);

    // Calculate new dimensions
    let width = image.width;
    let height = image.height;

    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    // Create canvas and draw image
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    ctx.drawImage(image, 0, 0, width, height);

    // Convert to Blob with compression
    let compressedBlob: Blob | null = null;
    let iterations = 0;

    while (iterations < MAX_ITERATIONS) {
      compressedBlob = await canvasToBlob(canvas, file.type, quality);

      if (compressedBlob && compressedBlob.size <= maxSizeBytes) {
        break;
      }

      // Reduce quality for next iteration
      quality = Math.max(MIN_QUALITY, quality - 0.1);
      iterations++;
    }

    // If compression failed or produced no result, return original
    if (!compressedBlob) {
      console.warn('Compression failed, returning original file');
      return file;
    }

    // If final result is still larger than max size but we did our best, use it
    if (compressedBlob.size > maxSizeBytes) {
      console.warn(`Could not compress image under ${maxSizeKB}KB, returning ${Math.round(compressedBlob.size / 1024)}KB`);
    }

    return compressedBlob;
  } catch (error) {
    console.error('Image compression error:', error);
    // Return original file if compression fails
    return file;
  }
}

/**
 * Load an image from a File or Blob
 */
function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Convert canvas to Blob with compression
 */
function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}
