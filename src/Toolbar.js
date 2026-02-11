import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const API_URL = process.env.REACT_APP_API_URL + "/songs";

function Toolbar({
  lang,
  setLang,
  seed,
  setSeed,
  likes,
  setLikes,
  page,
  tableSongs,
  gallerySongs,
  viewMode
}) {
  // IMPORTANT: generate a new random seed
  const generateRandomSeed = () => {
    const randomSeed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    setSeed(randomSeed);
  };

  // IMPORTANT: export ZIP depending on active view mode
  const exportZip = async () => {
    const payload =
      viewMode === "table"
        ? {
            page,
            lang,
            seed,
            likes,
            count: 10
          }
        : {
            page: 1,
            lang,
            seed,
            likes,
            count: gallerySongs.length
          };

    const res = await fetch(`${API_URL}/exportZip`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      console.error("Export failed", res.statusText);
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "songs.zip";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div
      className="
        d-flex 
        flex-wrap 
        align-items-center 
        justify-content-center 
        gap-3 
        mb-4
      "
    >
      {/* Language selector */}
      <div className="d-flex flex-column align-items-center">
        <label className="form-label mb-1">
          <i className="fa-solid fa-language"></i>
        </label>
        <select
          className="form-select"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          style={{ minWidth: "140px" }}
        >
          <option value="en">English (USA)</option>
          <option value="de">Deutsch (Germany)</option>
          <option value="uk">Українська (Ukraine)</option>
        </select>
      </div>

      {/* Seed input */}
      <div className="d-flex flex-column align-items-center">
        <label className="form-label mb-1">
          <i className="fa-solid fa-seedling"></i>
        </label>
        <input
          type="number"
          className="form-control"
          value={seed}
          onChange={(e) => setSeed(Number(e.target.value))}
          style={{ minWidth: "160px" }}
        />
      </div>

      {/* Random seed button */}
      <button className="btn btn-outline-secondary" onClick={generateRandomSeed}>
        <i className="fa-solid fa-shuffle"></i> Random
      </button>

      {/* Likes slider */}
      <div className="d-flex flex-column align-items-center" style={{ minWidth: "160px" }}>
        <label className="form-label mb-1">
          <i className="fa-solid fa-heart"></i> Likes
        </label>
        <input
          type="range"
          className="form-range"
          step="0.1"
          min="0"
          max="10"
          value={likes}
          onChange={(e) => setLikes(parseFloat(e.target.value))}
        />
        <span>{likes}</span>
      </div>

      {/* Export ZIP */}
      <button className="btn btn-success" onClick={exportZip}>
        <i className="fa-solid fa-file-zipper"></i> Export ZIP
      </button>
    </div>
  );
}

export default Toolbar;
