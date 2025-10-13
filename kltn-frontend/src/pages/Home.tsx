import { useEffect, useState } from "react";
import svgFlashSale from "/label-flashsale.svg";
import { Copy } from 'lucide-react';

import { toast } from 'sonner';

import "../index.css";

import "./custom.css";

interface StaticProduct {
  id: string;
  title: string;
  link: string;
  image: string;
  specialPrice: string;
  discount: string;
  oldPrice: string;
  soldCount: string;
}

interface StaticVoucher {
  id: string;
  code: string;
  title: string;
  discount: string;
  endDate: string;
  minOrder: string;
}

const Home: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Comment: Đã thay thế state bằng dữ liệu tĩnh
  // const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
  // const [isLoadingFlashSale, setIsLoadingFlashSale] = useState<boolean>(true);
  // const [newestProducts, setNewestProducts] = useState<Product[]>([]);
  // const [isLoadingNewestProducts, setIsLoadingNewestProducts] = useState<boolean>(true);
  // const [randomVouchers, setRandomVouchers] = useState<Voucher[]>([]);
  // const [isLoadingVouchers, setIsLoadingVouchers] = useState<boolean>(true);

  // Dữ liệu tĩnh thay thế cho loading states
  const isLoadingFlashSale = false;
  const isLoadingNewestProducts = false;
  const isLoadingVouchers = false;

  const itemsSlider = [
    "https://file.hstatic.net/1000253775/file/banner_pc_3688a7ee993a48a3aa2ceda425abfa7b.jpg",
    "https://yame.vn/cdn/shop/files/sale_thang_9.jpg?v=1757675267&width=2000",
    "https://cdn.hstatic.net/files/1000341902/collection/mob__4_-min_d1649a6d39854149a6b754eb3035e3b9.png",
    "https://cdn.hstatic.net/files/1000253775/file/ngang-2000x793.jpg",
    "https://file.hstatic.net/1000253775/collection/tat_ca_san_pham_a15a7fe1ed8f45b89989964da7a72e9f_master.jpg",
  ];

  const itemsCategories = [
    {
      href: "/category/1",
      imgSrc:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEghAXnRggsMQTrtGV5amdX199CBNoGNkLktsoYNhlJiZuS-GH6BTwDU_P682LHP4u2omH6RK7mZMgBXF0XBV_LSsPsihn_cTJ-zAFZ_PG05tmu0Gf4OMbIMhSYMs2olJOuUiYjmlpjjviNSvs6-1niF-jCE9dsIqsVcWq4mugVmknWZCHQTBucPrQedN6Zc/s1600/communityIcon_efpu1jpxvlzb1.png",
      name: "Thời trang nam",
    },
    {
      href: "/category/21",
      imgSrc:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYQo_Z_ALKvP-2lvpwdr0PWYFf2lRsFGqJOgv3coNls6TX7LSZNrQ_Kir5liuJzpJnq7bE3NTCwo-mn5DoNoavieZwN898vU6IE0_jRR_jdqhLC-OsuyBYKV-LlnI4G-qbPBzQeeGzC1n2GsDIE4DrKbrZCTVhOFbJz6jj5d-ZEqEXhoBfr-rokycWfMzb/s1600/images%20%282%29.jpg",
      name: "Thời trang nữ",
    },
    {
      href: "/category/14",
      imgSrc:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhNvBQVXpT_P7pWL7eEgwz69AjsTl36xE4pBhtSI-uX0b3Hcku__x2I5ScmQhYZtnTJs5qhA0pHqO_BGC840QT80Sk-ulcRyoRCgjF20GHP0rQF2p3WAB6jv76fC9jF-EjUDeclR9q3aV6Z9TEzHrIKgxQVn3eSpgP7FfXmgty9rh7iocMTlBkLzozUJQcY/s1600/unname-memory.webp",
      name: "Trẻ em",
    },
    {
      href: "/category/17",
      imgSrc:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgXvZ0YI5Eaorzb5JcxLypE-n-kPvoN0q3ep1YP4HeNMv4LvqWXUmvUE0DZkt8lAkJOIvfx6MQdJSG1rRK9G1KaG4Zu21W48Bit_NZvM7cefGHoY4kXmFxOJ2fKr_Lm-HiEuZGGg89_5Uu59aKjDZyshKpYBmD0azWDLD8nIm1e7Lt-jPkOHg3rMYrS6pU7/s1600/images%20%281%29.jpg",
      name: "Thể thao",
    },
        {
      href: "/category/2",
      imgSrc:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhF8ZvW7Qn2TZd7aWrjaCv7ArUb2zlnWUc2_qJ5qpDXhyr4HF0v59bMIkRExjmBdyXnD_pOxyEObGZHDYkk6cIJ9k6kQP8CqGaNTE-vrECgx8gjgCxq4wjtG4f_9zxy273nB6hTN0SG3081hJReWzIAchyXHMpc5Jup0mR42mb5h0jS_HmrOInqkYTKagVM/s1600/icon_ManngaT06.webp",
      name: "Thiết bị",
    },
        {
      href: "/category/3",
      imgSrc: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhk8dChWGHjA4xWuixCXJ64clSwwjQ4d5lmPK0Dku721DGHlZ39cnKUVcE0DR8Gz2UKQx1OMoMYQ8yfh05AA2VkEF_OVoav9EbVaS3jLAa2EUz8iuIen6ywNU2CCjO0W1ASIKm3KfFbHFbqTTfaix-Eg9nSlVdxprDQ6LI6U8SpiZslkXA8jQ9X8rBXohcg/s1600/0323f23f-44d6-45c4-be63-fffbf3e9e58a_medium.webp",
      name: "Dinh dưỡng",
    },
    {
      href: "/ma-giam-gia",
      imgSrc:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhkmzg2_sHsFg-nHtHnLeueosfi2OjYQGB_LoGYiqP_wBATw9___ONTG61ExyvKeLQBNttCSn0g6WerTupVYrOpFsSN9IsB8WzR5TfFiQDNugM-8QaFVN1d6LITTCpMR8Pvrhk4iaLhdj01ll9hGZBWPU005pM0cZcA4HVN8tl38adENc2Dmj8JR2k5FO2-/s1600/Icon_MaGiamGia_8px_1.webp",
      name: "Mã Giảm Giá",
    },
    {
      href: "/new-product",
      imgSrc:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiETXgIo7zFvb_3N_5Wg04JuZnNv6yb9zsJb72AbdBCiTsFtfUl6PMMV-wju-2v1WCtf171zZMpbOfIJscqMaMJ1EIxT0NXeH5t_Afdve7TwYBZvzzh6LNP4UTy0WwtkajWw7uzfuylLT5Lnx7cR5L4TE68FIyg5-Q_QPgkh8TXMwGBFcTXYOUAEMnTuGEY/s1600/Icon_SanPhamMoi_8px_1.webp",
      name: "Sản Phẩm Mới",
    },
    {
      href: "/category/22",
      imgSrc:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiWkd_Qz7gfWm6jGDuoPMkN6Tq4IADIuMRJlrDlXMkXEQZdr3LfM5UPOCFKNUHwx9IrkLfEM6h69z0nNoIfAmWYs9ZUkghvBwYX01qEzQVwE2OVARYEjb3LAed5IdQDeUngopgkQ9lvH2vP2k-qveCQuQYYKGMyODUElrJlPNOIF9QRcl7vGuLWXILKYTLZ/s1600/256x256bb.jpg",
      name: "Phụ kiện",
    },
    {
      href: "/category/24",
      imgSrc:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEisBYIDdF7ScugvuiyTLFS1h7lR9OAPqzT8i6IS_4IWtSowxZg_PLFIPgLfHbMeX4a1pSRWtf0wUn_t8Pq1y1uSiNQH5iAnbqcJJxevbRzW_UB__lF5sGfYDWA9hRvtrhovT6fC1-NEHaHFguLpWhP7PzvIDBpNrGq7NSe95RAvmAZLRzuU40uMi-SusLUf/s1600/Icon_DonSi_120x120.webp",
      name: "Flash Sale",
    },

  ];

  // Dữ liệu vouchers tĩnh
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

  const productsData: StaticProduct[] = [
    {
      id: '1',
      title: "Áo Polo Nam Classic",
      link: "/product/1",
      image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500",
      specialPrice: "299.000 đ",
      discount: "-25%",
      oldPrice: "399.000",
      soldCount: "Đã bán 45",
    },
    {
      id: '2',
      title: "Thời trang đường phố",
      link: "https://www.fahasa.com/vo-bai-tap-toan-5-tap-2-ket-noi-chuan.html?fhs_campaign=FLASHSALE",
      image: "https://yame.vn/cdn/shop/files/qu-n-short-cool-touch-04-den-1174882037.jpg?v=1750805045&width=823",
      specialPrice: "15.300 đ",
      discount: "-10%",
      oldPrice: "17.000",
      soldCount: "Đã bán 5",
    },
    {
      id: '3',
      title: "City Boy",
      link: "https://www.fahasa.com/tu-hoc-2000-tu-vung-tieng-anh-theo-chu-de-182109.html?fhs_campaign=FLASHSALE",
      image: "https://yame.vn/cdn/shop/files/ao-thun-cool-touch-08-nau-1174881479.jpg?v=1750799050&width=823",
      specialPrice: "42.250 đ",
      discount: "-35%",
      oldPrice: "65.000",
      soldCount: "Đã bán 8",
    },
    {
      id: '4',
      title: "Nghĩa địa thời trang",
      link: "https://www.fahasa.com/tong-on-toan-hoc-tap-1-theo-chuong-trinh-sgk-moi.html?fhs_campaign=FLASHSALE",
      image: "https://yame.vn/cdn/shop/files/qu-n-short-the-original-m84-xanh-d-ng-1174881854.jpg?v=1750790645&width=823",
      specialPrice: "159.000 đ",
      discount: "-20%",
      oldPrice: "200.000",
      soldCount: "Đã bán 5",
    },
    {
      id: '5',
      title: "Ngày hè năng động",
      link: "https://www.fahasa.com/nhung-bai-hoc-nho-cho-be-dung-danh-nhe.html?fhs_campaign=FLASHSALE",
      image: "https://yame.vn/cdn/shop/files/qu-n-short-the-original-m84-den-1174881860.jpg?v=1750790656&width=823",
      specialPrice: "32.850 đ",
      discount: "-27%",
      oldPrice: "45.000",
      soldCount: "Đã bán 5",
    },
    {
      id: '6',
      title: "Năng động mỗi ngày",
      link: "https://www.fahasa.com/de-on-luyen-va-tu-kiem-tra-toan-lop-2-tap-2.html?fhs_campaign=FLASHSALE",
      image: "https://yame.vn/cdn/shop/files/qu-n-lot-boxer-ng-n-y2010-a02-xam-tr-ng-1174879403.jpg?v=1750829641&width=823",
      specialPrice: "27.300 đ",
      discount: "-30%",
      oldPrice: "39.000",
      soldCount: "Đã bán 4",
    },
    {
      id: '7',
      title: "Penbook - Luyện Đề Thi Tốt Nghiệp THPT Môn Vật Lí",
      link: "https://www.fahasa.com/penbook-luyen-de-thi-tot-nghiep-thpt-mon-vat-li.html?fhs_campaign=FLASHSALE",
      image: "https://yame.vn/cdn/shop/files/non-no-style-m140-xanh-la-1174879688.jpg?v=1750832881&width=823",
      specialPrice: "135.000 đ",
      discount: "-40%",
      oldPrice: "225.000",
      soldCount: "Đã bán 4",
    },
    {
      id: '8',
      title: "Thám Tử Lừng Danh Conan - Giờ Trà Của Zero - Tập 5 - Tặng Kèm Obi Metalize",
      link: "https://www.fahasa.com/tham-tu-lung-danh-conan-gio-tra-cua-zero-tap-5-tang-kem-obi-metalize.html?fhs_campaign=FLASHSALE",
      image: "https://yame.vn/cdn/shop/files/ao-khoac-seventy-seven-05-be-1174884632.jpg?v=1750882939&width=823",
      specialPrice: "31.500 đ",
      discount: "-10%",
      oldPrice: "35.000",
      soldCount: "Đã bán 3",
    },
    {
      id: '9',
      title: "Bộ Sách Sói & Gia Vị - Tập 13 & 14 (Bộ 2 Tập)",
      link: "https://www.fahasa.com/bo-sach-soi-gia-vi-tap-13-14-bo-2-tap.html?fhs_campaign=FLASHSALE",
      image: "https://yame.vn/cdn/shop/files/ao-khoac-seventy-seven-05-den-1174884607.jpg?v=1750882806&width=823",
      specialPrice: "120.840 đ",
      discount: "-47%",
      oldPrice: "228.000",
      soldCount: "Đã bán 3",
    },
    {
      id: '10',
      title: "Lũ Ngốc, Bài Thi Và Linh Thú Triệu Hồi - Tập 5",
      link: "https://www.fahasa.com/lu-ngoc-bai-thi-va-linh-thu-trieu-hoi-tap-5.html?fhs_campaign=FLASHSALE",
      image: "https://yame.vn/cdn/shop/files/ao-thun-seventy-seven-13-tr-ng-1174883539.jpg?v=1750865401&width=823",
      specialPrice: "38.500 đ",
      discount: "-45%",
      oldPrice: "70.000",
      soldCount: "Đã bán 2",
    },
    {
      id: '11',
      title: "Combo Sách Học Tiếng Anh - Bộ 3 Cuốn",
      link: "https://www.fahasa.com/combo-sach-hoc-tieng-anh-bo-3-cuon.html?fhs_campaign=FLASHSALE",
      image: "https://yame.vn/cdn/shop/files/ao-thun-seventy-seven-03-tr-ng-den-1174883543.jpg?v=1750865410&width=823",
      specialPrice: "99.000 đ",
      discount: "-25%",
      oldPrice: "132.000",
      soldCount: "Đã bán 6",
    },
  ];

    const productsLastData = [
    {
      title: "Hoa Học Trò - Số 1452 - Chọn Ngành, Chọn Tương Lai Xanh Để Chữa Lành Thế Giới",
      link: "https://www.fahasa.com/hoa-hoc-tro-so-1452-chon-nganh-chon-tuong-lai-xanh-de-chua-lanh-the-gioi.html?fhs_campaign=DEAL_HOT_PAGES",
      image: "https://n7media.coolmate.me/uploads/September2025/wristband-the-thao-den-2.jpg?aio=w-700",
      specialPrice: "19.000 đ",
      discount: "-5%",
      oldPrice: "20.000 đ",
      soldCount: "Đã bán 520",
    },
    {
      title: "50 Đề Minh Họa Tốt Nghiệp THPT 2025 - Môn Tiếng Anh",
      link: "https://www.fahasa.com/50-de-minh-hoa-tot-nghiep-thpt-2025-mon-tieng-anh.html?fhs_campaign=DEAL_HOT_PAGES",
      image: "https://n7media.coolmate.me/uploads/September2025/tat-the-thao-co-trung-cotton-cushion-thoang-khi-den-2.jpg?aio=w-700",
      specialPrice: "159.000 đ",
      discount: "-21%",
      oldPrice: "200.000 đ",
      soldCount: "Đã bán 88",
    },
    {
      title: "Bảng Xếp Hạng Quân Vương - Tập 1 - Tặng Kèm Bookmark",
      link: "https://www.fahasa.com/bang-xep-hang-quan-vuong-tap-1-tang-kem-bookmark.html?fhs_campaign=DEAL_HOT_PAGES",
      image: "https://n7media.coolmate.me/uploads/August2025/ao-thun-dinkshot-essentials-17-den_69.jpg?aio=w-700",
      specialPrice: "42.750 đ",
      discount: "-5%",
      oldPrice: "45.000 đ",
      soldCount: "Đã bán 135",
    },
    {
      title: "Thinking, Fast and Slow",
      link: "https://www.fahasa.com/thinking-fast-and-slow-86091.html?fhs_campaign=DEAL_HOT_PAGES",
      image: "https://n7media.coolmate.me/uploads/August2025/ao-polo-pickleball-exdry-17-den.jpg?aio=w-700",
      specialPrice: "410.400 đ",
      discount: "-10%",
      oldPrice: "456.000 đ",
      soldCount: "Đã bán 217",
    },
    {
      title: "Hộp Mù Tranh Tương Tác Squishy Cô Tiên Xanh (Sản Phẩm Bên Trong Là Ngẫu Nhiên)",
      link: "https://www.fahasa.com/hop-mu-tranh-tuong-tac-squishy-co-tien-xanh-san-pham-ben-trong-la-ngau-nhien.html?fhs_campaign=DEAL_HOT_PAGES",
      image: "https://n7media.coolmate.me/uploads/May2025/ao-thun-nam-pickleball-nam-smash-shot-3885-trang_29.jpg?aio=w-700",
      specialPrice: "53.100 đ",
      discount: "-10%",
      oldPrice: "59.000 đ",
      soldCount: "Đã bán 17",
    },
    {
      title: "Hoàng Tử Bé (Song Ngữ Việt-Anh)",
      link: "https://www.fahasa.com/hoang-tu-be-song-ngu-viet-anh.html?fhs_campaign=DEAL_HOT_PAGES",
      image: "https://n7media.coolmate.me/uploads/September2025/wristband-the-thao-trang-2.jpg?aio=w-700",
      specialPrice: "59.250 đ",
      discount: "-25%",
      oldPrice: "79.000 đ",
      soldCount: "Đã bán 2.4k",
    },
    {
      title: "Đám Trẻ Ở Đại Dương Đen",
      link: "https://www.fahasa.com/dam-tre-o-dai-duong-den.html?fhs_campaign=DEAL_HOT_PAGES",
      image: "https://n7media.coolmate.me/uploads/May2025/ao-thun-nam-pickleball-dink-shot-4989-do_69.jpg?aio=w-700",
      specialPrice: "74.250 đ",
      discount: "-25%",
      oldPrice: "99.000 đ",
      soldCount: "Đã bán 2.1k",
    },
    {
      title: "Liễu Phàm Tứ Huấn - Tích Tập Phúc Đức, Cải Tạo Vận Mênh (Tái Bản 2022)",
      link: "https://www.fahasa.com/lieu-pham-tu-huan-tich-tap-phuc-duc-cai-tao-van-menh-tai-ban-2022.html?fhs_campaign=DEAL_HOT_PAGES",
      image: "https://n7media.coolmate.me/uploads/May2025/ao-thun-nam-pickleball-nam-smash-shot-7128-do_30.jpg?aio=w-700",
      specialPrice: "41.300 đ",
      discount: "-30%",
      oldPrice: "59.000 đ",
      soldCount: "Đã bán 1.8k",
    },
    {
      title: "Sức Mạnh Tiềm Thức (Tái Bản 2021)",
      link: "https://www.fahasa.com/suc-manh-tiem-thuc-2021.html?fhs_campaign=DEAL_HOT_PAGES",
      image: "https://n7media.coolmate.me/uploads/May2025/polo-nam-pickleball-baseline-6375-den_30.jpg?aio=w-700",
      specialPrice: "93.440 đ",
      discount: "-27%",
      oldPrice: "128.000 đ",
      soldCount: "Đã bán 1.4k",
    },
    {
      title: "Đắc Nhân Tâm (Tái Bản 2021)",
      link: "https://www.fahasa.com/dac-nhan-tam-tai-ban-2021.html?fhs_campaign=DEAL_HOT_PAGES",
      image: "https://n7media.coolmate.me/uploads/August2025/ao-thun-cau-long-nam-in-abstract-graphic-2-navy_10.jpg?aio=w-700",
      specialPrice: "60.200 đ",
      discount: "-30%",
      oldPrice: "86.000 đ",
      soldCount: "Đã bán 1.4k",
    },
    {
      title: "7 Thói Quen Hiệu Quả - The 7 Habits Of Highly Effective People - Bìa Cứng (Tái Bản 2022)",
      link: "https://www.fahasa.com/7-thoi-quen-hieu-qua-bc-thang-7-2022.html?fhs_campaign=DEAL_HOT_PAGES",
      image: "https://n7media.coolmate.me/uploads/September2025/wristband-the-thao-trang-2.jpg?aio=w-700",
      specialPrice: "187.500 đ",
      discount: "-25%",
      oldPrice: "250.000 đ",
      soldCount: "Đã bán 2.0k",
    },
    {
      title: "OSHO - Yêu - Being In Love",
      link: "https://www.fahasa.com/osho-yeu-being-in-love.html?fhs_campaign=DEAL_HOT_PAGES",
      image: "https://n7media.coolmate.me/uploads/May2025/ao-thun-nam-pickleball-nam-smash-shot-8260-den_42.jpg?aio=w-700",
      specialPrice: "122.640 đ",
      discount: "-27%",
      oldPrice: "168.000 đ",
      soldCount: "Đã bán 1.1k",
    },
    {
      title: "Mùa Hè Không Tên - Tặng Kèm Bookmark 2 Mặt + Poster Tranh",
      link: "https://www.fahasa.com/mua-he-khong-ten-tang-kem-bookmark-2-mat-poster-tranh.html?fhs_campaign=DEAL_HOT_PAGES",
      image: "https://n7media.coolmate.me/uploads/August2025/ao-thun-cau-long-nam-in-abstract-graphic-4-xanh-ngoc_81.jpg?aio=w-700",
      specialPrice: "104.000 đ",
      discount: "-20%",
      oldPrice: "130.000 đ",
      soldCount: "Đã bán 1.2k",
    },
    {
      title: "Tư Duy Nhanh Và Chậm (Tái Bản 2021)",
      link: "https://www.fahasa.com/tu-duy-nhanh-va-cham-tai-ban-2021.html?fhs_campaign=DEAL_HOT_PAGES",
      image: "https://n7media.coolmate.me/uploads/August2025/ao-tshirt-pickleball-driveshot-_6-trang-phoi-navy.jpg?aio=w-700",
      specialPrice: "201.750 đ",
      discount: "-25%",
      oldPrice: "269.000 đ",
      soldCount: "Đã bán 1.0k",
    },
    {
      title: "Không Diệt Không Sinh Đừng Sợ Hãi - Bìa Cứng - Phiên Bản Đặc Biệt - Tặng Kèm Postcard",
      link: "https://www.fahasa.com/khong-diet-khong-sinh-dung-so-hai-bia-cung-phien-ban-dac-biet-tang-kem-postcard.html?fhs_campaign=DEAL_HOT_PAGES",
      image: "https://n7media.coolmate.me/uploads/August2025/quan-short-nam-pickleball-dinkshot-1-_13-trang-phoi-navy.jpg?aio=w-700",
      specialPrice: "188.500 đ",
      discount: "-35%",
      oldPrice: "290.000 đ",
      soldCount: "Đã bán 607",
    },
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

  // Comment: Đã comment các useEffect fetch data từ API
  // useEffect(() => {
  //   const fetchFlashSaleProducts = async () => {
  //     try {
  //       setIsLoadingFlashSale(true);
  //       const products = await getFlashSaleProducts(10);
  //       setFlashSaleProducts(products);
  //     } catch (error) {
  //       console.error('Failed to fetch flash sale products:', error);
  //     } finally {
  //       setIsLoadingFlashSale(false);
  //     }
  //   };
  //   
  //   fetchFlashSaleProducts();
  // }, []);

  // useEffect(() => {
  //   const fetchRandomVouchers = async () => {
  //     try {
  //       setIsLoadingVouchers(true);
  //       const vouchers = await voucherService.getRandomVouchers();
  //       setRandomVouchers(vouchers.slice(0, 5)); // Lấy 5 voucher ngẫu nhiên
  //     } catch (error) {
  //       console.error('Failed to fetch random vouchers:', error);
  //     } finally {
  //       setIsLoadingVouchers(false);
  //     }
  //   };
  //   
  //   fetchRandomVouchers();
  // }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === itemsSlider.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [itemsSlider.length]);

  // Comment: Đã comment formatPrice vì sử dụng dữ liệu tĩnh
  // const formatPrice = (price: number): string => {
  //   return new Intl.NumberFormat('vi-VN', { 
  //     style: 'currency', 
  //     currency: 'VND',
  //     minimumFractionDigits: 0
  //   }).format(price);
  // };

  // Hàm tiện ích từ VoucherPage để sử dụng lại
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

  // Comment: Đã comment useEffect fetch newest products
  // useEffect(() => {
  //   const fetchNewestProducts = async () => {
  //     try {
  //       setIsLoadingNewestProducts(true);
  //       const products = await getNewestProducts(15);
  //       setNewestProducts(products);
  //     } catch (error) {
  //       console.error('Failed to fetch newest products:', error);
  //     } finally {
  //       setIsLoadingNewestProducts(false);
  //     }
  //   };
  //   
  //   fetchNewestProducts();
  // }, []);

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
                DAVINCI là shop thời trang độc đáo, nơi bạn không chỉ tìm thấy những bộ trang phục phong cách mà còn khám phá thế giới đa dạng của phụ kiện thời trang chất lượng cao. Tọa lạc tại vị trí trung tâm, DAVINCI mang đến cho khách hàng không gian mua sắm hiện đại, thoải mái và ấm cúng để thể hiện cá tính và gu thẩm mỹ riêng.
              </p>
              <button className="mt-6 px-6 py-2.5 bg-[#C92127] text-white rounded-lg hover:bg-[#a71b20] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md flex items-center gap-2">
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
            // Loading skeleton
            <div className="relative w-full block whitespace-nowrap mx-2 overflow-x-auto scrollbar-hide">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="inline-block w-[44%] md:w-[33%] lg:w-[19%] mr-[12px] bg-white rounded-lg overflow-hidden">
                  <div className="h-60 w-full bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-6 w-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Flash sale products - Sử dụng dữ liệu tĩnh
            <div className="relative w-full block whitespace-nowrap mx-2 overflow-x-auto scrollbar-hide">
              {productsData.slice(0, 5).map((product, index) => (
                <div key={index} className="inline-block w-[44%] md:w-[33%] lg:w-[19%] mr-[12px] bg-white rounded-lg hover:shadow-lg overflow-hidden transition-transform duration-300 transform group">
                  <a href={productsData[index] ? `/product?id=${productsData[index].id}` : '/product'}>
                    <div className="overflow-hidden h-60 w-full relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-60 object-cover lazyloaded transition-transform duration-300 transform group-hover:scale-110"
                      />
                      <div className="absolute top-2 left-2 bg-[#C92127] text-white px-2 py-1 rounded-md text-xs font-semibold">
                        {product.discount}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-[16px] text-gray-800 block overflow-hidden text-ellipsis whitespace-nowrap line-clamp-2">
                        {product.title}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xl font-semibold text-[#C92127]">
                          {product.specialPrice}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500 line-through">
                          {product.oldPrice} đ
                        </span>
                        <span className="text-sm text-gray-500">
                          {product.soldCount}
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          )}
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
                  <a href={product.link} className="block relative group">
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 bg-[#C92127] text-white px-2 py-1 rounded-md text-xs font-semibold">
                        {product.discount}
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
                        <div className="flex items-center text-yellow-400 text-xs">
                          {Array(5).fill(0).map((_, i) => (
                            <span key={i} className={i < 4 ? "text-yellow-400" : "text-gray-300"}>★</span>
                          ))}
                          <span className="text-gray-500 ml-1">({Math.floor(Math.random() * 50) + 1})</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {product.soldCount}
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>

          )}
          </div>
        </div>      {/* Chat Icon Component */}

        {/* Random Vouchers Section - Thêm đoạn này */}
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
                  <div className="text-5xl text-red-500 mb-2">+</div>
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
        

      </div>
    </>
  );
};

export default Home;
