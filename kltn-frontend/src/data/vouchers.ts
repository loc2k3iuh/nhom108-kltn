// src/data/vouchers.ts

// Standardized Voucher Interface
export interface Voucher {
  id: number;
  code: string;
  discount_name: string;
  discount_percentage?: number;
  discount_amount?: number;
  min_order_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  usage_limit?: number;
  used_count?: number;
}

// Centralized, standardized, and fashion-themed voucher data
export const staticVouchers: Voucher[] = [
  {
    id: 1,
    code: "NEWBIE20",
    discount_name: "Giảm 20% cho đơn hàng đầu tiên",
    discount_percentage: 20,
    min_order_value: 250000,
    start_date: "2024-01-01T00:00:00",
    end_date: "2024-12-31T23:59:59",
    is_active: true,
    usage_limit: 1000,
    used_count: 150
  },
  {
    id: 2,
    code: "FREESHIP",
    discount_name: "Miễn phí vận chuyển",
    discount_amount: 30000, // Assuming a fixed shipping fee of 30k
    min_order_value: 200000,
    start_date: "2024-01-01T00:00:00",
    end_date: "2024-12-31T23:59:59",
    is_active: true,
    usage_limit: 5000,
    used_count: 1200
  },
  {
    id: 3,
    code: "SHIRT50K",
    discount_name: "Giảm 50K cho áo sơ mi",
    discount_amount: 50000,
    min_order_value: 350000,
    start_date: "2024-09-01T00:00:00",
    end_date: "2024-10-31T23:59:59",
    is_active: true,
    usage_limit: 500,
    used_count: 80
  },
  {
    id: 4,
    code: "SPORTY15",
    discount_name: "Giảm 15% đồ thể thao",
    discount_percentage: 15,
    min_order_value: 400000,
    start_date: "2024-09-15T00:00:00",
    end_date: "2024-10-15T23:59:59",
    is_active: true,
    usage_limit: 300,
    used_count: 45
  },
  {
    id: 5,
    code: "JEANS10",
    discount_name: "Giảm 10% cho quần Jeans",
    discount_percentage: 10,
    min_order_value: 450000,
    start_date: "2024-09-01T00:00:00",
    end_date: "2024-11-30T23:59:59",
    is_active: true,
    usage_limit: 400,
    used_count: 120
  },
  {
    id: 6,
    code: "BIGSALE100K",
    discount_name: "Giảm 100K cho đơn từ 1 triệu",
    discount_amount: 100000,
    min_order_value: 1000000,
    start_date: "2024-10-01T00:00:00",
    end_date: "2024-10-10T23:59:59",
    is_active: true,
    usage_limit: 100,
    used_count: 10
  },
  {
    id: 7,
    code: "HATS20K",
    discount_name: "Giảm 20K cho phụ kiện mũ/nón",
    discount_amount: 20000,
    min_order_value: 150000,
    start_date: "2024-01-01T00:00:00",
    end_date: "2024-12-31T23:59:59",
    is_active: true,
    usage_limit: 1000,
    used_count: 350
  },
  {
    id: 8,
    code: "EXPIREDVOUCHER",
    discount_name: "Voucher đã hết hạn",
    discount_percentage: 50,
    min_order_value: 500000,
    start_date: "2024-01-01T00:00:00",
    end_date: "2024-08-01T23:59:59",
    is_active: false,
    usage_limit: 100,
    used_count: 100
  }
];
