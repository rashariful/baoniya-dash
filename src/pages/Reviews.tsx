"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "জাহাঙ্গীর হোসেন",
    text: "আলহামদুলিল্লাহ অত্যন্ত ভালো একটি জিনিস",
    image: "/reviews/user1.png",
    rating: 5,
  },
  {
    id: 2,
    name: "Md Shariful Islam",
    text: "খুব সুন্দর সার্ভিস, আমি সন্তুষ্ট",
    image: "/reviews/user2.png",
    rating: 5,
  },
  {
    id: 3,
    name: "Happy Client",
    text: "Highly recommended! Excellent quality.",
    image: "/reviews/user3.png",
    rating: 4,
  },
];

export default function Reviews() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => {
    setCurrent((current - 1 + reviews.length) % reviews.length);
  };

  const next = () => {
    setCurrent((current + 1) % reviews.length);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
        ⭐ Client Reviews
      </h2>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="min-w-full flex justify-center"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 w-full md:w-3/4 text-center">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-20 h-20 rounded-full mx-auto border-4 border-blue-500"
                />

                <h3 className="mt-4 text-lg font-semibold">
                  {review.name}
                </h3>

                <div className="flex justify-center mt-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>

                <p className="mt-4 text-gray-600 text-sm md:text-base">
                  “{review.text}”
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-6 gap-2">
        {reviews.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${
              current === i ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
