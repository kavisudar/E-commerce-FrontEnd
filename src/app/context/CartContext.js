"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  //  cart data  from BACKEND
  const fetchCart = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    try {
      const res = await fetch(`http://localhost:8080/api/cart/${userId}`);
      const data = await res.json();

      // console.log("CART DATA ", data);

      setCart(data);
    } catch (err) {
      console.error("Cart fetch error", err);
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);

  // REMOVE ITEM
  const removeFromCart = async (id) => {
    await fetch(`http://localhost:8080/api/cart/${id}`, {
      method: "DELETE",
    });
    fetchCart();
  };

  //  total Price
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCart,
        removeFromCart,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);