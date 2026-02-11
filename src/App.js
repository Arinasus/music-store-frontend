import React, { use, useState } from "react";
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
  const [songs, setSongs] = useState([]);
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
        gallerySongs={songs}
        page={page} 
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
          key={`table-${seed}`}
          lang={lang}
          seed={seed}
          likes={likes}
          songs={songs}
          page={page}
          setSongs={setSongs}
        />
      ) : (
        <GalleryView
          key={`gallery-${seed}`}
          lang={lang}
          seed={seed}
          likes={likes}
          songs={songs}
          setSongs={setSongs}
          setPage={setPage}
        />
      )}
    </div>
  );
}

export default App;
