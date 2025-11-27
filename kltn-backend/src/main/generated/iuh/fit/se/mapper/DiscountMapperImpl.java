package iuh.fit.se.mapper;

import iuh.fit.se.dtos.requests.CreateDiscountRequest;
import iuh.fit.se.dtos.requests.UpdateDiscountRequest;
import iuh.fit.se.dtos.responses.DiscountResponse;
import iuh.fit.se.entities.Discount;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-18T07:28:15+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 24.0.2 (Oracle Corporation)"
)
@Component
public class DiscountMapperImpl implements DiscountMapper {

    @Override
    public Discount toDiscount(CreateDiscountRequest request) {
        if ( request == null ) {
            return null;
        }

        Discount.DiscountBuilder discount = Discount.builder();

        discount.name( request.getName() );
        discount.discountType( request.getDiscountType() );
        discount.value( request.getValue() );
        discount.startDate( request.getStartDate() );
        discount.endDate( request.getEndDate() );

        return discount.build();
    }

    @Override
    public DiscountResponse toDiscountResponse(Discount discount) {
        if ( discount == null ) {
            return null;
        }

        DiscountResponse.DiscountResponseBuilder discountResponse = DiscountResponse.builder();

        discountResponse.id( discount.getId() );
        discountResponse.name( discount.getName() );
        discountResponse.discountType( discount.getDiscountType() );
        discountResponse.value( discount.getValue() );
        discountResponse.startDate( discount.getStartDate() );
        discountResponse.endDate( discount.getEndDate() );

        discountResponse.isActive( isDiscountActive(discount) );
        discountResponse.formattedValue( formatDiscountValue(discount.getDiscountType(), discount.getValue()) );

        return discountResponse.build();
    }

    @Override
    public void updateDiscountFromRequest(UpdateDiscountRequest request, Discount discount) {
        if ( request == null ) {
            return;
        }

        if ( request.getName() != null ) {
            discount.setName( request.getName() );
        }
        if ( request.getDiscountType() != null ) {
            discount.setDiscountType( request.getDiscountType() );
        }
        if ( request.getValue() != null ) {
            discount.setValue( request.getValue() );
        }
        if ( request.getStartDate() != null ) {
            discount.setStartDate( request.getStartDate() );
        }
        if ( request.getEndDate() != null ) {
            discount.setEndDate( request.getEndDate() );
        }
    }
}
