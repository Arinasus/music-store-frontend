// IMPORTANT: returns cover image source (URL or base64 fallback)
export function getCoverSrc(song) {
  if (!song) return null;

  // Lazy-loaded cover from backend
  if (song.coverImageUrl) return song.coverImageUrl;

  // Fallback: base64 cover
  if (song.coverImageBase64) {
    return `data:image/png;base64,${song.coverImageBase64}`;
  }

  return null;
}
