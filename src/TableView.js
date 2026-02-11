import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getAudioSrc, getCoverSrc } from "./utils"; // используем утилиты

const API_URL = process.env.REACT_APP_API_URL + "/songs";

function TableView({ lang, seed, likes, songs, setSongs }) {
  const [page, setPage] = useState(1);
  const [expandedSong, setExpandedSong] = useState(null);

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
    };
    fetchSongs();
  }, [page, lang, seed, likes, setSongs]);

  return (
    <div className="container mt-4">
      <table className="table table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Song</th>
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
                          {getCoverSrc(song) ? (
                            <img
                              src={getCoverSrc(song)}
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
                            {song.duration && (
                              <p className="card-text">
                                <b>Duration:</b>{" "}
                                {Math.floor(song.duration / 60)}:
                                {String(song.duration % 60).padStart(2, "0")}
                              </p>
                            )}
                            {song.review && (
                              <p className="card-text">
                                <b>Review:</b> {song.review}
                              </p>
                            )}

                            {getAudioSrc(song) && (
                              <audio
                                controls
                                src={getAudioSrc(song)}
                                style={{ width: "100%" }}
                              />
                            )}
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
          <i className="fa-solid fa-arrow-left"></i> Prev
        </button>
        <span>Page {page}</span>
        <button
          className="btn btn-outline-secondary"
          onClick={() => setPage((p) => p + 1)}
        >
          Next <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

export default TableView;
