export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: "CUSTOMER" | "RESTAURANT_OWNER" | "DELIVERY_PARTNER" | "ADMIN";
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  isOpen: boolean;
  menuItems: MenuItem[];
  owner?: { name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  issues?: { message: string; path: string[] }[];
}
