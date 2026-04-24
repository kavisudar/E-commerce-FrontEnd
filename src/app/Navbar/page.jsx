"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in { animation: modal-in 0.3s cubic-bezier(.22,1,.36,1) both; }
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
  const { cart } = useCart();
  const { toasts, addToast, removeToast } = useToast();

  const [user, setUser]             = useState(null);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [showLogin, setShowLogin]   = useState(false);
  const [isSignup, setIsSignup]     = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading]       = useState(false);
  const [showPass, setShowPass]     = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const capitalize = (str = "") => str.charAt(0).toUpperCase() + str.slice(1);

  useEffect(() => {
    const openLogin = () => setShowLogin(true);
    window.addEventListener("open-login", openLogin);
    return () => window.removeEventListener("open-login", openLogin);
  }, []);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) {
      const parsed = JSON.parse(u);
      setUser(parsed);
      if (parsed?.id) localStorage.setItem("userId", parsed.id);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localStorage.getItem("loginShown")) {
        setShowLogin(true);
        localStorage.setItem("loginShown", "true");
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const switchToSignup = () => {
    setIsSignup(true);
    setLoginError("");
    setFormData({ name: "", phone: "", email: "", password: "", confirmPassword: "" });
  };

  const switchToLogin = () => {
    setIsSignup(false);
    setLoginError("");
    setLoginData({ email: "", password: "" });
  };

  const closeModal = () => {
    setShowLogin(false);
    setLoginError("");
    setIsSignup(false);
  };

  const handleChange      = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      if (!res.ok) {
        const msg = await res.text();
        setLoginError(msg || "Invalid email or password");
        return;
      }

      const userData = await res.json();
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userId", userData.id);
      setUser(userData);
      closeModal();
      addToast(`Welcome back, ${capitalize(userData.name)}! 👋`, "success");
    } catch {
      setLoginError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email || !formData.password) {
      setLoginError("Please fill all fields");
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setLoginError("Enter a valid 10-digit phone number");
      return;
    }
    if (formData.password.length < 6) {
      setLoginError("Password must be at least 6 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setLoginError("Passwords do not match");
      return;
    }

    setLoading(true);
    setLoginError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
        }),
      });

      const msg = await res.text();

      if (msg === "User registered successfully") {
        addToast("Account created! Please login. 🎉", "success");
        setFormData({ name: "", phone: "", email: "", password: "", confirmPassword: "" });
        switchToLogin();
      } else {
        setLoginError(msg || "Registration failed");
      }
    } catch {
      setLoginError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setUser(null);
    addToast("Logged out successfully", "info");
  };

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className="bg-sky-400 shadow-md">
        <div className="w-11/12 mx-auto flex justify-between items-center py-4">
          <h1 className="text-white text-2xl font-bold">ShopMart</h1>

          <div className="hidden md:flex gap-6 text-white items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="w-10 h-10 bg-yellow-400 text-black flex items-center justify-center rounded-full font-bold cursor-pointer hover:scale-105 transition">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <div className="px-3 py-2 font-semibold border-b">
                    {capitalize(user?.name)}
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/order">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/cart">Cart</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-white text-sky-500 font-semibold px-4 py-1.5 rounded-full hover:bg-sky-50 transition"
              >
                Login
              </button>
            )}

            <Link href="/cart">
  <Button variant="ghost" size="icon" className="relative">
    <ShoppingCart className="h-6 w-6" />
    {cart?.length > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
        {cart.length}
      </span>
    )}
  </Button>
</Link>
          </div>

          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {showLogin && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-modal-in">

            <div className="bg-linear-to-r from-sky-400 to-blue-500 px-6 py-5 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">
                    {isSignup ? "Create Account" : "Welcome Back"}
                  </h2>
                  <p className="text-sky-100 text-sm mt-0.5">
                    {isSignup ? "Join ShopMart today" : "Login to continue shopping"}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white/70 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="flex mt-4 bg-white/20 rounded-full p-1 w-fit gap-1">
                <button
                  onClick={switchToLogin}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                    !isSignup ? "bg-white text-sky-600" : "text-white"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={switchToSignup}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                    isSignup ? "bg-white text-sky-600" : "text-white"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
              {!isSignup ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      onChange={handleLoginChange}
                      value={loginData.email}
                      className="w-full border border-gray-200 p-2.5 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative mt-1">
                      <input
                        name="password"
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        onChange={handleLoginChange}
                        value={loginData.password}
                        className="w-full border border-gray-200 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                      >
                        {showPass ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
                      ⚠️ {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-linear-to-r from-sky-400 to-blue-500 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
                  >
                    {loading ? "Logging in..." : "Login →"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      name="name"
                      placeholder="Your name"
                      onChange={handleChange}
                      value={formData.name}
                      className="w-full border border-gray-200 p-2.5 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <input
                      name="phone"
                      placeholder="10-digit mobile number"
                      onChange={handleChange}
                      value={formData.phone}
                      maxLength={10}
                      className="w-full border border-gray-200 p-2.5 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      onChange={handleChange}
                      value={formData.email}
                      className="w-full border border-gray-200 p-2.5 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative mt-1">
                      <input
                        name="password"
                        type={showPass ? "text" : "password"}
                        placeholder="Min. 6 characters"
                        onChange={handleChange}
                        value={formData.password}
                        className="w-full border border-gray-200 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                      >
                        {showPass ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                    <div className="relative mt-1">
                      <input
                        name="confirmPassword"
                        type={showConfirmPass ? "text" : "password"}
                        placeholder="Re-enter password"
                        onChange={handleChange}
                        value={formData.confirmPassword}
                        className="w-full border border-gray-200 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                      >
                        {formData.confirmPassword.length > 0
                          ? formData.password === formData.confirmPassword ? "✅" : "❌"
                          : showConfirmPass ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
                      ⚠️ {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-linear-to-r from-sky-400 to-blue-500 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
                  >
                    {loading ? "Creating account..." : "Create Account →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}