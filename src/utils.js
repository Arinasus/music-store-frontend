import * as Tone from "tone";
import seedrandom from "seedrandom";

export function generateNotes(seed, index) {
  const rng = seedrandom(seed + "-" + index);
  const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];
  const sequence = [];
  for (let i = 0; i < 8; i++) {
    const noteIndex = Math.floor(rng() * notes.length);
    sequence.push(notes[noteIndex]);
  }
  return sequence;
}

export function playSong(notes) { Tone.start().then(() => { const synth = new Tone.Synth().toDestination(); let time = Tone.now(); notes.forEach((note) => { synth.triggerAttackRelease(note, "8n", time); time += 0.5; }); }); }

// Generate Canvas 
export function generateCover(song, idx, seed) { 
return new Promise((resolve) => { 
    const canvas = document.createElement("canvas"); 
    canvas.width = 150; canvas.height = 150; 
    const ctx = canvas.getContext("2d"); // Безопасное вычисление цвета 
    const color1 = Math.abs((seed + idx) * 123456).toString(16).padStart(6, "0").slice(0, 6); 
    const color2 = Math.abs((seed + song.index) * 654321).toString(16).padStart(6, "0").slice(0, 6); 
    const gradient = ctx.createLinearGradient(0, 0, 150, 150); 
    gradient.addColorStop(0, `#${color1}`); 
    gradient.addColorStop(1, `#${color2}`); 
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 150, 150); // Текст 
    ctx.fillStyle = "white"; ctx.font = "bold 12px Arial"; 
    const wrapText = (text, x, y, maxWidth, lineHeight, maxLines = 3) => { 
        const words = text.split(" "); let line = ""; 
        let lineCount = 0; for (let n = 0; n < words.length; n++) { 
            const testLine = line + words[n] + " "; const metrics = ctx.measureText(testLine); 
            if (metrics.width > maxWidth && n > 0) { 
                ctx.fillText(line, x, y); 
                line = words[n] + " "; y += lineHeight; lineCount++; if (lineCount >= maxLines - 1) { 
                    ctx.fillText(line + "...", x, y); 
                    return; 
                } 
            } 
            else {
              line = testLine; 
            } 
        } 
                ctx.fillText(line, x, y); }; 
                    wrapText(song.title, 10, 20, 130, 14); 
                    ctx.font = "10px Arial"; 
                    wrapText(song.artist, 10, 60, 130, 12); // Робот 
                    const robot = new Image(); 
                    robot.crossOrigin = "anonymous"; 
                    robot.src = `https://robohash.org/${encodeURIComponent( song.album + song.artist + song.index + seed )}?size=50x50`; 
                    robot.onload = () => { ctx.drawImage(robot, 100, 100, 40, 40); 
                        resolve(canvas.toDataURL("image/png")); 
            }; 
    }); 
}