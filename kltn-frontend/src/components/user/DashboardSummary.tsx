import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGifts } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getTotalSpentByUser, getTotalOrdersCountByUser } from "@/services/orderService";
import { getTotalValidVouchersCount } from "@/services/voucherService";
import { toast } from "sonner";

type Props = {
  userId?: number;
  perks?: string[];
};

const DashboardSummary = ({
  userId,
  perks = [
    "Giảm 10% cho đơn hàng trên 200K",
    "Miễn phí vận chuyển cho đơn từ 500K",
    "Tặng quà khi mua áo thun trên 300K",
  ],
}: Props) => {
  const [totalVouchers, setTotalVouchers] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [vouchersCount, ordersCount, spentAmount] = await Promise.all([
          getTotalValidVouchersCount(userId).catch(() => 0),
          getTotalOrdersCountByUser(userId).catch(() => 0),
          getTotalSpentByUser(userId).catch(() => 0)
        ]);

        setTotalVouchers(vouchersCount);
        setTotalOrders(ordersCount);
        setTotalSpent(spentAmount);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Không thể tải thông tin dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]);

  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };
  return (
    <section className="bg-white p-4 rounded shadow-md">
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="p-4 border rounded-md bg-white">
          <p className="text-gray-700">Tổng số voucher hiện có</p>
          {loading ? (
            <div className="h-7 bg-gray-200 rounded animate-pulse mt-1"></div>
          ) : (
            <p className="text-red-500 text-xl font-semibold">{totalVouchers} vouchers</p>
          )}
        </div>
        <div className="p-4 border rounded-md bg-white">
          <p className="text-gray-700">Số đơn hàng</p>
          {loading ? (
            <div className="h-7 bg-gray-200 rounded animate-pulse mt-1"></div>
          ) : (
            <p className="text-red-500 text-xl font-semibold">{totalOrders} đơn hàng</p>
          )}
        </div>
        <div className="p-4 border rounded-md bg-white">
          <p className="text-gray-700">Đã thanh toán</p>
          {loading ? (
            <div className="h-7 bg-gray-200 rounded animate-pulse mt-1"></div>
          ) : (
            <p className="text-red-500 text-xl font-semibold">{formatPrice(totalSpent)}</p>
          )}
        </div>
      </div>
      <div className="mt-6 bg-white p-6 rounded-md shadow-md">
        <h2 className="font-semibold text-lg flex items-center">
          <FontAwesomeIcon icon={faGifts} className="text-lg mr-2" />
          Ưu đãi của bạn
        </h2>
        <ul className="mt-4 space-y-2 text-gray-700">
          {perks.map((perk, idx) => (
            <li key={idx} className="p-2 border rounded-md">
              {perk}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default DashboardSummary;