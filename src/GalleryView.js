import React, { useState, useEffect } from "react";
import { playSong, generateReview, generateCover } from "./utils"; // используем общую функцию

function GalleryView({ lang, seed, likes }) {
  const [songs, setSongs] = useState([]);
  const [covers, setCovers] = useState({}); // хранение готовых картинок
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:5161/api/songs";

  // сброс при смене параметров
  useEffect(() => {
    setSongs([]);
    setCovers({});
    setPage(1);
  }, [lang, seed, likes]);
    useEffect(() => { 
        window.scrollTo(0, 0); 
    }, [lang, seed, likes]);
  // загрузка песен
  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      const res = await fetch(
        `${API_URL}?page=${page}&lang=${lang}&seed=${seed}&likes=${likes}&count=10`
      );
      const data = await res.json();
      setSongs((prev) => [...prev, ...data]);

      // генерируем обложки асинхронно
      data.forEach((song, idx) => {
        generateCover(song, idx, seed).then((src) => {
          setCovers((prev) => ({ ...prev, [song.index]: src }));
        });
      });

      setLoading(false);
    };
    fetchSongs();
  }, [page, lang, seed, likes]);

  // бесконечная прокрутка
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        setPage((p) => p + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      {songs.map((song, idx) => (
        <div
          key={`gallery-${song.index}-${page}-${seed}-${idx}`}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            width: "200px",
            background: "#f9f9f9",
          }}
        >
          {/* Обложка: градиент + текст + маленький робот */}
          <div style={{ marginBottom: "10px" }}>
            {covers[song.index] ? (
              <img
                src={covers[song.index]}
                alt="Album cover"
                style={{ borderRadius: "8px", width: "150px", height: "150px" }}
              />
            ) : (
              <p>Loading cover...</p>
            )}
          </div>

          <h3>{song.title}</h3>
          <p><b>Artist:</b> {song.artist}</p>
          <p><b>Album:</b> {song.album}</p>
          <p><b>Genre:</b> {song.genre}</p>
          <p><b>Likes:</b> {song.likes}</p>

          <button
            onClick={() => {
              import("tone").then((Tone) => Tone.start());
              playSong(seed, song.index);
            }}
          >
            ▶️ Play
          </button>

          <p style={{ fontStyle: "italic", marginTop: "10px" }}>
            {generateReview()}
          </p>
        </div>
      ))}
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default GalleryView;
