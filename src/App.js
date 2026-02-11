import React, { useState } from "react";
import Toolbar from "./Toolbar";
import TableView from "./TableView";
import GalleryView from "./GalleryView";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const [viewMode, setViewMode] = useState("table");
  const [lang, setLang] = useState("en");
  const [seed, setSeed] = useState(12345);
  const [likes, setLikes] = useState(3.7);
  const [tableSongs, setTableSongs] = useState([]);
  const [gallerySongs, setGallerySongs] = useState([]);
  const [page, setPage] = useState(1);
  return (
    <div className="container py-4">
      <h1 className="mb-4">
        <i className="fa-solid fa-music"></i> Music Store Showcase
      </h1>

      {/* Панель управления */}
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

      {/* Переключение режимов */}
      <div className="d-flex gap-3 mb-4">
        <button
          className={`btn ${viewMode === "table" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setViewMode("table")}
        >
          <i className="fa-solid fa-table"></i>
        </button>
        <button
          className={`btn ${viewMode === "gallery" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setViewMode("gallery")}
        >
          <i className="fa-solid fa-th"></i>
        </button>
      </div>

      {viewMode === "table" ? (
        <TableView
          lang={lang}
          seed={seed}
          likes={likes}
          songs={tableSongs}
          page={page}
          setSongs={setTableSongs}
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
