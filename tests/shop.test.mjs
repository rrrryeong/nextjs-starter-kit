import test from 'node:test';
import assert from 'node:assert/strict';
import { canUseCoupon, orderSummary, sanitizeCart } from '../lib/shop.ts';

test('coupon requires merchandise subtotal of at least 30,000 won', () => {
  assert.equal(canUseCoupon(29999, true, false), false);
  assert.equal(canUseCoupon(30000, true, false), true);
  assert.equal(canUseCoupon(30001, true, false), true);
});
test('coupon belongs to the signed-in test account and can only be used once', () => {
  assert.equal(canUseCoupon(50000, false, false), false);
  assert.equal(canUseCoupon(50000, true, true), false);
});
test('shipping cannot make a 29,000 won order eligible', () => {
  assert.deepEqual(orderSummary({2: 1}, true, true, false), {
    subtotal: 29000, eligible: false, discount: 0, shipping: 3000, total: 32000,
  });
});
test('eligible orders get 3,000 won off only when selected', () => {
  assert.equal(orderSummary({6: 1}, false, true, false).total, 35000);
  assert.equal(orderSummary({6: 1}, true, true, false).total, 32000);
  assert.equal(orderSummary({6: 1}, true, true, true).discount, 0);
  assert.equal(orderSummary({6: 1}, true, false, false).discount, 0);
});
test('free shipping uses the subtotal before discounts', () => {
  assert.deepEqual(orderSummary({1: 1, 6: 1}, true, true, false), {
    subtotal: 50000, eligible: true, discount: 3000, shipping: 0, total: 47000,
  });
});
test('empty or malformed carts do not create unexpected charges', () => {
  assert.equal(orderSummary({}).total, 0);
  assert.deepEqual(sanitizeCart({1: -1, 2: 1.5, 3: '2', 4: 1000, 999: 1}), {4: 99});
  assert.deepEqual(sanitizeCart(null), {});
});
