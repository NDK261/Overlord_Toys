"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Product } from "@/types/product";

interface ImageGalleryProps {
  product: Product;
}

export function ImageGallery({ product }: ImageGalleryProps) {
  const images = useMemo(() => {
    const galleryImages = (product.images ?? [])
      .map((image) => image.url)
      .filter(Boolean);

    if (!galleryImages.length) {
      return [product.thumbnail_url];
    }

    if (!galleryImages.includes(product.thumbnail_url)) {
      return [product.thumbnail_url, ...galleryImages];
    }

    return galleryImages;
  }, [product.images, product.thumbnail_url]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const selectedImage = images[selectedIndex] ?? product.thumbnail_url;

  return (
    <>
      <div className="space-y-6">
        <button
          aria-label={`Zoom ${product.name}`}
          className="glass-card relative block w-full overflow-hidden rounded-2xl border border-white/10 aspect-square group"
          onClick={() => setIsZoomOpen(true)}
          type="button"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(111,247,232,0.18),transparent_55%)] opacity-70" />
          <div className="flex h-full items-center justify-center p-8 md:p-10">
            <Image
              key={selectedImage}
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 animate-[gallery-image-in_320ms_ease-out]"
              height={800}
              src={selectedImage}
              width={800}
            />
          </div>
          <span className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-label uppercase tracking-[0.18em] text-on-surface-variant">
            Click to zoom
          </span>
        </button>

        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => {
            const isActive = index === selectedIndex;

            return (
              <button
                aria-label={`View image ${index + 1} of ${product.name}`}
                aria-pressed={isActive}
                className={[
                  "glass-card relative overflow-hidden rounded-xl aspect-square p-2 transition-all duration-200",
                  isActive
                    ? "border border-primary-container shadow-[0_0_0_1px_rgba(111,247,232,0.28),0_18px_32px_-24px_rgba(111,247,232,0.9)]"
                    : "border border-transparent hover:border-primary-container/30 hover:-translate-y-0.5",
                ].join(" ")}
                key={`${image}-${index}`}
                onClick={() => setSelectedIndex(index)}
                type="button"
              >
                <Image
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="h-full w-full rounded-lg object-cover"
                  height={200}
                  src={image}
                  width={200}
                />
                {isActive ? (
                  <span className="pointer-events-none absolute inset-x-3 bottom-3 h-0.5 rounded-full bg-gradient-primary" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {isZoomOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/88 p-4 md:p-10"
          onClick={() => setIsZoomOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            aria-label="Close zoom view"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/8 text-on-surface transition-colors hover:bg-white/14"
            onClick={() => setIsZoomOpen(false)}
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          <div
            className="relative w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-surface/80 p-4 shadow-[0_24px_90px_-40px_rgba(0,0,0,0.85)] md:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden rounded-[22px] bg-[radial-gradient(circle_at_top,rgba(111,247,232,0.16),transparent_52%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] p-6 md:p-10">
              <Image
                alt={product.name}
                className="max-h-[78vh] w-auto max-w-full object-contain animate-[gallery-image-in_320ms_ease-out]"
                height={1400}
                src={selectedImage}
                width={1400}
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 px-1">
              <div>
                <p className="text-sm font-headline font-semibold text-on-surface">{product.name}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                  Image {selectedIndex + 1} / {images.length}
                </p>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((image, index) => {
                  const isActive = index === selectedIndex;

                  return (
                    <button
                      aria-label={`Zoom image ${index + 1}`}
                      className={[
                        "overflow-hidden rounded-lg border p-1 transition-all",
                        isActive
                          ? "border-primary-container bg-primary-container/10"
                          : "border-white/10 hover:border-primary-container/30",
                      ].join(" ")}
                      key={`zoom-${image}-${index}`}
                      onClick={() => setSelectedIndex(index)}
                      type="button"
                    >
                      <Image
                        alt={`${product.name} zoom thumbnail ${index + 1}`}
                        className="h-14 w-14 rounded-md object-cover"
                        height={56}
                        src={image}
                        width={56}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}