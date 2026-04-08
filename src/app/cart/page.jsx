"use client";

import { useCart } from "@/app/context/page";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    totalPrice,
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    landmark: "",
  });

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const getDeliveryDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toDateString();
  };

  const handlePlaceOrder = () => {
    if (!address.name || !address.phone || !address.address) {
      alert("Please fill all details");
      return;
    }

    const order = {
      id: Date.now(),
      items: cart,
      address,
      deliveryDate: getDeliveryDate(),
      payment: "COD",
    };

    const prevOrders = JSON.parse(localStorage.getItem("orders")) || [];
    localStorage.setItem("orders", JSON.stringify([...prevOrders, order]));

    setOrderPlaced(true);
    setShowCheckout(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 md:px-10">
      <h1 className="text-3xl font-bold mb-8">🛒 Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          <h4>Your cart is empty 😔</h4>
          <div className="mt-16">
            <Link
              href="/products"
              className="bg-orange-400 text-white py-2 px-4 rounded-lg hover:bg-orange-600"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-white p-4 rounded-2xl shadow"
              >
                <div className="w-24 h-24 bg-gray-50 rounded flex items-center justify-center">
                  <img src={item.img} className="h-full object-contain" />
                </div>

                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-green-600 font-bold">
                    ₹{item.price}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="p-1 bg-gray-200 rounded"
                    >
                      <Minus size={16} />
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() => increaseQty(item.id)}
                      className="p-1 bg-gray-200 rounded"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500"
                >
                  <Trash2 />
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="bg-white p-6 rounded-2xl shadow h-fit">
            <h2 className="text-xl font-bold mb-4">
              Price Details
            </h2>

            <div className="flex justify-between mb-2">
              <span>Items</span>
              <span>{cart.length}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Total</span>
              <span className="font-bold">₹{totalPrice}</span>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="bg-green-500 text-white px-6 py-2 rounded mt-5 w-full"
            >
              Place Order
            </button>
          </div>
        </div>
      )}

      {/* ✅ CHECKOUT MODAL */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Delivery Details
            </h2>

            <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full border p-2 mb-2 rounded" />
            <input name="phone" placeholder="Phone Number" onChange={handleChange} className="w-full border p-2 mb-2 rounded" />
            <input name="address" placeholder="Address" onChange={handleChange} className="w-full border p-2 mb-2 rounded" />
            <input name="landmark" placeholder="Landmark" onChange={handleChange} className="w-full border p-2 mb-2 rounded" />

            <p className="text-sm mt-2">
              📦 Delivery by: <b>{getDeliveryDate()}</b>
            </p>

            <p className="text-sm mt-2">
              💰 Payment: <b>Cash on Delivery</b>
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handlePlaceOrder}
                className="bg-green-500 text-white px-4 py-2 rounded w-full"
              >
                Confirm Order
              </button>

              <button
                onClick={() => setShowCheckout(false)}
                className="bg-gray-300 px-4 py-2 rounded w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ SUCCESS TOAST */}
      {orderPlaced && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          🎉 Order Placed Successfully!
        </div>
      )}
    </div>
  );
}