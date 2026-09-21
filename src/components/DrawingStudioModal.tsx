import React, { useRef, useState, useEffect } from 'react';
import { Palette, Eraser, RotateCcw, Check, X, Paintbrush, Sliders } from 'lucide-react';

interface DrawingStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArtworkReady: (dataUrl: string) => void;
}

const PALETTE = [
  '#0f172a', // Obsidian
  '#b91c1c', // Venetian Red
  '#c2410c', // Burnt Orange
  '#d97706', // Ochre / Amber
  '#eab308', // Cadmium Yellow
  '#15803d', // Terre Verte
  '#0e7490', // Cobalt Teal
  '#1d4ed8', // Ultramarine
  '#4338ca', // Indigo
  '#7e22ce', // Royal Purple
  '#be185d', // Rose Madder
  '#78350f', // Raw Umber
  '#ffffff', // Titanium White
];

export const DrawingStudioModal: React.FC<DrawingStudioModalProps> = ({
  isOpen,
  onClose,
  onArtworkReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#b91c1c');
  const [brushSize, setBrushSize] = useState(12);
  const [isEraser, setIsEraser] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  // Setup canvas with linen-like warm canvas background
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Base primed canvas fill
      ctx.fillStyle = '#f8f5ee';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Save initial blank state
      const initial = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([initial]);
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const saveHistoryStep = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-15), state]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const newHistory = [...history];
    newHistory.pop(); // remove current state
    const previous = newHistory[newHistory.length - 1];
    setHistory(newHistory);

    const canvas = canvasRef.current;
    if (!canvas || !previous) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.putImageData(previous, 0, 0);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#f8f5ee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveHistoryStep();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = isEraser ? '#f8f5ee' : color;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveHistoryStep();
    }
  };

  const handleFinish = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onArtworkReady(dataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        id="drawing-studio-container"
        className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-700/80 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif-display text-lg font-bold text-zinc-100">
                L'Atelier Drawing Studio
              </h3>
              <p className="text-xs text-zinc-400">
                Paint your original piece directly onto the virtual linen
              </p>
            </div>
          </div>
          <button
            id="close-drawing-studio-btn"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Tools Bar */}
        <div className="px-5 py-3 bg-zinc-900/90 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          {/* Tool toggles */}
          <div className="flex items-center gap-2">
            <button
              id="tool-brush-btn"
              type="button"
              onClick={() => setIsEraser(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                !isEraser
                  ? 'bg-amber-500 text-zinc-950 font-semibold'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              <Paintbrush className="w-3.5 h-3.5" />
              Brush
            </button>
            <button
              id="tool-eraser-btn"
              type="button"
              onClick={() => setIsEraser(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                isEraser
                  ? 'bg-amber-500 text-zinc-950 font-semibold'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              Eraser
            </button>

            {/* Brush Size Slider */}
            <div className="flex items-center gap-2 pl-3 border-l border-zinc-700">
              <Sliders className="w-3.5 h-3.5 text-zinc-400" />
              <input
                type="range"
                min="2"
                max="48"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-24 accent-amber-400 h-1.5 bg-zinc-700 rounded-lg cursor-pointer"
                title={`Brush Size: ${brushSize}px`}
              />
              <span className="text-[11px] text-zinc-400 font-mono w-6 text-right">
                {brushSize}px
              </span>
            </div>
          </div>

          {/* Color swatches */}
          <div className="flex items-center gap-1.5">
            {PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setColor(c);
                  setIsEraser(false);
                }}
                style={{ backgroundColor: c }}
                className={`w-6 h-6 rounded-full border transition-transform ${
                  color === c && !isEraser
                    ? 'scale-125 border-amber-400 ring-2 ring-amber-400/40'
                    : 'border-zinc-700 hover:scale-110'
                }`}
                title={c}
              />
            ))}
            {/* Custom Color Input */}
            <label className="relative cursor-pointer ml-1">
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                  setIsEraser(false);
                }}
                className="sr-only"
              />
              <div
                className="w-6 h-6 rounded-full border border-zinc-500 flex items-center justify-center text-[10px] text-zinc-300 bg-gradient-to-tr from-rose-500 via-emerald-500 to-amber-500 hover:scale-110 transition-transform"
                title="Custom color picker"
              >
                +
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              id="drawing-undo-btn"
              type="button"
              onClick={handleUndo}
              disabled={history.length <= 1}
              className="p-1.5 text-xs text-zinc-400 hover:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 rounded transition-colors"
              title="Undo stroke"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              id="drawing-clear-btn"
              type="button"
              onClick={handleClear}
              className="px-2.5 py-1 text-xs text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Drawing Canvas Area */}
        <div className="p-4 sm:p-6 bg-zinc-950/60 flex items-center justify-center overflow-auto flex-1">
          <div className="p-3 bg-zinc-950 border-4 border-zinc-800 rounded-sm shadow-2xl">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-[340px] h-[255px] sm:w-[560px] sm:h-[420px] md:w-[720px] md:h-[540px] bg-[#f8f5ee] rounded-xs cursor-crosshair touch-none shadow-inner"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3.5 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-400">
            Canvas size: 800 x 600 • Primed Belgian Canvas texture
          </span>
          <div className="flex items-center gap-3">
            <button
              id="cancel-drawing-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              id="use-drawing-btn"
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-md transition-all hover:scale-105"
            >
              <Check className="w-4 h-4" />
              Use This Artwork
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
