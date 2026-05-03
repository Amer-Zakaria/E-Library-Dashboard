export async function convertToWebP(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) {
    return file; // Not an image, return as is
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const webpFileName = file.name.split('.').slice(0, -1).join('.') + '.webp';
              const webpFile = new File([blob], webpFileName, {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(webpFile);
            } else {
              resolve(file); // Fallback if blob creation fails
            }
          },
          'image/webp',
          0.8 // Quality setting for WebP
        );
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
