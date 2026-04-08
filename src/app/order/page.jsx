"use client";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(data);
  }, []);

  return (
    <div className="w-11/12 mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">📦 My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="bg-white p-4 rounded shadow mb-4">

            <p className="font-semibold">Delivery: {order.deliveryDate}</p>
            <p className="text-sm text-gray-600">
              {order.address.address}, {order.address.landmark}
            </p>

            <div className="mt-3">
              {order.items.map((item) => (
                <p key={item.id}>
                  {item.name} x {item.qty}
                </p>
              ))}
            </div>

            <p className="mt-2 text-green-600 font-bold">
              Payment: {order.payment}
            </p>
          </div>
        ))
      )}
    </div>
  );
}