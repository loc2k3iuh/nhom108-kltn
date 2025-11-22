package iuh.fit.se.services.impls;

import iuh.fit.se.configurations.VnPayConfig;
import iuh.fit.se.dtos.requests.VnPayRequest;
import iuh.fit.se.services.interfaces.IVnPayService;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VnPayServiceImpl implements IVnPayService {

  @Value("${vn-pay.url}")
  private String vnPayUrl;

  @Value("${vn-pay.return-url}")
  private String vnPayReturnUrl;

  @Value("${vn-pay.api-url}")
  private String vnPayApiUrl;

  @Value("${vn-pay.tmn-code}")
  private String vnPayTmnCode;

  @Value("${vn-pay.secret-key}")
  private String vnPaySecretKey;

  @Override
  public String createPayment(VnPayRequest paymentRequest) throws UnsupportedEncodingException {
    String vnp_Version = "2.1.0";
    String vnp_Command = "pay";
    String orderType = "other";

    long amount = 0;
    try {
      // Parse as double first to handle decimal values, then convert to long
      double amountDouble = Double.parseDouble(paymentRequest.getAmount());
      amount = (long) (amountDouble * 100);
    } catch (NumberFormatException e) {
      throw new IllegalArgumentException("Số tiền không hợp lệ");
    }

    String bankCode = ""; // Replace with actual bank code
    String vnp_TxnRef = VnPayConfig.getRandomNumber(8);
    String vnp_IpAddr = "127.0.0.1";
    String vnp_TmnCode = vnPayTmnCode;

    Map<String, String> vnp_Params = new HashMap<>();
    vnp_Params.put("vnp_Version", vnp_Version);
    vnp_Params.put("vnp_Command", vnp_Command);
    vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
    vnp_Params.put("vnp_Amount", String.valueOf(amount));
    vnp_Params.put("vnp_CurrCode", "VND");

    vnp_Params.put("vnp_BankCode", bankCode);
    vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
    vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
    vnp_Params.put("vnp_OrderType", orderType);
    vnp_Params.put("vnp_Locale", "vn");
    vnp_Params.put("vnp_ReturnUrl", vnPayReturnUrl);
    vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

    Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
    SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
    String vnp_CreateDate = formatter.format(cld.getTime());
    vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

    cld.add(Calendar.MINUTE, 15);
    String vnp_ExpireDate = formatter.format(cld.getTime());
    vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

    List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
    Collections.sort(fieldNames);
    StringBuilder hashData = new StringBuilder();
    StringBuilder query = new StringBuilder();
    for (String fieldName : fieldNames) {
      String fieldValue = vnp_Params.get(fieldName);
      if ((fieldValue != null) && (fieldValue.length() > 0)) {
        hashData
            .append(fieldName)
            .append('=')
            .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
        query
            .append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()))
            .append('=')
            .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
        query.append('&');
        hashData.append('&');
      }
    }

    if (query.length() > 0) query.setLength(query.length() - 1);
    if (hashData.length() > 0) hashData.setLength(hashData.length() - 1);

    String vnp_SecureHash = VnPayConfig.hmacSHA512(vnPaySecretKey, hashData.toString());
    query.append("&vnp_SecureHash=").append(vnp_SecureHash);
    return vnPayUrl + "?" + query;
  }

  @Override
  public String handlePaymentReturn(String responseCode) {
    return responseCode;
  }
}
