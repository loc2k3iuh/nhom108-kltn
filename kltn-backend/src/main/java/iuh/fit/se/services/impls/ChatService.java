package iuh.fit.se.services.impls;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import iuh.fit.se.dtos.requests.ProductFilterRequest;
import iuh.fit.se.dtos.responses.ChatResponse;
import iuh.fit.se.dtos.responses.ProductDetailResponse;
import iuh.fit.se.services.interfaces.IProductFilterService;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

  private final IProductFilterService productFilterService;
  private final ChatClient.Builder chatClientBuilder;
  private final ObjectMapper objectMapper;

  private static final String SYSTEM_PROMPT =
      """
            You are a helpful AI assistant for an e-commerce website named "DAVINCI".
            Your primary role is to understand user queries in Vietnamese and convert them into a structured JSON format for product filtering.
            You must only respond with a valid JSON object. Do not add any explanatory text, greetings, or any other text outside of the JSON structure.

            The JSON output must conform to the following `ProductFilterRequest` structure:
            {
              "keyword": "string", "categoryIds": [long], "brandIds": [long], "colorIds": [long], "sizeIds": [long],
              "minPrice": double, "maxPrice": double, "isNew": boolean, "isBestSeller": boolean,
              "sortBy": "string", "sortDirection": "string", "page": int, "size": int
            }

            **IMPORTANT RULES:**
            1.  **JSON ONLY:** Your entire response must be a single, valid JSON object, without markdown backticks (```).
            2.  **ID MAPPING:** Use the provided maps to convert user keywords into their corresponding IDs.
            3.  **KEYWORD HANDLING:**
                - If the query mentions a specific product type (e.g., "áo thun", "quần jean"), extract the most important noun as a single word for the "keyword" field (e.g., "áo", "quần").
                - If the query is ONLY about a general property (e.g., "sản phẩm bán chạy nhất") and does NOT mention a specific product type, the "keyword" field MUST be `null`.
            4.  **IRRELEVANT QUERIES:** If the user's message is NOT a product search query (e.g., asking general knowledge questions), you MUST return a JSON where all filter-specific fields are `null`.
            5.  **DEFAULT VALUES:**
                - Pagination MUST always be present. If not specified by the user, default to `page: 0` and `size: 10`.
                - Sorting MUST always be present. If not specified by the user, you MUST default to `sortBy: "basePrice"` and `sortDirection: "ASC"`.
            6.  **NO ROOT CATEGORIES:** Never include category IDs 1, 2, 3, or 4 in the `categoryIds` array. Use their subcategory IDs instead.

            **--- AVAILABLE DATA FOR MAPPING ---**

            **Category Hierarchy (Parent -> Subcategories):**
            - 1 (Thời trang nam): [9, 10, 11, 12, 13]
            - 2 (Thời trang nữ): [14, 15, 16, 17, 18]
            - 3 (Thời trang trẻ em): [19, 20, 21, 22, 23]
            - 4 (Giày dép): [39, 40, 41, 46, 47]

            **Category Keywords to ID:**
            - "thời trang nam", "nam": 1
            - "thời trang nữ", "nữ": 2
            - "thời trang trẻ em", "trẻ em": 3
            - "giày dép", "giày", "dép": 4
            - "áo t-shirt nam", "áo thun nam": 9
            - "áo polo nam": 10
            - "áo sơ mi nam": 11
            - "quần jeans nam": 12
            - "quần tây nam": 13
            - "áo t-shirt nữ", "áo thun nữ": 14
            - "váy ngắn": 15
            - "váy dài": 16
            - "quần jeans nữ": 17
            - "quần short nữ": 18
            - "bé trai 0-2 tuổi": 19
            - "bé gái 0-2 tuổi": 20
            - "trẻ em trai 3-14 tuổi": 21
            - "trẻ em gái 3-14 tuổi": 22
            - "đồ ngủ trẻ em": 23
            - "giày sneaker": 39
            - "giày chạy bộ": 40
            - "giày tập gym": 41
            - "giày boot": 46
            - "dép các loại": 47

            **Brand Keywords to ID:**
            - "nike": 1, "adidas": 2, "puma": 3, "zara": 4, "h&m": 5, "uniqlo": 6, "coolmate": 7, "coolmatem": 7, "yame": 8, "calvin klein": 9, "tommy hilfiger": 10, "polo ralph lauren": 11, "lacoste": 12, "converse": 13, "vans": 14, "local brand": 15

            **Color Keywords to ID:**
            - "đỏ": 1, "xanh dương": 2, "xanh lá": 3, "đen": 4, "trắng": 5, "xám": 6, "hồng": 7, "vàng": 8, "nâu": 9, "tím": 10, "cam": 11, "be": 12, "xanh navy": 13, "xanh mint": 14, "hồng pastel": 15

            **Size Keywords to ID:**
            - "xs", "extra small", "rất nhỏ": 1
            - "s", "small", "nhỏ": 2
            - "m", "medium", "vừa": 3
            - "l", "large", "lớn": 4
            - "xl", "extra large", "rất lớn": 5
            - "xxl", "double extra large", "cực lớn": 6
            - "xxxl", "3xl", "cực kỳ lớn": 7
            - "free size", "một size": 8
            - "size 38", "38": 9
            - "size 39", "39": 10
            - "size 40", "40": 11
            - "size 41", "41": 12
            - "size 42", "42": 13
            - "size 43", "43": 14
            - "size 44", "44": 15

            **Sort Options (User Input -> [sortBy, sortDirection]):**
            - "mới nhất": ["createdAt", "DESC"]
            - "cũ nhất": ["createdAt", "ASC"]
            - "bán chạy nhất": ["orderCount", "DESC"]
            - "bán ít nhất": ["orderCount", "ASC"]
            - "đánh giá cao nhất": ["averageRating", "DESC"]
            - "đánh giá thấp nhất": ["averageRating", "ASC"]
            - "giá thấp đến cao", "rẻ nhất": ["discountedPrice", "ASC"]
            - "giá cao đến thấp", "đắt nhất": ["discountedPrice", "DESC"]
            - "lượt yêu thích": ["favoriteCount", "DESC"]
            - "lượt yêu thích ít nhất": ["favoriteCount", "ASC"]
            - "đánh giá nhiều nhất": ["reviewCount", "DESC"]
            - "đánh giá ít nhất": ["reviewCount", "ASC"]
            - "giảm giá nhiều nhất": ["currentDiscountPercent", "DESC"]
            - "giảm giá ít nhất": ["currentDiscountPercent", "ASC"]

            **--- END OF DATA MAPPING ---**

            **EXAMPLES:**
            User Message 1: "tìm cho tôi áo thun nam màu đen" -> Expected JSON: { "keyword": "áo", "categoryIds": [9], "colorIds": [4], "sortBy": "basePrice", "sortDirection": "ASC", "page": 0, "size": 10 }
            User Message 2: "sản phẩm bán chạy nhất" -> Expected JSON: { "keyword": null, "isBestSeller": true, "sortBy": "orderCount", "sortDirection": "DESC", "page": 0, "size": 10 }
            User Message 3: "công nghệ AI là gì?" -> Expected JSON: { "keyword": null, "categoryIds": null, "brandIds": null, "colorIds": null, "sizeIds": null, "minPrice": null, "maxPrice": null, "isNew": null, "isBestSeller": null, "sortBy": "basePrice", "sortDirection": "ASC", "page": 0, "size": 10 }
            """;

  public ChatResponse processMessage(String message) {
    String lowerCaseMessage = message.toLowerCase();
    if (lowerCaseMessage.contains("xin chào")
        || lowerCaseMessage.contains("hi")
        || lowerCaseMessage.contains("hello")
        || lowerCaseMessage.contains("chào bạn")
        || lowerCaseMessage.contains("bạn có đó không")
        || lowerCaseMessage.contains("hãy giúp tôi")) {
      return ChatResponse.builder()
          .responseMessage(
              "Chào bạn! Tôi là trợ lý ảo của DAVINCI. Tôi có thể giúp gì cho bạn hôm nay?")
          .build();
    }
    if (lowerCaseMessage.contains("bạn là ai") || lowerCaseMessage.contains("tên gì")) {
      return ChatResponse.builder()
          .responseMessage(
              "Tôi là trợ lý ảo của DAVINCI, được thiết kế để giúp bạn tìm kiếm sản phẩm dễ dàng hơn.")
          .build();
    }

    if (lowerCaseMessage.contains("tạm biệt")
        || lowerCaseMessage.contains("bye")
        || lowerCaseMessage.contains("see you")
        || lowerCaseMessage.contains("cảm ơn")) {
      return ChatResponse.builder()
          .responseMessage("Tôi là trợ lý ảo của DAVINCI, rất hân hạnh được làm việc với bạn.")
          .build();
    }

    try {
      SystemMessage systemMessage = new SystemMessage(SYSTEM_PROMPT);
      UserMessage userMessage = new UserMessage(message);
      Prompt prompt = new Prompt(systemMessage, userMessage);
      ChatClient chatClient = chatClientBuilder.build();

      String rawResponse = chatClient.prompt(prompt).call().content();
      log.info("AI Raw Response: {}", rawResponse);

      String cleanedJson = rawResponse.trim().replace("```json", "").replace("```", "").trim();
      ProductFilterRequest filterRequest =
          objectMapper.readValue(cleanedJson, ProductFilterRequest.class);
      log.info("Deserialized ProductFilterRequest: {}", filterRequest);

      // Check if the AI returned an empty/irrelevant filter
      if (isFilterRequestEmpty(filterRequest)) {
        log.info("Irrelevant query detected. Responding with guidance.");
        return ChatResponse.builder()
            .responseMessage(
                "Xin lỗi, tôi chưa hiểu yêu cầu của bạn. Tôi có thể giúp bạn tìm kiếm các sản phẩm như áo, quần, hay giày dép. Bạn muốn tìm gì?")
            .build();
      }

      // Fallback for pagination and sorting, just in case the AI misses them
      if (filterRequest.getPage() == null) filterRequest.setPage(0);
      if (filterRequest.getSize() == null) filterRequest.setSize(10);
      if (filterRequest.getSortBy() == null || filterRequest.getSortBy().trim().isEmpty()) {
        filterRequest.setSortBy("basePrice");
        filterRequest.setSortDirection("ASC");
      }

      Page<ProductDetailResponse> products = productFilterService.filterProducts(filterRequest);
      String responseMessage =
          products.isEmpty()
              ? "Xin lỗi, tôi không tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn."
              : "Đây là những sản phẩm tôi tìm được:";

      return ChatResponse.builder()
          .responseMessage(responseMessage)
          .products(products)
          .filterPayload(filterRequest) // Thêm payload vào response
          .build();

    } catch (JsonProcessingException e) {
      log.error(
          "Error processing AI response: Invalid JSON format. Cleaned JSON: {}", e.getMessage());
      return ChatResponse.builder()
          .responseMessage("Xin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại.")
          .build();
    } catch (Exception e) {
      log.error("An unexpected error occurred in ChatService", e);
      return ChatResponse.builder()
          .responseMessage("Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.")
          .build();
    }
  }

  /**
   * Checks if the filter request is effectively empty, meaning it contains no specific search
   * criteria. This is used to detect irrelevant user queries.
   */
  private boolean isFilterRequestEmpty(ProductFilterRequest request) {
    if (request == null) return true;
    return (request.getKeyword() == null || request.getKeyword().trim().isEmpty())
        && (request.getCategoryIds() == null || request.getCategoryIds().isEmpty())
        && (request.getBrandIds() == null || request.getBrandIds().isEmpty())
        && (request.getColorIds() == null || request.getColorIds().isEmpty())
        && (request.getSizeIds() == null || request.getSizeIds().isEmpty())
        && request.getMinPrice() == null
        && request.getMaxPrice() == null
        && !Objects.equals(Boolean.TRUE, request.getIsNew())
        && !Objects.equals(Boolean.TRUE, request.getIsBestSeller());
  }
}
