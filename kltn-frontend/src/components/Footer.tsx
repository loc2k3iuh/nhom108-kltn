import React from 'react';
import { Link } from 'react-router-dom';
import vuvisaIco from '/ico.png';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope,
  FaCreditCard,
  FaTruck,
  FaHandsHelping,
  FaTshirt
} from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-gradient-to-b from-white to-gray-100">
      {/* Newsletter Section */}
      <div className="w-full bg-red-50 py-8">
        <div className="container mx-auto px-4 lg:max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="md:w-1/2 text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Đăng ký nhận thông tin</h3>
              <p className="text-gray-600">Nhận thông báo về thời trang mới và ưu đãi đặc biệt hàng tuần!</p>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="flex-grow px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-md transition duration-200">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="border-t border-b border-gray-200 py-10">
        <div className="container mx-auto px-4 lg:max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-red-50 p-3 rounded-full mb-3">
                <FaTruck className="text-red-600 text-2xl" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Giao hàng miễn phí</h3>
              <p className="text-sm text-gray-600">Cho đơn hàng từ 250.000đ</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-red-50 p-3 rounded-full mb-3">
                <FaHandsHelping className="text-red-600 text-2xl" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Hỗ trợ trực tuyến</h3>
              <p className="text-sm text-gray-600">Hỗ trợ 24/7</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-red-50 p-3 rounded-full mb-3">
                <FaCreditCard className="text-red-600 text-2xl" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Thanh toán an toàn</h3>
              <p className="text-sm text-gray-600">Thanh toán đa dạng</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-red-50 p-3 rounded-full mb-3">
                <MdSecurity className="text-red-600 text-2xl" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Bảo mật thông tin</h3>
              <p className="text-sm text-gray-600">Mã hóa dữ liệu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="w-full container mx-auto lg:max-w-7xl p-6 lg:p-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* About Column */}
          <div className="md:col-span-4">
            <div className="flex items-center mb-5">
              <img src={vuvisaIco} className="h-10 mr-3" alt="DAVINCI Logo" />
              <span className="text-3xl font-bold text-red-600">DAVINCI</span>
            </div>
            <p className="text-gray-600 mb-6">
              DAVINCI - Thương hiệu thời trang cao cấp với bộ sưu tập đa dạng và phong cách hiện đại. 
              Khám phá không gian thời trang và tìm kiếm những món đồ phù hợp với phong cách của bạn.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition duration-200">
                <FaFacebookF size={16} />
              </a>
              <a href="#" className="bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition duration-200">
                <FaInstagram size={16} />
              </a>
              <a href="#" className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition duration-200">
                <FaYoutube size={16} />
              </a>
              <a href="#" className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-500 transition duration-200">
                <FaTwitter size={16} />
              </a>
            </div>
          </div>

          {/* Categories Column */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Danh mục</h3>
            <ul className="space-y-2">
              <li><Link to="/category/1" className="text-gray-600 hover:text-red-600 transition duration-200">Thời trang nam</Link></li>
              <li><Link to="/category/2" className="text-gray-600 hover:text-red-600 transition duration-200">Thời trang nữ</Link></li>
              <li><Link to="/category/3" className="text-gray-600 hover:text-red-600 transition duration-200">Phụ kiện thể thao</Link></li>
              <li><Link to="/category/4" className="text-gray-600 hover:text-red-600 transition duration-200">Giày dép</Link></li>
              <li><Link to="/flash-sale" className="text-gray-600 hover:text-red-600 transition duration-200">Flash sale</Link></li>
            </ul>
          </div>

          {/* Information Column */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Thông tin</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-red-600 transition duration-200">Về chúng tôi</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-600 hover:text-red-600 transition duration-200">Điều khoản dịch vụ</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-600 hover:text-red-600 transition duration-200">Chính sách bảo mật</Link></li>
              <li><Link to="/shipping-policy" className="text-gray-600 hover:text-red-600 transition duration-200">Chính sách vận chuyển</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-red-600 transition duration-200">FAQ</Link></li>
            </ul>
          </div>

          {/* Account Column */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Tài khoản</h3>
            <ul className="space-y-2">
              <li><Link to="/user/profile" className="text-gray-600 hover:text-red-600 transition duration-200">Tài khoản của tôi</Link></li>
              <li><Link to="/user/orders" className="text-gray-600 hover:text-red-600 transition duration-200">Đơn hàng</Link></li>
              <li><Link to="/user/wishlist" className="text-gray-600 hover:text-red-600 transition duration-200">Danh sách yêu thích</Link></li>
              <li><Link to="/track-order" className="text-gray-600 hover:text-red-600 transition duration-200">Theo dõi đơn hàng</Link></li>
              <li><Link to="/help" className="text-gray-600 hover:text-red-600 transition duration-200">Trợ giúp</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Liên hệ</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-red-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-600">12 Nguyễn Văn Bảo, Phường 1, Gò Vấp, TP.HCM</span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="text-red-600 mr-3 flex-shrink-0" />
                <span className="text-gray-600">+84 974 867266</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-red-600 mr-3 flex-shrink-0" />
                <span className="text-gray-600">contact@davinci.com</span>
              </li>
              <li className="flex items-center">
                <FaTshirt className="text-red-600 mr-3 flex-shrink-0" />
                <span className="text-gray-600">Mở cửa: 8:00 - 21:00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-50 py-6">
        <div className="container mx-auto px-4 lg:max-w-7xl flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">© {new Date().getFullYear()} DAVINCI - Thương hiệu thời trang cao cấp. Tất cả quyền được bảo lưu.</p>
          </div>
          <div className="flex items-center">
            <img src="https://cdn0.fahasa.com/media/wysiwyg/payment-footer.png" alt="Payment Methods" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;