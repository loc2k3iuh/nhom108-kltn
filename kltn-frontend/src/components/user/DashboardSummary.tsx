import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGifts } from "@fortawesome/free-solid-svg-icons";

type Props = {
  stats?: {
    fPoint: number;
    freeship: number;
    orders: number;
    paid: string;
  };
  perks?: string[];
};

const DashboardSummary = ({
  stats = { fPoint: 0, freeship: 0, orders: 0, paid: "0 đ" },
  perks = [
    "Giảm 10% cho đơn hàng trên 200K",
    "Miễn phí vận chuyển cho đơn từ 500K",
    "Tặng quà khi mua sách giáo khoa",
  ],
}: Props) => {
  return (
    <section className="bg-white p-4 rounded shadow-md">
      <div className="mt-4 grid grid-cols-4 gap-4 text-center">
        <div className="p-4 border rounded-md bg-white">
          <p className="text-gray-700">F-Point hiện có</p>
          <p className="text-red-500 text-xl font-semibold">{stats.fPoint}</p>
        </div>
        <div className="p-4 border rounded-md bg-white">
          <p className="text-gray-700">Freeship hiện có</p>
          <p className="text-red-500 text-xl font-semibold">{stats.freeship} lần</p>
        </div>
        <div className="p-4 border rounded-md bg-white">
          <p className="text-gray-700">Số đơn hàng</p>
          <p className="text-red-500 text-xl font-semibold">{stats.orders} đơn hàng</p>
        </div>
        <div className="p-4 border rounded-md bg-white">
          <p className="text-gray-700">Đã thanh toán</p>
          <p className="text-red-500 text-xl font-semibold">{stats.paid}</p>
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
