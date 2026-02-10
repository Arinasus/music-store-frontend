import React, { useState, useEffect } from "react";
import { playSong, generateReview, generateCover } from "./utils";
import "./TableView.css";

function TableView({ lang, seed, likes, songs, setSongs }) {
  const [covers, setCovers] = useState({});
  const [page, setPage] = useState(1);
  const [selectedSong, setSelectedSong] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL + "/songs";

  useEffect(() => {
    setPage(1);
    setSelectedSong(null);
  }, [lang, seed, likes]);

  useEffect(() => {
    const fetchSongs = async () => {
      const res = await fetch(
        `${API_URL}?page=${page}&lang=${lang}&seed=${seed}&likes=${likes}&count=10`
      );
      const data = await res.json();
      setSongs(data);

      data.forEach((song, idx) => {
        generateCover(song, idx, seed).then((src) => {
          setCovers((prev) => ({ ...prev, [song.index]: src }));
        });
      });
    };
    fetchSongs();
  }, [page, lang, seed, likes, setSongs, API_URL]);

  return (
    <div className="table-view">
      {/* Таблица песен */}
      <table className="song-table">
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
            <tr
              key={`table-${song.index}-${page}-${seed}-${idx}`}
              onClick={() => setSelectedSong(song)}
              style={{ cursor: "pointer" }}
            >
              <td>{song.index}</td>
              <td>{song.title}</td>
              <td>{song.artist}</td>
              <td>{song.album}</td>
              <td>{song.genre}</td>
              <td>{song.likes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Пагинация */}
      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
        <span>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>

      {/* Блок выбранной песни снизу */}
      {selectedSong && (
        <div className="song-details">
          <div className="cover">
            {covers[selectedSong.index] ? (
              <img
                src={covers[selectedSong.index]}
                alt="Album cover"
                style={{ borderRadius: "8px" }}
              />
            ) : (
              <p>Loading cover...</p>
            )}
          </div>
          <div className="info">
            <h3>{selectedSong.title}</h3>
            <p><b>Artist:</b> {selectedSong.artist}</p>
            <p><b>Album:</b> {selectedSong.album}</p>
            <p><b>Genre:</b> {selectedSong.genre}</p>
            <p><b>Likes:</b> {selectedSong.likes}</p>
            <button
              className="play-btn"
              onClick={() => {
                import("tone").then((Tone) => Tone.start());
                playSong(seed, selectedSong.index);
              }}
            >
              ▶️ Play
            </button>
            <p className="review">{generateReview()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableView;
