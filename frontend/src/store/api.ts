import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Product,
  User,
  CartItem,
  Cart,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "@/types";

// Create the API
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Product", "User", "Cart", "Order"],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // Product endpoints
    getProducts: builder.query<
      { data: Product[]; pagination: any },
      { page?: number; limit?: number; search?: string; category?: string }
    >({
      query: (params) => ({
        url: "/products",
        params,
      }),
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    getProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // Cart endpoints
    getCart: builder.query<Cart, void>({
      query: () => "/orders/cart",
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation<Cart, { productId: string; quantity: number }>({
      query: (item) => ({
        url: "/orders/cart",
        method: "POST",
        body: item,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation<Cart, string>({
      query: (itemId) => ({
        url: `/orders/cart/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation<
      Cart,
      { itemId: string; quantity: number }
    >({
      query: ({ itemId, quantity }) => ({
        url: `/orders/cart/${itemId}`,
        method: "PUT",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    // User endpoints
    getUserProfile: builder.query<User, void>({
      query: () => "/users/profile",
      providesTags: ["User"],
    }),
    updateUserProfile: builder.mutation<User, Partial<User>>({
      query: (userData) => ({
        url: "/users/profile",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // Order endpoints
    getOrders: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/orders",
        params,
      }),
      providesTags: ["Order"],
    }),
    createOrder: builder.mutation<any, any>({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order", "Cart"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProductsQuery,
  useGetProductQuery,
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetOrdersQuery,
  useCreateOrderMutation,
} = api;
