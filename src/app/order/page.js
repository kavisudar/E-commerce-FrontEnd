"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function StatusBadge({ status }) {
  const isDelivered = status.toLowerCase() === "delivered";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
        isDelivered
          ? "bg-green-50 text-green-700 border-green-300"
          : "bg-blue-50 text-blue-700 border-blue-300"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
          isDelivered ? "bg-green-500" : "bg-blue-500"
        }`}
      />
      {status}
    </span>
  );
}

function PaymentChip({ method }) {
  const isUPI = method.toLowerCase().includes("upi");
  const isCOD = method.toLowerCase().includes("cash");

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md border border-gray-200 bg-white text-gray-600">
      {isCOD ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
      ) : isUPI ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      )}
      {method}
    </span>
  );
}

export default function Page() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(data.reverse());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className="max-w-3xl mx-auto">

        {/* Page Header */}
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
              Account
            </p>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              My Orders
            </h1>
          </div>
          {orders.length > 0 && (
            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-500 whitespace-nowrap mb-1">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </span>
          )}
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-500 text-sm mb-7 max-w-xs">
              Looks like you haven't placed any orders. Start shopping to see them here.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Browse Products
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const orderTotal = order.items.reduce(
                (acc, item) => acc + item.price * item.qty,
                0
              );

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex flex-wrap gap-5">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
                          Order ID
                        </p>
                        <p className="text-sm font-medium text-gray-800 font-mono">
                          #{order.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
                          Ordered on
                        </p>
                        <p className="text-sm font-medium text-gray-800">
                          {new Date(order.id).toDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
                          Delivery by
                        </p>
                        <p className="text-sm font-medium text-gray-800">
                          {order.deliveryDate}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status="Delivered" />
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-gray-100 px-5">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 py-4">
                        {/* Image */}
                        <div className="w-14 h-14 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Qty: {item.qty}
                            {item.size && <> · Size: {item.size}</>}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold text-gray-900">
                            ₹{(item.price * item.qty).toLocaleString("en-IN")}
                          </p>
                          {item.qty > 1 && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              ₹{item.price.toLocaleString("en-IN")} each
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-gray-100 bg-gray-50">
                    {/* Address */}
                    <div className="px-5 py-4 sm:border-r border-gray-100">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                        Delivery address
                      </p>
                      <p className="text-sm font-medium text-gray-800 leading-snug">
                        {order.address.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                        {order.address.address}
                      </p>
                      {order.address.landmark && (
                        <p className="text-xs text-gray-500 leading-snug">
                          {order.address.landmark}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        📞 {order.address.phone}
                      </p>
                    </div>

                    {/* Payment */}
                    <div className="px-5 py-4 sm:border-r border-t sm:border-t-0 border-gray-100">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                        Payment
                      </p>
                      <PaymentChip method={order.payment} />
                    </div>

                    {/* Total */}
                    <div className="px-5 py-4 border-t sm:border-t-0 border-gray-100 sm:text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                        Order total
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{orderTotal.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}