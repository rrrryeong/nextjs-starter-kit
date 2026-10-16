import type { WithChildren } from "@/types";
import { ShopProvider } from "@/components/shop-provider";

export default function MarketingLayout({ children }: WithChildren) {
  return <ShopProvider>{children}</ShopProvider>;
}
