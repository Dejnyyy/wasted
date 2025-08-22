import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface Product {
  id: number;
  name: string;
  image: string;
  price: string;
  sizes: string;
  description: string;
  verdict: string;
  colors?: Array<{ color: string; image: string }>;
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  const initialImage = product.colors?.length
    ? product.colors[0].image
    : product.image;

  const [selectedImage, setSelectedImage] = useState<string>(initialImage);
  const [isClosing, setIsClosing] = useState(false);

  // Zoom & pan
  const [scale, setScale] = useState(1); // 1..3
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const hasVariants = !!product.colors?.length;
  const variantIndex = useMemo(
    () =>
      hasVariants
        ? product.colors!.findIndex((v) => v.image === selectedImage)
        : -1,
    [hasVariants, product.colors, selectedImage]
  );

  /* ----------------------------
     Lifecycle: lock scroll, focus, ESC
  ---------------------------- */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // focus dialog
    dialogRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleRequestClose();
      if (hasVariants && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const arr = product.colors!;
        const next = arr[(variantIndex + dir + arr.length) % arr.length];
        handleSelectImage(next.image);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variantIndex, hasVariants, product.colors]);

  /* ----------------------------
     Close with fade-out
  ---------------------------- */
  const handleRequestClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    // match CSS duration (200ms)
    setTimeout(() => onClose(), 200);
  };

  /* ----------------------------
     Zoom helpers
  ---------------------------- */
  const setZoom = (next: number) => {
    const clamped = clamp(next, 1, 3);
    setScale(clamped);
    if (clamped === 1) setOffset({ x: 0, y: 0 });
  };
  const zoomIn = () => setZoom(scale + 0.2);
  const zoomOut = () => setZoom(scale - 0.2);
  const resetZoom = () => setZoom(1);
  const toggleZoom = () => setZoom(scale > 1 ? 1 : 2);

  // Wheel zoom
  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(scale + delta);
  };

  // Drag-to-pan when zoomed
  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (scale === 1) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!dragging || scale === 1 || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    dragStart.current = { x: e.clientX, y: e.clientY };

    // clamp offset so image doesn't fly away
    const wrap = imageWrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const maxX = (rect.width * (scale - 1)) / 2;
    const maxY = (rect.height * (scale - 1)) / 2;

    setOffset((o) => ({
      x: clamp(o.x + dx, -maxX, maxX),
      y: clamp(o.y + dy, -maxY, maxY),
    }));
  };
  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!dragging) return;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    setDragging(false);
  };

  const handleSelectImage = (src: string) => {
    setSelectedImage(src);
    // reset view for new image
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleRequestClose}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-200 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        // stop click-through
        onClick={(e) => e.stopPropagation()}
        className={`relative mx-3 w-full max-w-4xl rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl outline-none transition-all duration-200 ${
          isClosing ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleRequestClose}
          className="absolute right-2 top-2 z-10 rounded-full p-2 text-2xl leading-none text-white/80 transition hover:text-pink-400"
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Left: Image viewer */}
          <div className="relative w-full md:w-1/2">
            {/* Toolbar */}
            <div className="pointer-events-auto absolute left-3 top-3 z-10 flex gap-2">
              <button
                onClick={zoomOut}
                className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs text-white/80 backdrop-blur transition hover:bg-white/10"
              >
                −
              </button>
              <button
                onClick={resetZoom}
                className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs text-white/80 backdrop-blur transition hover:bg-white/10"
              >
                Reset
              </button>
              <button
                onClick={zoomIn}
                className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs text-white/80 backdrop-blur transition hover:bg-white/10"
              >
                +
              </button>
            </div>

            <div
              ref={imageWrapRef}
              className="relative h-72 w-full overflow-hidden rounded-t-2xl md:h-full md:rounded-l-2xl md:rounded-tr-none"
              onWheel={handleWheel}
              onDoubleClick={toggleZoom}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <Image
                src={selectedImage}
                alt={product.name}
                width={1400}
                height={1400}
                className="h-full w-full select-none object-contain"
                style={{
                  transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
                  transition: dragging ? "none" : "transform 0.2s ease",
                  willChange: "transform",
                  pointerEvents: "none", // allow the wrapper to capture drag
                }}
                priority
              />
            </div>
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-1/2 p-5 md:p-6">
            <h2 className="text-2xl font-bold text-pink-400">{product.name}</h2>
            <p className="mt-3 text-zinc-100">{product.description}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <p className="font-semibold text-zinc-200">
                Price: <span className="text-pink-400">{product.price}</span>
              </p>
              <p className="font-semibold text-zinc-200">
                Sizes: <span className="text-pink-400">{product.sizes}</span>
              </p>
            </div>

            <p className="mt-3 text-zinc-100">
              <span className="font-semibold">Verdict: </span>
              <span className="text-pink-400">{product.verdict}</span>
            </p>

            {/* Variants */}
            {hasVariants && (
              <div className="mt-5">
                <h3 className="mb-2 text-sm font-semibold text-zinc-200">
                  Available Colors
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors!.map((variant, i) => {
                    const active = selectedImage === variant.image;
                    return (
                      <button
                        key={variant.color + i}
                        onClick={() => handleSelectImage(variant.image)}
                        style={{ backgroundColor: variant.color }}
                        className={`h-8 w-8 rounded-full border-2 transition ${
                          active
                            ? "border-white"
                            : "border-white/20 hover:border-white/50"
                        }`}
                        aria-label={`Color ${variant.color}`}
                        title={variant.color}
                      />
                    );
                  })}
                </div>

                {/* Next/prev for variants */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      const arr = product.colors!;
                      const next =
                        arr[(variantIndex - 1 + arr.length) % arr.length];
                      handleSelectImage(next.image);
                    }}
                    className="rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur transition hover:bg-white/10"
                  >
                    ◀ Prev
                  </button>
                  <button
                    onClick={() => {
                      const arr = product.colors!;
                      const next = arr[(variantIndex + 1) % arr.length];
                      handleSelectImage(next.image);
                    }}
                    className="rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur transition hover:bg-white/10"
                  >
                    Next ▶
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href={`/3dshirts?shirt=${encodeURIComponent(selectedImage)}`}
                className="inline-block rounded-xl border border-pink-500 px-4 py-2 font-semibold text-white transition hover:border-pink-400 hover:bg-white/5"
              >
                3D View
              </Link>
              <button
                onClick={resetZoom}
                className="inline-block rounded-xl border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                Reset View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
