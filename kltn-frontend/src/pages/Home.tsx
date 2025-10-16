import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import svgFlashSale from "/label-flashsale.svg";
import { Copy } from 'lucide-react';

import { toast } from 'sonner';

import male from "../assets/img/male.gif";
import female from "../assets/img/female.gif";
import kid from "../assets/img/kid.gif";
import sport from "../assets/img/sport.gif";
import voucher from "../assets/img/voucher.gif";
import newProduct from "../assets/img/new.gif";
import flashSale from "../assets/img/flash-sale.gif";
import accessory from "../assets/img/accessory.gif"
import sneaker from "../assets/img/sneaker.gif"
import trending from "../assets/img/trending.gif"
import "../index.css";
import "./custom.css";

import { getFlashSaleProducts, getNewestProducts } from "@/services/productService";
import { mapProductToViewModel, ProductViewModel } from "@/mappers/productMapper";

console.log("Procuct: ",getFlashSaleProducts);
console.log("Procuct: ",getNewestProducts);

const Home: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [flashSaleProducts, setFlashSaleProducts] = useState<ProductViewModel[]>([]);
  const [isLoadingFlashSale, setIsLoadingFlashSale] = useState<boolean>(true);


  const [productsLastData, setProductsLastData] = useState<ProductViewModel[]>([]);
  const [isLoadingNewestProducts, setIsLoadingNewestProducts] = useState<boolean>(true);
  const isLoadingVouchers = false;

  const itemsSlider = [
    "https://file.hstatic.net/1000253775/file/banner_pc_3688a7ee993a48a3aa2ceda425abfa7b.jpg",
    "https://yame.vn/cdn/shop/files/sale_thang_9.jpg?v=1757675267&width=2000",
    "https://cdn.hstatic.net/files/1000341902/collection/mob__4_-min_d1649a6d39854149a6b754eb3035e3b9.png",
    "https://cdn.hstatic.net/files/1000253775/file/ngang-2000x793.jpg",
    "https://file.hstatic.net/1000253775/collection/tat_ca_san_pham_a15a7fe1ed8f45b89989964da7a72e9f_master.jpg",
  ];


  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? itemsSlider.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === itemsSlider.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    document.title = "DAVINCI - Thời trang số 1 Việt Nam";
  }, []);

  useEffect(() => {
    const fetchBoth = async () => {
      try {
        setIsLoadingFlashSale(true);
        setIsLoadingNewestProducts(true);
        const [flash, newest] = await Promise.all([
          getFlashSaleProducts(10),
          getNewestProducts(10),

        ]);



        const mappedFlash: ProductViewModel[] = flash.map((p) =>
          mapProductToViewModel(p, { showZeroDiscountLabel: false })
        );

        const mappedNewest: ProductViewModel[] = newest.map((p) =>
          mapProductToViewModel(p, { showZeroDiscountLabel: true })
        );

        setFlashSaleProducts(mappedFlash);
        setProductsLastData(mappedNewest);

      } catch (error) {
        console.error('Failed to fetch flash sale products:', error);
        toast.error('Không thể tải danh sách sản phẩm');
      } finally {
        setIsLoadingFlashSale(false);
        setIsLoadingNewestProducts(false);
      }
    };

    fetchBoth();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === itemsSlider.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [itemsSlider.length]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Hàm format giá tĩnh
  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Hàm kiểm tra voucher hết hạn
  const isVoucherExpired = (endDateString: string) => {
    const endDate = new Date(endDateString);
    const today = new Date();
    return endDate < today;
  };

  // Hàm copy voucher code
  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        toast.success('Đã sao chép mã voucher thành công!');
      })
      .catch(() => {
        toast.error('Không thể sao chép mã voucher!');
      });
  };





  return (
    <>
      {/* flex flex-col items-center justify-center */}
      <div className="">

        
        <div className="flex flex-1 container m-auto justify-center w-full h-full">
          <div className="w-full md:max-w-7xl mt-[10px] sm:mt-[16px] flex flex-col md:flex-row items-center justify-start mx-2">

            {/* Modern Carousel Component */}
            <div
              className="w-full md:w-[calc(100%-400px)] md:max-w-[840px] relative overflow-hidden rounded-xl shadow-lg"
              style={{ height: 'min(320px, 50vw)' }}
            >
              <div className="h-full w-full">
                {itemsSlider.map((item, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-in-out ${
                      index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  >
                    <img
                      src={item}
                      className="h-full w-full object-cover object-center"
                      alt={`Banner ${index + 1}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-70"></div>
                  </div>
                ))}
              </div>

              {/* Slider indicators */}
              <button
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 group focus:outline-none cursor-pointer"
                onClick={handlePrev}
                aria-label="Previous slide"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm shadow-md transition-all duration-200 group-hover:bg-white group-hover:scale-110 group-active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </div>
              </button>

              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 group focus:outline-none cursor-pointer"
                onClick={handleNext}
                aria-label="Next slide"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm shadow-md transition-all duration-200 group-hover:bg-white group-hover:scale-110 group-active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </button>

              {/* Progress Bar Indicators */}
              <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center pb-4">
                <div className="flex gap-2 px-2 py-1 rounded-full bg-black/20 backdrop-blur-sm">
                  {itemsSlider.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleIndicatorClick(index)}
                      className={`relative transition-all duration-500 focus:outline-none ${
                        index === currentIndex ? "w-8" : "w-2"
                      } h-2 rounded-full`}
                      aria-label={`Go to slide ${index + 1}`}
                    >
                      <span 
                        className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                          index === currentIndex ? "bg-white" : "bg-white/40 hover:bg-white/60"
                        }`}
                      ></span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slide Counter */}
              <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm text-white text-sm font-medium">
                {currentIndex + 1}/{itemsSlider.length}
              </div>

            </div>
            <div className="hidden md:block w-[400px] h-[320px] ml-4 rounded-xl p-6 bg-gradient-to-b from-white to-blue-50 shadow-md">
              <h1 className="text-3xl font-bold text-[#C92127] mb-2">
                DAVINCI - Thời trang & Phong cách.
              </h1>
              <div className="h-1 w-16 bg-[#C92127] mb-4 rounded-full"></div>
              <p className="mt-4 text-gray-700 leading-relaxed">
DAVINCI là shop thời trang độc đáo, nơi bạn khám phá trang phục và phụ kiện chất lượng cao. Tọa lạc trung tâm, DAVINCI mang đến không gian mua sắm hiện đại, thoải mái, giúp bạn thể hiện cá tính và gu thẩm mỹ riêng.
              </p>
              <button className="mt-3 px-6 py-2.5 bg-[#C92127] text-white rounded-lg hover:bg-[#a71b20] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md flex items-center gap-2">
                Xem thêm
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 container m-auto justify-center mt-[10px] sm:mt-[16px]">
          <div className="relative overflow-hidden z-1 p-0 mx-2 bg-white rounded-md w-full md:max-w-7xl px-[4px] pt-[15px] pb-[8px]">
            <div className="relative w-full block whitespace-nowrap md:whitespace-normal h-32 sm:h-32 overflow-x-auto scrollbar-hide space-x-4 md:h-full md:grid md:grid-cols-5 lg:grid-cols-10 md:gap-4">
              {itemsCategories.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="inline-block md:flex md:flex-col items-center justify-start w-1/5 sm:w-1/7 md:w-full h-full transition-transform hover:scale-105"
                >
                  <div className="flex items-center justify-center w-[52px] h-[52px] md:w-[60px] md:h-[60px] mx-auto bg-gradient-to-br from-red-50 to-slate-50 rounded-full shadow-sm border border-gray-100 p-1.5 overflow-hidden hover:shadow-md transition-all duration-300">
                    <img
                      src={item.imgSrc}
                      alt={item.name}
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <p className="mt-2 text-[12px] text-[#212121] text-center truncate w-full">
                    {item.name}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-1 justify-center w-full h-full bg-flash-sale relative z-1 mt-[16px]">
          <div className="my-[32px] container xl:max-w-7xl relative z-1 w-full h-full md:mx-auto">
            <div className="py-[12px] pr-[8px] pl-[16px] bg-white mb-[16px] rounded-[8px] mx-2 flex flex-row items-center justify-between">
              <div className="relative flex flex-row items-center justify-start">
                <a className="h-[20px]" href={"flashsale"}>
                  <img className="h-[20px]" src={svgFlashSale} />
                </a>
              </div>
              <a
                className="fhs_center_right padding_left_big"
                href={"flashsale"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-500"
                  viewBox="0 0 16 16"
                >
                  <path fill="none" d="M0,0H16V16H0Z" />
                  <path
                    stroke="#9E9E9E"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6,9l3.945,3.945L13.891,9"
                    transform="translate(-1.945 -2.973)"
                  />
                </svg>
              </a>
            </div>

            {isLoadingFlashSale ? (
              // Hiển thị skeleton loading trong khi chờ API
              <div className="relative w-full block whitespace-nowrap mx-2 overflow-x-auto scrollbar-hide">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="inline-block w-[44%] md:w-[33%] lg:w-[19%] mr-[12px] bg-white rounded-lg overflow-hidden">
                    <div className="h-60 w-full bg-gray-200 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative w-full block whitespace-nowrap mx-2 overflow-x-auto scrollbar-hide">
                {flashSaleProducts.map((product) => (
                  <div key={product.id} className="inline-block w-[44%] md:w-[33%] lg:w-[19%] mr-[12px] bg-white rounded-lg hover:shadow-lg overflow-hidden transition-transform duration-300 transform group">
                    <Link to={product.link}>
                      <div className="overflow-hidden h-60 w-full relative">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-60 object-cover lazyloaded transition-transform duration-300 transform group-hover:scale-110"
                        />
                        {product.discountPercent > 0 && (
                        <div className="absolute top-2 right-2 bg-[#C92127] text-white px-2 py-1 rounded-md text-xs font-semibold">
                          {product.discountLabel}
                        </div>
                        )}
                      </div>

                        <div className="p-4">
                            <h3 className="text-sm text-gray-800 font-medium mb-2 line-clamp-2 h-10">
                                {product.title}
                            </h3>
                            <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-[#C92127]">
                          {product.specialPrice}
                        </span>
                                <span className="text-xs text-gray-500 line-through">
                          {product.oldPrice} đ
                        </span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center text-xs text-gray-600">
                                    <span className="text-yellow-500 mr-1">★</span>
                                    <span>{(product.averageRating ?? 0).toFixed(1)} ({product.reviewCount ?? 0})</span>
                                </div>
                                <span className="text-xs text-gray-500">
                          {product.soldCount}
                        </span>
                            </div>
                        </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>



          </div>
        </div>

        <div className="flex flex-1 justify-center w-full h-full relative z-1 mt-[16px] mb-[16px]">
          <div className="container xl:max-w-7xl relative z-1 w-full h-full md:mx-auto bg-white rounded-[8px]">
            <div className="py-[12px] pr-[8px] pl-[16px] mb-[16px] mx-2 flex flex-row items-center justify-between">
              <div className="relative flex flex-row items-center justify-start">
                <a className="text-lg font-bold text-gray-800 flex items-center" href="/new-product">
                  Sản phẩm
                  <span className="ml-2 inline-flex items-center justify-center bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                    Mới
                  </span>
                </a>
              </div>
              <a
                className="fhs_center_right padding_left_big"
                href="/new-product"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-500"
                  viewBox="0 0 16 16"
                >
                  <path fill="none" d="M0,0H16V16H0Z" />
                  <path
                    stroke="#9E9E9E"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6,9l3.945,3.945L13.891,9"
                    transform="translate(-1.945 -2.973)"
                  />
                </svg>
              </a>
            </div>

          {isLoadingNewestProducts ? (
            // Loading skeleton
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-6 w-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4">
              {productsLastData.map((product, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <Link to={product.link} className="block relative group">
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                        <div className="absolute top-2 right-2 bg-[#C92127] text-white px-2 py-1 rounded-md text-xs font-semibold">
                            {product.discountLabel}
                        </div>

                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                        Mới
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm text-gray-800 font-medium mb-2 line-clamp-2 h-10">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-[#C92127]">
                          {product.specialPrice}
                        </span>
                        <span className="text-xs text-gray-500 line-through">
                          {product.oldPrice} đ
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-xs text-gray-600">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span>{(product.averageRating ?? 0).toFixed(1)} ({product.reviewCount ?? 0})</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {product.soldCount}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

          )}
          </div>
        </div>      {/* Chat Icon Component */}

        <div className="flex flex-1 justify-center w-full h-full relative z-1 mt-[16px] mb-[16px]">
          <div className="container xl:max-w-7xl relative z-1 w-full h-full md:mx-auto bg-white rounded-[8px]">
            <div className="py-[12px] pr-[8px] pl-[16px] mb-[16px] mx-2 flex flex-row items-center justify-between">
              <div className="relative flex flex-row items-center justify-start">
                <a className="text-lg font-bold text-gray-800 flex items-center" href="/voucher">
                  Mã giảm giá
                  <span className="ml-2 inline-flex items-center justify-center bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                    Hot
                  </span>
                </a>
              </div>
              <a
                className="fhs_center_right padding_left_big"
                href="/voucher"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-500"
                  viewBox="0 0 16 16"
                >
                  <path fill="none" d="M0,0H16V16H0Z" />
                  <path
                    stroke="#9E9E9E"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6,9l3.945,3.945L13.891,9"
                    transform="translate(-1.945 -2.973)"
                  />
                </svg>
              </a>
            </div>

            {isLoadingVouchers ? (
              // Loading skeleton
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden shadow border border-gray-200">
                    <div className="h-16 bg-gray-200 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                      <div className="h-8 bg-gray-200 rounded animate-pulse my-2"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4">
                {randomVouchers.map((voucher) => {
                  const isExpired = isVoucherExpired(voucher.end_date);
                  
                  return (
                    <div
                      key={voucher.id}
                      className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200 ${
                        isExpired ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="bg-gradient-to-r from-red-500 to-orange-500 h-16 relative flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="font-bold text-xl">
                            {voucher.discount_percentage && `${voucher.discount_percentage}%`}
                            {voucher.discount_amount && `${formatPrice(voucher.discount_amount)}`}
                          </div>
                          <div className="text-xs">GIẢM</div>
                        </div>
                        {!isExpired && (
                          <div className="absolute top-1 right-1 bg-white text-xs font-semibold px-2 py-0.5 rounded text-red-600">
                            HOT
                          </div>
                        )}
                      </div>
                      
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-1" title={voucher.discount_name}>
                          {voucher.discount_name}
                        </h3>
                        
                        <div 
                          className="bg-gray-100 border border-dashed border-gray-300 rounded-md p-2 mb-2 flex justify-between items-center cursor-pointer"
                          onClick={() => copyVoucherCode(voucher.code)}
                          title="Nhấp để sao chép"
                        >
                          <span className="font-mono font-semibold text-gray-700 text-sm truncate">{voucher.code}</span>
                          <Copy size={16} className="text-gray-500 flex-shrink-0" />
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div>HSD: {formatDate(voucher.end_date)}</div>
                          {voucher.min_order_value > 0 && (
                            <div>Từ {formatPrice(voucher.min_order_value)}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200 flex flex-col items-center justify-center p-4">
                  <div className="text-5xl text-red-500 mb-2">_</div>
                  <p className="text-center text-gray-700 font-medium">Xem thêm nhiều mã giảm giá khác</p>
                  <a 
                    href="/voucher"
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md text-sm transition-colors duration-200"
                  >
                    Xem tất cả
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        

      {/* </div> */}
    </>
  );
};


const itemsCategories = [
    {
        href: "/category/1",
        imgSrc: male,
        name: "Thời trang nam",
    },
    {
        href: "/category/21",
        imgSrc: female,
        name: "Thời trang nữ",
    },
    {
        href: "/category/14",
        imgSrc: kid,
        name: "Trẻ em",
    },
    {
        href: "/category/17",
        imgSrc: sport,
        name: "Thể thao",
    },
    {
        href: "/category/3",
        imgSrc: sneaker,
        name: "Giày dép",
    },
    {
        href: "/category/22",
        imgSrc: accessory,
        name: "Phụ kiện",
    },
    {
        href: "/new-product",
        imgSrc: newProduct,
        name: "Sản Phẩm Mới",
    },
    {
        href: "/category/2",
        imgSrc: trending,
        name: "Xu hướng",
    },
    {
        href: "/ma-giam-gia",
        imgSrc: voucher,
        name: "Mã Giảm Giá",
    },
    {
        href: "/category/24",
        imgSrc: flashSale,
        name: "Flash Sale",
    },

];

const randomVouchers = [
    {
        id: '1',
        code: 'DAVINCI20',
        discount_name: 'Giảm 20% cho đơn hàng đầu tiên',
        discount_percentage: 20,
        end_date: '2024-12-31',
        min_order_value: 200000
    },
    {
        id: '2',
        code: 'FASHION50K',
        discount_name: 'Giảm 50K cho thời trang',
        discount_amount: 50000,
        end_date: '2024-11-30',
        min_order_value: 300000
    },
    {
        id: '3',
        code: 'SPORT15',
        discount_name: 'Giảm 15% phụ kiện thể thao',
        discount_percentage: 15,
        end_date: '2024-10-25',
        min_order_value: 150000
    },
    {
        id: '4',
        code: 'SHOES30K',
        discount_name: 'Giảm 30K giày thể thao',
        discount_amount: 30000,
        end_date: '2024-12-15',
        min_order_value: 500000
    },
    {
        id: '5',
        code: 'GYM25',
        discount_name: 'Giảm 25% đồ tập gym',
        discount_percentage: 25,
        end_date: '2024-11-20',
        min_order_value: 400000
    }
];


export default Home;
