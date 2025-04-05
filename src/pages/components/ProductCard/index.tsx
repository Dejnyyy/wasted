import Image from 'next/image'
import { Product } from '../ProductModal'

interface ProductCardProps {
  product: Product
  onClick: () => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div
      className="bg-white text-black p-6 rounded-xl flex flex-col items-center cursor-pointer"
      onClick={onClick}
    >
      <Image src={product.image} alt={product.name} width={200} height={200} className='rounded-xl hover:scale-110 duration-200  transition-all ' />
      <p className="text-sm text-pink-600 mt-4">COMING SOON</p>
      <h3 className="font-bold mt-2">{product.name}</h3>
      
    </div>
  )
}

export default ProductCard
