export const fromSecondsToFormattedTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;

  return `${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
};

export const fromFileToBlobSrc = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    try {
      reader.onload = () => {
        resolve(reader.result);
      };

      reader.readAsDataURL(file);
    } catch (e) {
      reject(e);
    }
  });
};

export const isAudioType = (file: File) => {
  return file.type.includes('audio');
};
