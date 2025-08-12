export function isValidImage(file) {
  const isJPG = file.type === 'image/jpeg';
  const isPNG = file.type === 'image/png';

  return (isJPG || isPNG);
}

export function isAllowedImageSize(file) {
  // image < 512kb
  return file.size / 1024 < 512;
}

export function compressImage(file) {
  const MAX_WIDTH = 1024;
  const MAX_HEIGHT = 1024;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(event) {
      const img = new Image();
      img.src = event.target.result;
      img.onload = function() {
        var width = img.width;
        var height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round(height *= MAX_WIDTH / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round(width *= MAX_HEIGHT / height);
            height = MAX_HEIGHT;
          }
        }

        img.width = width;
        img.height = height;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(canvasBlob => {
          const newFile = new File([canvasBlob], `-compressed.jpeg`);
          resolve(newFile);
        }, 'image/jpeg', 0.7);
      };
    };
  });
}
