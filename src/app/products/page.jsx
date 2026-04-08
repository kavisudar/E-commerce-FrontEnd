"use client";

import { useCart } from "@/app/context/page";
import { useState } from "react";
import Navbar from "@/app/Navbar/page";
import { useRouter } from "next/navigation";

const products = [
  {
    id: 1,
    name: "Men T-Shirt",
    category: "dresses",
    price: 599,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
  },
  {
    id: 2,
    name: "Running Shoes",
    category: "shoes",
    size: 9,
    price: 1999,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
  },
  {
    id: 3,
    name: "Smart Watch",
    category: "watches",
    price: 2999,
    img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500",
  },
  {
    id: 4,
    name: "iPhone 14",
    category: "phones",
    price: 79999,
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
  },
  {
    id: 5,
    name: "Lipstick",
    category: "cosmetics",
    price: 499,
    img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500",
  },
];

export default function ProductsPage() {
  const router = useRouter();

  // ✅ FIX: hook inside component
  const { cart, addToCart } = useCart();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  // ✅ check product in cart
  const isInCart = (id) => {
    return cart?.some((item) => item.id === id);
  };

  // ✅ add to cart
  const handleAdd = (item) => {
    const user = localStorage.getItem("user");

    if (!user) {
      window.dispatchEvent(new Event("open-login"));
      return;
    }

    addToCart(item);
  };

  // ✅ buy
  const handleBuy = (item) => {
    const user = localStorage.getItem("user");

    if (!user) {
      window.dispatchEvent(new Event("open-login"));
      return;
    }

    addToCart(item);
    router.push("/cart");
  };

  // ✅ filter
  const filtered = products.filter(
    (item) =>
      (category === "all" || item.category === category) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />

      <div className="bg-gray-100 min-h-screen py-6 px-4 md:px-10">
        {/* Top Bar */}
        <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="Search for products..."
            className="border px-4 py-2 rounded w-full md:w-1/3"
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border px-4 py-2 rounded"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="dresses">Fashion</option>
            <option value="shoes">Shoes</option>
            <option value="watches">Watches</option>
            <option value="phones">Mobiles</option>
            <option value="cosmetics">Beauty</option>
          </select>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3 rounded-lg shadow hover:shadow-lg transition"
            >
              {/* Image */}
              <div className="h-40 flex items-center justify-center bg-gray-50 rounded">
                <img
                  src={item.img}
                  alt={item.name}
                  className="h-full object-contain"
                />
              </div>

              {/* Details */}
              <h3 className="text-sm font-semibold mt-2 line-clamp-2">
                {item.name}
              </h3>

              <p className="text-green-600 font-bold">
                ₹{item.price}
              </p>

              {item.size && (
                <p className="text-xs text-gray-500">
                  Size: {item.size}
                </p>
              )}

              {/* Buttons */}
              <div className="flex gap-2 mt-2">
                
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

                <button
                  onClick={() => handleBuy(item)}
                  className="w-full bg-orange-500 text-white text-sm py-1 rounded hover:bg-orange-600"
                >
                  Buy
                </button>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}