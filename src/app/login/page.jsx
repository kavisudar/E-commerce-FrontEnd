"use client";
import React from 'react'
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      
      {/* Card */}
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Login to ShopMart
        </h2>

        {/* Form */}
        <form className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 cursor-pointer text-sm text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

        
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember me
            </label>
            <span className="text-sky-500 cursor-pointer hover:underline">
              Forgot Password?
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600 transition"
          >
            Login
          </button>
        </form>

    
        <div className="my-4 text-center text-gray-400 text-sm">
          OR
        </div>

        {/* Social Login */}
        <button className="w-full border py-2 rounded-lg hover:bg-gray-100 transition">
          Continue with Google
        </button>

        {/* Signup */}
        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <span className="text-sky-500 cursor-pointer hover:underline">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}