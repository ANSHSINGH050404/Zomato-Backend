"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Restaurant } from "@/lib/types";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getRestaurants()
      .then((data) => setRestaurants(data.restaurants))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500">Loading restaurants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-white">Restaurants</h1>
      {restaurants.length === 0 ? (
        <p className="text-gray-500">No restaurants found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {restaurants.map((r) => (
            <Link
              key={r.id}
              href={`/restaurants/${r.id}`}
              className="block bg-[#111] rounded-lg shadow-lg border border-gray-800 p-4 hover:border-gray-700 transition-colors"
            >
              <h2 className="text-lg font-semibold text-white">{r.name}</h2>
              <p className="text-sm text-gray-400 mt-1">{r.address}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm bg-green-900 text-green-300 px-2 py-0.5 rounded">
                  ★ {r.rating.toFixed(1)}
                </span>
                {r.isOpen ? (
                  <span className="text-xs text-green-400">Open</span>
                ) : (
                  <span className="text-xs text-red-400">Closed</span>
                )}
              </div>
              {r.owner && (
                <p className="text-xs text-gray-600 mt-2">
                  by {r.owner.name}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
