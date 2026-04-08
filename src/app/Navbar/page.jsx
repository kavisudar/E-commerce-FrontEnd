"use client";

import Link from "next/link";
import { useCart } from "@/app/context/page";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,DropdownMenuTrigger,DropdownMenuSeparator,} from "@/components/ui/dropdown-menu";
import { ShoppingCart, Heart, Settings, LogOut } from "lucide-react";

export default function Page() {
  const { cart } = useCart();

  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState("");

  // 🔥 open login from other pages
  useEffect(() => {
    const openLogin = () => setShowLogin(true);
    window.addEventListener("open-login", openLogin);
    return () => window.removeEventListener("open-login", openLogin);
  }, []);

  // 🔥 load user
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  // 🔥 auto popup
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localStorage.getItem("loginShown")) {
        setShowLogin(true);
        localStorage.setItem("loginShown", "true");
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // INPUT HANDLERS
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // 🔐 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      if (res.ok) {
        const userData = await res.json();

        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        setShowLogin(false);
        setLoginError("");

        setToast(true);
        setTimeout(() => setToast(false), 3000);
      } else {
        const msg = await res.text();
        setLoginError(msg);
      }
    } catch {
      setLoginError("Server error");
    }
  };

  // 📝 SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const msg = await res.text();

      if (msg === "User registered successfully") {
        localStorage.setItem("user", JSON.stringify(formData));
        setUser(formData);

        setToast(true);
        setTimeout(() => setToast(false), 3000);

        setShowLogin(false);
        setIsSignup(false);
      } else {
        alert(msg);
      }

      setFormData({ name: "", email: "", password: "" });
    } catch {
      alert("Error connecting to server");
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="bg-sky-400 shadow-md">
        <div className="w-11/12 mx-auto flex justify-between items-center py-4">
          <h1 className="text-white text-2xl font-bold">ShopMart</h1>

          <ul className="hidden md:flex gap-8 text-white font-semibold">
            <li>Fashion</li>
            <li>Electronics</li>
            <li>Beauty</li>
            <li>Sports</li>
            <li>Books</li>
          </ul>

          <div className="hidden md:flex gap-6 text-white items-center">
            
            {/* PROFILE */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="w-10 h-10 bg-yellow-400 text-black flex items-center justify-center rounded-full font-bold cursor-pointer">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56">
                  <div className="px-3 py-2 font-semibold text-sm border-b">
                    {user?.name}
                  </div>

                  <DropdownMenuItem asChild>
                    <Link href="/order">My Orders</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/cart">Cart</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/favorites">Wishlist</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/account">Account</Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => {
                      localStorage.removeItem("user");
                      setUser(null);
                    }}
                    className="text-red-500"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button onClick={() => setShowLogin(true)}>Login</button>
            )}

            {/* CART */}
            <Link href="/cart">Cart ({cart?.length || 0})</Link>
          </div>

          {/* MOBILE */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden bg-sky-500 px-6 py-4 space-y-4 text-white">
            <p>Fashion</p>
            <p>Electronics</p>
            <p>Beauty</p>
            <p>Sports</p>
            <p>Books</p>

            <hr />

            {user ? (
              <p
                onClick={() => {
                  localStorage.removeItem("user");
                  setUser(null);
                }}
              >
                Logout
              </p>
            ) : (
              <p onClick={() => setShowLogin(true)}>Login</p>
            )}

            <p>Cart ({cart?.length || 0})</p>
          </div>
        )}
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden relative">

            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-3 right-3 text-xl"
            >
              ✕
            </button>

            <div className={`flex w-[200%] transition ${isSignup ? "-translate-x-1/2" : ""}`}>

              {/* LOGIN */}
              <div className="w-1/2 p-6">
                <h2 className="text-xl font-bold mb-4">Login</h2>

                <form onSubmit={handleLogin} className="space-y-3">
                  <input name="email" placeholder="Email" onChange={handleLoginChange} className="w-full border p-2 rounded" />
                  <input name="password" type="password" placeholder="Password" onChange={handleLoginChange} className="w-full border p-2 rounded" />

                  {loginError && <p className="text-red-500 text-sm">{loginError}</p>}

                  <button className="w-full bg-sky-500 text-white py-2 rounded">Login</button>
                </form>

                <p className="mt-3 text-sm">
                  No account?{" "}
                  <span onClick={() => setIsSignup(true)} className="text-blue-500 cursor-pointer">
                    Sign up
                  </span>
                </p>
              </div>

              {/* SIGNUP */}
              <div className="w-1/2 p-6 bg-gray-50">
                <h2 className="text-xl font-bold mb-4">Sign Up</h2>

                <form onSubmit={handleSignup} className="space-y-3">
                  <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" />
                  <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" />
                  <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full border p-2 rounded" />

                  <button className="w-full bg-green-500 text-white py-2 rounded">Sign Up</button>
                </form>

                <p className="mt-3 text-sm">
                  Already have account?{" "}
                  <span onClick={() => setIsSignup(false)} className="text-blue-500 cursor-pointer">
                    Login
                  </span>
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow">
          ✅ Success!
        </div>
      )}
    </>
  );
}