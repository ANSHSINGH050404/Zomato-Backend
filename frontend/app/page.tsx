import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <h1 className="text-5xl font-bold text-red-500 mb-4">Zomato</h1>
      <p className="text-lg text-gray-400 mb-8 text-center max-w-md">
        Order food from the best restaurants near you.
      </p>
      <div className="flex gap-4">
        <Link
          href="/restaurants"
          className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
        >
          Browse Restaurants
        </Link>
        <Link
          href="/signup"
          className="bg-gray-800 text-gray-200 px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
