import React, { useState, useEffect } from "react";
import { playSong, generateReview, generateCover} from "./utils";

function TableView({ lang, seed, likes, songs, setSongs }) {
  const [covers, setCovers] = useState({});
  const [page, setPage] = useState(1);
  const [expandedSong, setExpandedSong] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL + "/songs";
    useEffect(() => { 
        setPage(1); // всегда возвращаемся на первую страницу 
        setExpandedSong(null); // закрываем раскрытые строки 
    }, [lang, seed, likes]);

  useEffect(() => {
    const fetchSongs = async () => {
      const res = await fetch(
        `${API_URL}?page=${page}&lang=${lang}&seed=${seed}&likes=${likes}&count=10`
      );
      const data = await res.json();
      setSongs(data);

      // генерируем обложки асинхронно
      data.forEach((song, idx) => {
        generateCover(song, idx, seed).then((src) => {
          setCovers((prev) => ({ ...prev, [song.index]: src }));
        });
      });
    };
    fetchSongs();
  }, [page, lang, seed, likes, setSongs]);

  return (
    <>
      <table border="1" cellPadding="5" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Genre</th>
            <th>Likes</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, idx) => (
            <React.Fragment key={`table-${song.index}-${page}-${seed}-${idx}`}>
              <tr
                onClick={() =>
                  setExpandedSong(expandedSong === song.index ? null : song.index)
                }
                style={{ cursor: "pointer" }}
              >
                <td>{song.index}</td>
                <td>{song.title}</td>
                <td>{song.artist}</td>
                <td>{song.album}</td>
                <td>{song.genre}</td>
                <td>{song.likes}</td>
              </tr>

              {expandedSong === song.index && (
                <tr>
                  <td colSpan="6">
                    <div
                      style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        width: "220px",
                        background: "#f9f9f9",
                      }}
                    >
                      {/* Обложка */}
                      <div style={{ display: "flex", gap: "10px" }}>
                        {covers[song.index] ? (
                          <img
                            src={covers[song.index]}
                            alt="Album cover"
                            style={{ borderRadius: "8px" }}
                          />
                        ) : (
                          <p>Loading cover...</p>
                        )}
                      </div>

                      <div>
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
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
        <span style={{ margin: "0 10px" }}>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </>
  );
}

export default TableView;
