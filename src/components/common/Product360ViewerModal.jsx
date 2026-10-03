import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCcw,
  X,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  MoveHorizontal
} from 'lucide-react';
import sound from '../../utils/soundFX';
import { formatPrice } from '../../utils/formatters';

export default function Product360ViewerModal({ isOpen, onClose, product }) {
  const [angle, setAngle] = useState(0); // 0 to 359
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startAngleRef = useRef(0);

  // Auto rotation loop
  useEffect(() => {
    let animId;
    if (isOpen && isAutoRotate && !isDragging) {
      const step = () => {
        setAngle((prev) => (prev + 1) % 360);
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isOpen, isAutoRotate, isDragging]);

  if (!isOpen || !product) return null;

  // Mouse / Touch drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsAutoRotate(false);
    startXRef.current = e.clientX;
    startAngleRef.current = angle;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    // 2px drag = 1 degree rotation
    const newAngle = (startAngleRef.current - Math.round(deltaX * 0.7) + 3600) % 360;
    setAngle(newAngle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setIsAutoRotate(false);
      startXRef.current = e.touches[0].clientX;
      startAngleRef.current = angle;
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    const newAngle = (startAngleRef.current - Math.round(deltaX * 0.7) + 3600) % 360;
    setAngle(newAngle);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  // Determine which image perspective to show based on angle (quadrants)
  const imageIndex = Math.floor((angle / 360) * images.length) % images.length;
  const currentImage = images[imageIndex] || product.image;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none"
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-100 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">
                  360° Interaktiv Ko'rinish
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                  {angle}°
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-sm">
                {product.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 360 Interactive Stage */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="relative w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-950 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing shadow-inner"
        >
          {/* Circular 3D Turntable grid */}
          <div
            className="absolute bottom-6 w-72 h-20 rounded-[100%] border-2 border-indigo-500/30 bg-indigo-500/5 shadow-2xl transition-transform"
            style={{
              transform: `rotateX(75deg) rotateZ(${angle}deg)`
            }}
          />

          {/* Product Image with 3D perspective effect */}
          <div
            className="relative z-10 transition-transform duration-75 flex items-center justify-center"
            style={{
              transform: `scale(${zoom}) rotateY(${Math.sin((angle * Math.PI) / 180) * 15}deg)`,
              filter: `drop-shadow(0 ${20 + Math.cos((angle * Math.PI) / 180) * 5}px 25px rgba(0,0,0,0.3))`
            }}
          >
            <img
              src={currentImage}
              alt={product.name}
              className="max-h-64 sm:max-h-72 object-contain pointer-events-none transition-all duration-150"
            />
          </div>

          {/* Interactive Hint Banner */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5 shadow-lg pointer-events-none">
            <MoveHorizontal className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Sichqoncha bilan ushlab aylantiring</span>
          </div>

          {/* Compass / Degree Badge */}
          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-xs font-mono font-bold border border-black/10 dark:border-white/10">
            Burchak: {angle}°
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Angle Presets */}
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className="text-slate-400 mr-1 text-[11px]">Rakurs:</span>
            {[
              { label: "Oldi", deg: 0 },
              { label: "O'ng", deg: 90 },
              { label: "Orqa", deg: 180 },
              { label: "Chap", deg: 270 }
            ].map((p) => (
              <button
                key={p.deg}
                onClick={() => {
                  sound.playPop();
                  setAngle(p.deg);
                  setIsAutoRotate(false);
                }}
                className={`px-2.5 py-1 rounded-lg border transition ${
                  Math.abs(angle - p.deg) < 15
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Actions: Auto Rotate & Zoom */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playPop();
                setIsAutoRotate(!isAutoRotate);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                isAutoRotate
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoRotate ? "To'xtatish" : "Avto-aylantirish"}</span>
            </button>

            <button
              onClick={() => setZoom((z) => Math.min(1.5, z + 0.15))}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition"
              title="Kattalashtirish"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition"
              title="Kichiklashtirish"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
