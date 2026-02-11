import React, { useState, useEffect } from "react";
import Toolbar from "./Toolbar";
import TableView from "./TableView";
import GalleryView from "./GalleryView";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  // IMPORTANT: UI mode (table or gallery)
  const [viewMode, setViewMode] = useState("table");

  // IMPORTANT: generation parameters
  const [lang, setLang] = useState("en");
  const [seed, setSeed] = useState(12345);
  const [likes, setLikes] = useState(3.7);

  // IMPORTANT: separate state for table and gallery
  const [tableSongs, setTableSongs] = useState([]);
  const [gallerySongs, setGallerySongs] = useState([]);

  // IMPORTANT: shared pagination state for TableView
  const [page, setPage] = useState(1);

  // IMPORTANT: reset pagination when generation parameters change
  useEffect(() => {
    setPage(1);
  }, [lang, seed, likes]);

  return (
    <div className="container py-4">
      <h1 className="mb-4">
        <i className="fa-solid fa-music"></i> Music Store Showcase
      </h1>

      {/* IMPORTANT: top toolbar with language, seed, likes, export */}
      <Toolbar
        lang={lang}
        setLang={setLang}
        seed={seed}
        setSeed={setSeed}
        likes={likes}
        setLikes={setLikes}
        page={page}
        tableSongs={tableSongs}
        gallerySongs={gallerySongs}
        viewMode={viewMode}
      />

      {/* IMPORTANT: view mode switch */}
      <div className="d-flex gap-3 mb-4">
        <button
          className={`btn ${
            viewMode === "table" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setViewMode("table")}
        >
          <i className="fa-solid fa-table"></i>
        </button>

        <button
          className={`btn ${
            viewMode === "gallery" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setViewMode("gallery")}
        >
          <i className="fa-solid fa-th"></i>
        </button>
      </div>

      {/* IMPORTANT: render selected view */}
      {viewMode === "table" ? (
        <TableView
          lang={lang}
          seed={seed}
          likes={likes}
          songs={tableSongs}
          setSongs={setTableSongs}
          page={page}
          setPage={setPage}
        />
      ) : (
        <GalleryView
          lang={lang}
          seed={seed}
          likes={likes}
          songs={gallerySongs}
          setSongs={setGallerySongs}
          page={page}
          setPage={setPage}
        />
      )}
    </div>
  );
}

export default App;
