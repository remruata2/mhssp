"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Img = { src: string; alt?: string };

interface Props {
  images: {
    leftTop: Img;
    leftBottom: Img;
    center: Img;
    rightTop: Img;
    rightBottom: Img;
  };
}

export default function CommunityIntroGallery({ images }: Props) {
  const ordered: Img[] = [
    images.leftTop,
    images.leftBottom,
    images.center,
    images.rightTop,
    images.rightBottom,
  ];

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };
  const close = () => setOpen(false);
  const prev = () => setIndex((i) => (i - 1 + ordered.length) % ordered.length);
  const next = () => setIndex((i) => (i + 1) % ordered.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      delta > 0 ? prev() : next();
    }
    touchStartX.current = null;
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-start">
        {/* Left column: two stacked */}
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => openAt(i)}
              className="block w-full relative rounded-xl overflow-hidden bg-gray-100 h-48 sm:h-56 shadow focus:outline-none focus:ring-2 focus:ring-[#2B415A]"
              aria-label={ordered[i].alt ?? `Open image ${i + 1}`}
            >
              <Image
                src={ordered[i].src}
                alt={ordered[i].alt ?? ""}
                fill
                className="object-cover"
                priority={i === 0}
              />
            </button>
          ))}
        </div>

        {/* Center hero */}
        <button
          type="button"
          onClick={() => openAt(2)}
          className="block w-full relative rounded-xl overflow-hidden bg-gray-100 h-56 sm:h-64 md:h-80 shadow self-center focus:outline-none focus:ring-2 focus:ring-[#2B415A]"
          aria-label={ordered[2].alt ?? "Open center image"}
        >
          <Image
            src={ordered[2].src}
            alt={ordered[2].alt ?? ""}
            fill
            className="object-cover"
            priority
          />
        </button>

        {/* Right column: two stacked */}
        <div className="space-y-4">
          {[3, 4].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => openAt(i)}
              className="block w-full relative rounded-xl overflow-hidden bg-gray-100 h-48 sm:h-56 shadow focus:outline-none focus:ring-2 focus:ring-[#2B415A]"
              aria-label={ordered[i].alt ?? `Open image ${i + 1}`}
            >
              <Image
                src={ordered[i].src}
                alt={ordered[i].alt ?? ""}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 select-none">
          <div className="absolute inset-0 bg-black/70" onClick={close} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl">
              <div
                className="relative aspect-video bg-black rounded-lg overflow-hidden touch-pan-y"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                <Image
                  src={ordered[index].src}
                  alt={ordered[index].alt ?? ""}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>

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