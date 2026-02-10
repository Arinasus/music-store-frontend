import React from "react";
import { generateNotes } from "./utils";

function Toolbar({ lang, setLang, seed, setSeed, likes, setLikes, songs }) {
  const generateRandomSeed = () => {
    const randomSeed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    setSeed(randomSeed);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
        alignItems: "center",
      }}
    >
      {/* Язык */}
      <select value={lang} onChange={(e) => setLang(e.target.value)}>
        <option value="en">English (USA)</option>
        <option value="de">Deutsch (Germany)</option>
        <option value="uk">Українська (Ukraine)</option>
      </select>

      {/* Seed */}
      <input
        type="number"
        value={seed}
        onChange={(e) => setSeed(Number(e.target.value))}
        style={{ width: "200px" }}
      />
      <button onClick={generateRandomSeed}>Random Seed</button>

      {/* Likes */}
      <input
        type="number"
        step="0.1"
        min="0"
        max="10"
        value={likes}
        onChange={(e) => setLikes(parseFloat(e.target.value))}
        style={{ width: "100px" }}
      />

    {/* Export ZIP */}
      <button
  onClick={async () => {
    const songsWithNotes = songs.map((song) => ({
      ...song,
      notes: generateNotes(seed, song.index),
    }));

    const res = await fetch("http://localhost:5161/api/songs/exportZip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(songsWithNotes),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "songs.zip";
    a.click();
    window.URL.revokeObjectURL(url);
  }}
>
  💾 Export ZIP
</button>

      </div>
  );
}

export default Toolbar;
