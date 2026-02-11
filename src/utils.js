export function audioBytesToBase64(bytes) {
  if (!bytes || bytes.length === 0) return null;
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.slice(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary);
}

export function getAudioSrc(song) {
  if (!song.audioPreview) return null;
  if (typeof song.audioPreview === "string") {
    return `data:audio/wav;base64,${song.audioPreview}`;
  }
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

// 👉 обновлённая функция для обложки
export function getCoverSrc(song) {
  if (song.coverImageUrl) {
    // лениво загруженная обложка (URL от бэка)
    return song.coverImageUrl;
  }
  if (song.coverImageBase64) {
    // fallback: если бэк вернул base64
    return `data:image/png;base64,${song.coverImageBase64}`;
  }
  return null;
}
