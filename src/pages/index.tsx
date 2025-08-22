import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductModal, { Product } from "../components/ProductModal";
import ProductCard from "../components/ProductCard";

gsap.registerPlugin(ScrollTrigger);

/* =========================
   Catalog (unchanged)
========================= */
const products: Product[] = [
  {
    id: 1,
    name: "Graphic Tee",
    image: "/Tees/wasted designtee.png",
    price: "$49.99",
    sizes: "M, L, XL",
    description:
      "This one pulls no punches. Front print says “I don’t need to prove anything,” and the back says “but I still could destroy you emotionally in two lines of lowercase text.” It’s giving discipline. It’s giving quiet power. It’s giving “I built this empire from bad dreams and geometry homework.”",
    verdict:
      "This is the uniform for your inner circle. The one people assume is sold out even when it’s not. The one someone thrift-finds in 2029 and gatekeeps like it’s a relic. You don’t just wear this—you belong to it.",
  },
  {
    id: 2,
    name: "Logo Tee",
    image: "/Tees/minimalfrontlogo.png",
    price: "$19.99",
    sizes: "S, M, L, XL",
    description:
      'YES. This is the "you don’t even know how hard I go" fit. Reserved in front, full villain arc in the back.',
    verdict: 'This is the shirt people lie and say is "vintage" in 2032.',
  },
  {
    id: 3,
    name: "Wasted Fire Tee",
    image: "/Tees/FireTees/wastedfire.png",
    price: "$29.99",
    sizes: "S, M, L, XL",
    description:
      "Color splash! Still gritty, but now you’re flirting with aggressive energy drink mascot.",
    verdict:
      'Keep this for a collab or surprise drop. Call it "Hot Damage" or some equally unhinged two-word combo.',
    colors: [
      { color: "cyan", image: "/Tees/FireTees/cyanwastedfire.png" },
      { color: "gold", image: "/Tees/FireTees/goldenwastedfire.png" },
      { color: "green", image: "/Tees/FireTees/greenmagicwastedfire.png" },
      { color: "indigo", image: "/Tees/FireTees/magicwastedfire.png" },
      { color: "magenta", image: "/Tees/FireTees/screamingpinkwastedfire.png" },
      { color: "darkslateblue", image: "/Tees/FireTees/spacewastedfire.png" },
      { color: "deeppink", image: "/Tees/FireTees/warmpinkwastedfire.png" },
      { color: "orange", image: "/Tees/FireTees/wastedfire.png" },
    ],
  },
  {
    id: 4,
    name: "Wasted Tees",
    image: "/Tees/Whitefirecleanback.png",
    price: "$34.99",
    sizes: "S, M, L, XL",
    description:
      "Okay this one’s the most accessible. You wear it to the corner store and still look like you don’t talk to your family.",
    verdict:
      "This is the bread and butter. Stock this in every size and don’t apologize.",
  },
  {
    id: 5,
    name: "Wasted Logo Tee",
    image: "/Tees/wastedsample.png",
    price: "$24.99",
    sizes: "S, M, L, XL",
    description:
      'Are you kidding me? The weathered texture plus that chunk of back art? It’s giving “worn by someone who hasn’t slept in 48 hours and skates better than you."',
    verdict: "This one hurts in a good way. Pure core piece.",
  },
  {
    id: 6,
    name: "Wasted Fire Tee",
    image: "/Tees/whitefireweirdwasted.png",
    price: "$29.99",
    sizes: "S, M, L, XL",
    description:
      "That’s metal concert merch for a band that only exists in your imagination. Textured white on black gives it that crunchy, rough “I’ve seen stuff” vibe. Clean duality. Front says chaos. Back says commitment.",
    verdict:
      "Drop this in a limited run and pretend it was “too hot to keep in stock.”",
  },
];

/* =========================
   Page
========================= */
const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  /* Intro + reveals */
  useEffect(() => {
    if (!heroRef.current || !contentRef.current) return;

    // Lock scroll during intro
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        document.body.style.overflow = prevOverflow || "auto";
      },
    });

    // Intro: logo float-in, tagline fade, then slide hero up to reveal content
    tl.fromTo(
      logoRef.current,
      { autoAlpha: 0, y: 10, scale: 0.96, filter: "blur(6px)" },
      { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.9 }
    )
      .fromTo(
        taglineRef.current,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.6 },
        "-=0.35"
      )
      .to(heroRef.current, {
        yPercent: -100,
        duration: 1.1,
        ease: "power4.inOut",
        delay: 0.9,
      })
      .set(heroRef.current, { pointerEvents: "none" });

    // Parallax bg (wasted.png) — slow drift on scroll
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    // Grid items stagger-in on first view
    if (gridRef.current) {
      const items = Array.from(gridRef.current.children);
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 20, scale: 0.98, filter: "blur(4px)" },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
          },
        }
      );
    }

    // Card hover lift (subtle)
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-card]").forEach((el) => {
        el.addEventListener("mouseenter", () =>
          gsap.to(el, { y: -4, duration: 0.2, ease: "power2.out" })
        );
        el.addEventListener("mouseleave", () =>
          gsap.to(el, { y: 0, duration: 0.3, ease: "power2.out" })
        );
      });
    }, gridRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <>
      <Head>
        <title>WASTED</title>
        <meta
          name="description"
          content="Wasted Potential — Streetwear Clothing"
        />
        <meta name="theme-color" content="#000000" />
      </Head>

      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Soft background glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -left-32 h-[45rem] w-[45rem] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(241,126,167,0.35), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -right-32 h-[45rem] w-[45rem] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(142,121,255,0.33), transparent 70%)",
          }}
        />

        {/* Intro / Hero overlay */}
        <section
          ref={heroRef}
          className="fixed left-0 top-0 z-40 grid h-screen w-full place-items-center bg-black"
        >
          <div className="text-center">
            <div ref={logoRef}>
              <Image
                src="/WASTED.png"
                alt="Wasted Logo"
                className="mx-auto object-contain"
                width={560}
                height={180}
                priority
              />
            </div>
            <p
              ref={taglineRef}
              className="mt-2 tracking-wider text-pink-300/90"
            >
              Wasted Potential. Unleashed.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section
          ref={contentRef}
          className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center px-5 pb-24 pt-28 md:px-8"
        >
          {/* Subtle centered brand mark with parallax */}
          <div
            ref={bgRef}
            className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-15"
            style={{
              backgroundImage: "url('/wasted.png')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "42%",
            }}
          />

          {/* Header / Section title */}
          <div className="mb-8 flex w-full items-end justify-between gap-4">
            <h2 className="inline-block border-b border-pink-300/60 pb-2 text-xl font-semibold tracking-wide md:text-2xl">
              Featured Drops
            </h2>
            <a
              href="#catalog"
              className="text-xs text-zinc-400 transition-colors hover:text-zinc-200"
            >
              Scroll to shop ↓
            </a>
          </div>

          {/* Products Grid */}
          <div
            id="catalog"
            ref={gridRef}
            className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {products.map((product) => (
              <div key={product.id} data-card>
                <ProductCard
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default Home;
