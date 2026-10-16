export const products = [
  { id: 1, name: "데일리 세라믹 머그", category: "키친", price: 18000, color: "크림 화이트 · 320ml", image: "photo-1514228742587-6b1558fcca3d", label: "BEST" },
  { id: 2, name: "소프트 리넨 쿠션", category: "패브릭", price: 29000, color: "내추럴 베이지 · 45×45cm", image: "photo-1584100936595-c0654b55a2e2", label: "" },
  { id: 3, name: "우드 다이닝 체어", category: "리빙", price: 128000, color: "내추럴 오크", image: "photo-1598300042247-d088f8ab3a91", label: "NEW" },
  { id: 4, name: "모닝 글라스 화병", category: "리빙", price: 24000, color: "클리어 · 20cm", image: "photo-1578500494198-246f612d3b3d", label: "" },
  { id: 5, name: "내추럴 코튼 토트", category: "패브릭", price: 22000, color: "아이보리 · 코튼 100%", image: "photo-1590874103328-eac38a683ce7", label: "" },
  { id: 6, name: "우드 서빙 보드", category: "키친", price: 32000, color: "아카시아 · 30cm", image: "photo-1556911220-bff31c812dba", label: "BEST" },
];

export type Cart = Record<number, number>;
export const TEST_ACCOUNT = { id: "ondo-test", name: "온도 테스트", email: "test@ondo.example" };
export const TEST_COUPON = { id: "welcome-3000", name: "첫 만남 3,000원 할인 쿠폰", minimum: 50000, discount: 3000 };
export const money = (value: number) => value.toLocaleString("ko-KR") + "원";
export const photo = (id: string, width = 700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export function sanitizeCart(value: unknown): Cart {
  if (!value || typeof value !== "object") return {};
  const cart: Cart = {};
  for (const p of products) {
    const quantity = (value as Cart)[p.id];
    if (Number.isSafeInteger(quantity) && quantity > 0) cart[p.id] = Math.min(quantity, 99);
  }
  return cart;
}

export function canUseCoupon(subtotal: number, loggedIn: boolean, couponUsed: boolean) {
  return loggedIn && !couponUsed && subtotal >= TEST_COUPON.minimum;
}

export function orderSummary(cart: Cart, couponSelected = false, loggedIn = false, couponUsed = false) {
  const cleanCart = sanitizeCart(cart);
  const subtotal = products.reduce((sum, p) => sum + p.price * (cleanCart[p.id] || 0), 0);
  const eligible = canUseCoupon(subtotal, loggedIn, couponUsed);
  const discount = couponSelected && eligible ? TEST_COUPON.discount : 0;
  // Free shipping is based on the merchandise subtotal before coupon discounts.
  const shipping = subtotal === 0 || subtotal >= 50000 ? 0 : 3000;
  return { subtotal, eligible, discount, shipping, total: subtotal + shipping - discount };
}
