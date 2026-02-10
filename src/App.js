import React, { useState } from "react";
import Toolbar from "./Toolbar";
import TableView from "./TableView";
import GalleryView from "./GalleryView";
import 'bootstrap/dist/css/bootstrap.min.css';
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
/>

function App() {
  const [viewMode, setViewMode] = useState("table");
  const [lang, setLang] = useState("en");
  const [seed, setSeed] = useState(12345);
  const [likes, setLikes] = useState(3.7);
  const [songs, setSongs] = useState([]);
  return (
    <div style={{ padding: "20px" }}>
      <h1>🎵 Music Store Showcase</h1>

      {/* Панель управления */}
      <Toolbar
        lang={lang}
        setLang={setLang}
        seed={seed}
        setSeed={setSeed}
        likes={likes}
        setLikes={setLikes}
        songs={songs}
      />

      {/* Переключение режимов */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setViewMode("table")}>Table View</button>
        <button onClick={() => setViewMode("gallery")}>Gallery View</button>
      </div>

      {viewMode === "table" ? (
        <TableView key={`table-${seed}`} lang={lang} seed={seed} likes={likes} songs={songs} setSongs={setSongs}/>
      ) : (
        <GalleryView key={`gallery-${seed}`} lang={lang} seed={seed} likes={likes} songs={songs} setSongs={setSongs}/>
      )}
    </div>
  );
}

export default App;
