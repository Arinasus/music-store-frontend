import React, { useState, useEffect } from "react";
import { playSong, generateReview, generateCover } from "./utils";
import "@fortawesome/fontawesome-free/css/all.min.css"; // иконки Font Awesome

const API_URL = process.env.REACT_APP_API_URL + "/songs";

function GalleryView({ lang, seed, likes }) {
  const [songs, setSongs] = useState([]);
  const [covers, setCovers] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    setSongs([]);
    setCovers({});
    setPage(1);
    window.scrollTo(0, 0);
  }, [lang, seed, likes]);

  // loading songs
  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_URL}?page=${page}&lang=${lang}&seed=${seed}&likes=${likes}&count=10`
        );
        if (!res.ok) throw new Error("Failed to fetch songs");
        const data = await res.json();
        setSongs((prev) => [...prev, ...data]);

        data.forEach((song, idx) => {
          generateCover(song, idx, seed).then((src) => {
            setCovers((prev) => ({ ...prev, [song.index]: src }));
          });
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [page, lang, seed, likes]);

  // scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (
        !loading &&
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100
      ) {
        setPage((p) => p + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  // change volume
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    import("tone").then((Tone) => {
      Tone.Destination.volume.value = Tone.gainToDb(e.target.value / 100);
    });
  };

  return (
    <div className="container mt-4">
      <div className="row g-4">
        {songs.map((song, idx) => (
          <div
            className="col-sm-6 col-md-4 col-lg-3"
            key={`gallery-${song.index}-${page}-${seed}-${idx}`}
          >
            <div className="card h-100 shadow-sm">
              <div
                className="card-img-top d-flex justify-content-center align-items-center"
                style={{ height: "180px" }}
              >
                {covers[song.index] ? (
                  <img
                    src={covers[song.index]}
                    alt="Album cover"
                    className="img-fluid rounded"
                    style={{ maxHeight: "160px" }}
                  />
                ) : (
                  <span>Loading cover...</span>
                )}
              </div>
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

                <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={() => {
                    import("tone").then((Tone) => Tone.start());
                    playSong(seed, song.index);
                  }}
                >
                  <i className="fa-solid fa-play"></i> Play
                </button>

                <div className="mb-2">
                  <label htmlFor={`volume-${song.index}`} className="form-label">
                    <i className="fa-solid fa-volume-high"></i> Volume
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    id={`volume-${song.index}`}
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {loading && (
        <div className="text-center mt-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryView;
