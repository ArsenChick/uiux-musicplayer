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

export const toPercentString = (value: number) => {
  const percentStr = Math.ceil(value * 100).toString();
  if (percentStr.length === 1) {
    return `0${percentStr}`;
  }

  return percentStr;
};

export const getVolumeIconName = (volume: number) => {
  if (volume === 0) return 'Volume0';
  if (volume < 0.33) return 'Volume1';
  if (volume < 0.67) return 'Volume2';
  return 'Volume3';
};
