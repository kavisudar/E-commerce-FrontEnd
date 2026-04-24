"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut, Activity, Users, ShieldCheck, Clock, Zap, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [logs, setLogs] = useState([])
  const router = useRouter()

  useEffect(() => {
    const session = localStorage.getItem("currentUser")
    if (!session) { router.push("/admin/auth") }
    else {
      setUser(JSON.parse(session))
      setLogs(JSON.parse(localStorage.getItem("login_history") || "[]").reverse())
    }
  }, [router])

  const logout = () => {
    localStorage.removeItem("currentUser")
    router.push("/admin/auth")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans p-6">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-10 bg-zinc-900/50 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight">Nexus Terminal</h1>
            <p className="text-zinc-500 text-xs">Operator: <span className="text-indigo-400">{user.name}</span></p>
          </div>
        </div>
        <Button variant="ghost" onClick={logout} className="text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl">
          <LogOut size={20} className="mr-2" /> Disconnect
        </Button>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-Time Status Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="System Performance" value="99.2%" detail="Optimal Range" icon={<Zap className="text-yellow-400" />} color="bg-yellow-400/10" />
          <StatCard title="Live Users" value="1,284" detail="+12% today" icon={<Users className="text-blue-400" />} color="bg-blue-400/10" />
          
          {/* History Table Container */}
          <div className="md:col-span-2 bg-zinc-900/30 border border-white/5 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Clock className="text-indigo-400" size={20}/> Access Logs
              </h2>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full uppercase tracking-widest">Live Updates</span>
            </div>
            <div className="space-y-3">
              {logs.map((log, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-bold text-indigo-400">
                      {log.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{log.name}</p>
                      <p className="text-[10px] text-zinc-500">{log.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-zinc-400">{log.time}</p>
                    <p className="text-[9px] text-green-500 flex items-center justify-end gap-1"><Activity size={10}/> Auth Verified</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Health Check */}
        <div className="space-y-6">
           <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Cloud Synced</h3>
                <p className="text-indigo-100 text-sm mb-6 opacity-80">Your dashboard is connected to the Nexus Real-time relay.</p>
                <Button className="w-full bg-white text-indigo-600 hover:bg-zinc-100 font-bold rounded-xl">
                  Check Updates <ExternalLink size={16} className="ml-2" />
                </Button>
              </div>
              <Activity className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform" />
           </div>
           
           <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
              <h3 className="text-sm font-bold text-zinc-400 mb-4 uppercase tracking-widest">Active Server Nodes</h3>
              <div className="space-y-4">
                 <NodeStatus name="US-East-1" status="Operational" load="24%" />
                 <NodeStatus name="EU-West-2" status="Operational" load="12%" />
                 <NodeStatus name="ASIA-S1" status="High Load" load="89%" color="text-orange-400" />
              </div>
           </div>
        </div>

      </main>
    </div>
  )
}

// Sub-components
function StatCard({ title, value, detail, icon, color }) {
  return (
    <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-3xl">
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-zinc-500 text-xs font-medium">{title}</p>
      <h4 className="text-2xl font-bold mt-1">{value}</h4>
      <p className="text-[10px] text-zinc-600 mt-2">{detail}</p>
    </div>
  )
}

function NodeStatus({ name, status, load, color = "text-green-500" }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-zinc-400">{name}</span>
      <span className={`font-mono font-bold ${color}`}>{load}</span>
    </div>
  )
}