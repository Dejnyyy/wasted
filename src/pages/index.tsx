import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import gsap from 'gsap'
import ProductModal, { Product } from './components/ProductModal'
import ProductCard from './components/ProductCard'

const products: Product[] = [
  {
    id: 1,
    name: 'Wasted Fire Tee',
    image: '/Tees/whitefireweirdwasted.png',
    price: '$29.99',
    sizes: 'S, M, L, XL',
    description: 'That’s metal concert merch for a band that only exists in your imagination. Textured white on black gives it that crunchy, rough “I’ve seen stuff” vibe. Clean duality. Front says chaos. Back says commitment.',
    verdict:"Drop this in a limited run and pretend it was “too hot to keep in stock.”"
  },
  {
    id: 2,
    name: 'Wasted Logo Tee',
    image: '/Tees/wastedsample.png',
    price: '$24.99',
    sizes: 'S, M, L, XL',
    description: 'Are you kidding me? The weathered texture plus that chunk of back art? It’s giving “worn by someone who hasn’t slept in 48 hours and skates better than you."',
    verdict: "This one hurts in a good way. Pure core piece.",
  },
  {
    id: 3,
    name: 'Wasted Fire Tee',
    image: '/Tees/FireTees/wastedfire.png',
    price: '$29.99',
    sizes: 'S, M, L, XL',
    description: 'Color splash! Still gritty, but now you’re flirting with aggressive energy drink mascot.',
    verdict: 'Keep this for a collab or surprise drop. Call it "Hot Damage" or some equally unhinged two-word combo.',
    colors: [
      { color: 'cyan', image: '/Tees/FireTees/cyanwastedfire.png' },
      { color: 'gold', image: '/Tees/FireTees/goldenwastedfire.png' },
      { color: 'green', image: '/Tees/FireTees/greenmagicwastedfire.png' },
      { color: 'indigo', image: '/Tees/FireTees/magicwastedfire.png' },
      { color: 'magenta', image: '/Tees/FireTees/screamingpinkwastedfire.png' },
      { color: 'darkslateblue', image: '/Tees/FireTees/spacewastedfire.png' },
      { color: 'deeppink', image: '/Tees/FireTees/warmpinkwastedfire.png' },
      { color: 'orange', image: '/Tees/FireTees/wastedfire.png' },
     
    ]
  },  
  {
    id: 4,
    name: 'Wasted Tees',
    image: '/Tees/whitefirecleanback.png',
    price: '$34.99',
    sizes: 'S, M, L, XL',
    description: 'Okay this one’s the most accessible. You wear it to the corner store and still look like you don’t talk to your family.',
    verdict:"This is the bread and butter. Stock this in every size and don’t apologize."
  },
  {
    id: 5,
    name: 'Logo Tee',
    image: '/Tees/minimalfrontlogo.png',
    price: '$19.99',
    sizes: 'S, M, L, XL',
    description: 'YES. This is the "you don’t even know how hard I go" fit. Reserved in front, full villain arc in the back.',
    verdict:'This is the shirt people lie and say is "vintage" in 2032.'
  },
  {
    id: 6,
    name: 'Graphic Tee',
    image: '/Tees/wasted designtee.png',
    price: '$49.99',
    sizes: 'M, L, XL',
    description: 'This one pulls no punches. Front print says “I don’t need to prove anything,” and the back says “but I still could destroy you emotionally in two lines of lowercase text.” It’s giving discipline. It’s giving quiet power. It’s giving “I built this empire from bad dreams and geometry homework.”',
    verdict:'This is the uniform for your inner circle. The one people assume is sold out even when it’s not. The one someone thrift-finds in 2029 and gatekeeps like it’s a relic. You don’t just wear this—you belong to it.'
  },
]

const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const productsRef = useRef<HTMLDivElement>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    // Disable scrolling on mount
    document.body.style.overflow = 'hidden'

    const tl = gsap.timeline({
      onComplete: () => {
        // Re-enable scrolling after the animation completes
        document.body.style.overflow = 'auto'
      },
    })

    if (heroRef.current && contentRef.current && productsRef.current) {
      tl.fromTo(heroRef.current, { opacity: 0 }, { opacity: 1, duration: 1 })
        .to(heroRef.current, { opacity: 0, duration: 1, delay: 2 })
        .set(heroRef.current, { pointerEvents: 'none' })
        .fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, '-=0.5')
        .fromTo(
          productsRef.current.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.3 },
          '-=0.5'
        )
    }

    // Clean up in case the component unmounts
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <>
      <Head>
        <title>WASTED</title>
        <meta name="description" content="Wasted Potential - Streetwear Clothing" />
      </Head>
      <div className="relative min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black"
        >
          <Image src="/WASTED.png" alt="Wasted Logo" width={300} height={100} priority />
          <p className="mt-2 text-pink-300 tracking-wider">Wasted Potential. Unleashed.</p>
        </section>

        {/* Main Content Section */}
        <section
          ref={contentRef}
          className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/whitefiretexturewasted.png')" }}
        >
          <h2 className="text-2xl font-semibold border-b border-pink-300 inline-block pb-2 mb-6">
            Featured Drops
          </h2>
          <div ref={productsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
         
        </section>
      </div>
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  )
}

export default Home
