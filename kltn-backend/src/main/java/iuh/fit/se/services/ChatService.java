package iuh.fit.se.services;

import iuh.fit.se.dtos.requests.ProductFilterRequest;
import iuh.fit.se.dtos.responses.ChatResponse;
import iuh.fit.se.dtos.responses.ProductDetailResponse;
import iuh.fit.se.services.interfaces.IProductFilterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final IProductFilterService productFilterService;

    // Hardcoded map for category keywords to IDs (to be replaced by LLM in a real scenario)
    private static final Map<String, Long> CATEGORY_KEYWORDS_MAP = new HashMap<>();
    private static final Map<Long, List<Long>> CATEGORY_HIERARCHY_MAP = new HashMap<>(); // New map for parent-child relationships
    private static final Map<String, String[]> SORT_OPTIONS_MAP = new HashMap<>();
    private static final Map<String, Long> SIZE_KEYWORDS_MAP = new HashMap<>();
    private static final Map<String, Long> BRAND_KEYWORDS_MAP = new HashMap<>();
    private static final Map<String, Long> COLOR_KEYWORDS_MAP = new HashMap<>();


    static {
        // Main categories
        CATEGORY_KEYWORDS_MAP.put("thời trang nam", 1L);
        CATEGORY_KEYWORDS_MAP.put("nam", 1L);
        CATEGORY_KEYWORDS_MAP.put("thời trang nữ", 2L);
        CATEGORY_KEYWORDS_MAP.put("nữ", 2L);
        CATEGORY_KEYWORDS_MAP.put("thời trang trẻ em", 3L);
        CATEGORY_KEYWORDS_MAP.put("trẻ em", 3L);
        CATEGORY_KEYWORDS_MAP.put("giày dép", 4L);
        CATEGORY_KEYWORDS_MAP.put("giày", 4L);
        CATEGORY_KEYWORDS_MAP.put("dép", 4L);

        // Subcategories for Thời trang nam (1)
        CATEGORY_KEYWORDS_MAP.put("áo t-shirt nam", 9L);
        CATEGORY_KEYWORDS_MAP.put("áo thun nam", 9L);
        CATEGORY_KEYWORDS_MAP.put("áo polo nam", 10L);
        CATEGORY_KEYWORDS_MAP.put("áo sơ mi nam", 11L);
        CATEGORY_KEYWORDS_MAP.put("quần jeans nam", 12L);
        CATEGORY_KEYWORDS_MAP.put("quần tây nam", 13L);

        // Subcategories for Thời trang nữ (2)
        CATEGORY_KEYWORDS_MAP.put("áo t-shirt nữ", 14L);
        CATEGORY_KEYWORDS_MAP.put("áo thun nữ", 14L);
        CATEGORY_KEYWORDS_MAP.put("váy ngắn", 15L);
        CATEGORY_KEYWORDS_MAP.put("váy dài", 16L);
        CATEGORY_KEYWORDS_MAP.put("quần jeans nữ", 17L);
        CATEGORY_KEYWORDS_MAP.put("quần short nữ", 18L);

        // Subcategories for Thời trang trẻ em (3)
        CATEGORY_KEYWORDS_MAP.put("bé trai 0-2 tuổi", 19L);
        CATEGORY_KEYWORDS_MAP.put("bé gái 0-2 tuổi", 20L);
        CATEGORY_KEYWORDS_MAP.put("trẻ em trai 3-14 tuổi", 21L);
        CATEGORY_KEYWORDS_MAP.put("trẻ em gái 3-14 tuổi", 22L);
        CATEGORY_KEYWORDS_MAP.put("đồ ngủ trẻ em", 23L);

        // Subcategories for Giày dép (4)
        CATEGORY_KEYWORDS_MAP.put("giày sneaker", 39L);
        CATEGORY_KEYWORDS_MAP.put("giày chạy bộ", 40L);
        CATEGORY_KEYWORDS_MAP.put("giày tập gym", 41L);
        CATEGORY_KEYWORDS_MAP.put("giày boot", 46L);
        CATEGORY_KEYWORDS_MAP.put("dép các loại", 47L);

        // Initialize CATEGORY_HIERARCHY_MAP
        CATEGORY_HIERARCHY_MAP.put(1L, Arrays.asList(9L, 10L, 11L, 12L, 13L)); // Thời trang nam
        CATEGORY_HIERARCHY_MAP.put(2L, Arrays.asList(14L, 15L, 16L, 17L, 18L)); // Thời trang nữ
        CATEGORY_HIERARCHY_MAP.put(3L, Arrays.asList(19L, 20L, 21L, 22L, 23L)); // Thời trang trẻ em
        CATEGORY_HIERARCHY_MAP.put(4L, Arrays.asList(39L, 40L, 41L, 46L, 47L)); // Giày dép


        // Sorting options
        SORT_OPTIONS_MAP.put("mới nhất", new String[]{"createdAt", "DESC"});
        SORT_OPTIONS_MAP.put("cũ nhất", new String[]{"createdAt", "ASC"});
        SORT_OPTIONS_MAP.put("bán chạy nhất", new String[]{"orderCount", "DESC"});
        SORT_OPTIONS_MAP.put("bán ít nhất", new String[]{"orderCount", "ASC"});
        SORT_OPTIONS_MAP.put("đánh giá cao nhất", new String[]{"averageRating", "DESC"});
        SORT_OPTIONS_MAP.put("đánh giá thấp nhất", new String[]{"averageRating", "ASC"});
        SORT_OPTIONS_MAP.put("giá thấp đến cao", new String[]{"discountedPrice", "ASC"});
        SORT_OPTIONS_MAP.put("giá cao đến thấp", new String[]{"discountedPrice", "DESC"});
        SORT_OPTIONS_MAP.put("lượt yêu thích", new String[]{"favoriteCount", "DESC"}); // Assuming DESC for "lượt yêu thích" implies highest
        SORT_OPTIONS_MAP.put("lượt yêu thích ít nhất", new String[]{"favoriteCount", "ASC"});
        SORT_OPTIONS_MAP.put("đánh giá nhiều nhất", new String[]{"reviewCount", "DESC"});
        SORT_OPTIONS_MAP.put("đánh giá ít nhất", new String[]{"reviewCount", "ASC"});
        SORT_OPTIONS_MAP.put("giảm giá nhiều nhất", new String[]{"currentDiscountPercent", "DESC"});
        SORT_OPTIONS_MAP.put("giảm giá ít nhất", new String[]{"currentDiscountPercent", "ASC"});
        // Add simpler keywords for price sorting, but ensure they don't override more specific ones
        SORT_OPTIONS_MAP.put("rẻ nhất", new String[]{"discountedPrice", "ASC"});
        SORT_OPTIONS_MAP.put("đắt nhất", new String[]{"discountedPrice", "DESC"});

        // Size options
        SIZE_KEYWORDS_MAP.put("xs", 1L);
        SIZE_KEYWORDS_MAP.put("extra small", 1L);
        SIZE_KEYWORDS_MAP.put("rất nhỏ", 1L);
        SIZE_KEYWORDS_MAP.put("s", 2L);
        SIZE_KEYWORDS_MAP.put("small", 2L);
        SIZE_KEYWORDS_MAP.put("nhỏ", 2L);
        SIZE_KEYWORDS_MAP.put("m", 3L);
        SIZE_KEYWORDS_MAP.put("medium", 3L);
        SIZE_KEYWORDS_MAP.put("vừa", 3L);
        SIZE_KEYWORDS_MAP.put("l", 4L);
        SIZE_KEYWORDS_MAP.put("large", 4L);
        SIZE_KEYWORDS_MAP.put("lớn", 4L);
        SIZE_KEYWORDS_MAP.put("xl", 5L);
        SIZE_KEYWORDS_MAP.put("extra large", 5L);
        SIZE_KEYWORDS_MAP.put("rất lớn", 5L);
        SIZE_KEYWORDS_MAP.put("xxl", 6L);
        SIZE_KEYWORDS_MAP.put("double extra large", 6L);
        SIZE_KEYWORDS_MAP.put("cực lớn", 6L);
        SIZE_KEYWORDS_MAP.put("xxxl", 7L);
        SIZE_KEYWORDS_MAP.put("3xl", 7L);
        SIZE_KEYWORDS_MAP.put("cực kỳ lớn", 7L);
        SIZE_KEYWORDS_MAP.put("free size", 8L);
        SIZE_KEYWORDS_MAP.put("một size", 8L);
        SIZE_KEYWORDS_MAP.put("size 38", 9L);
        SIZE_KEYWORDS_MAP.put("38", 9L);
        SIZE_KEYWORDS_MAP.put("size 39", 10L);
        SIZE_KEYWORDS_MAP.put("39", 10L);
        SIZE_KEYWORDS_MAP.put("size 40", 11L);
        SIZE_KEYWORDS_MAP.put("40", 11L);
        SIZE_KEYWORDS_MAP.put("size 41", 12L);
        SIZE_KEYWORDS_MAP.put("41", 12L);
        SIZE_KEYWORDS_MAP.put("size 42", 13L);
        SIZE_KEYWORDS_MAP.put("42", 13L);
        SIZE_KEYWORDS_MAP.put("size 43", 14L);
        SIZE_KEYWORDS_MAP.put("43", 14L);
        SIZE_KEYWORDS_MAP.put("size 44", 15L);
        SIZE_KEYWORDS_MAP.put("44", 15L);

        // Brand options
        BRAND_KEYWORDS_MAP.put("nike", 1L);
        BRAND_KEYWORDS_MAP.put("adidas", 2L);
        BRAND_KEYWORDS_MAP.put("puma", 3L);
        BRAND_KEYWORDS_MAP.put("zara", 4L);
        BRAND_KEYWORDS_MAP.put("h&m", 5L);
        BRAND_KEYWORDS_MAP.put("uniqlo", 6L);
        BRAND_KEYWORDS_MAP.put("coolmate", 7L);
        BRAND_KEYWORDS_MAP.put("coolmatem", 7L); // Added for typo handling example
        BRAND_KEYWORDS_MAP.put("yame", 8L);
        BRAND_KEYWORDS_MAP.put("calvin klein", 9L);
        BRAND_KEYWORDS_MAP.put("tommy hilfiger", 10L);
        BRAND_KEYWORDS_MAP.put("polo ralph lauren", 11L);
        BRAND_KEYWORDS_MAP.put("lacoste", 12L);
        BRAND_KEYWORDS_MAP.put("converse", 13L);
        BRAND_KEYWORDS_MAP.put("vans", 14L);
        BRAND_KEYWORDS_MAP.put("local brand", 15L);

        // Color options
        COLOR_KEYWORDS_MAP.put("đỏ", 1L);
        COLOR_KEYWORDS_MAP.put("xanh dương", 2L);
        COLOR_KEYWORDS_MAP.put("xanh lá", 3L);
        COLOR_KEYWORDS_MAP.put("đen", 4L);
        COLOR_KEYWORDS_MAP.put("trắng", 5L);
        COLOR_KEYWORDS_MAP.put("xám", 6L);
        COLOR_KEYWORDS_MAP.put("hồng", 7L);
        COLOR_KEYWORDS_MAP.put("vàng", 8L);
        COLOR_KEYWORDS_MAP.put("nâu", 9L);
        COLOR_KEYWORDS_MAP.put("tím", 10L);
        COLOR_KEYWORDS_MAP.put("cam", 11L);
        COLOR_KEYWORDS_MAP.put("be", 12L);
        COLOR_KEYWORDS_MAP.put("xanh navy", 13L);
        COLOR_KEYWORDS_MAP.put("xanh mint", 14L);
        COLOR_KEYWORDS_MAP.put("hồng pastel", 15L);
    }

    public ChatResponse processMessage(String message) {
        String lowerCaseMessage = message.toLowerCase();
        Set<String> messageWords = new HashSet<>(Arrays.asList(lowerCaseMessage.split("\\s+"))); // Split message into words for precise matching

        // --- General Chat Interactions ---
        if (lowerCaseMessage.contains("xin chào") || lowerCaseMessage.contains("hi") || lowerCaseMessage.contains("hello")) {
            return ChatResponse.builder()
                    .responseMessage("Chào bạn! Tôi là trợ lý ảo của DAVINCI. Tôi có thể giúp gì cho bạn hôm nay?")
                    .build();
        }

        if (lowerCaseMessage.contains("bạn là ai") || lowerCaseMessage.contains("tên gì")) {
            return ChatResponse.builder()
                    .responseMessage("Tôi là trợ lý ảo của DAVINCI, được thiết kế để giúp bạn tìm kiếm sản phẩm dễ dàng hơn.")
                    .build();
        }

        // --- Check for Product Search Keywords ---
        boolean isProductSearch = lowerCaseMessage.contains("tìm")
                || lowerCaseMessage.contains("sản phẩm")
                || lowerCaseMessage.contains("mua")
                || lowerCaseMessage.contains("muốn mua")
                || lowerCaseMessage.contains("có")
                || lowerCaseMessage.contains("show")
                || lowerCaseMessage.contains("hiển thị");

        if (!isProductSearch) {
            return ChatResponse.builder()
                    .responseMessage("Xin lỗi, tôi chưa hiểu yêu cầu của bạn. Bạn có thể thử tìm kiếm sản phẩm bằng cách nói 'tìm áo nam' hoặc 'sản phẩm mới' không?")
                    .build();
        }

        // --- Product Filtering Logic (only if isProductSearch is true) ---
        ProductFilterRequest.ProductFilterRequestBuilder filterBuilder = ProductFilterRequest.builder();

        // --- Category Parsing ---
        Set<Long> foundCategoryIds = new HashSet<>();

        // Collect all directly mentioned category IDs (both root and sub)
        for (Map.Entry<String, Long> entry : CATEGORY_KEYWORDS_MAP.entrySet()) {
            boolean matched = false;
            if (entry.getKey().contains(" ")) { // Multi-word keyword
                if (lowerCaseMessage.contains(entry.getKey())) {
                    matched = true;
                }
            } else { // Single-word keyword
                if (messageWords.contains(entry.getKey())) {
                    matched = true;
                }
            }
            if (matched) {
                foundCategoryIds.add(entry.getValue());
            }
        }

        // Special handling for "áo nam" to ensure subcategories of 1L are included
        // If "áo nam" is found, it implies "Thời trang nam" (ID 1) and its subcategories.
        // We add 1L here temporarily, it will be expanded and removed later if it's a root.
        if (lowerCaseMessage.contains("áo nam")) {
            foundCategoryIds.add(1L);
        }


        // Now, process foundCategoryIds to expand roots and remove root IDs themselves from the final list
        Set<Long> finalCategoryIds = new HashSet<>();
        for (Long categoryId : foundCategoryIds) {
            if (CATEGORY_HIERARCHY_MAP.containsKey(categoryId)) { // This is a root category (1, 2, 3, 4)
                // Add all its subcategories
                finalCategoryIds.addAll(CATEGORY_HIERARCHY_MAP.get(categoryId));
                // Do NOT add the root category ID itself, as per user's request "không truyền vào id từ 1 đến 4"
            } else { // This is a specific subcategory
                finalCategoryIds.add(categoryId);
            }
        }

        if (!finalCategoryIds.isEmpty()) {
            filterBuilder.categoryIds(new ArrayList<>(finalCategoryIds));
        }


        // --- Size Parsing ---
        List<Long> foundSizeIds = new ArrayList<>();
        for (Map.Entry<String, Long> entry : SIZE_KEYWORDS_MAP.entrySet()) {
            boolean matched = false;
            if (entry.getKey().contains(" ")) { // Multi-word keyword
                if (lowerCaseMessage.contains(entry.getKey())) {
                    matched = true;
                }
            } else { // Single-word keyword
                if (messageWords.contains(entry.getKey())) {
                    matched = true;
                }
            }
            if (matched) {
                foundSizeIds.add(entry.getValue());
            }
        }
        if (!foundSizeIds.isEmpty()) {
            filterBuilder.sizeIds(foundSizeIds);
        }

        // --- Brand Parsing ---
        List<Long> foundBrandIds = new ArrayList<>();
        for (Map.Entry<String, Long> entry : BRAND_KEYWORDS_MAP.entrySet()) {
            boolean matched = false;
            if (entry.getKey().contains(" ")) { // Multi-word keyword
                if (lowerCaseMessage.contains(entry.getKey())) {
                    matched = true;
                }
            } else { // Single-word keyword
                if (messageWords.contains(entry.getKey())) {
                    matched = true;
                }
            }
            if (matched) {
                foundBrandIds.add(entry.getValue());
            }
        }
        if (!foundBrandIds.isEmpty()) {
            filterBuilder.brandIds(foundBrandIds);
        }

        // --- Color Parsing ---
        List<Long> foundColorIds = new ArrayList<>();
        for (Map.Entry<String, Long> entry : COLOR_KEYWORDS_MAP.entrySet()) {
            boolean matched = false;
            if (entry.getKey().contains(" ")) { // Multi-word keyword
                if (lowerCaseMessage.contains(entry.getKey())) {
                    matched = true;
                }
            } else { // Single-word keyword
                if (messageWords.contains(entry.getKey())) {
                    matched = true;
                }
            }
            if (matched) {
                foundColorIds.add(entry.getValue());
            }
        }
        if (!foundColorIds.isEmpty()) {
            filterBuilder.colorIds(foundColorIds);
        }

        // --- Boolean Filters ---
        // Check for "mới nhất" to set isNew
        if (lowerCaseMessage.contains("mới nhất") || lowerCaseMessage.contains("sản phẩm mới") || lowerCaseMessage.contains("hàng mới") || lowerCaseMessage.contains("mới về")) {
            filterBuilder.isNew(true);
        }
        // Check for "bán chạy nhất" to set isBestSeller
        if (lowerCaseMessage.contains("bán chạy nhất") || lowerCaseMessage.contains("sản phẩm hot") || lowerCaseMessage.contains("best seller") || lowerCaseMessage.contains("bán chạy")) {
            filterBuilder.isBestSeller(true);
        }


        // --- Sorting ---
        // Find the sort option that appears latest in the message
        String finalSortBy = null;
        String finalSortDirection = null;
        int lastSortKeywordIndex = -1;

        for (Map.Entry<String, String[]> entry : SORT_OPTIONS_MAP.entrySet()) {
            int currentIndex = lowerCaseMessage.indexOf(entry.getKey());
            if (currentIndex != -1 && currentIndex > lastSortKeywordIndex) {
                finalSortBy = entry.getValue()[0];
                finalSortDirection = entry.getValue()[1];
                lastSortKeywordIndex = currentIndex;
            }
        }

        // Fallback for simple price sorting if no specific sort option was found
        if (finalSortBy == null) {
            if (lowerCaseMessage.contains("rẻ") || lowerCaseMessage.contains("giá thấp")) {
                finalSortBy = "discountedPrice";
                finalSortDirection = "ASC";
            } else if (lowerCaseMessage.contains("đắt") || lowerCaseMessage.contains("giá cao")) {
                finalSortBy = "discountedPrice";
                finalSortDirection = "DESC";
            }
        }

        // Default sorting if no sorting preference was found at all
        if (finalSortBy == null) {
            finalSortBy = "basePrice"; // Default sortBy
            finalSortDirection = "ASC"; // Default sortDirection
        }

        filterBuilder.sortBy(finalSortBy).sortDirection(finalSortDirection);


        // --- Price range (more robust parsing using regex) ---
        Pattern priceRangePattern = Pattern.compile("(dưới|trên)\\s*(\\d+(\\.\\d+)?)([kkm]?)");
        Matcher priceRangeMatcher = priceRangePattern.matcher(lowerCaseMessage);

        while (priceRangeMatcher.find()) {
            String type = priceRangeMatcher.group(1); // "dưới" or "trên"
            double value = Double.parseDouble(priceRangeMatcher.group(2));
            String unit = priceRangeMatcher.group(4); // "k", "kk", "m" or empty

            // Convert to actual price
            if ("k".equals(unit)) {
                value *= 1_000;
            } else if ("kk".equals(unit) || "m".equals(unit)) { // Assuming 'm' also means million
                value *= 1_000_000;
            }

            if ("dưới".equals(type)) {
                filterBuilder.maxPrice(value);
            } else if ("trên".equals(type)) {
                filterBuilder.minPrice(value);
            }
        }

        // --- Pagination ---
        Pattern pagePattern = Pattern.compile("trang\\s*(\\d+)");
        Matcher pageMatcher = pagePattern.matcher(lowerCaseMessage);
        if (pageMatcher.find()) {
            filterBuilder.page(Integer.parseInt(pageMatcher.group(1)) - 1); // Page is 0-indexed
        }

        Pattern sizePattern = Pattern.compile("(\\d+)\\s*(sản phẩm|kết quả)");
        Matcher sizeMatcher = sizePattern.matcher(lowerCaseMessage);
        if (sizeMatcher.find()) {
            filterBuilder.size(Integer.parseInt(sizeMatcher.group(1)));
        }


        // Always include the original message as a keyword search for broader results
        // This should be done carefully if LLM is used, to avoid double filtering
        filterBuilder.keyword(message);

        // Default pagination if not specified
        if (filterBuilder.build().getPage() == null) {
            filterBuilder.page(0);
        }
        if (filterBuilder.build().getSize() == null) {
            filterBuilder.size(10);
        }

        ProductFilterRequest filterRequest = filterBuilder.build();

        // --- Log the generated ProductFilterRequest ---
        log.info("Generated ProductFilterRequest from message '{}': {}", message, filterRequest);

        // Now, use the ProductFilterService to get the products
        Page<ProductDetailResponse> products = productFilterService.filterProducts(filterRequest);

        return ChatResponse.builder()
                .responseMessage("Đây là những sản phẩm tôi tìm được:")
                .products(products)
                .build();
    }
}
