type Product = {
  id: number | string;
  img: string;
  name: string;
  price: string;
};

type Props = {
  products: Product[];
  onSeeAll?: () => void;
};

const ProductSuggestions = ({ products, onSeeAll }: Props) => {
  return (
    <div
      className="max-w-6xl mx-auto p-6 rounded-lg shadow-lg mt-6 
                bg-gradient-to-b from-green-200 to-green-50"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Gợi ý cho bạn
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-4 rounded-lg shadow-md flex flex-col min-h-[350px] transition-transform transform hover:scale-105 hover:shadow-xl 
                           bg-white"
          >
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-60 object-cover rounded-md mb-3"
            />
            <h3 className="font-semibold text-lg text-gray-900 mb-1 flex-1">
              {product.name}
            </h3>
            <p className="text-red-600 font-bold text-lg mb-3">{product.price}</p>
            <button className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-4 py-2 rounded-md font-medium mt-auto transition-all duration-300 cursor-pointer">
              Mua ngay
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={onSeeAll}
          className="bg-gradient-to-r from-red-700 to-red-400 hover:from-red-500 hover:to-red-800 text-white px-6 py-3 rounded-md font-medium transition-colors duration-500 cursor-pointer"
        >
          Xem tất cả
        </button>
      </div>
    </div>
  );
};

export default ProductSuggestions;
