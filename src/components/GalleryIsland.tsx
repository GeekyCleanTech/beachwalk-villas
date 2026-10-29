import { h } from 'preact';
import { useState } from 'preact/hooks';

interface Props {
  images: string[];
  title: string;
}

export default function GalleryIsland({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  if (!images || images.length === 0) return null;

  return (
    <div class="w-full">
      {/* Main featured image */}
      <div class="aspect-[16/10] overflow-hidden mb-3 rounded-card shadow-[var(--shadow-soft)] relative">
        <img
          src={images[activeIndex]}
          alt={`${title} view ${activeIndex + 1}`}
          class="w-full h-full object-cover transition-opacity duration-300"
          loading="eager"
        />
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div class="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {images.map((src, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={src}
                onClick={() => setActiveIndex(i)}
                class={`aspect-square overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-seafoam transition-all duration-150 ${
                  isActive ? "ring-2 ring-seafoam opacity-100" : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`View image ${i + 1} of ${images.length}`}
              >
                <img
                  src={src}
                  alt={`${title} thumbnail ${i + 1}`}
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
