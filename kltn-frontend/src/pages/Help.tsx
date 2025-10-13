import React from 'react';
import { FaHeadset, FaPhoneAlt, FaEnvelope, FaComments, FaQuestionCircle, FaBook, FaExchangeAlt, FaTruck } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Help: React.FC = () => {
  return (
    <div className="bg-white py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Trung tâm trợ giúp</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            DAVINCI luôn sẵn sàng hỗ trợ bạn với mọi vấn đề hay thắc mắc. Hãy cho chúng tôi biết làm thế nào 
            để giúp đỡ bạn tốt nhất.
          </p>
        </div>

        {/* Hỗ trợ chính */}
        <div className="bg-red-50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Làm thế nào chúng tôi có thể giúp bạn?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition duration-200">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-red-100 rounded-full mb-4">
                <FaHeadset className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Hỗ trợ trực tiếp</h3>
              <p className="text-gray-600 mb-4">
                Liên hệ với đội ngũ hỗ trợ khách hàng của chúng tôi để được giải đáp nhanh chóng.
              </p>
              <a 
                href="#support-contact" 
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-md transition duration-200"
              >
                Liên hệ ngay
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition duration-200">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-red-100 rounded-full mb-4">
                <FaQuestionCircle className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Câu hỏi thường gặp</h3>
              <p className="text-gray-600 mb-4">
                Tìm câu trả lời nhanh cho những câu hỏi phổ biến về đặt hàng, thanh toán và giao hàng.
              </p>
              <Link 
                to="/faq"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-md transition duration-200"
              >
                Xem FAQ
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition duration-200">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-red-100 rounded-full mb-4">
                <FaBook className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Hướng dẫn & Chính sách</h3>
              <p className="text-gray-600 mb-4">
                Xem hướng dẫn chi tiết và các chính sách mua hàng, vận chuyển, đổi trả của DAVINCI.
              </p>
              <a 
                href="#guides" 
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-md transition duration-200"
              >
                Xem hướng dẫn
              </a>
            </div>
          </div>
        </div>

        {/* Các chủ đề phổ biến */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Chủ đề trợ giúp phổ biến</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition duration-200">
              <div className="flex items-center mb-3">
                <FaTruck className="text-red-600 mr-3" />
                <h3 className="font-semibold text-gray-800">Theo dõi đơn hàng</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Làm thế nào để theo dõi đơn hàng của tôi? Đơn hàng của tôi hiện đang ở đâu?
              </p>
              <Link to="/faq#van-chuyen" className="text-red-600 hover:underline text-sm font-medium">
                Xem hướng dẫn
              </Link>
            </div>
            <div className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition duration-200">
              <div className="flex items-center mb-3">
                <FaExchangeAlt className="text-red-600 mr-3" />
                <h3 className="font-semibold text-gray-800">Đổi trả sản phẩm</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Làm thế nào để đổi hoặc trả lại sản phẩm? Chính sách đổi trả của DAVINCI là gì?
              </p>
              <Link to="/faq#doi-tra" className="text-red-600 hover:underline text-sm font-medium">
                Xem hướng dẫn
              </Link>
            </div>
            <div className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition duration-200">
              <div className="flex items-center mb-3">
                <FaPhoneAlt className="text-red-600 mr-3" />
                <h3 className="font-semibold text-gray-800">Liên hệ DAVINCI</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Làm thế nào để liên hệ với đội ngũ chăm sóc khách hàng? Thời gian hỗ trợ?
              </p>
              <a href="#support-contact" className="text-red-600 hover:underline text-sm font-medium">
                Xem thông tin liên hệ
              </a>
            </div>
            <div className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition duration-200">
              <div className="flex items-center mb-3">
                <FaComments className="text-red-600 mr-3" />
                <h3 className="font-semibold text-gray-800">Chat hỗ trợ trực tuyến</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Làm thế nào để trò chuyện trực tiếp với nhân viên hỗ trợ trực tuyến?
              </p>
              <a href="#" className="text-red-600 hover:underline text-sm font-medium">
                Bắt đầu chat
              </a>
            </div>
            <div className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition duration-200">
              <div className="flex items-center mb-3">
                <FaEnvelope className="text-red-600 mr-3" />
                <h3 className="font-semibold text-gray-800">Đăng ký nhận thông tin</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Làm thế nào để đăng ký nhận thông tin về sách mới và khuyến mãi?
              </p>
              <a href="#" className="text-red-600 hover:underline text-sm font-medium">
                Đăng ký ngay
              </a>
            </div>
            <div className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition duration-200">
              <div className="flex items-center mb-3">
                <FaBook className="text-red-600 mr-3" />
                <h3 className="font-semibold text-gray-800">Tài liệu hướng dẫn</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Tìm hiểu cách sử dụng ứng dụng và website DAVINCI một cách hiệu quả.
              </p>
              <a href="#guides" className="text-red-600 hover:underline text-sm font-medium">
                Xem tài liệu
              </a>
            </div>
          </div>
        </div>

        {/* Hướng dẫn & Chính sách */}
        <div id="guides" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Hướng dẫn & Chính sách</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Hướng dẫn mua hàng</h3>
                <p className="text-gray-600 mb-4">
                  Tìm hiểu quy trình đặt hàng trên website DAVINCI, từ cách tìm kiếm sản phẩm, 
                  thêm vào giỏ hàng, đến thanh toán và theo dõi đơn hàng.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center">
                    <span className="bg-red-100 text-red-600 w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                    <span className="text-gray-600 text-sm">Tìm kiếm và chọn sản phẩm</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-red-100 text-red-600 w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                    <span className="text-gray-600 text-sm">Thêm sản phẩm vào giỏ hàng</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-red-100 text-red-600 w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">3</span>
                    <span className="text-gray-600 text-sm">Cung cấp thông tin giao hàng</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-red-100 text-red-600 w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">4</span>
                    <span className="text-gray-600 text-sm">Chọn phương thức thanh toán</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-red-100 text-red-600 w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">5</span>
                    <span className="text-gray-600 text-sm">Xác nhận và hoàn tất đơn hàng</span>
                  </li>
                </ul>
                <Link 
                  to="/faq#mua-hang" 
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Xem hướng dẫn chi tiết →
                </Link>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Chính sách của DAVINCI</h3>
                <p className="text-gray-600 mb-4">
                  Tìm hiểu về các chính sách của DAVINCI, bao gồm điều khoản dịch vụ, chính sách bảo mật, vận chuyển và đổi trả.
                </p>
                <div className="space-y-3">
                  <Link to="/terms-of-service" className="flex items-center group">
                    <span className="text-red-600 mr-2 group-hover:translate-x-1 transition-transform">→</span>
                    <span className="text-gray-600 group-hover:text-red-600 transition">Điều khoản dịch vụ</span>
                  </Link>
                  <Link to="/privacy-policy" className="flex items-center group">
                    <span className="text-red-600 mr-2 group-hover:translate-x-1 transition-transform">→</span>
                    <span className="text-gray-600 group-hover:text-red-600 transition">Chính sách bảo mật</span>
                  </Link>
                  <Link to="/shipping-policy" className="flex items-center group">
                    <span className="text-red-600 mr-2 group-hover:translate-x-1 transition-transform">→</span>
                    <span className="text-gray-600 group-hover:text-red-600 transition">Chính sách vận chuyển</span>
                  </Link>
                  <div className="flex items-center group">
                    <span className="text-red-600 mr-2 group-hover:translate-x-1 transition-transform">→</span>
                    <span className="text-gray-600 group-hover:text-red-600 transition">Chính sách đổi trả và hoàn tiền</span>
                  </div>
                  <div className="flex items-center group">
                    <span className="text-red-600 mr-2 group-hover:translate-x-1 transition-transform">→</span>
                    <span className="text-gray-600 group-hover:text-red-600 transition">Chính sách bảo hành</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liên hệ hỗ trợ */}
        <div id="support-contact" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Liên hệ hỗ trợ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Thông tin liên hệ</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                      <FaPhoneAlt className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Hotline hỗ trợ</p>
                      <p className="text-gray-600">+84 974 867266</p>
                      <p className="text-gray-500 text-sm">(7:30 - 21:00, từ Thứ Hai đến Chủ Nhật)</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                      <FaEnvelope className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Email hỗ trợ</p>
                      <p className="text-gray-600">support@davinci.com</p>
                      <p className="text-gray-500 text-sm">(Phản hồi trong vòng 24 giờ làm việc)</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                      <FaComments className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Chat trực tuyến</p>
                      <p className="text-gray-600">Trò chuyện trực tiếp với nhân viên hỗ trợ</p>
                      <p className="text-gray-500 text-sm">(Sẵn sàng 24/7)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Gửi yêu cầu hỗ trợ</h3>
                <p className="text-gray-600 mb-4">
                  Hãy cho chúng tôi biết bạn cần trợ giúp về vấn đề gì, nhân viên DAVINCI sẽ phản hồi sớm nhất có thể.
                </p>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Nhập họ tên của bạn"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Nhập email của bạn"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Chủ đề</label>
                    <select 
                      id="subject" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Chọn chủ đề</option>
                      <option value="order">Đơn hàng</option>
                      <option value="shipping">Vận chuyển</option>
                      <option value="return">Đổi trả</option>
                      <option value="product">Sản phẩm</option>
                      <option value="account">Tài khoản</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải"
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-md transition duration-200"
                  >
                    Gửi yêu cầu
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Câu hỏi thường gặp</h2>
            <Link 
              to="/faq" 
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Xem tất cả FAQ
            </Link>
          </div>
          <div className="space-y-4">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="p-4 cursor-pointer hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Làm thế nào để theo dõi đơn hàng của tôi?</h3>
                  <span className="text-red-600">+</span>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="p-4 cursor-pointer hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Chính sách đổi trả sản phẩm như thế nào?</h3>
                  <span className="text-red-600">+</span>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="p-4 cursor-pointer hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Tôi có thể thay đổi địa chỉ giao hàng sau khi đặt hàng không?</h3>
                  <span className="text-red-600">+</span>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="p-4 cursor-pointer hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Làm thế nào để đăng ký tài khoản DAVINCI?</h3>
                  <span className="text-red-600">+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-red-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Vẫn còn thắc mắc?</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Đội ngũ DAVINCI luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi qua hotline 
            hoặc bắt đầu cuộc trò chuyện trực tuyến ngay bây giờ.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="tel:+84974867266" 
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-8 py-3 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <FaPhoneAlt className="mr-2" /> Gọi ngay
            </a>
            <a 
              href="#" 
              className="bg-white hover:bg-gray-100 text-red-600 border border-red-600 font-medium px-8 py-3 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <FaComments className="mr-2" /> Chat với DAVINCI
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
