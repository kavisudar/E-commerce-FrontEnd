"use client";
import { useCart } from "@/app/context/page";
import { useRouter } from "next/navigation";

export default function PopularBuying() {
  const { cart, addToCart } = useCart();
  const router = useRouter();

  const isInCart = (id) => {
    return cart?.some((item) => item.id === id);
  };

  const handleAdd = (item) => {
    addToCart(item);
  };

  const products = [
    {
      id: 1,
      name: "Smart Watch",
      price: 2999,
      img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: 2,
      name: "Photo Frame",
      price: 1499,
      img: "https://picsum.photos/seed/bag/500/400",
    },
    {
      id: 3,
      name: "Earrings",
      price: 799,
      img: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: 4,
      name: "T-shirt",
      price: 999,
      img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&auto=format&fit=crop&q=60",
    },
  ];

  return (
    <div className="w-11/12 mx-auto my-10">
      <h2 className="text-2xl font-bold mb-6">🔥 Popular Buying</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition duration-300"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600 mt-1">₹{item.price.toFixed(2)}</p>

              {isInCart(item.id) ? (
                <button
                  onClick={() => router.push("/cart")}
                  className="w-full bg-green-500 text-white text-sm py-1 rounded hover:bg-green-600"
                >
                  Go to Cart
                </button>
              ) : (
                <button
                  onClick={() => handleAdd(item)}
                  className="w-full bg-yellow-400 text-black text-sm py-1 rounded hover:bg-yellow-500"
                >
                  Add
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}