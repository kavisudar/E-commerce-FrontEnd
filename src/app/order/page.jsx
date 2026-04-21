"use client";

import { useEffect, useState, useCallback } from "react";
import { products } from "@/app/data/product";

// ── Toast Component ──────────────────────────────────────────
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

function ConfirmDialog({ isOpen, onConfirm, onCancel, orderId }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 animate-slide-in">
        <div className="text-center mb-4">
          <span className="text-4xl">🗑️</span>
          <h2 className="text-lg font-bold mt-2 text-gray-800">Cancel Order?</h2>
          <p className="text-sm text-gray-500 mt-1">
            Are you sure you want to cancel <b>Order #{orderId}</b>? This cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-50 transition"
          >
            Keep Order
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-linear-to-r from-red-500 to-rose-600 text-white py-2 rounded-xl font-medium hover:opacity-90 transition"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
}


export default function OrdersPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [confirm, setConfirm] = useState({ open: false, orderId: null });

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const getImage = (productId) => {
    if (!products || products.length === 0)
      return "https://via.placeholder.com/150";
    const product = products.find((p) => Number(p.id) === Number(productId));
    return product?.img || "https://via.placeholder.com/150";
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/orders/${userId}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      addToast("Failed to load orders. Try again.", "error");
    }
  };

  useEffect(() => {
    if (userId) fetchOrders();
  }, [userId]);

  const confirmCancel = (orderId) => {
    setConfirm({ open: true, orderId });
  };

  const cancelOrder = async () => {
    const orderId = confirm.orderId;
    setConfirm({ open: false, orderId: null });
    try {
      const res = await fetch(
        `http://localhost:8080/api/orders/cancel/${orderId}`,
        { method: "PUT" }
      );
      if (!res.ok) {
        addToast("Failed to cancel order. Try again.", "error");
        return;
      }
      addToast(`Order #${orderId} has been cancelled.`, "success");
      fetchOrders();
    } catch {
      addToast("Server error. Please try again.", "error");
    }
  };

  const getDeliveryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toDateString();
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <Toast toasts={toasts} removeToast={removeToast} />
      <ConfirmDialog
        isOpen={confirm.open}
        orderId={confirm.orderId}
        onConfirm={cancelOrder}
        onCancel={() => setConfirm({ open: false, orderId: null })}
      />

      <h1 className="text-3xl font-bold mb-6">📦 My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">No orders found 😔</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-md p-5">
              {/* HEADER */}
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <div>
                  <p className="font-semibold">Order ID: {order.id}</p>
                  <p className="text-sm text-gray-500">
                    Ordered on: {new Date().toDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">₹{order.total}</p>
                 {order.status !== "CANCELLED" ? <p className="text-xs text-gray-500">
                    Delivery by {getDeliveryDate()}
                  </p> : <p className="text-xs text-red-500">Order Cancelled</p>} 
                </div>
              </div>

              {/* ITEMS */}
              <div className="space-y-4">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center border p-3 rounded-lg">
                    <img
                      src={getImage(item.productId)}
                      className="w-20 h-20 object-contain bg-gray-50 rounded"
                    />
                    <div className="flex-1">
                      <h2 className="font-semibold text-lg">{item.name}</h2>
                      <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                      <p className="text-green-600 font-bold">₹{item.price}</p>
                      <div className="flex gap-1 mt-2">
                        {[1, 2, 3, 4,].map((star) => (
                          <span key={star}>⭐</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* TRACKING */}
              <div className="mt-4 border-t pt-3">
                <p className="text-sm font-semibold mb-2">Tracking</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Ordered</span>
                  <span>Shipped</span>
                  <span>Out for delivery</span>
                  <span className="text-green-600">Delivered</span>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="mt-4 pt-3 border-t text-sm text-gray-600">
                <p><b>Delivery to:</b> {order.name}</p>
                <p>{order.address}</p>
                <p>📞 {order.phone}</p>
              </div>

              {/* ACTION */}
              <div className="mt-4 flex justify-end">
                {order.status !== "CANCELLED" ? (
                  <button
                    onClick={() => confirmCancel(order.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded"
                  >
                    Cancel Order
                  </button>
                ) : (
                  <h2 className="bg-red-500 text-white px-4 py-1 rounded">Order Cancelled</h2>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}