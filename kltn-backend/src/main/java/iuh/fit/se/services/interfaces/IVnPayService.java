package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.VnPayRequest;
import java.io.UnsupportedEncodingException;

public interface IVnPayService {
  String createPayment(VnPayRequest vnpayRequest) throws UnsupportedEncodingException;

  String handlePaymentReturn(String responseCode);
}
