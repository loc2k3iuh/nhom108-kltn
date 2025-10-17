// src/mappers/productMapper.ts
import { Product } from "@/types/product";

export interface ProductViewModel {
  id: number;
  title: string;
  link: string;
  image: string;
  specialPrice: string; // formatted VND
  oldPrice: string; // formatted VND
  discountPercent: number; // numeric for logic
  discountLabel: string; // like -30%
  soldCount: string; // e.g., "Đã bán 12"
  averageRating?: number;
  reviewCount?: number;
  orderCount?: number;
  product: Product; // Add the original product
}

const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};

interface MapOptions {
  showZeroDiscountLabel?: boolean; // if true, show -0% when no discount
}

export const mapProductToViewModel = (
  p: Product,
  options: MapOptions = {}
): ProductViewModel => {
  const discountPercent = Math.max(0, Math.round(p.currentDiscountPercent || 0));
  const hasDiscount = discountPercent > 0;
  const discountLabel = hasDiscount
    ? `-${discountPercent}%`
    : options.showZeroDiscountLabel
    ? `-0%`
    : "";

  const specialPriceNumber =
    p.discountedPrice ?? p.minPrice ?? p.basePrice ?? 0;

  const link = `/product/${p.id}`;

  return {
    id: p.id,
    title: p.name,
    link,
    image: p.primaryImageUrl || (p.imageUrls?.[0] ?? "https://via.placeholder.com/300"),
    specialPrice: formatPrice(specialPriceNumber),
    oldPrice: formatPrice(p.basePrice ?? specialPriceNumber),
    discountPercent,
    discountLabel,
    soldCount: `Đã bán ${p.orderCount ?? 0}`,
    averageRating: p.averageRating,
    reviewCount: p.reviewCount,
    orderCount: p.orderCount,
    product: p, // Include the full product object
  };
};
