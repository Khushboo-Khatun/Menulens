/**
 * Utility to compress and resize images client-side before uploading.
 * Resizes the longest side to max 1400px and exports as JPEG quality 0.75,
 * keeping the payload well under Vercel's 4.5MB serverless limit.
 */
export async function compressImage(
  fileOrBlob: File | Blob,
  maxDimension = 1400,
  quality = 0.75
): Promise<{ blob: Blob; previewUrl: string }> {
  return new Promise((resolve) => {
    // SSR safety check
    if (typeof window === "undefined" || !window.URL) {
      const fallbackUrl = URL.createObjectURL(fileOrBlob);
      resolve({ blob: fileOrBlob, previewUrl: fallbackUrl });
      return;
    }

    const objectUrl = URL.createObjectURL(fileOrBlob);
    const img = new Image();

    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          resolve({ blob: fileOrBlob, previewUrl: objectUrl });
          return;
        }

        // Calculate aspect-ratio preserving dimensions
        const longestSide = Math.max(width, height);
        if (longestSide > maxDimension) {
          const scale = maxDimension / longestSide;
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({ blob: fileOrBlob, previewUrl: objectUrl });
          return;
        }

        // Fill white background for transparent PNGs before converting to JPEG
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Revoke the raw large image url to save mobile memory
              URL.revokeObjectURL(objectUrl);
              const compressedPreview = URL.createObjectURL(blob);
              resolve({ blob, previewUrl: compressedPreview });
            } else {
              resolve({ blob: fileOrBlob, previewUrl: objectUrl });
            }
          },
          "image/jpeg",
          quality
        );
      } catch (err) {
        console.error("Canvas image compression failed, falling back to original:", err);
        resolve({ blob: fileOrBlob, previewUrl: objectUrl });
      }
    };

    img.onerror = (err) => {
      console.error("Image loading failed during compression:", err);
      resolve({ blob: fileOrBlob, previewUrl: objectUrl });
    };

    img.src = objectUrl;
  });
}
