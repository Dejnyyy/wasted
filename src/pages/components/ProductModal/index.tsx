import { useState } from 'react'
import Link from "next/link"

export interface Product {
  id: number
  name: string
  image: string
  price: string
  sizes: string
  description: string
  verdict: string
}

interface ProductModalProps {
  product: Product
  onClose: () => void
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [scale, setScale] = useState(1)
  const [origin, setOrigin] = useState({ x: 0.5, y: 0.5 })

  // Handle zoom on mouse wheel
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setScale((prev) => Math.max(1, prev + delta))
  }

  // Update transform origin based on mouse position if zoomed in
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scale > 1) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      setOrigin({ x, y })
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-900 p-6 rounded-xl w-full max-w-3xl flex flex-col md:flex-row shadow-lg transition duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Image */}
        <div
          className="overflow-hidden w-full md:w-1/2 h-64 md:h-auto rounded-xl"
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: `${origin.x * 100}% ${origin.y * 100}%`,
              transition: 'transform 0.2s',
            }}
            className="w-full h-full object-contain"
          />
        </div>
        {/* Right Side: Product Information */}
        <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-pink-500">{product.name}</h2>
          <p className="mt-2 text-white">{product.description}</p>
          <p className="mt-2 font-semibold text-white">
            Price: <span className="text-pink-500">{product.price}</span>
          </p>
          <p className="mt-2 font-semibold text-white">
            Sizes: <span className="text-pink-500">{product.sizes}</span>
          </p>
          <p className="mt-2 text-white">
            <span className="font-semibold">Verdict: </span>
            <span className="text-pink-500">{product.verdict}</span>
          </p>
          {/* Navigation Button */}
          <div className="mt-8">
            <Link href={`/3dshirts?shirt=${encodeURIComponent(product.image)}`}>
              <p className="inline-block bg-black text-white font-bold rounded-xl border border-pink-500 py-2 px-4 animate-pulse">
                3D View
              </p>
            </Link>
          </div>
        </div>
       
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-2xl text-white hover:text-pink-500 p-2 transition duration-200"
        >
          &times;
        </button>
      </div>
    </div>
  )
}

export default ProductModal
