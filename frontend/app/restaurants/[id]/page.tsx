"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Restaurant } from "@/lib/types";

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    api
      .getRestaurant(id)
      .then((data) => setRestaurant(data.restaurant))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <p className="text-red-400">{error || "Restaurant not found"}</p>
        <Link href="/restaurants" className="text-red-500 hover:underline text-sm mt-2 inline-block">
          ← Back to restaurants
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === restaurant.ownerId;

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <Link href="/restaurants" className="text-red-500 hover:underline text-sm">
        ← Back to restaurants
      </Link>

      <div className="bg-[#111] rounded-lg shadow-lg border border-gray-800 p-6 mt-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{restaurant.name}</h1>
            <p className="text-gray-400 mt-1">{restaurant.address}</p>
          </div>
          <div className="text-right">
            <span className="bg-green-900 text-green-300 px-3 py-1 rounded text-sm font-medium">
              ★ {restaurant.rating.toFixed(1)}
            </span>
            <br />
            {restaurant.isOpen ? (
              <span className="text-xs text-green-400 mt-1 inline-block">Open</span>
            ) : (
              <span className="text-xs text-red-400 mt-1 inline-block">Closed</span>
            )}
          </div>
        </div>

        {restaurant.description && (
          <p className="text-gray-400 mt-4">{restaurant.description}</p>
        )}

        <p className="text-sm text-gray-500 mt-2">📞 {restaurant.phone}</p>

        {isOwner && (
          <Link
            href={`/restaurants/${id}/menu/create`}
            className="inline-block mt-4 bg-red-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-600 transition-colors"
          >
            + Add Menu Item
          </Link>
        )}
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4 text-white">Menu</h2>
      {(!restaurant.menuItems || restaurant.menuItems.length === 0) ? (
        <p className="text-gray-500">No menu items yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {restaurant.menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#111] rounded-lg shadow-lg border border-gray-800 p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-400 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
                <span className="text-lg font-bold text-red-500">
                  ₹{Number(item.price).toFixed(2)}
                </span>
              </div>
              <div className="mt-2">
                {item.isAvailable ? (
                  <span className="text-xs text-green-400">Available</span>
                ) : (
                  <span className="text-xs text-red-400">Unavailable</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
