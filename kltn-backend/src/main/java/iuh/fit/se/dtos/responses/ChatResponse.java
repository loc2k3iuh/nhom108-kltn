package iuh.fit.se.dtos.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import iuh.fit.se.dtos.requests.ProductFilterRequest;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL) // Bỏ qua các trường null khi serialize sang JSON
public class ChatResponse {
  String responseMessage;
  Page<ProductDetailResponse> products;
  ProductFilterRequest filterPayload; // Thêm trường này để chứa payload
}
