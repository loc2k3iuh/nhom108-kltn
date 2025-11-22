package iuh.fit.se.controllers;


import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.VnPayRequest;
import iuh.fit.se.services.interfaces.IVnPayService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("${api.prefix}/vn-pay")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VnPayController {

    IVnPayService iVnPayService;
    @PostMapping
    public APIResponse<?> createPayment(@RequestBody VnPayRequest vnpayRequest) {
        try {
            String paymentUrl = iVnPayService.createPayment(vnpayRequest);
            return APIResponse.builder()
                    .message("Payment URL generated successfully")
                    .result(paymentUrl)
                    .build();
        } catch (Exception e) {
            return APIResponse.builder()
                    .message("Error generating payment URL: " + e.getMessage())
                    .build();
        }
    }

    @GetMapping("/return")
    public APIResponse<?> returnPayment(@RequestParam("vnp_ResponseCode") String responseCode) {
        try {
            String result = iVnPayService.handlePaymentReturn(responseCode);
            return APIResponse.builder()
                    .message("Payment handled successfully")
                    .result(result)
                    .build();
        } catch (Exception e) {
            return APIResponse.builder()
                    .message("Error handling payment: " + e.getMessage())
                    .build();
        }
    }
}