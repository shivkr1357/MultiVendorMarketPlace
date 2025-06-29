import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { api } from "./api";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import uiReducer from "./slices/uiSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart"], // Only persist auth and cart
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  ui: uiReducer,
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
