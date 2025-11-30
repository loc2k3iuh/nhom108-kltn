package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.CreateVoucherRequest;
import iuh.fit.se.dtos.requests.UpdateVoucherRequest;
import iuh.fit.se.dtos.responses.VoucherResponse;
import iuh.fit.se.entities.Voucher;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;

public interface IVoucherService {

  class VoucherApplyResult {
    public final Voucher voucher;
    public final BigDecimal discountAmount;

    public VoucherApplyResult(Voucher voucher, BigDecimal discountAmount) {
      this.voucher = voucher;
      this.discountAmount = discountAmount;
    }
  }

  VoucherApplyResult validateAndCalculate(Long userId, String code, BigDecimal orderTotal);

  void recordUsage(Long userId, Long voucherId);

  Page<VoucherResponse> getAllVouchersForUser(Long userId, String keyword, int page, int size);

  List<VoucherResponse> getSuitableVouchersListForOrderAmount(Long userId, BigDecimal orderAmount);

  Long getTotalValidVouchersCountByUser(Long userId);

  VoucherResponse claimVoucher(Long userId, String voucherCode);

  Page<VoucherResponse> getClaimableVouchersForUser(
      Long userId, String keyword, int page, int size);

  // CRUD operations
  VoucherResponse createVoucher(CreateVoucherRequest request);

  VoucherResponse updateVoucher(Long id, UpdateVoucherRequest request);

  void deleteVoucher(Long id);

  VoucherResponse getVoucherById(Long id);

  Page<VoucherResponse> getAllVouchers(
      String keyword, String discountType, int page, int size, String sortBy, String sortDir);
}
