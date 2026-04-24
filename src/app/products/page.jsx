"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/app/Navbar/page";
import { useRouter } from "next/navigation";
import { products } from "@/app/data/product";
import JarvisBot from "@/app/bot/page";

function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-5 right-5 z-9999 flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white text-sm font-medium min-w-[260px] max-w-xs
            transition-all duration-500 animate-slide-in
            ${t.type === "success" ? "bg-linear-to-r from-green-500 to-emerald-600" : ""}
            ${t.type === "error"   ? "bg-linear-to-r from-red-500 to-rose-600"     : ""}
            ${t.type === "info"    ? "bg-linear-to-r from-orange-500 to-amber-500" : ""}
            ${t.type === "warn"    ? "bg-linear-to-r from-yellow-400 to-orange-400 text-gray-900" : ""}
          `}
        >
          <span className="text-lg">
            {t.type === "success" && "✅"}
            {t.type === "error"   && "❌"}
            {t.type === "info"    && "ℹ️"}
            {t.type === "warn"    && "⚠️"}
          </span>
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="ml-1 opacity-70 hover:opacity-100 text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}

      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(60px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0)    scale(1);    }
        }
        .animate-slide-in { animation: slide-in 0.35s cubic-bezier(.22,1,.36,1) both; }
      `}</style>
    </div>
  );
}


function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

export default function ProductsPage() {
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [botOpen, setBotOpen] = useState(false);

  const getUserId = () => {
    if (typeof window !== "undefined") return localStorage.getItem("userId");
    return null;
  };

  const fetchCart = async () => {
    const userId = getUserId();
    if (!userId) return setCart([]);
    try {
      const res = await fetch(`http://localhost:8080/api/cart/${userId}`);
      const data = await res.json();
      setCart(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setCart([]);
    }
  };

  const isInCart = (id) =>
    Array.isArray(cart) && cart.some((i) => i.productId === id);

  const handleAdd = async (item) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      addToast("Please login to add items to cart", "warn");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/cart/add/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        }),
      });

      if (!res.ok) {
        addToast("Failed to add item. Try again.", "error");
        return;
      }

      addToast(`${item.name} added to cart!`, "success");
      fetchCart();
    } catch {
      addToast("Server error. Please try again.", "error");
    }
  };

  const handleBuy = async (item) => {
    await handleAdd(item);
    router.push("/cart");
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const filtered = products.filter(
    (item) =>
      (category === "all" || item.category === category) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className="bg-gray-100 min-h-screen p-6">
        {/* Search */}
        <div className="bg-white p-4 rounded shadow flex gap-4">
          <input
            placeholder="Search..."
            className="border p-2 w-full"
            onChange={(e) => setSearch(e.target.value)}
          />
          <select onChange={(e) => setCategory(e.target.value)}>
  <option value="all">All</option>
  <option value="dresses">Fashion</option>
  <option value="shoes">Shoes</option>
  <option value="watches">Watches</option>
  <option value="phones">Mobiles</option>
  <option value="cosmetics">Cosmetics</option>
</select>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white p-3 rounded shadow">
              <img src={item.img} className="h-40 mx-auto" />
              <h3>{item.name}</h3>
              <p className="text-green-600">₹{item.price}</p>

              <div className="flex gap-2 mt-2">
                {isInCart(item.id) ? (
                  <button
                    onClick={() => router.push("/cart")}
                    className="bg-green-500 text-white w-full"
                  >
                    Go
                  </button>
                ) : (
                  <button
                    onClick={() => handleAdd(item)}
                    className="bg-yellow-400 w-full"
                  >
                    Add
                  </button>
                )}
                <button
                  onClick={() => handleBuy(item)}
                  className="bg-orange-500 text-white w-full"
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bot */}
      <button
        onClick={() => setBotOpen(true)}
        className="fixed bottom-6 right-6 bg-orange-600 text-white p-4 rounded-full shadow-xl z-[9999]"
      >
        💬
      </button>

      <JarvisBot isOpen={botOpen} onClose={() => setBotOpen(false)} />
    </div>
  );
}