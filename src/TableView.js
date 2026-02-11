import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const API_URL = process.env.REACT_APP_API_URL + "/songs";

function TableView({ lang, seed, likes, songs, setSongs, page, setPage }) {
  const [expandedSong, setExpandedSong] = useState(null);
  const [loading, setLoading] = useState(false);

  // IMPORTANT: load table page
  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `${API_URL}?page=${page}&lang=${lang}&seed=${seed}&likes=${likes}&count=10`
        );

        const data = await res.json();
        setSongs(data);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [page, lang, seed, likes, setSongs]);

  // IMPORTANT: load cover lazily
  const fetchCover = async (songId) => {
    const res = await fetch(`${API_URL}/${songId}/cover`);
    const data = await res.json();

    setSongs((prev) =>
      prev.map((s) =>
        s.index === songId ? { ...s, coverImageUrl: data.cover } : s
      )
    );
  };

  return (
    <div className="container mt-4">

      {loading && (
        <div className="alert alert-info text-center">Loading songs…</div>
      )}

      {/* IMPORTANT: responsive table wrapper */}
      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-dark text-center">
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
            {songs.map((song) => (
              <React.Fragment key={`row-${song.index}`}>
                <tr
                  onClick={() => {
                    const newExpanded =
                      expandedSong === song.index ? null : song.index;
                    setExpandedSong(newExpanded);

                    if (newExpanded && !song.coverImageUrl) {
                      fetchCover(song.index);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                  className={expandedSong === song.index ? "table-active" : ""}
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
                      <div className="card shadow-sm p-3">

                        <div className="row g-3">
                          <div className="col-md-3 text-center">
                            {song.coverImageUrl ? (
                              <img
                                src={song.coverImageUrl}
                                alt="Cover"
                                className="img-fluid rounded"
                              />
                            ) : (
                              <p>Loading cover...</p>
                            )}
                          </div>

                          <div className="col-md-9">
                            <h5>{song.title}</h5>
                            <p><b>Artist:</b> {song.artist}</p>
                            <p><b>Album:</b> {song.album}</p>
                            <p><b>Genre:</b> {song.genre}</p>
                            <p><b>Likes:</b> {song.likes}</p>

                            {song.duration && (
                              <p>
                                <b>Duration:</b>{" "}
                                {Math.floor(song.duration / 60)}:
                                {String(song.duration % 60).padStart(2, "0")}
                              </p>
                            )}

                            <audio
                              controls
                              src={`${API_URL}/${song.index}/audio`}
                              style={{ width: "100%" }}
                            />
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
      </div>

      {/* Pagination */}
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
