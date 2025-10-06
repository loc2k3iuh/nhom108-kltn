import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const TermsOfService: React.FC = () => {
  return (
    <div className="bg-white py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Điều khoản dịch vụ</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Vui lòng đọc kỹ các điều khoản dịch vụ này trước khi sử dụng trang web và dịch vụ của DAVINCI.
            Việc sử dụng dịch vụ của chúng tôi đồng nghĩa với việc bạn đã đọc, hiểu và đồng ý với các điều khoản dưới đây.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              1. Giới thiệu
            </h2>
            <p className="text-gray-600 mb-6">
              Chào mừng bạn đến với DAVINCI - Thương hiệu thời trang cao cấp. Trang web và các dịch vụ của chúng tôi 
              được điều chỉnh bởi các điều khoản và điều kiện được nêu trong tài liệu này. Khi truy cập 
              hoặc sử dụng trang web của chúng tôi tại bất kỳ nền tảng nào (trang web, ứng dụng di động, hoặc 
              bất kỳ thiết bị nào khác), bạn đồng ý tuân theo và chịu ràng buộc bởi những điều khoản này.
            </p>
            <p className="text-gray-600 mb-4">
              Chúng tôi có thể cập nhật hoặc thay đổi các điều khoản này vào bất kỳ lúc nào mà không cần thông báo trước. 
              Việc bạn tiếp tục sử dụng dịch vụ sau khi có bất kỳ thay đổi nào đồng nghĩa với việc bạn chấp nhận 
              những thay đổi đó.
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              2. Tài khoản người dùng
            </h2>
            <p className="text-gray-600 mb-6">
              Để sử dụng một số tính năng của dịch vụ chúng tôi, bạn có thể cần phải đăng ký tài khoản. 
              Khi đăng ký, bạn đồng ý cung cấp thông tin chính xác, đầy đủ và cập nhật. Bạn chịu trách nhiệm 
              bảo mật tài khoản của mình, bao gồm mật khẩu, và bạn đồng ý thông báo cho chúng tôi ngay lập tức 
              nếu bạn phát hiện bất kỳ vi phạm bảo mật nào liên quan đến tài khoản của bạn.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">2.1. Trách nhiệm của người dùng</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Bạn cam kết không sử dụng dịch vụ cho bất kỳ mục đích bất hợp pháp nào hoặc bị cấm bởi các điều khoản này.</li>
              <li>Bạn không được phép sử dụng dịch vụ theo cách có thể gây hại đến DAVINCI, người dùng khác, hoặc bên thứ ba.</li>
              <li>Bạn chịu trách nhiệm về tất cả hoạt động xảy ra dưới tài khoản của mình.</li>
              <li>Bạn cam kết không sao chép, phân phối, hoặc tiết lộ bất kỳ phần nào của dịch vụ.</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">2.2. Tạm ngưng hoặc chấm dứt tài khoản</h3>
            <p className="text-gray-600 mb-4">
              DAVINCI có quyền tạm ngưng hoặc chấm dứt tài khoản của bạn và quyền truy cập vào dịch vụ nếu bạn 
              vi phạm bất kỳ điều khoản nào của thỏa thuận này. Chúng tôi cũng có thể hạn chế quyền truy cập của
              bạn vào một số tính năng hoặc phần của dịch vụ mà không cần thông báo hoặc trách nhiệm pháp lý.
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              3. Mua hàng và thanh toán
            </h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">3.1. Đặt hàng</h3>
            <p className="text-gray-600 mb-4">
              Khi bạn đặt hàng trên DAVINCI, bạn đưa ra lời đề nghị mua sản phẩm thời trang. Chúng tôi có quyền chấp nhận hoặc từ chối 
              đơn đặt hàng của bạn vì bất kỳ lý do gì. Sau khi chúng tôi chấp nhận đơn đặt hàng của bạn, bạn sẽ nhận được 
              email xác nhận với chi tiết đơn hàng của bạn.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">3.2. Giá cả và thanh toán</h3>
            <p className="text-gray-600 mb-4">
              Tất cả giá niêm yết trên trang web của chúng tôi đều bằng Việt Nam Đồng (VNĐ) và đã bao gồm thuế giá trị gia tăng 
              (nếu áp dụng). Giá có thể thay đổi mà không cần thông báo trước. Mọi chi phí vận chuyển sẽ được hiển thị riêng 
              tại thời điểm thanh toán.
            </p>
            <p className="text-gray-600 mb-4">
              Chúng tôi chấp nhận nhiều phương thức thanh toán khác nhau, bao gồm thẻ tín dụng/ghi nợ, chuyển khoản ngân hàng, 
              và các phương thức thanh toán điện tử khác như được hiển thị trên trang web. Tất cả các giao dịch thanh toán được 
              xử lý thông qua các kênh thanh toán bảo mật.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">3.3. Hủy đơn hàng</h3>
            <p className="text-gray-600 mb-4">
              Bạn có thể hủy đơn hàng trước khi nó được xử lý để vận chuyển. Sau khi đơn hàng đã được gửi, bạn không thể hủy 
              nhưng có thể trả lại theo chính sách hoàn trả của chúng tôi.
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              4. Chính sách giao hàng
            </h2>
            <p className="text-gray-600 mb-4">
              DAVINCI sẽ nỗ lực để đảm bảo đơn hàng thời trang của bạn được giao đúng thời hạn như đã cam kết. Thời gian giao hàng dự kiến 
              sẽ được hiển thị khi bạn đặt hàng và trong email xác nhận.
            </p>
            <p className="text-gray-600 mb-4">
              Chúng tôi không chịu trách nhiệm về bất kỳ sự chậm trễ nào do các sự kiện ngoài tầm kiểm soát hợp lý của chúng tôi, 
              chẳng hạn như thiên tai, sự cố vận chuyển, hoặc các vấn đề khác.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">4.1. Phí vận chuyển</h3>
            <p className="text-gray-600 mb-4">
              Phí vận chuyển sẽ được tính dựa trên địa chỉ giao hàng, trọng lượng và kích thước của sản phẩm. Phí vận chuyển cụ thể 
              sẽ được hiển thị trong quá trình thanh toán trước khi bạn hoàn tất đơn hàng.
            </p>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaCheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Miễn phí giao hàng cho đơn hàng từ 250.000đ trở lên trong phạm vi nội thành TP.HCM và Hà Nội.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              5. Chính sách đổi trả và hoàn tiền
            </h2>
            <p className="text-gray-600 mb-4">
              DAVINCI cam kết cung cấp các sản phẩm thời trang chất lượng cao. Tuy nhiên, nếu bạn không hài lòng với sản phẩm của mình, 
              chúng tôi chấp nhận trả lại hàng trong vòng 7 ngày kể từ ngày giao hàng.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">5.1. Điều kiện đổi trả</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Sản phẩm thời trang phải còn nguyên trạng, không bị hư hỏng, và có tất cả thẻ tag, nhãn mác ban đầu.</li>
              <li>Bạn cần có bằng chứng mua hàng (hóa đơn hoặc xác nhận đơn hàng).</li>
              <li>Một số sản phẩm như đồ lót, trang sức cá nhân không thể trả lại vì lý do vệ sinh sẽ được đánh dấu rõ ràng.</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">5.2. Quy trình hoàn tiền</h3>
            <p className="text-gray-600 mb-4">
              Sau khi chúng tôi nhận được và kiểm tra sản phẩm trả lại, chúng tôi sẽ xử lý hoàn tiền qua phương thức thanh toán ban đầu 
              của bạn hoặc dưới dạng tín dụng cửa hàng, tùy theo lựa chọn của bạn. Việc hoàn tiền có thể mất 5-10 ngày làm việc để 
              hiển thị trong tài khoản của bạn, tùy thuộc vào phương thức thanh toán và ngân hàng của bạn.
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              6. Quyền sở hữu trí tuệ
            </h2>
            <p className="text-gray-600 mb-4">
              Tất cả nội dung trên trang web của DAVINCI, bao gồm nhưng không giới hạn ở văn bản, đồ họa, logo, biểu tượng, 
              hình ảnh, đoạn âm thanh, video, phần mềm và các yếu tố khác, đều là tài sản của DAVINCI hoặc các nhà cung cấp 
              nội dung của chúng tôi và được bảo vệ bởi luật sở hữu trí tuệ.
            </p>
            <p className="text-gray-600 mb-4">
              Bạn không được phép sao chép, phân phối, sửa đổi, hiển thị công khai, thực hiện công khai, tái xuất bản, tải xuống, 
              lưu trữ hoặc truyền bất kỳ nội dung nào trên trang web của chúng tôi, trừ khi được cho phép rõ ràng bằng văn bản 
              từ DAVINCI.
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              7. Giới hạn trách nhiệm
            </h2>
            <p className="text-gray-600 mb-4">
              Trong phạm vi tối đa được pháp luật cho phép, DAVINCI và các đối tác, nhân viên, giám đốc, đại lý và nhà cung cấp 
              của chúng tôi sẽ không chịu trách nhiệm đối với bất kỳ thiệt hại nào phát sinh từ hoặc liên quan đến việc sử dụng 
              hoặc không thể sử dụng dịch vụ của chúng tôi.
            </p>
            <p className="text-gray-600 mb-4">
              Chúng tôi không đảm bảo rằng dịch vụ của chúng tôi sẽ không bị gián đoạn, kịp thời, an toàn hoặc không có lỗi. 
              Bạn hiểu và đồng ý rằng bạn sử dụng dịch vụ của chúng tôi với rủi ro của riêng bạn.
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              8. Luật áp dụng và giải quyết tranh chấp
            </h2>
            <p className="text-gray-600 mb-4">
              Các điều khoản này sẽ được điều chỉnh và giải thích theo luật pháp Việt Nam. Bất kỳ tranh chấp nào phát sinh từ 
              hoặc liên quan đến các điều khoản này sẽ được giải quyết thông qua thương lượng thiện chí. Nếu không thể giải quyết 
              tranh chấp thông qua thương lượng, tranh chấp sẽ được đưa ra tòa án có thẩm quyền tại Việt Nam.
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              9. Liên hệ
            </h2>
            <p className="text-gray-600 mb-4">
              Nếu bạn có bất kỳ câu hỏi, thắc mắc hoặc đề xuất nào về Điều khoản dịch vụ này, vui lòng liên hệ với chúng tôi:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg text-gray-700 mb-4">
              <p><strong>DAVINCI - Thương hiệu thời trang cao cấp</strong></p>
              <p>Địa chỉ: 12 Nguyễn Văn Bảo, Phường 1, Gò Vấp, TP.HCM</p>
              <p>Email: contact@davinci.com</p>
              <p>Điện thoại: +84 974 867266</p>
            </div>
            <p className="text-gray-600 italic">
              Cập nhật lần cuối: Ngày 23 tháng 05 năm 2025
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-600">
            Bằng việc tiếp tục sử dụng dịch vụ của chúng tôi, bạn đồng ý với các điều khoản và điều kiện được nêu trong tài liệu này.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
