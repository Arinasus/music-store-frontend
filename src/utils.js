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
  const base64 = audioBytesToBase64(song.audioPreview);
  return base64 ? `data:audio/wav;base64,${base64}` : null;
}

/**
 * Возвращает готовый src для <img>.
 */
export function getCoverSrc(song) {
  return song.coverImageBase64
    ? `data:image/png;base64,${song.coverImageBase64}`
    : null;
}
