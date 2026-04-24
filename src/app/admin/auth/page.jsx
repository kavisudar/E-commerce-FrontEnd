"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Mail, User, ArrowRight, Sparkles, Globe, CheckCircle, XCircle, Loader2, ShieldAlert } from 'lucide-react'
import { Button } from "@/components/ui/button"

// Toast Component 
function Toast({ toasts }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className={`flex items-start gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl min-w-65 max-w-85
              ${t.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300'
                : t.type === 'error'
                ? 'bg-red-950/80 border-red-500/30 text-red-300'
                : 'bg-zinc-900/80 border-white/10 text-zinc-300'
              }`}
          >
            <span className="mt-0.5 shrink-0">
              {t.type === 'success' && <CheckCircle size={18} className="text-emerald-400" />}
              {t.type === 'error'   && <XCircle size={18} className="text-red-400" />}
              {t.type === 'info'    && <ShieldAlert size={18} className="text-indigo-400" />}
            </span>
            <p className="text-sm font-medium leading-snug">{t.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

//  Password Strength Bar 
function StrengthBar({ strength }) {
  const levels = { Weak: 1, Medium: 2, Strong: 3 }
  const level = levels[strength] || 0
  const colors = ['bg-zinc-700', 'bg-red-500', 'bg-yellow-400', 'bg-emerald-400']
  const labels = ['', 'Weak', 'Medium', 'Strong']
  const labelColors = ['', 'text-red-400', 'text-yellow-400', 'text-emerald-400']

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= level ? colors[level] : 'bg-zinc-800'}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
          />
        ))}
      </div>
      {strength && (
        <p className={`text-xs font-semibold tracking-wide ${labelColors[level]}`}>
          {labels[level]} password
        </p>
      )}
    </div>
  )
}

// Main Component
export default function ModernAuth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [strength, setStrength] = useState("")
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState([])
  const router = useRouter()

  // Toast helpers 
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  //  Password validation
  const validatePassword = (pwd) => {
    const hasNumber  = /[0-9]/.test(pwd)
    const hasChar    = /[a-zA-Z]/.test(pwd)
    const hasSpecial = /[^a-zA-Z0-9]/.test(pwd)
    const validLen   = pwd.length >= 8 && pwd.length <= 10

    if (!validLen) return pwd.length < 8 ? "Weak" : ""
    if (!hasNumber || !hasChar || !hasSpecial) return "Weak"
    if (pwd.length === 10) return "Strong"
    if (pwd.length >= 9)   return "Medium"
    return "Weak"
  }

  const handlePasswordChange = (e) => {
    const val = e.target.value
    setPassword(val)
    setStrength(validatePassword(val))
  }

  const isValidPassword = () => strength === "Strong" || strength === "Medium"

  //  Authentication 
  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        //  LOGIN
        const res = await fetch("http://localhost:8080/api/auth/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })

        if (!res.ok) {
          const msg = await res.text()
          addToast(msg || "Invalid credentials. Access denied.", 'error')
          return
        }

        const user = await res.json()
        localStorage.setItem("admin", JSON.stringify(user))
        addToast("Welcome back! Redirecting…", 'success')
        router.push("/admin/dash")

      } else {
        //  REGISTER
        if (!isValidPassword()) {
          addToast("Password must be 8–10 chars with a letter, number & special character.", 'error')
          return
        }

        const res = await fetch("http://localhost:8080/api/auth/admin/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        })

        const msg = await res.text()

        if (!res.ok) {
          addToast(msg || "Registration failed. Please try again.", 'error')
          return
        }

        const user = (() => { try { return JSON.parse(msg) } catch { return null } })()
        if (user) localStorage.setItem("admin", JSON.stringify(user))

        addToast("Admin account created! Redirecting…", 'success')
        router.push("/admin/dash")
      }
    } catch (err) {
      console.error(err)
      addToast("Cannot reach the server. Please check your connection.", 'error')
    } finally {
      setLoading(false)
    }
  }

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <>
      <Toast toasts={toasts} />

      <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0c] relative overflow-hidden font-sans">
        {/* ambient blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-700" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-250 h-150 flex bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* ── Left panel ── */}
          <div className="hidden md:flex w-1/2 bg-linear-to-br from-indigo-600 to-purple-700 p-12 flex-col justify-between text-white relative">
            <div className="z-10">
              <div className="flex items-center gap-2 mb-8">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                  <Globe size={24} className="animate-spin-slow" />
                </div>
                <span className="font-bold tracking-widest text-xl">SHOPMART ADMIN</span>
              </div>
              <h2 className="text-4xl font-extrabold leading-tight">
                Control your <br /> Ecosystem in <br />
                <span className="text-indigo-200">Real-Time.</span>
              </h2>
            </div>

            <div className="z-10 space-y-4">
              <div className="flex items-center gap-3 text-sm bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-md">
                <Sparkles size={18} className="text-yellow-300" />
                <span>v2.0 Active: Gmail Syncing Enabled</span>
              </div>
            </div>

            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />
          </div>

          {/* ── Right panel ── */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-zinc-950/50 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-3xl font-bold text-white">
                    {isLogin ? "Sign In" : "Register"}
                  </h3>
                  <p className="text-zinc-400 mt-2 text-sm">
                    ShopMart Centralized Management System
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  {/* Name (register only) */}
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative group overflow-hidden"
                      >
                        <User className="absolute left-3 top-3 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                          className="w-full bg-zinc-900 text-white pl-10 pr-4 py-3 rounded-xl outline-none border border-transparent focus:border-indigo-500/50 transition-colors"
                          placeholder="Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email */}
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                      type="email"
                      className="w-full bg-zinc-900 text-white pl-10 pr-4 py-3 rounded-xl outline-none border border-transparent focus:border-indigo-500/50 transition-colors"
                      placeholder="Admin Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                      <input
                        type="password"
                        className="w-full bg-zinc-900 text-white pl-10 pr-4 py-3 rounded-xl outline-none border border-transparent focus:border-indigo-500/50 transition-colors"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>

                    {/* Strength bar (register only) */}
                    <AnimatePresence>
                      {!isLogin && password && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                        >
                          <StrengthBar strength={strength} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-all"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 size={20} className="animate-spin" />
                        {isLogin ? "Authenticating…" : "Creating account…"}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {isLogin ? "Authenticate" : "Create Core Account"}
                        <ArrowRight size={20} />
                      </span>
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => { setIsLogin(!isLogin); setPassword(""); setStrength("") }}
                    className="text-zinc-500 text-sm hover:text-indigo-400 transition-colors"
                  >
                    {isLogin
                      ? "Need new credentials? Register core"
                      : "Already have access? Sign In"}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </>
  )
}
