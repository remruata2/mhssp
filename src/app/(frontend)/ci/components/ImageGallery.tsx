"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  className?: string;
  gridClassName?: string;
  itemClassNames?: string[]; // optional per-item layout classes
}

export default function ImageGallery({ images, className, gridClassName, itemClassNames }: ImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const startX = useRef<number | null>(null);
  const threshold = 40; // px swipe threshold

  const openAt = useCallback((i: number) => {
    setIndex(i);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);
  const next = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  // Keyboard controls
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, prev, next]);

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const endX = e.changedTouches[0].clientX;
    const delta = endX - startX.current;
    if (Math.abs(delta) > threshold) {
      if (delta > 0) prev();
      else next();
    }
    startX.current = null;
  };

  return (
    <div className={className}>
      <div className={gridClassName ?? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"}>
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => openAt(i)}
            className={`relative overflow-hidden rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2B415A] ${
              itemClassNames?.[i] ?? "aspect-[4/3]"
            }`}
            aria-label={`Open image ${i + 1}`}
          >
            <Image
              src={src}
              alt={`Gallery image ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
              priority={i < 4}
            />
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 select-none">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70" onClick={close} />

          {/* Viewer */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl">
              <div
                className="relative aspect-video bg-black rounded-lg overflow-hidden touch-pan-y"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                <Image
                  src={images[index]}
                  alt={`Image ${index + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>
              {/* Controls */}
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
                <button
                  type="button"
                  onClick={prev}
                  className="h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center text-gray-800"
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center text-gray-800"
                  aria-label="Next image"
                >
                  ›
                </button>
              </div>
              <button
                type="button"
                onClick={close}
                className="absolute -top-3 -right-3 h-9 w-9 rounded-full bg-white/95 hover:bg-white shadow flex items-center justify-center text-gray-800"
                aria-label="Close viewer"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
