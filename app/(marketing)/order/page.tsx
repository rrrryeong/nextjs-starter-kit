"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, CheckCircle2, Ticket, Minus, Plus } from "lucide-react";
import { useShop } from "@/components/shop-provider";
import { products, money, photo, orderSummary, TEST_ACCOUNT, TEST_COUPON } from "@/lib/shop";

export default function OrderPage() {
  const { cart, setCart, loggedIn, setLoggedIn, couponUsed, setCouponUsed, ready } = useShop();
  const [selected, setSelected] = useState(false);
  const [completed, setCompleted] = useState<{ total: number; discount: number } | null>(null);
  const [error, setError] = useState("");
  const summary = orderSummary(cart, selected, loggedIn, couponUsed);
  const items = products.filter((p) => cart[p.id] > 0);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const latest = orderSummary(cart, selected, loggedIn, couponUsed);
    if (!loggedIn || !items.length) { setError("테스트 계정 로그인과 주문 상품을 확인해 주세요."); return; }
    if (selected && !latest.eligible) { setError("쿠폰 사용 조건을 다시 확인해 주세요."); setSelected(false); return; }
    if (latest.discount > 0) setCouponUsed(true);
    setCompleted({ total: latest.total, discount: latest.discount });
    setCart({});
    setError("");
  }
  function change(id: number, amount: number) {
    setCart((old) => ({ ...old, [id]: Math.min(99, Math.max(0, (old[id] || 0) + amount)) }));
    setSelected(false);
  }
  return <div className="store order-store">
    <header className="store-header"><Link className="store-logo" href="/">ondo<span>온도</span></Link><Link className="order-back" href="/#collection"><ArrowLeft size={16} /> 쇼핑 계속하기</Link></header>
    <main className="order-main">
      {!ready ? <p role="status">주문 정보를 불러오고 있어요.</p> : completed ? <section className="order-complete"><CheckCircle2 size={48} strokeWidth={1.3} /><h1>테스트 주문을 완료했어요</h1><p>결제 금액 {money(completed.total)}</p>{completed.discount > 0 && <p>쿠폰 할인 {money(completed.discount)} · 쿠폰 사용 완료</p>}<p className="order-note">실제 결제나 배송은 진행되지 않습니다.</p><Link className="continue-shopping" href="/">쇼핑몰로 돌아가기</Link><button type="button" className="cart-keep-shopping" onClick={() => { setCouponUsed(false); setCompleted(null); }}>테스트 초기화 (쿠폰 재발급)</button></section> : items.length === 0 ? <section className="order-complete"><h1>주문할 상품이 없어요</h1><p>장바구니에 좋아하는 물건을 담아주세요.</p><Link className="continue-shopping" href="/#collection">상품 둘러보기</Link></section> : <>
        <span className="eyebrow">YOUR EVERYDAY, ONDO</span><h1 className="order-heading">주문하기</h1><p className="order-intro">선택한 물건과 혜택을 확인해 주세요.</p>
        <form onSubmit={submit} className="order-grid">
          <div>
            <section className="order-section"><h2>주문 상품 <small>{items.reduce((sum, p) => sum + cart[p.id], 0)}개</small></h2>{items.map((p) => <div className="order-product" key={p.id}><img src={photo(p.image, 200)} alt={p.name} /><div><h3>{p.name}</h3><p>{p.color}</p><div className="quantity"><button type="button" onClick={() => change(p.id, -1)} aria-label={`${p.name} 수량 줄이기`}><Minus size={14} /></button><span>{cart[p.id]}</span><button type="button" disabled={cart[p.id] >= 99} onClick={() => change(p.id, 1)} aria-label={`${p.name} 수량 늘리기`}><Plus size={14} /></button></div></div><strong>{money(p.price * cart[p.id])}</strong></div>)}</section>
            <section className="order-section"><h2>주문자</h2>{loggedIn ? <div className="account-info"><div><strong>{TEST_ACCOUNT.name}</strong><p>{TEST_ACCOUNT.email}</p></div><button type="button" onClick={() => { setLoggedIn(false); setSelected(false); }}>로그아웃</button></div> : <div className="test-login"><p>테스트 계정으로 로그인하면 발급된 쿠폰 1장을 확인할 수 있어요.</p><p className="order-note">{TEST_ACCOUNT.email} · 비밀번호 없이 체험하는 테스트 계정</p><button type="button" className="order-outline" onClick={() => setLoggedIn(true)}>테스트 계정으로 로그인</button></div>}</section>
            <section className="order-section"><h2><Ticket size={20} /> 쿠폰</h2><div className="coupon-option"><label><input type="checkbox" checked={selected && summary.eligible} disabled={!summary.eligible} onChange={(e) => { setSelected(e.target.checked); setError(""); }} /><span><strong>{TEST_COUPON.name}</strong><small>상품 합계 30,000원 이상 사용 가능 · 계정당 1회</small></span></label><span className="coupon-status">{!loggedIn ? "로그인 필요" : couponUsed ? "사용 완료" : summary.eligible ? "사용 가능" : "금액 미달"}</span></div><p className="order-note" role="status">{!loggedIn ? "로그인 후 쿠폰을 사용할 수 있어요." : couponUsed ? "이 계정의 쿠폰을 이미 사용했어요." : summary.subtotal < TEST_COUPON.minimum ? `${money(TEST_COUPON.minimum - summary.subtotal)} 더 담으면 사용할 수 있어요. 배송비는 조건 금액에 포함하지 않습니다.` : summary.discount > 0 ? "3,000원 할인이 적용되었어요." : "쿠폰을 선택하면 3,000원 할인됩니다."}</p></section>
            <section className="order-section"><h2>배송 정보</h2><div className="delivery-fields"><label>받는 분<input name="recipient" autoComplete="name" required defaultValue="온도 테스트" maxLength={50} /></label><label>연락처<input name="phone" type="tel" autoComplete="tel" required defaultValue="010-0000-0000" pattern="[0-9+() -]{9,20}" /></label><label className="full-field">주소<input name="address" autoComplete="street-address" required defaultValue="서울시 테스트로 123" maxLength={200} /></label></div><p className="order-note">테스트용 정보가 입력되어 있습니다. 실제 배송은 진행되지 않습니다.</p></section>
          </div>
          <aside className="order-summary"><h2>결제 예정 금액</h2><dl><div><dt>상품 합계</dt><dd>{money(summary.subtotal)}</dd></div><div><dt>배송비</dt><dd>{summary.shipping === 0 ? "무료" : money(summary.shipping)}</dd></div><div className="discount-row"><dt>쿠폰 할인</dt><dd>-{money(summary.discount)}</dd></div><div className="order-grand-total"><dt>총 결제 금액</dt><dd>{money(summary.total)}</dd></div></dl><p className="order-note">할인 전 상품 합계 5만원 이상 무료배송</p><button className="continue-shopping" type="submit" disabled={!loggedIn}>{money(summary.total)} 테스트 주문하기</button>{!loggedIn && <p className="order-note">주문하려면 테스트 계정으로 로그인해 주세요.</p>}<p className="order-note">실제 금액이 청구되지 않는 테스트 주문입니다.</p>{error && <p className="order-error" role="alert">{error}</p>}</aside>
        </form>
      </>}
    </main>
  </div>;
}
