import React, { useState, useEffect } from "react";
import { playSong, generateReview, generateCover } from "./utils";
import "bootstrap/dist/css/bootstrap.min.css";

function TableView({ lang, seed, likes, songs, setSongs }) {
  const [covers, setCovers] = useState({});
  const [page, setPage] = useState(1);
  const [expandedSong, setExpandedSong] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL + "/songs";

  useEffect(() => {
    setPage(1);
    setExpandedSong(null);
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
    <div className="container mt-4">
      <table className="table table-hover table-bordered">
        <thead className="table-dark">
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
                className={expandedSong === song.index ? "table-active" : ""}
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
                    <div className="card mb-3 shadow-sm">
                      <div className="row g-0">
                        <div className="col-md-3 d-flex align-items-center justify-content-center">
                          {covers[song.index] ? (
                            <img
                              src={covers[song.index]}
                              alt="Album cover"
                              className="img-fluid rounded"
                            />
                          ) : (
                            <p>Loading cover...</p>
                          )}
                        </div>
                        <div className="col-md-9">
                          <div className="card-body">
                            <h5 className="card-title">{song.title}</h5>
                            <p className="card-text"><b>Artist:</b> {song.artist}</p>
                            <p className="card-text"><b>Album:</b> {song.album}</p>
                            <p className="card-text"><b>Genre:</b> {song.genre}</p>
                            <p className="card-text"><b>Likes:</b> {song.likes}</p>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                import("tone").then((Tone) => Tone.start());
                                playSong(seed, song.index);
                              }}
                            >
                              ▶️ Play
                            </button>
                            <p className="card-text mt-2 fst-italic">
                              {generateReview()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          className="btn btn-outline-secondary"
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default TableView;
