import React, { useState } from 'react';
import { FaQuestionCircle, FaPlus, FaMinus, FaShippingFast, FaCreditCard, FaExchangeAlt, FaUserCircle, FaBook } from 'react-icons/fa';

const FAQ: React.FC = () => {
  const [openFaqs, setOpenFaqs] = useState<{ [key: string]: boolean }>({
    'faq-1': true,
  });

  const toggleFaq = (id: string) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-white py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Câu hỏi thường gặp</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Tìm hiểu thông tin hữu ích về việc mua sắm thời trang tại DAVINCI. Nếu bạn không tìm thấy câu trả lời cho câu hỏi của mình, 
            vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại bên dưới.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <a href="#mua-hang" className="flex flex-col items-center p-4 bg-gray-50 hover:bg-red-50 rounded-lg transition duration-200">
              <FaShoppingCart className="text-red-600 text-xl mb-2" />
              <span className="text-gray-800 font-medium text-center">Mua hàng</span>
            </a>
            <a href="#thanh-toan" className="flex flex-col items-center p-4 bg-gray-50 hover:bg-red-50 rounded-lg transition duration-200">
              <FaCreditCard className="text-red-600 text-xl mb-2" />
              <span className="text-gray-800 font-medium text-center">Thanh toán</span>
            </a>
            <a href="#van-chuyen" className="flex flex-col items-center p-4 bg-gray-50 hover:bg-red-50 rounded-lg transition duration-200">
              <FaShippingFast className="text-red-600 text-xl mb-2" />
              <span className="text-gray-800 font-medium text-center">Vận chuyển</span>
            </a>
            <a href="#doi-tra" className="flex flex-col items-center p-4 bg-gray-50 hover:bg-red-50 rounded-lg transition duration-200">
              <FaExchangeAlt className="text-red-600 text-xl mb-2" />
              <span className="text-gray-800 font-medium text-center">Đổi trả</span>
            </a>
            <a href="#tai-khoan" className="flex flex-col items-center p-4 bg-gray-50 hover:bg-red-50 rounded-lg transition duration-200">
              <FaUserCircle className="text-red-600 text-xl mb-2" />
              <span className="text-gray-800 font-medium text-center">Tài khoản</span>
            </a>
          </div>
        </div>

        {/* Mua hàng FAQs */}
        <div id="mua-hang" className="mb-10">
          <div className="flex items-center mb-6">
            <FaShoppingCart className="text-red-600 mr-3 text-xl" />
            <h2 className="text-2xl font-bold text-gray-800">Mua hàng</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFaq('faq-1')}
              >
                <span className="font-semibold text-gray-800">Làm thế nào để đặt hàng thời trang trên DAVINCI?</span>
                {openFaqs['faq-1'] ? (
                  <FaMinus className="text-red-600" />
                ) : (
                  <FaPlus className="text-red-600" />
                )}
              </button>
              {openFaqs['faq-1'] && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600 mb-2">Để đặt hàng thời trang trên DAVINCI, bạn cần thực hiện các bước sau:</p>
                  <ol className="list-decimal pl-5 text-gray-600 space-y-2">
                    <li>Tìm kiếm sản phẩm thời trang bạn muốn mua thông qua thanh tìm kiếm hoặc duyệt qua các danh mục (nam, nữ, phụ kiện, giày dép...).</li>
                    <li>Nhấp vào sản phẩm để xem chi tiết, chọn size và màu sắc phù hợp, sau đó nhấn nút "Thêm vào giỏ hàng".</li>
                    <li>Khi đã chọn xong sản phẩm, nhấp vào biểu tượng giỏ hàng ở góc phải trên cùng.</li>
                    <li>Kiểm tra giỏ hàng và nhấn "Thanh toán".</li>
                    <li>Nhập thông tin giao hàng của bạn hoặc đăng nhập vào tài khoản nếu bạn đã có.</li>
                    <li>Chọn phương thức thanh toán và hoàn tất đơn hàng.</li>
                  </ol>
                  <p className="text-gray-600 mt-2">Sau khi đặt hàng thành công, bạn sẽ nhận được email xác nhận đơn hàng.</p>
                </div>
              )}
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFaq('faq-2')}
              >
                <span className="font-semibold text-gray-800">Tôi có cần tạo tài khoản để mua hàng không?</span>
                {openFaqs['faq-2'] ? (
                  <FaMinus className="text-red-600" />
                ) : (
                  <FaPlus className="text-red-600" />
                )}
              </button>
              {openFaqs['faq-2'] && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600">
                    Có, bạn cần tạo tài khoản để mua sắm thời trang tại DAVINCI. Việc tạo tài khoản giúp bạn theo dõi đơn hàng thời trang, lưu thông tin giao hàng, 
                    xem lịch sử mua sắm và nhận được những ưu đãi thời trang đặc biệt. Quá trình đăng ký rất đơn giản và chỉ mất vài phút.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFaq('faq-3')}
              >
                <span className="font-semibold text-gray-800">Làm thế nào để sử dụng mã giảm giá?</span>
                {openFaqs['faq-3'] ? (
                  <FaMinus className="text-red-600" />
                ) : (
                  <FaPlus className="text-red-600" />
                )}
              </button>
              {openFaqs['faq-3'] && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600">
                    Để sử dụng mã giảm giá, bạn cần thực hiện các bước sau:
                  </p>
                  <ol className="list-decimal pl-5 text-gray-600 space-y-2 my-2">
                    <li>Thêm sản phẩm thời trang vào giỏ hàng.</li>
                    <li>Trong trang giỏ hàng, bạn sẽ thấy mục "Mã giảm giá" hoặc "Voucher".</li>
                    <li>Nhập mã giảm giá vào ô và nhấn "Áp dụng".</li>
                    <li>Nếu mã hợp lệ, giảm giá sẽ được áp dụng ngay lập tức vào tổng đơn hàng.</li>
                  </ol>
                  <p className="text-gray-600">
                    Lưu ý: Mỗi mã giảm giá có điều kiện áp dụng riêng, ví dụ như giá trị đơn hàng tối thiểu, 
                    sản phẩm cụ thể hoặc thời hạn sử dụng. Vui lòng kiểm tra điều kiện sử dụng trước khi áp dụng.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Thanh toán FAQs */}
        <div id="thanh-toan" className="mb-10">
          <div className="flex items-center mb-6">
            <FaCreditCard className="text-red-600 mr-3 text-xl" />
            <h2 className="text-2xl font-bold text-gray-800">Thanh toán</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFaq('faq-4')}
              >
                <span className="font-semibold text-gray-800">DAVINCI chấp nhận những phương thức thanh toán nào?</span>
                {openFaqs['faq-4'] ? (
                  <FaMinus className="text-red-600" />
                ) : (
                  <FaPlus className="text-red-600" />
                )}
              </button>
              {openFaqs['faq-4'] && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600 mb-2">
                    DAVINCI chấp nhận nhiều phương thức thanh toán khác nhau để mang đến sự thuận tiện cho khách hàng mua sắm thời trang:
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-2">
                    <li>Thanh toán khi nhận hàng (COD)</li>
                    <li>Thẻ tín dụng/ghi nợ (Visa, MasterCard, JCB)</li>
                    <li>Chuyển khoản ngân hàng</li>
                    <li>Ví điện tử (MoMo, ZaloPay, VNPay)</li>
                    <li>Trả góp qua các đối tác tài chính</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFaq('faq-5')}
              >
                <span className="font-semibold text-gray-800">Thanh toán online có an toàn không?</span>
                {openFaqs['faq-5'] ? (
                  <FaMinus className="text-red-600" />
                ) : (
                  <FaPlus className="text-red-600" />
                )}
              </button>
              {openFaqs['faq-5'] && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600">
                    Có, DAVINCI cam kết bảo mật thông tin thanh toán của khách hàng. Chúng tôi sử dụng công nghệ mã hóa SSL 
                    (Secure Socket Layer) để bảo vệ thông tin cá nhân và giao dịch mua sắm thời trang của bạn. Ngoài ra, chúng tôi chỉ hợp tác với 
                    các đối tác thanh toán uy tín và đáng tin cậy. DAVINCI tuân thủ các tiêu chuẩn bảo mật thanh toán quốc tế và 
                    không lưu trữ thông tin thẻ tín dụng của khách hàng.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFaq('faq-6')}
              >
                <span className="font-semibold text-gray-800">Tôi có thể yêu cầu xuất hóa đơn VAT không?</span>
                {openFaqs['faq-6'] ? (
                  <FaMinus className="text-red-600" />
                ) : (
                  <FaPlus className="text-red-600" />
                )}
              </button>
              {openFaqs['faq-6'] && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600">
                    Có, DAVINCI hỗ trợ xuất hóa đơn VAT cho khách hàng. Khi thực hiện thanh toán, bạn có thể chọn tùy chọn 
                    "Yêu cầu xuất hóa đơn VAT" và điền đầy đủ thông tin công ty, mã số thuế và địa chỉ. Hóa đơn VAT sẽ được 
                    gửi qua email hoặc kèm theo đơn hàng thời trang. Đối với đơn hàng đã thanh toán, bạn có thể yêu cầu xuất hóa đơn 
                    trong vòng 30 ngày kể từ ngày mua hàng bằng cách liên hệ với bộ phận Chăm sóc khách hàng.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vận chuyển FAQs */}
        <div id="van-chuyen" className="mb-10">
          <div className="flex items-center mb-6">
            <FaShippingFast className="text-red-600 mr-3 text-xl" />
            <h2 className="text-2xl font-bold text-gray-800">Vận chuyển</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFaq('faq-7')}
              >
                <span className="font-semibold text-gray-800">DAVINCI giao hàng thời trang đến những khu vực nào?</span>
                {openFaqs['faq-7'] ? (
                  <FaMinus className="text-red-600" />
                ) : (
                  <FaPlus className="text-red-600" />
                )}
              </button>
              {openFaqs['faq-7'] && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600">
                    DAVINCI cung cấp dịch vụ giao hàng thời trang trên toàn quốc, bao gồm tất cả 63 tỉnh thành của Việt Nam. Chúng tôi phân chia 
                    khu vực giao hàng thành 4 vùng:
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-2 my-2">
                    <li><strong>Khu vực 1:</strong> Nội thành TP.HCM và Hà Nội</li>
                    <li><strong>Khu vực 2:</strong> Các thành phố lớn và thị xã (Đà Nẵng, Cần Thơ, Hải Phòng...)</li>
                    <li><strong>Khu vực 3:</strong> Các tỉnh thành khác trên toàn quốc</li>
                    <li><strong>Khu vực 4:</strong> Vùng sâu, vùng xa, hải đảo</li>
                  </ul>
                  <p className="text-gray-600">
                    Thời gian giao hàng và phí vận chuyển sẽ khác nhau tùy thuộc vào khu vực. Chi tiết vui lòng tham khảo 
                    <a href="/shipping-policy" className="text-red-600 hover:underline"> Chính sách vận chuyển</a> của chúng tôi.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFaq('faq-8')}
              >
                <span className="font-semibold text-gray-800">Thời gian giao hàng là bao lâu?</span>
                {openFaqs['faq-8'] ? (
                  <FaMinus className="text-red-600" />
                ) : (
                  <FaPlus className="text-red-600" />
                )}
              </button>
              {openFaqs['faq-8'] && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600 mb-2">
                    Thời gian giao hàng phụ thuộc vào khu vực và phương thức vận chuyển bạn chọn:
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-2">
                    <li><strong>Giao hàng tiêu chuẩn:</strong> 
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        <li>Khu vực 1: 2-3 ngày làm việc</li>
                        <li>Khu vực 2: 3-4 ngày làm việc</li>
                        <li>Khu vực 3: 4-5 ngày làm việc</li>
                        <li>Khu vực 4: 5-7 ngày làm việc</li>
                      </ul>
                    </li>
                    <li className="mt-2"><strong>Giao hàng nhanh:</strong> 
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        <li>Khu vực 1: 1-2 ngày làm việc</li>
                        <li>Khu vực 2: 2-3 ngày làm việc</li>
                        <li>Khu vực 3: 3-4 ngày làm việc</li>
                      </ul>
                    </li>
                    <li className="mt-2"><strong>Giao hàng hỏa tốc:</strong> Trong ngày (chỉ áp dụng cho khu vực nội thành TP.HCM)</li>
                  </ul>
                  <p className="text-gray-600 mt-2">
                    Lưu ý: Thời gian trên không bao gồm thời gian xử lý đơn hàng (thường 1-2 ngày làm việc) và có thể bị 
                    ảnh hưởng bởi thời tiết, sự kiện đặc biệt hoặc các yếu tố bất khả kháng khác.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFaq('faq-9')}
              >
                <span className="font-semibold text-gray-800">Làm thế nào để theo dõi đơn hàng?</span>
                {openFaqs['faq-9'] ? (
                  <FaMinus className="text-red-600" />
                ) : (
                  <FaPlus className="text-red-600" />
                )}
              </button>
              {openFaqs['faq-9'] && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600 mb-2">
                    Bạn có thể theo dõi đơn hàng của mình bằng một trong các cách sau:
                  </p>
                  <ol className="list-decimal pl-5 text-gray-600 space-y-2">
                    <li>Đăng nhập vào tài khoản DAVINCI và vào mục "Đơn hàng thời trang của tôi" để xem trạng thái đơn hàng.</li>
                    <li>Sử dụng mã vận đơn được cung cấp trong email xác nhận đơn hàng để tra cứu trên website của đơn vị vận chuyển.</li>
                    <li>Nhấp vào đường link theo dõi đơn hàng được gửi trong email hoặc tin nhắn thông báo.</li>
                    <li>Liên hệ trực tiếp với bộ phận Chăm sóc khách hàng qua hotline: +84 974 867266.</li>
                  </ol>
                  <p className="text-gray-600 mt-2">
                    Chúng tôi cũng sẽ gửi email hoặc tin nhắn thông báo khi đơn hàng thời trang của bạn được xử lý, giao cho đơn vị vận chuyển và 
                    khi giao hàng thành công.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Đổi trả FAQs */}
        <div id="doi-tra" className="mb-10">
          <div className="flex items-center mb-6">
            <FaExchangeAlt className="text-red-600 mr-3 text-xl" />
            <h2 className="text-2xl font-bold text-gray-800">Đổi trả</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFaq('faq-10')}
              >
                <span className="font-semibold text-gray-800">Tôi có thể đổi trả sản phẩm thời trang không?</span>
                {openFaqs['faq-10'] ? (
                  <FaMinus className="text-red-600" />
                ) : (
                  <FaPlus className="text-red-600" />
                )}
              </button>
              {openFaqs['faq-10'] && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600 mb-2">
                    Có, DAVINCI chấp nhận đổi trả sản phẩm thời trang trong các trường hợp sau:
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-2">
                    <li>Sản phẩm thời trang bị lỗi, hư hỏng do nhà sản xuất</li>
                    <li>Sản phẩm không đúng với mô tả hoặc hình ảnh trên website</li>
                    <li>Giao nhầm sản phẩm hoặc sai size/màu sắc</li>
                    <li>Sản phẩm thời trang còn nguyên vẹn, chưa qua sử dụng, còn tem mác (trong vòng 7 ngày kể từ ngày nhận hàng)</li>
                  </ul>
                  <p className="text-gray-600 mt-2">
                    Lưu ý: Một số sản phẩm như đồ lót, trang sức cá nhân, hàng khuyến mãi/giảm giá đặc biệt 
                    có thể không được áp dụng chính sách đổi trả. Chi tiết vui lòng tham khảo Chính sách đổi trả của chúng tôi.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFaq('faq-11')}
              >
                <span className="font-semibold text-gray-800">Thời hạn đổi trả sản phẩm thời trang là bao lâu?</span>
                {openFaqs['faq-11'] ? (
                  <FaMinus className="text-red-600" />
                ) : (
                  <FaPlus className="text-red-600" />
                )}
              </button>
              {openFaqs['faq-11'] && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600 mb-2">
                    Thời hạn đổi trả sản phẩm thời trang phụ thuộc vào lý do đổi trả:
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-2">
                    <li><strong>Lỗi từ phía DAVINCI</strong> (giao nhầm sản phẩm, thiếu sản phẩm, sai size/màu, sản phẩm bị lỗi):
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        <li>Thời hạn: 14 ngày kể từ ngày nhận hàng</li>
                        <li>Chi phí vận chuyển đổi/trả: DAVINCI chịu hoàn toàn</li>
                      </ul>
                    </li>
                    <li className="mt-2"><strong>Thay đổi quyết định mua hàng</strong> (sản phẩm còn nguyên vẹn, chưa qua sử dụng):
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        <li>Thời hạn: 7 ngày kể từ ngày nhận hàng</li>
                        <li>Chi phí vận chuyển đổi/trả: Khách hàng chịu chi phí</li>
                      </ul>
                    </li>
                  </ul>
                  <p className="text-gray-600 mt-2">
                    Lưu ý: Sản phẩm thời trang đổi trả phải còn nguyên vẹn, đầy đủ phụ kiện, tem mác, bao bì (nếu có)
                    và kèm theo hóa đơn mua hàng hoặc phiếu giao hàng.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFaq('faq-12')}
              >
                <span className="font-semibold text-gray-800">Quy trình đổi trả sản phẩm thời trang như thế nào?</span>
                {openFaqs['faq-12'] ? (
                  <FaMinus className="text-red-600" />
                ) : (
                  <FaPlus className="text-red-600" />
                )}
              </button>
              {openFaqs['faq-12'] && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600 mb-2">
                    Quy trình đổi trả sản phẩm thời trang tại DAVINCI gồm các bước sau:
                  </p>
                  <ol className="list-decimal pl-5 text-gray-600 space-y-2">
                    <li>Liên hệ với bộ phận Chăm sóc khách hàng qua hotline 0974 867266 hoặc email contact@davinci.com 
                    để thông báo yêu cầu đổi/trả sản phẩm thời trang.</li>
                    <li>Cung cấp thông tin đơn hàng, lý do đổi/trả và hình ảnh sản phẩm thời trang (nếu có).</li>
                    <li>Nhận email xác nhận yêu cầu đổi/trả từ DAVINCI với hướng dẫn chi tiết.</li>
                    <li>Đóng gói sản phẩm thời trang cẩn thận và gửi về địa chỉ được cung cấp trong email.</li>
                    <li>Sau khi nhận được sản phẩm và kiểm tra, DAVINCI sẽ tiến hành:
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        <li>Đổi sản phẩm mới (nếu yêu cầu đổi)</li>
                        <li>Hoàn tiền (nếu yêu cầu trả)</li>
                      </ul>
                    </li>
                  </ol>
                  <p className="text-gray-600 mt-2">
                    Thời gian xử lý đổi/trả thường mất 5-7 ngày làm việc kể từ khi DAVINCI nhận được sản phẩm thời trang trả lại.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tài khoản FAQs */}
        <div id="tai-khoan" className="mb-10">
          <div className="flex items-center mb-6">
            <FaUserCircle className="text-red-600 mr-3 text-xl" />
            <h2 className="text-2xl font-bold text-gray-800">Tài khoản</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFaq('faq-13')}
              >
                <span className="font-semibold text-gray-800">Làm thế nào để tạo tài khoản DAVINCI?</span>
                {openFaqs['faq-13'] ? (
                  <FaMinus className="text-red-600" />
                ) : (
                  <FaPlus className="text-red-600" />
                )}
              </button>
              {openFaqs['faq-13'] && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600 mb-2">
                    Để tạo tài khoản DAVINCI, bạn có thể thực hiện theo các bước sau:
                  </p>
                  <ol className="list-decimal pl-5 text-gray-600 space-y-2">
                    <li>Truy cập website DAVINCI.com</li>
                    <li>Nhấp vào biểu tượng "Tài khoản" ở góc phải trên cùng</li>
                    <li>Chọn "Đăng ký"</li>
                    <li>Điền đầy đủ thông tin vào form đăng ký (họ tên, email, số điện thoại, mật khẩu)</li>
                    <li>Nhấn nút "Tạo tài khoản"</li>
                    <li>Xác nhận email thông qua đường link được gửi đến địa chỉ email của bạn</li>
                  </ol>
                  <p className="text-gray-600 mt-2">
                    Hoặc bạn có thể đăng ký nhanh bằng cách liên kết với tài khoản Facebook hoặc Google.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFaq('faq-14')}
              >
                <span className="font-semibold text-gray-800">Tôi quên mật khẩu, phải làm thế nào?</span>
                {openFaqs['faq-14'] ? (
                  <FaMinus className="text-red-600" />
                ) : (
                  <FaPlus className="text-red-600" />
                )}
              </button>
              {openFaqs['faq-14'] && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600 mb-2">
                    Nếu bạn quên mật khẩu, hãy thực hiện các bước sau để đặt lại mật khẩu:
                  </p>
                  <ol className="list-decimal pl-5 text-gray-600 space-y-2">
                    <li>Truy cập trang đăng nhập DAVINCI</li>
                    <li>Nhấp vào liên kết "Quên mật khẩu?" bên dưới form đăng nhập</li>
                    <li>Nhập địa chỉ email đã đăng ký</li>
                    <li>Nhấn nút "Gửi yêu cầu"</li>
                    <li>Kiểm tra email và làm theo hướng dẫn để đặt lại mật khẩu</li>
                    <li>Tạo mật khẩu mới và xác nhận</li>
                  </ol>
                  <p className="text-gray-600 mt-2">
                    Lưu ý: Đường link đặt lại mật khẩu chỉ có hiệu lực trong 24 giờ. Nếu bạn không nhận được email, 
                    hãy kiểm tra thư mục spam hoặc liên hệ với bộ phận Chăm sóc khách hàng.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFaq('faq-15')}
              >
                <span className="font-semibold text-gray-800">Làm thế nào để thay đổi thông tin tài khoản?</span>
                {openFaqs['faq-15'] ? (
                  <FaMinus className="text-red-600" />
                ) : (
                  <FaPlus className="text-red-600" />
                )}
              </button>
              {openFaqs['faq-15'] && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600 mb-2">
                    Để thay đổi thông tin tài khoản, bạn cần:
                  </p>
                  <ol className="list-decimal pl-5 text-gray-600 space-y-2">
                    <li>Đăng nhập vào tài khoản DAVINCI</li>
                    <li>Nhấp vào biểu tượng "Tài khoản" ở góc phải trên cùng</li>
                    <li>Chọn "Thông tin tài khoản" hoặc "Hồ sơ của tôi"</li>
                    <li>Nhấp vào "Chỉnh sửa" bên cạnh thông tin bạn muốn thay đổi</li>
                    <li>Cập nhật thông tin mới và nhấn "Lưu" hoặc "Cập nhật"</li>
                  </ol>
                  <p className="text-gray-600 mt-2">
                    Bạn có thể thay đổi hầu hết thông tin cá nhân như họ tên, số điện thoại, địa chỉ giao hàng, v.v. 
                    Tuy nhiên, để thay đổi email đăng ký, bạn cần liên hệ với bộ phận Chăm sóc khách hàng.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vấn đề khác */}
        <div className="bg-gray-50 p-6 rounded-lg mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Bạn không tìm thấy câu trả lời cho câu hỏi của mình?</h2>
          <p className="text-gray-600 mb-6">
            Đừng lo lắng! Đội ngũ Chăm sóc khách hàng của DAVINCI luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi qua:
          </p>
          <div className="bg-white p-4 rounded-lg text-gray-700 mb-4">
            <p><strong>Bộ phận Chăm sóc khách hàng DAVINCI</strong></p>
            <p>Email: contact@davinci.com</p>
            <p>Điện thoại: +84 974 867266 (7:30 - 21:00, từ Thứ Hai đến Chủ Nhật)</p>
            <p>Fanpage: <a href="https://www.facebook.com/davinci" className="text-red-600 hover:underline">facebook.com/davinci</a></p>
          </div>
          <p className="text-gray-600 italic">
            Chúng tôi cam kết phản hồi mọi thắc mắc của bạn trong vòng 24 giờ làm việc.
          </p>
        </div>
      </div>
    </div>
  );
};

const FaShoppingCart = (props: any) => <FaBook {...props} />;

export default FAQ;
