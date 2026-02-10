// utils.js

/**
 * Преобразует массив байтов (song.audioPreview) в base64 строку,
 * чтобы можно было вставить в <audio src="...">.
 */
export function audioBytesToBase64(bytes) {
  if (!bytes || bytes.length === 0) return null;
  let binary = "";
  const chunkSize = 0x8000; // оптимизация для больших массивов
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.slice(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary);
}

/**
 * Возвращает готовый src для <audio>.
 */
export function getAudioSrc(song) {
  if (!song.audioPreview) return null;

  // если это уже строка base64
  if (typeof song.audioPreview === "string") {
    return `data:audio/wav;base64,${song.audioPreview}`;
  }

  // если это массив чисел
  if (Array.isArray(song.audioPreview)) {
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < song.audioPreview.length; i += chunkSize) {
      const chunk = song.audioPreview.slice(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, chunk);
    }
    return `data:audio/wav;base64,${btoa(binary)}`;
  }

  return null;
}


/**
 * Возвращает готовый src для <img>.
 */
export function getCoverSrc(song) {
  return song.coverImageBase64
    ? `data:image/png;base64,${song.coverImageBase64}`
    : null;
}
