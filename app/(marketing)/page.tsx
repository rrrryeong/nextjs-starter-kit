"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowRight, ShoppingBag, Plus, Minus, X, Check, Package, Truck } from "lucide-react";

const products = [
  { id: 1, name: "데일리 세라믹 머그", category: "키친", price: 18000, color: "크림 화이트 · 320ml", image: "photo-1514228742587-6b1558fcca3d", label: "BEST" },
  { id: 2, name: "소프트 리넨 쿠션", category: "패브릭", price: 29000, color: "내추럴 베이지 · 45×45cm", image: "photo-1584100936595-c0654b55a2e2", label: "" },
  { id: 3, name: "우드 다이닝 체어", category: "리빙", price: 128000, color: "내추럴 오크", image: "photo-1598300042247-d088f8ab3a91", label: "NEW" },
  { id: 4, name: "모닝 글라스 화병", category: "리빙", price: 24000, color: "클리어 · 20cm", image: "photo-1578500494198-246f612d3b3d", label: "" },
  { id: 5, name: "내추럴 코튼 토트", category: "패브릭", price: 22000, color: "아이보리 · 코튼 100%", image: "photo-1590874103328-eac38a683ce7", label: "" },
  { id: 6, name: "우드 서빙 보드", category: "키친", price: 32000, color: "아카시아 · 30cm", image: "photo-1556911220-bff31c812dba", label: "BEST" },
];
const money = (value: number) => value.toLocaleString("ko-KR") + "원";
const photo = (id: string, width = 700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export default function HomePage() {
  const [category, setCategory] = useState("전체");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState<number | null>(null);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = products.reduce((sum, product) => sum + product.price * (cart[product.id] || 0), 0);
  function change(id: number, amount: number) {
    setCart((old) => ({ ...old, [id]: Math.max(0, (old[id] || 0) + amount) }));
  }
  function add(id: number) {
    change(id, 1);
    setAdded(id);
    window.setTimeout(() => setAdded(null), 1500);
  }
  return (
    <div className="store">
      <div className="store-announcement">작은 변화로 채우는 일상. 5만원 이상 무료배송 <ArrowUpRight size={12} /></div>
      <header className="store-header">
        <a className="store-logo" href="/">ondo<span>온도</span></a>
        <nav aria-label="메인 메뉴"><a href="#collection">모든 상품</a><a href="#story">우리의 이야기 <ArrowUpRight size={13} /></a></nav>
        <button className="cart-trigger" onClick={() => setOpen(true)} aria-label={`장바구니 ${count}개`}><ShoppingBag size={19} /><span>장바구니</span><b>{count}</b></button>
      </header>
      <main>
        <section className="store-hero">
          <div className="hero-copy"><span className="eyebrow">THOUGHTFUL THINGS, EVERYDAY.</span><h1>일상에 더하는<br />기분 좋은 온도.</h1><p>매일 손이 가는 물건, 오래 곁에 두고 싶은 취향.<br />당신의 일상을 위한 작은 것들을 만나보세요.</p><a className="shop-link" href="#collection">컬렉션 둘러보기 <ArrowRight size={17} /></a><span className="hero-edition">2026 AUTUMN COLLECTION — VOL. 01</span></div>
          <div className="hero-photo" style={{ backgroundImage: `url(${photo("photo-1600210492486-724fe5c67fb0", 1500)})` }} role="img" aria-label="자연광이 드는 따뜻한 거실"><span>Less, but better.<br /><small>당신만의 공간, 당신만의 속도.</small></span><span className="photo-index">01 / 03</span></div>
        </section>
        <section className="collection" id="collection">
          <div className="collection-heading"><div><span className="eyebrow">THE EVERYDAY EDIT</span><h2>매일의 좋은 물건</h2></div><span className="collection-note">덜어낼수록, 더 좋아지는 일상.</span></div>
          <div className="collection-toolbar"><div className="category-tabs" aria-label="상품 카테고리">{["전체", "리빙", "키친", "패브릭"].map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}</div><span>{products.filter((p) => category === "전체" || p.category === category).length}개의 상품</span></div>
          <div className="product-grid">{products.filter((p) => category === "전체" || p.category === category).map((product) => <article className="product" key={product.id}><div className="product-image"><img src={photo(product.image)} alt={product.name} loading="lazy" />{product.label && <span className="product-label">{product.label}</span>}<button onClick={() => add(product.id)} aria-label={`${product.name} 장바구니 담기`} className={added === product.id ? "added" : ""}>{added === product.id ? <Check size={19} /> : <Plus size={20} />}</button></div><div className="product-meta"><h3>{product.name}</h3><span>{product.category}</span></div><p className="product-color">{product.color}</p><p className="product-price">{money(product.price)}</p></article>)}</div>
        </section>
        <section className="store-story" id="story"><span className="eyebrow">OUR POINT OF VIEW</span><h2>좋은 물건은, 일상에 조용히 스며듭니다.</h2><p>유행보다 오래가는 디자인, 꾸밈보다 편안한 쓰임.<br />온도는 매일의 순간을 조금 더 다정하게 만드는 물건을 고릅니다.</p><span className="story-sign">ondo.</span></section>
        <div className="store-benefits"><span><Truck size={20} />5만원 이상 무료배송</span><span><Package size={20} />정성스럽게 준비하는 포장</span><span><ShoppingBag size={20} />오래 곁에 둘 좋은 물건</span></div>
      </main>
      <footer className="store-footer"><div><a className="store-logo" href="/">ondo<span>온도</span></a><p>일상을 위한, 적당한 온도.</p></div><div className="footer-right"><span>라이프스타일 샘플 스토어 · 실제 결제는 제공하지 않습니다.</span><span>© 2026 ONDO. ALL RIGHTS RESERVED.</span></div></footer>
      {open && <div className="cart-overlay" onClick={() => setOpen(false)}><section className="cart-panel" role="dialog" aria-modal="true" aria-label="장바구니" onClick={(e) => e.stopPropagation()}><div className="cart-title"><h2>장바구니 <small>{count}</small></h2><button autoFocus onClick={() => setOpen(false)} aria-label="장바구니 닫기"><X /></button></div><div className="cart-items">{count === 0 ? <div className="cart-empty"><ShoppingBag size={36} strokeWidth={1} /><p>장바구니가 비어 있어요.</p><button onClick={() => setOpen(false)}>좋은 물건 만나러 가기 <ArrowRight size={15} /></button></div> : products.filter((p) => cart[p.id] > 0).map((p) => <div className="cart-item" key={p.id}><img src={photo(p.image, 200)} alt={p.name} /><div><h3>{p.name}</h3><p>{money(p.price)}</p><div className="quantity"><button onClick={() => change(p.id, -1)} aria-label={`${p.name} 수량 줄이기`}><Minus size={14} /></button><span>{cart[p.id]}</span><button onClick={() => change(p.id, 1)} aria-label={`${p.name} 수량 늘리기`}><Plus size={14} /></button></div></div><button className="remove-item" onClick={() => setCart((old) => ({ ...old, [p.id]: 0 }))} aria-label={`${p.name} 삭제`}><X size={16} /></button></div>)}</div>{count > 0 && <div className="cart-total"><div><span>상품 합계</span><strong>{money(total)}</strong></div><div><span>배송비</span><span>{total >= 50000 ? "무료" : money(3000)}</span></div><div className="final-total"><span>총 결제 예상 금액</span><strong>{money(total + (total >= 50000 ? 0 : 3000))}</strong></div><p>샘플 스토어입니다. 실제 주문 및 결제는 진행되지 않습니다.</p><button className="continue-shopping" onClick={() => setOpen(false)}>계속 쇼핑하기 <ArrowRight size={16} /></button></div>}</section></div>}
      <span className="sr-only" role="status">{added ? "장바구니에 상품을 담았습니다." : ""}</span>
    </div>
  );
}
