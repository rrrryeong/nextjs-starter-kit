"use client";

import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction, type ReactNode } from "react";
import { sanitizeCart, type Cart } from "@/lib/shop";

const STORAGE_KEY = "ondo-shop-v1";
type ShopContext = {
  cart: Cart;
  setCart: Dispatch<SetStateAction<Cart>>;
  loggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  couponUsed: boolean;
  setCouponUsed: Dispatch<SetStateAction<boolean>>;
  ready: boolean;
};
const Context = createContext<ShopContext | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [couponUsed, setCouponUsed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setCart(sanitizeCart(saved.cart));
        setLoggedIn(saved.loggedIn === true);
        setCouponUsed(saved.couponUsed === true);
      }
    } catch { /* Start a clean demo session if browser storage is unavailable. */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, loggedIn, couponUsed })); }
    catch { /* Shopping remains available in memory. */ }
  }, [cart, loggedIn, couponUsed, ready]);
  return <Context.Provider value={{ cart, setCart, loggedIn, setLoggedIn, couponUsed, setCouponUsed, ready }}>{children}</Context.Provider>;
}

export function useShop() {
  const shop = useContext(Context);
  if (!shop) throw new Error("ShopProvider is required");
  return shop;
}
