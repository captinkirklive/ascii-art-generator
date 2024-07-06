import React, { useState, useRef } from 'react';
import { saveAs } from 'file-saver';
import './App.css';

const ASCII_CHARS = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.', ' '];

function App() {
  const [asciiArt, setAsciiArt] = useState('');
  const canvasRef = useRef(null);

  const generateAsciiArt = (image, newWidth = 100) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const aspectRatio = image.height / image.width;
    const newHeight = Math.round(aspectRatio * newWidth * 0.55);

    canvas.width = newWidth;
    canvas.height = newHeight;

    ctx.drawImage(image, 0, 0, newWidth, newHeight);
    const imageData = ctx.getImageData(0, 0, newWidth, newHeight);

    let asciiImage = '';
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (i % (newWidth * 4) === 0) asciiImage += '\n';
      const brightness = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
      const char = ASCII_CHARS[Math.floor(brightness / 256 * ASCII_CHARS.length)];
      asciiImage += char;
    }

    setAsciiArt(asciiImage);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => generateAsciiArt(img);
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const blob = new Blob([asciiArt], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'ascii_art.txt');
  };

  return (
    <div className="App">
      <h1>ASCII Art Generator</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {asciiArt && (
        <div>
          <pre>{asciiArt}</pre>
          <button onClick={handleDownload}>Download ASCII Art</button>
        </div>
      )}
    </div>
  );
}

export default App;