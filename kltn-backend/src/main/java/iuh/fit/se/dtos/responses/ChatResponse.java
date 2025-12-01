package iuh.fit.se.dtos.responses;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatResponse {
    String responseMessage;
    Page<ProductDetailResponse> products;
}
