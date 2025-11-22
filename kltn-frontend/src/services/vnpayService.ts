import axiosInstance from '@/lib/axios';

export interface VnPayRequest {
  amount: string;
}

export interface VnPayResponse {
  paymentUrl: string;
}

const VNPAY_API = '/vn-pay';

export const createVnPayPayment = async (amount: number): Promise<string> => {
  try {
    console.log('Creating VNPay payment with amount:', amount);
    const response = await axiosInstance.post<{ result: string }>(VNPAY_API, {
      amount: amount.toString(),
    });
    
    console.log('VNPay response:', response.data);
    
    if (!response.data.result) {
      throw new Error('Payment URL not found in response');
    }
    
    return response.data.result;
    
  } catch (error: any) {
    console.error('VNPay payment creation error:', error);
    console.error('Error response:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Không thể tạo link thanh toán VNPay');
  }
};

export const handleVnPayReturn = async (responseCode: string): Promise<string> => {
  try {
    const response = await axiosInstance.get<{ result: string }>(`${VNPAY_API}/return`, {
      params: { vnp_ResponseCode: responseCode },
    });
    
    return response.data.result;
  } catch (error: any) {
    console.error('VNPay return handling error:', error);
    throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi xử lý thanh toán');
  }
};
