"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200",
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [current]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="relative w-full h-62.5 sm:h-87.5 md:h-112.5 overflow-hidden">
      
      {/* Slider */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="slide"
            className="w-full h-full object-cover shrink-0"
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
        
        <h1 className="text-white text-xl sm:text-3xl md:text-5xl font-bold">
          Your One-Stop Shop for Everything!
        </h1>

        <Link
          href="/products"
          className="mt-4 px-6 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-500 transition"
        >
          Explore
        </Link>
      </div>

      {/* Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/70 px-2 sm:px-3 py-1 sm:py-2 rounded-full hover:bg-white"
      >
        ◀
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/70 px-2 sm:px-3 py-1 sm:py-2 rounded-full hover:bg-white"
      >
        ▶
      </button>
    </div>
  );
}