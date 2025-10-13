const NotFound: React.FC = () => {

    return (
        <>
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="flex py-[50px] px-[10px] items-center flex-col md:flex-row">
                    <div>
                        <img className="w-[320px] h-[370px] mr-[30px]" src="/404_web_image.webp" alt="404" />
                    </div>
                    <div className="pt-[120px] md:pt-0 w-1/2">
                        <p className="text-[40px] font-bold">Oops!</p>
                        <br/>
                        <p className="desc-error">Rất tiếc, chúng tôi không thể tìm thấy những gì bạn đang tìm kiếm.</p>
                        <br/>
                        <p className="error-code">Error code: 404</p>
                        <br/>
                        <a className="btn-back-home" href="/"><span>Quay lại trang chủ</span></a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotFound;