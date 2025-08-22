import React, { Suspense, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Html, useProgress } from "@react-three/drei";

// Dynamically import the ShirtModel component to prevent SSR issues
const ShirtModel = dynamic(() => import("../components/Shirt3DModel"), {
  ssr: false,
});

/* =============================
   Small helpers
============================= */
const PRESET_TEXTURES = [
  "/Tees/wastedsample.png",
  "/Tees/wasted designtee.png",
  "/Tees/FireTees/wastedfire.png",
  "/Tees/Whitefirecleanback.png",
];

const ENV_OPTIONS = [
  "city",
  "studio",
  "apartment",
  "forest",
  "dawn",
  "warehouse",
  "park",
  "lobby",
] as const;
type EnvName = (typeof ENV_OPTIONS)[number];

function Loader() {
  const { progress, item } = useProgress();
  return (
    <Html center>
      <div
        className={`flex flex-col items-center gap-2 rounded-xl border border-white/20 bg-black/60 px-4 py-3 text-white backdrop-blur`}
      >
        <div className="text-sm opacity-80">Loading…</div>
        <div className="h-1.5 w-48 overflow-hidden rounded bg-white/10">
          <div
            className="h-full bg-white"
            style={{ width: `${Math.min(100, Math.round(progress))}%` }}
          />
        </div>
        <div className="text-[11px] opacity-60">
          {item?.toString().split("/").slice(-1)[0] ?? "assets"}
        </div>
      </div>
    </Html>
  );
}

/* =============================
   Page
============================= */
export default function ShirtPage() {
  const router = useRouter();
  const initialShirt =
    typeof router.query.shirt === "string" ? router.query.shirt : undefined;

  const [env, setEnv] = useState<EnvName>("city");
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedTex, setSelectedTex] = useState<string | undefined>(
    initialShirt
  );
  const [copied, setCopied] = useState(false);

  // build a shareable link with the current texture
  const shareHref = useMemo(() => {
    if (!selectedTex) return "/shirt";
    const u = new URL(
      typeof window !== "undefined"
        ? window.location.href
        : "https://example.com/shirt",
      window.location.origin || "https://example.com"
    );
    u.searchParams.set("shirt", selectedTex);
    u.hash = "";
    return u.pathname + u.search;
  }, [selectedTex]);

  // file upload → data URL
  const onUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedTex(reader.result);
      }
    };
    reader.readAsDataURL(file);
    // reset input so the same file can re-trigger
    e.currentTarget.value = "";
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareHref);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <>
      <Head>
        <title>3D Wasted Shirt</title>
        <meta name="theme-color" content="#0f0f15" />
      </Head>

      <div className="relative h-[100svh] w-screen overflow-hidden bg-[#0f0f15] text-white">
        {/* Animated background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 800px at 20% 10%, rgba(241,126,167,0.18), transparent 55%), radial-gradient(1200px 800px at 85% 90%, rgba(142,121,255,0.18), transparent 55%)",
          }}
        />

        {/* Top bar */}
        <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-5 py-4">
          <Link
            href="/"
            className={` rounded-xl border border-pink-500/70 bg-black/60 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:border-pink-400`}
          >
            ← Back
          </Link>

          <div className="flex items-center gap-2">
            {/* Environment select */}
            <select
              value={env}
              onChange={(e) => setEnv(e.target.value as EnvName)}
              className={` rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs backdrop-blur transition hover:bg-white/10`}
              title="Lighting environment"
            >
              {ENV_OPTIONS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>

            {/* Auto-rotate */}
            <button
              onClick={() => setAutoRotate((v) => !v)}
              className={`rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs backdrop-blur transition hover:bg-white/10`}
              title="Toggle auto-rotate"
            >
              {autoRotate ? "Auto-rotate: On" : "Auto-rotate: Off"}
            </button>

            {/* Share link */}
            <button
              onClick={copyLink}
              className={`rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs backdrop-blur transition hover:bg-white/10`}
              title="Copy link with current texture"
            >
              {copied ? "Copied ✓" : "Share"}
            </button>
          </div>
        </div>

        {/* Texture strip */}
        <div className="absolute bottom-4 left-0 right-0 z-20 mx-auto flex max-w-4xl items-center gap-3 px-5">
          <div className={`mr-1 shrink-0 text-xs text-white/70`}>Textures:</div>
          <div className="flex w-full items-center gap-3 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-2 backdrop-blur">
            {/* Upload */}
            <label className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-lg border border-dashed border-white/20 text-[11px] text-white/70 transition hover:bg-white/5">
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onUpload}
              />
            </label>

            {/* Presets */}
            {PRESET_TEXTURES.map((src) => (
              <button
                key={src}
                onClick={() => setSelectedTex(src)}
                className={`relative h-14 w-14 overflow-hidden rounded-lg border transition ${
                  selectedTex === src
                    ? "border-white"
                    : "border-white/15 hover:border-white/35"
                }`}
                title={src.split("/").slice(-1)[0]}
              >
                {/* Using plain img to avoid Next/Image layout inside scrolling strip */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          shadows
          camera={{ position: [0.6, 0.9, 1.6], fov: 42 }}
        >
          <Suspense fallback={<Loader />}>
            {/* Stage handles lights + ground + env; easy to swap environments */}
            <Stage
              environment={env}
              intensity={0.7}
              adjustCamera={1.1}
              shadows="contact"
            >
              <ShirtModel shirtImage={selectedTex ?? initialShirt} />
            </Stage>

            <OrbitControls
              enablePan={false}
              autoRotate={autoRotate}
              autoRotateSpeed={0.8}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={(2 * Math.PI) / 3}
              minDistance={0.7}
              maxDistance={3}
            />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}
