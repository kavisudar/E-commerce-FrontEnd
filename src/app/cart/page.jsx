"use client";

import { useEffect, useState, useCallback } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { products } from "@/app/data/product";

const getImage = (productId) => {
  const product = products.find((p) => Number(p.id) === Number(productId));
  return product?.img || "https://via.placeholder.com/150";
};

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
          to   { opacity: 1; transform: translateX(0) scale(1); }
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

export default function Page() {
  const { toasts, addToast, removeToast } = useToast();

  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
  });

 
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
      //  console.log("CART DATA", JSON.stringify(data)); 
      setCart(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setCart([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  
  const increaseQty = async (id) => {
    await fetch(`http://localhost:8080/api/cart/increase/${id}`, { method: "PUT" });
    fetchCart();
  };

 
  const decreaseQty = async (id) => {
    await fetch(`http://localhost:8080/api/cart/decrease/${id}`, { method: "PUT" });
    fetchCart();
  };


  const removeItem = async (id) => {
    await fetch(`http://localhost:8080/api/cart/delete/${id}`, { method: "DELETE" });
    addToast("Item removed from cart", "info");
    fetchCart();
  };


  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );


  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  
  const handlePlaceOrder = async () => {
    const userId = getUserId(); 

    if (!userId) {
      addToast("Please login first", "warn");
      return;
    }

    if (!address.name || !address.phone || !address.address) {
      addToast("Please fill all required fields", "warn");
      return;
    }

    setLoading(true); 

    try {
      const res = await fetch(
        `http://localhost:8080/api/orders/place/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: address.name,
            phone: address.phone,
            address: address.address,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.error("ORDER ERROR", err);
        addToast("Order failed. Please try again.", "error");
        return;
      }

      setShowCheckout(false);
      addToast("Order placed successfully! 🎉", "success", 4000);

  
      setTimeout(() => {
        window.location.href = "/order";
      }, 1500);

    } catch (err) {
      console.error("FRONTEND ERROR", err);
      addToast("Server error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 md:px-10">
      <Toast toasts={toasts} removeToast={removeToast} />

      <h1 className="text-3xl font-bold mb-8">🛒 Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center">
          <h4>Cart is empty</h4>
          <Link href="/products">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
  <div
    key={item.id}
    className="flex justify-between bg-white p-4 rounded shadow"
  >
    <div className="flex gap-4 items-center">
      {/* ADD THIS */}
      <img
        src={getImage(item.productId)}
        className="w-16 h-16 object-contain bg-gray-50 rounded"
      />

      <div>
        <h2 className="font-semibold">{item.name}</h2>
        <p className="text-green-600">₹{item.price}</p>

        <div className="flex gap-3 mt-2 items-center">
          <button
            onClick={() => decreaseQty(item.id)}
            className="px-2 bg-gray-300"
          >
            <Minus size={16} />
          </button>
          <span>{item.quantity}</span>
          <button
            onClick={() => increaseQty(item.id)}
            className="px-2 bg-gray-300"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>

    <button onClick={() => removeItem(item.id)} className="text-red-500">
      <Trash2 />
    </button>
  </div>
))}
          </div>

          {/* RIGHT */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="font-bold mb-3">Price Summary</h2>
            <p className="text-gray-500 text-sm">{cart.length} item(s)</p>
            <p className="text-xl font-bold text-green-600 mt-1">₹{totalPrice}</p>

            <button
              onClick={() => setShowCheckout(true)}
              className="bg-green-500 text-white w-full mt-4 py-2 rounded"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-80 shadow-2xl">
            <h2 className="text-lg font-bold mb-4">📦 Delivery Details</h2>

            <input
              name="name"
              placeholder="Full Name *"
              onChange={handleChange}
              className="border w-full mb-2 p-2 rounded"
            />
            <input
              name="phone"
              placeholder="Phone Number *"
              onChange={handleChange}
              className="border w-full mb-2 p-2 rounded"
            />
            <input
              name="address"
              placeholder="Delivery Address *"
              onChange={handleChange}
              className="border w-full mb-2 p-2 rounded"
            />

            <div className="flex gap-2 mt-3">
             
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="flex-1 bg-green-500 text-white py-2 rounded-xl font-medium hover:bg-green-600 transition disabled:opacity-60"
              >
                {loading ? "Placing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}