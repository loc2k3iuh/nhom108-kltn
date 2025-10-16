package iuh.fit.se.services.interfaces;

import iuh.fit.se.entities.Product;
import iuh.fit.se.entities.ProductVariant;

public interface IPriceService {
    double getFinalPrice(Product product, ProductVariant variant);
}
