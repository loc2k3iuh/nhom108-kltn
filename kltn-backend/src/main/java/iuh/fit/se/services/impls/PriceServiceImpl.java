package iuh.fit.se.services.impls;

import iuh.fit.se.entities.Discount;
import iuh.fit.se.entities.Product;
import iuh.fit.se.entities.ProductDiscount;
import iuh.fit.se.entities.ProductVariant;
import iuh.fit.se.enums.DiscountType;
import iuh.fit.se.repositories.ProductDiscountRepository;
import iuh.fit.se.services.interfaces.IPriceService;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PriceServiceImpl implements IPriceService {

  private final ProductDiscountRepository productDiscountRepository;

  @Override
  public double getFinalPrice(Product product, ProductVariant variant) {
    double originalPrice = getOriginalPrice(product, variant);

    Optional<ProductDiscount> activeDiscountOpt =
        productDiscountRepository.findActiveDiscountByProductId(product.getId());

    if (activeDiscountOpt.isPresent()) {
      Discount discount = activeDiscountOpt.get().getDiscount();
      return calculateDiscountedPrice(originalPrice, discount);
    }

    return originalPrice;
  }

  private double getOriginalPrice(Product product, ProductVariant variant) {
    if (variant != null && variant.getPrice() != null) {
      return variant.getPrice();
    }
    if (product != null && product.getBasePrice() != null) {
      return product.getBasePrice();
    }
    return 0.0;
  }

  private double calculateDiscountedPrice(double originalPrice, Discount discount) {
    if (discount.getDiscountType() == DiscountType.PERCENT) {
      double discountAmount = originalPrice * (discount.getValue() / 100.0);
      return originalPrice - discountAmount;
    } else if (discount.getDiscountType() == DiscountType.FIXED) {
      return Math.max(0, originalPrice - discount.getValue());
    }
    return originalPrice;
  }
}
