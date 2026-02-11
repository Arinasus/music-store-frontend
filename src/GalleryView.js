import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getAudioSrc, getCoverSrc } from "./utils";

const API_URL = process.env.REACT_APP_API_URL + "/songs";

function GalleryView({ lang, seed, likes }) {
  const [songs, setSongs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // сбрасываем список при смене параметров
  useEffect(() => {
    setSongs([]);
    setPage(1);
    window.scrollTo(0, 0);
  }, [lang, seed, likes]);

  // загрузка песен
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [page, lang, seed, likes]);

  // бесконечный скролл
  useEffect(() => {
    const handleScroll = () => {
      if (
        !loading &&
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200
      ) {
        setPage((p) => p + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div className="container mt-4">

      {/* Индикатор загрузки при первой загрузке */}
      {loading && page === 1 && (
        <div className="text-center mb-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

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
                {getCoverSrc(song) ? (
                  <img
                    src={getCoverSrc(song)}
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
        ))}
      </div>

      {/* Индикатор загрузки при догрузке страниц */}
      {loading && page > 1 && (
        <div className="text-center mt-3 mb-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading more...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryView;
