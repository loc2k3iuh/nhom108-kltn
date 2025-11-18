import React from 'react';
import { FaLock, FaShieldAlt, FaUserShield } from 'react-icons/fa';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-white py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Chính sách bảo mật</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            DAVINCI cam kết bảo vệ thông tin cá nhân của bạn. Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng, 
            lưu trữ và bảo vệ thông tin của bạn khi sử dụng dịch vụ của chúng tôi.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <div className="flex items-center mb-4">
              <FaShieldAlt className="text-red-600 mr-3 text-xl" />
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                1. Thông tin chúng tôi thu thập
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              DAVINCI thu thập thông tin từ bạn khi bạn đăng ký tài khoản, đặt hàng thời trang, tham gia khảo sát, liên hệ với bộ phận 
              hỗ trợ khách hàng, hoặc tương tác với trang web của chúng tôi. Thông tin mà chúng tôi thu thập có thể bao gồm:
            </p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">1.1. Thông tin cá nhân</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li>Họ tên</li>
                <li>Địa chỉ email</li>
                <li>Số điện thoại</li>
                <li>Địa chỉ giao hàng và thanh toán</li>
                <li>Ngày sinh (nếu được cung cấp)</li>
                <li>Thông tin thanh toán (chúng tôi không lưu trữ đầy đủ thông tin thẻ tín dụng)</li>
              </ul>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">1.2. Thông tin tự động</h3>
              <p className="text-gray-600 mb-3">
                Chúng tôi tự động thu thập một số thông tin khi bạn truy cập trang web của chúng tôi, bao gồm:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li>Địa chỉ IP</li>
                <li>Loại trình duyệt và thiết bị</li>
                <li>Thời gian truy cập</li>
                <li>Trang đã xem</li>
                <li>Cookie và công nghệ theo dõi tương tự</li>
                <li>Lịch sử tìm kiếm và mua sắm thời trang</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <div className="flex items-center mb-4">
              <FaUserShield className="text-red-600 mr-3 text-xl" />
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                2. Cách chúng tôi sử dụng thông tin
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Chúng tôi sử dụng thông tin thu thập được cho các mục đích sau:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Xử lý và hoàn tất đơn đặt hàng thời trang của bạn</li>
              <li>Gửi thông báo về đơn hàng và trạng thái giao hàng</li>
              <li>Gửi thông tin về sản phẩm thời trang, dịch vụ và khuyến mãi</li>
              <li>Cải thiện trải nghiệm khách hàng và dịch vụ của chúng tôi</li>
              <li>Quản lý tài khoản của bạn</li>
              <li>Phản hồi các yêu cầu, câu hỏi và mối quan tâm của bạn</li>
              <li>Phòng chống gian lận và bảo mật</li>
              <li>Tuân thủ các nghĩa vụ pháp lý</li>
            </ul>

            <div className="bg-gray-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    <strong className="font-medium text-gray-800">Lưu ý:</strong> Chúng tôi không bao giờ bán thông tin cá nhân của bạn cho bên thứ ba. 
                    Thông tin của bạn chỉ được sử dụng cho các mục đích đã nêu trong chính sách này.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">2.1. Email marketing</h3>
              <p className="text-gray-600">
                Nếu bạn đăng ký nhận thông tin khuyến mãi, chúng tôi sẽ gửi email về sản phẩm thời trang mới, khuyến mãi và thông tin liên quan.
                Bạn có thể hủy đăng ký bất kỳ lúc nào bằng cách nhấp vào liên kết "Hủy đăng ký" ở cuối mỗi email
                hoặc liên hệ với chúng tôi qua contact@davinci.com.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <div className="flex items-center mb-4">
              <FaLock className="text-red-600 mr-3 text-xl" />
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                3. Chia sẻ thông tin
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Chúng tôi có thể chia sẻ thông tin của bạn trong các trường hợp sau:
            </p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">3.1. Đối tác dịch vụ</h3>
              <p className="text-gray-600 mb-3">
                Chúng tôi làm việc với các công ty khác để cung cấp dịch vụ cho bạn, chẳng hạn như:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li>Đối tác vận chuyển để giao hàng đến bạn</li>
                <li>Đối tác thanh toán để xử lý giao dịch</li>
                <li>Dịch vụ phân tích để cải thiện trang web</li>
                <li>Nhà cung cấp dịch vụ email để gửi thông báo</li>
              </ul>
              <p className="text-gray-600">
                Các đối tác này chỉ được cung cấp thông tin cần thiết để thực hiện dịch vụ và bị ràng buộc bởi các thỏa thuận 
                bảo mật để bảo vệ thông tin của bạn.
              </p>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">3.2. Yêu cầu pháp lý</h3>
              <p className="text-gray-600">
                Chúng tôi có thể tiết lộ thông tin cá nhân nếu chúng tôi tin rằng việc đó là cần thiết để tuân thủ luật pháp, 
                quy định, quy trình pháp lý hoặc yêu cầu chính phủ, bảo vệ quyền lợi của chúng tôi, bảo vệ an toàn cá nhân 
                của người dùng, hoặc bảo vệ công chúng.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              4. Bảo mật dữ liệu
            </h2>
            <p className="text-gray-600 mb-4">
              Chúng tôi cam kết bảo vệ thông tin của bạn và áp dụng nhiều biện pháp bảo mật để giữ an toàn cho dữ liệu của bạn:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Sử dụng mã hóa SSL (Secure Socket Layer) để bảo vệ dữ liệu trong quá trình truyền</li>
              <li>Tuân thủ các tiêu chuẩn bảo mật thanh toán (PCI DSS)</li>
              <li>Giới hạn quyền truy cập thông tin cá nhân chỉ cho nhân viên được ủy quyền</li>
              <li>Thường xuyên đánh giá và cập nhật các biện pháp bảo mật</li>
              <li>Lưu trữ dữ liệu tại các trung tâm dữ liệu an toàn</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Mặc dù chúng tôi nỗ lực bảo vệ thông tin của bạn, không có phương thức truyền tải qua internet hoặc lưu trữ 
              điện tử nào là an toàn 100%. Do đó, chúng tôi không thể đảm bảo an toàn tuyệt đối cho thông tin của bạn.
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              5. Cookie và công nghệ theo dõi
            </h2>
            <p className="text-gray-600 mb-4">
              Chúng tôi sử dụng cookie và các công nghệ tương tự để thu thập thông tin và cải thiện trải nghiệm của bạn 
              trên trang web của chúng tôi.
            </p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">5.1. Cookie là gì?</h3>
              <p className="text-gray-600">
                Cookie là các tệp văn bản nhỏ được lưu trữ trên trình duyệt hoặc thiết bị của bạn. Chúng cho phép trang web ghi nhớ 
                các tương tác và tùy chọn của bạn trong một khoảng thời gian.
              </p>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">5.2. Chúng tôi sử dụng cookie để:</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                <li>Ghi nhớ thông tin đăng nhập của bạn</li>
                <li>Ghi nhớ các sản phẩm thời trang trong giỏ hàng</li>
                <li>Hiểu cách bạn sử dụng trang web</li>
                <li>Cá nhân hóa trải nghiệm của bạn</li>
                <li>Cải thiện trang web và dịch vụ</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">5.3. Kiểm soát cookie</h3>
              <p className="text-gray-600">
                Hầu hết các trình duyệt cho phép bạn kiểm soát cookie thông qua cài đặt. Bạn có thể chặn, xóa hoặc tắt cookie, 
                nhưng điều này có thể ảnh hưởng đến chức năng của trang web. Để biết thêm thông tin về cookie, 
                bạn có thể truy cập www.allaboutcookies.org.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              6. Quyền của bạn
            </h2>
            <p className="text-gray-600 mb-6">
              Tùy thuộc vào quy định pháp luật hiện hành, bạn có thể có các quyền sau liên quan đến thông tin cá nhân của mình:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li><strong>Quyền truy cập:</strong> Bạn có quyền yêu cầu bản sao thông tin cá nhân mà chúng tôi lưu giữ về bạn.</li>
              <li><strong>Quyền chỉnh sửa:</strong> Bạn có quyền yêu cầu chúng tôi cập nhật thông tin không chính xác hoặc không đầy đủ.</li>
              <li><strong>Quyền xóa:</strong> Bạn có quyền yêu cầu chúng tôi xóa thông tin cá nhân của bạn trong một số trường hợp.</li>
              <li><strong>Quyền hạn chế xử lý:</strong> Bạn có quyền yêu cầu chúng tôi tạm dừng xử lý thông tin của bạn.</li>
              <li><strong>Quyền phản đối:</strong> Bạn có quyền phản đối việc xử lý thông tin cá nhân trong một số trường hợp.</li>
              <li><strong>Quyền chuyển dữ liệu:</strong> Bạn có quyền yêu cầu chúng tôi chuyển thông tin của bạn sang tổ chức khác.</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Để thực hiện bất kỳ quyền nào ở trên, vui lòng liên hệ với chúng tôi qua email contact@davinci.com. Chúng tôi sẽ 
              phản hồi yêu cầu của bạn trong thời gian phù hợp, thông thường là trong vòng một tháng.
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              7. Bảo vệ thông tin trẻ em
            </h2>
            <p className="text-gray-600 mb-4">
              Dịch vụ của chúng tôi không dành cho trẻ em dưới 13 tuổi. Chúng tôi không cố ý thu thập thông tin cá nhân từ trẻ em dưới 13 tuổi. 
              Nếu bạn là phụ huynh hoặc người giám hộ và tin rằng con bạn đã cung cấp thông tin cá nhân cho chúng tôi, 
              vui lòng liên hệ với chúng tôi để chúng tôi có thể thực hiện các bước cần thiết để xóa thông tin đó.
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-10">
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              8. Thay đổi đối với chính sách bảo mật
            </h2>
            <p className="text-gray-600 mb-4">
              Chúng tôi có thể cập nhật Chính sách bảo mật này theo thời gian để phản ánh những thay đổi trong thực tiễn bảo mật của chúng tôi. 
              Bất kỳ thay đổi nào sẽ được đăng trên trang này kèm theo ngày cập nhật. Nếu có những thay đổi quan trọng, 
              chúng tôi sẽ thông báo cho bạn qua email hoặc thông báo trên trang web của chúng tôi.
            </p>
            <p className="text-gray-600 mb-4">
              Chúng tôi khuyến khích bạn định kỳ xem lại Chính sách bảo mật này để cập nhật thông tin về cách chúng tôi bảo vệ 
              thông tin của bạn.
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              9. Liên hệ
            </h2>
            <p className="text-gray-600 mb-4">
              Nếu bạn có bất kỳ câu hỏi, thắc mắc hoặc yêu cầu nào liên quan đến Chính sách bảo mật này hoặc cách chúng tôi 
              xử lý thông tin cá nhân của bạn, vui lòng liên hệ với chúng tôi:
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
            Bằng việc tiếp tục sử dụng dịch vụ của chúng tôi, bạn đồng ý với các điều khoản trong Chính sách bảo mật này.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
