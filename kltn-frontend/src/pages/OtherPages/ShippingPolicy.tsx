import React from 'react';
import { FaTruck, FaShippingFast, FaMapMarkerAlt, FaRegClock, FaMoneyBillWave } from 'react-icons/fa';

const ShippingPolicy: React.FC = () => {
  return (
    <div className="bg-white py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Chính sách vận chuyển</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            DAVINCI cam kết cung cấp dịch vụ giao hàng nhanh chóng, đáng tin cậy và tiết kiệm chi phí cho khách hàng.
            Trang này giải thích các phương thức vận chuyển, thời gian giao hàng và chi phí liên quan.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <div className="flex items-center mb-4">
              <FaShippingFast className="text-red-600 mr-3 text-xl" />
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                1. Phương thức vận chuyển
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              DAVINCI hợp tác với nhiều đơn vị vận chuyển uy tín để đảm bảo đơn hàng thời trang của bạn được giao đến nhanh chóng và an toàn.
              Chúng tôi cung cấp các phương thức vận chuyển sau:
            </p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">1.1. Giao hàng tiêu chuẩn</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li>Áp dụng cho tất cả các đơn hàng trong phạm vi lãnh thổ Việt Nam</li>
                <li>Thời gian giao hàng: 2-5 ngày làm việc (tùy khu vực)</li>
                <li>Miễn phí giao hàng cho đơn hàng từ 250.000đ</li>
                <li>Phí vận chuyển cho đơn hàng dưới 250.000đ: 15.000đ - 30.000đ (tùy khu vực)</li>
              </ul>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">1.2. Giao hàng nhanh</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li>Áp dụng cho các khu vực nội thành TP.HCM, Hà Nội và một số thành phố lớn</li>
                <li>Thời gian giao hàng: 1-2 ngày làm việc</li>
                <li>Phí giao hàng nhanh: 30.000đ - 50.000đ (tùy khu vực)</li>
              </ul>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">1.3. Giao hàng hỏa tốc</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li>Chỉ áp dụng cho khu vực nội thành TP.HCM</li>
                <li>Thời gian giao hàng: trong ngày (đối với đơn hàng đặt trước 12h trưa)</li>
                <li>Phí giao hàng hỏa tốc: 60.000đ - 80.000đ</li>
              </ul>
            </div>
            <p className="text-gray-600 mb-4">
              Lưu ý: Trong một số trường hợp, thời gian giao hàng có thể bị ảnh hưởng bởi các yếu tố như thời tiết, 
              sự kiện đặc biệt, hoặc khu vực vùng sâu vùng xa.
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <div className="flex items-center mb-4">
              <FaMapMarkerAlt className="text-red-600 mr-3 text-xl" />
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                2. Khu vực giao hàng
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              DAVINCI hiện cung cấp dịch vụ giao hàng thời trang trên toàn lãnh thổ Việt Nam, bao gồm tất cả 63 tỉnh thành.
            </p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">2.1. Phân loại khu vực giao hàng</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li><strong>Khu vực 1:</strong> Nội thành TP.HCM và Hà Nội (giao hàng nhanh nhất)</li>
                <li><strong>Khu vực 2:</strong> Các thành phố lớn và thị xã (Đà Nẵng, Cần Thơ, Hải Phòng...)</li>
                <li><strong>Khu vực 3:</strong> Các tỉnh thành khác trên toàn quốc</li>
                <li><strong>Khu vực 4:</strong> Vùng sâu, vùng xa, hải đảo (có thể phát sinh thêm phí và thời gian giao hàng)</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">2.2. Lưu ý về khu vực đặc biệt</h3>
              <p className="text-gray-600">
                Đối với các đơn hàng giao đến khu vực hải đảo (Phú Quốc, Côn Đảo, Lý Sơn...) hoặc vùng sâu vùng xa, 
                có thể phát sinh thêm phí vận chuyển và thời gian giao hàng có thể kéo dài hơn. 
                Bộ phận chăm sóc khách hàng sẽ liên hệ trực tiếp để xác nhận chi phí và thời gian giao hàng cụ thể.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <div className="flex items-center mb-4">
              <FaRegClock className="text-red-600 mr-3 text-xl" />
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                3. Thời gian giao hàng
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Thời gian giao hàng được tính từ khi đơn hàng được xác nhận và chuyển qua đơn vị vận chuyển.
            </p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">3.1. Thời gian xử lý đơn hàng</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li>Đơn hàng được đặt trước 14h00: xử lý trong ngày</li>
                <li>Đơn hàng được đặt sau 14h00: xử lý vào ngày làm việc tiếp theo</li>
                <li>Thời gian xử lý có thể kéo dài hơn trong các dịp cao điểm như Black Friday, Tết...</li>
              </ul>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">3.2. Ước tính thời gian giao hàng</h3>
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Khu vực</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Giao hàng tiêu chuẩn</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Giao hàng nhanh</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Khu vực 1</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">2-3 ngày</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">1-2 ngày</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Khu vực 2</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">3-4 ngày</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">2-3 ngày</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Khu vực 3</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">4-5 ngày</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">3-4 ngày</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Khu vực 4</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">5-7 ngày</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">4-5 ngày</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong className="font-medium text-yellow-800">Lưu ý:</strong> Thời gian giao hàng có thể thay đổi do điều kiện thời tiết, 
                    sự cố giao thông, hoặc các yếu tố bất khả kháng khác. DAVINCI sẽ cập nhật tình trạng đơn hàng thời trang và 
                    thông báo cho khách hàng nếu có bất kỳ thay đổi đáng kể nào về thời gian giao hàng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <div className="flex items-center mb-4">
              <FaMoneyBillWave className="text-red-600 mr-3 text-xl" />
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                4. Chi phí vận chuyển
              </h2>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">4.1. Biểu phí vận chuyển tiêu chuẩn</h3>
              <table className="min-w-full border-collapse mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Khu vực</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Đơn hàng dưới 250.000đ</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Đơn hàng từ 250.000đ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Khu vực 1</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">15.000đ</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Miễn phí</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Khu vực 2</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">20.000đ</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Miễn phí</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Khu vực 3</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">25.000đ</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Miễn phí</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Khu vực 4</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">30.000đ</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Miễn phí</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">4.2. Phí vận chuyển nhanh (phụ thu thêm)</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li>Khu vực 1: +15.000đ</li>
                <li>Khu vực 2: +20.000đ</li>
                <li>Khu vực 3: +30.000đ</li>
                <li>Khu vực 4: +40.000đ</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">4.3. Trường hợp đặc biệt</h3>
              <p className="text-gray-600 mb-3">
                Phí vận chuyển có thể tăng thêm trong các trường hợp sau:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li>Đơn hàng có tổng trọng lượng trên 5kg</li>
                <li>Đơn hàng có kích thước lớn (chiều dài + chiều rộng + chiều cao {'>'} 100cm)</li>
                <li>Địa chỉ giao hàng nằm trong khu vực đặc biệt (hải đảo, vùng núi cao...)</li>
              </ul>
              <p className="text-gray-600">
                Trong những trường hợp này, DAVINCI sẽ liên hệ trực tiếp với khách hàng để thông báo về phí vận chuyển phát sinh.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <div className="flex items-center mb-4">
              <FaTruck className="text-red-600 mr-3 text-xl" />
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                5. Theo dõi đơn hàng
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              DAVINCI cung cấp khả năng theo dõi đơn hàng thời trang để bạn có thể kiểm tra tình trạng giao hàng của mình bất kỳ lúc nào.
            </p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">5.1. Cách thức theo dõi</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li>Đăng nhập vào tài khoản DAVINCI và vào mục "Đơn hàng thời trang của tôi"</li>
                <li>Sử dụng mã vận đơn được cung cấp trong email xác nhận đơn hàng</li>
                <li>Liên hệ trực tiếp với bộ phận Chăm sóc khách hàng qua số điện thoại: +84 974 867266</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">5.2. Các trạng thái đơn hàng</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li><strong>Đang xử lý:</strong> Đơn hàng đã được tiếp nhận và đang được xử lý</li>
                <li><strong>Đang đóng gói:</strong> Đơn hàng đang được chuẩn bị và đóng gói</li>
                <li><strong>Đã giao cho đơn vị vận chuyển:</strong> Đơn hàng đã được bàn giao cho đơn vị vận chuyển</li>
                <li><strong>Đang vận chuyển:</strong> Đơn hàng đang được vận chuyển đến địa chỉ giao hàng</li>
                <li><strong>Đã giao hàng:</strong> Đơn hàng đã được giao thành công</li>
                <li><strong>Giao hàng không thành công:</strong> Đơn hàng giao không thành công, đang chờ giao lại</li>
                <li><strong>Đã hủy:</strong> Đơn hàng đã bị hủy</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              6. Chính sách nhận hàng
            </h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">6.1. Kiểm tra hàng khi nhận</h3>
              <p className="text-gray-600 mb-3">
                Khi nhận hàng, khách hàng nên kiểm tra:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li>Tình trạng bên ngoài của gói hàng thời trang (có bị hư hỏng, móp méo không)</li>
                <li>Sản phẩm thời trang bên trong có đúng với đơn đặt hàng không</li>
                <li>Số lượng sản phẩm thời trang có đầy đủ không</li>
                <li>Tình trạng của sản phẩm thời trang (có bị hư hỏng, lỗi không)</li>
              </ul>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">6.2. Ký nhận hàng</h3>
              <p className="text-gray-600 mb-3">
                Khi nhận hàng, khách hàng sẽ được yêu cầu ký nhận. Trong trường hợp phát hiện sản phẩm bị hư hỏng 
                hoặc không đúng đơn hàng, vui lòng:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li>Từ chối nhận hàng và ghi rõ lý do</li>
                <li>Hoặc ghi chú tình trạng hàng hóa thời trang trên biên bản giao nhận</li>
                <li>Liên hệ ngay với bộ phận Chăm sóc khách hàng của DAVINCI</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">6.3. Trường hợp vắng mặt</h3>
              <p className="text-gray-600">
                Nếu khách hàng không có mặt tại địa chỉ giao hàng vào thời điểm giao:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li>Đơn vị vận chuyển sẽ cố gắng liên hệ qua số điện thoại được cung cấp</li>
                <li>Đơn hàng thời trang sẽ được giữ lại và giao lại vào ngày làm việc tiếp theo</li>
                <li>Sau 3 lần giao không thành công, đơn hàng sẽ được trả về DAVINCI</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              7. Liên hệ hỗ trợ vận chuyển
            </h2>
            <p className="text-gray-600 mb-4">
              Nếu bạn có bất kỳ câu hỏi nào về việc giao hàng hoặc cần hỗ trợ, vui lòng liên hệ với chúng tôi qua:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg text-gray-700 mb-4">
              <p><strong>Bộ phận Chăm sóc khách hàng DAVINCI</strong></p>
              <p>Email: shipping@davinci.com</p>
              <p>Điện thoại: +84 974 867266 (7:30 - 21:00, từ Thứ Hai đến Chủ Nhật)</p>
              <p>Fanpage: <a href="https://www.facebook.com/davinci" className="text-red-600 hover:underline">facebook.com/davinci</a></p>
            </div>
            <p className="text-gray-600 italic">
              Cập nhật lần cuối: Ngày 23 tháng 05 năm 2025
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-600">
            DAVINCI luôn nỗ lực cải thiện dịch vụ vận chuyển để mang đến trải nghiệm mua sắm thời trang tốt nhất cho khách hàng.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
