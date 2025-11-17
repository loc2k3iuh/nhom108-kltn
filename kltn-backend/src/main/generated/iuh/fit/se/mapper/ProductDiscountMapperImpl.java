package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.ProductDiscountResponse;
import iuh.fit.se.entities.Product;
import iuh.fit.se.entities.ProductDiscount;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-10T11:44:53+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 24.0.2 (Oracle Corporation)"
)
@Component
public class ProductDiscountMapperImpl implements ProductDiscountMapper {

    @Autowired
    private DiscountMapper discountMapper;

    @Override
    public ProductDiscountResponse toProductDiscountResponse(ProductDiscount productDiscount) {
        if ( productDiscount == null ) {
            return null;
        }

        ProductDiscountResponse.ProductDiscountResponseBuilder productDiscountResponse = ProductDiscountResponse.builder();

        productDiscountResponse.productId( productDiscountProductId( productDiscount ) );
        productDiscountResponse.productName( productDiscountProductName( productDiscount ) );
        productDiscountResponse.originalPrice( productDiscountProductBasePrice( productDiscount ) );
        productDiscountResponse.discount( discountMapper.toDiscountResponse( productDiscount.getDiscount() ) );

        productDiscountResponse.discountedPrice( calculateDiscountedPrice(productDiscount) );
        productDiscountResponse.savedAmount( calculateSavedAmount(productDiscount) );

        return productDiscountResponse.build();
    }

    private Long productDiscountProductId(ProductDiscount productDiscount) {
        Product product = productDiscount.getProduct();
        if ( product == null ) {
            return null;
        }
        return product.getId();
    }

    private String productDiscountProductName(ProductDiscount productDiscount) {
        Product product = productDiscount.getProduct();
        if ( product == null ) {
            return null;
        }
        return product.getName();
    }

    private Double productDiscountProductBasePrice(ProductDiscount productDiscount) {
        Product product = productDiscount.getProduct();
        if ( product == null ) {
            return null;
        }
        return product.getBasePrice();
    }
}
