"use client";
import React from "react";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="w-11/12 mx-auto py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-4">ShopMart</h2>
          <p className="text-gray-400 text-sm">
            Your one-stop shop for fashion, electronics, and more.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Products</li>
            <li className="hover:text-white cursor-pointer">Help</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-white cursor-pointer">Fashion</li>
            <li className="hover:text-white cursor-pointer">Electronics</li>
            <li className="hover:text-white cursor-pointer">Beauty</li>
            <li className="hover:text-white cursor-pointer">Sports</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
          <p className="text-gray-400 text-sm mb-3">
            Get latest deals and updates
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter email"
              className="px-3 py-2 rounded text-white bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500">
              Join
            </button>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 text-center py-4 text-gray-400 text-sm">
        © 2026 ShopMart. All rights reserved.
      </div>
    </footer>
  );
}