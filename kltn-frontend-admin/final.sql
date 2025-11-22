-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               11.5.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for defaultdb
CREATE DATABASE IF NOT EXISTS `defaultdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `defaultdb`;

-- Dumping structure for table defaultdb.addresses
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `detail_address` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `ward` varchar(255) DEFAULT NULL,
  `zip` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKk9ch94u6g3t8refiutg80wu0h` (`phone_number`),
  KEY `FK1fa36y2oqhao3wgg2rw1pi459` (`user_id`),
  CONSTRAINT `FK1fa36y2oqhao3wgg2rw1pi459` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.addresses: ~1 rows (approximately)
INSERT INTO `addresses` (`id`, `user_id`, `city`, `detail_address`, `district`, `phone_number`, `street`, `ward`, `zip`) VALUES
	(1, 2, 'Thành phố Hồ Chí Minh', 'IUH, DHCN', 'Gò Vấp', '0912345678', 'Đường', 'Phường', '70000');

-- Dumping structure for table defaultdb.brands
CREATE TABLE IF NOT EXISTS `brands` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` text DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.brands: ~15 rows (approximately)
INSERT INTO `brands` (`id`, `description`, `logo_url`, `name`) VALUES
	(1, 'Just Do It - Thương hiệu thể thao hàng đầu thế giới', 'https://cdn.freebiesupply.com/logos/large/2x/nike-4-logo-png-transparent.png', 'Nike'),
	(2, 'Impossible is Nothing - Thương hiệu thể thao Đức', 'https://cdn.freebiesupply.com/logos/large/2x/adidas-logo-png-transparent.png', 'Adidas'),
	(3, 'Forever Faster - Thương hiệu thể thao năng động', 'https://cdn.freebiesupply.com/logos/large/2x/puma-logo-png-transparent.png', 'Puma'),
	(4, 'Fast fashion - Thời trang nhanh từ Tây Ban Nha', 'https://cdn.freebiesupply.com/logos/large/2x/zara-logo-png-transparent.png', 'Zara'),
	(5, 'Fashion and quality at the best price', 'https://cdn.freebiesupply.com/logos/large/2x/h-m-logo-png-transparent.png', 'H&M'),
	(6, 'LifeWear - Quần áo cho cuộc sống', 'https://cdn.freebiesupply.com/logos/large/2x/uniqlo-logo-png-transparent.png', 'Uniqlo'),
	(7, 'Thương hiệu thời trang nam Việt Nam', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=100&fit=crop', 'Coolmate'),
	(8, 'Thương hiệu thời trang trẻ Việt Nam', 'https://images.unsplash.com/photo-1607344645866-009c7d0dce97?w=200&h=100&fit=crop', 'Yame'),
	(9, 'Thương hiệu thời trang cao cấp Mỹ', 'https://cdn.freebiesupply.com/logos/large/2x/calvin-klein-logo-png-transparent.png', 'Calvin Klein'),
	(10, 'Classic American Cool', 'https://cdn.freebiesupply.com/logos/large/2x/tommy-hilfiger-logo-png-transparent.png', 'Tommy Hilfiger'),
	(11, 'Timeless style, authentic luxury', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=200&h=100&fit=crop', 'Polo Ralph Lauren'),
	(12, 'Life is a beautiful sport', 'https://cdn.freebiesupply.com/logos/large/2x/lacoste-logo-png-transparent.png', 'Lacoste'),
	(13, 'Chuck Taylor All Star - Biểu tượng thời trang', 'https://cdn.freebiesupply.com/logos/large/2x/converse-logo-png-transparent.png', 'Converse'),
	(14, 'Off The Wall - Thương hiệu skateboard', 'https://cdn.freebiesupply.com/logos/large/2x/vans-logo-png-transparent.png', 'Vans'),
	(15, 'Thương hiệu nội địa chất lượng cao', 'https://images.unsplash.com/photo-1607081692251-7a5ab0813e8d?w=200&h=100&fit=crop', 'Local Brand');

-- Dumping structure for table defaultdb.calendar_events
CREATE TABLE IF NOT EXISTS `calendar_events` (
  `all_day` bit(1) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `end_time` datetime(6) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `start_time` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `description` text DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `priority` enum('CRITICAL','HIGH','LOW','MEDIUM') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKdfj8ceigqqlaei8w1in1qp2e8` (`user_id`),
  CONSTRAINT `FKdfj8ceigqqlaei8w1in1qp2e8` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.calendar_events: ~0 rows (approximately)

-- Dumping structure for table defaultdb.carts
CREATE TABLE IF NOT EXISTS `carts` (
  `created_date` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `updated_date` datetime(6) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKb5o626f86h46m4s7ms6ginnop` (`user_id`),
  CONSTRAINT `FKb5o626f86h46m4s7ms6ginnop` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.carts: ~1 rows (approximately)
INSERT INTO `carts` (`created_date`, `id`, `updated_date`, `user_id`) VALUES
	('2025-10-13 13:25:36.000000', 1, '2025-10-13 13:25:46.000000', 2);

-- Dumping structure for table defaultdb.cart_items
CREATE TABLE IF NOT EXISTS `cart_items` (
  `cart_id` bigint(20) NOT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) NOT NULL,
  `product_variant_id` bigint(20) DEFAULT NULL,
  `quantity` bigint(20) NOT NULL,
  `updated_date` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpcttvuq4mxppo8sxggjtn5i2c` (`cart_id`),
  KEY `FK1re40cjegsfvw58xrkdp6bac6` (`product_id`),
  KEY `FKn1s4l7h0vm4o259wpu7ft0y2y` (`product_variant_id`),
  CONSTRAINT `FK1re40cjegsfvw58xrkdp6bac6` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKn1s4l7h0vm4o259wpu7ft0y2y` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `FKpcttvuq4mxppo8sxggjtn5i2c` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.cart_items: ~1 rows (approximately)
INSERT INTO `cart_items` (`cart_id`, `created_date`, `id`, `product_id`, `product_variant_id`, `quantity`, `updated_date`) VALUES
	(1, '2025-10-13 13:26:11.000000', 1, 2, 6, 1, '2025-10-13 13:26:14.000000');

-- Dumping structure for table defaultdb.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `parent_id` bigint(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKsaok720gsu4u2wrgbk10b5n8d` (`parent_id`),
  CONSTRAINT `FKsaok720gsu4u2wrgbk10b5n8d` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=187 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.categories: ~93 rows (approximately)
INSERT INTO `categories` (`id`, `parent_id`, `description`, `name`) VALUES
	(1, NULL, 'Các sản phẩm thời trang dành cho nam giới', 'Thời trang nam'),
	(2, NULL, 'Các sản phẩm thời trang dành cho nữ giới', 'Thời trang nữ'),
	(3, NULL, 'Các sản phẩm thời trang dành cho trẻ em', 'Thời trang trẻ em'),
	(4, NULL, 'Các loại giày dép cho nam, nữ và trẻ em', 'Giày dép'),
	(5, NULL, 'Túi xách, balo và các phụ kiện đựng đồ', 'Túi xách & Balo'),
	(6, NULL, 'Các phụ kiện thời trang như trang sức, kính mắt, nón...', 'Phụ kiện thời trang'),
	(7, NULL, 'Trang phục và phụ kiện thể thao', 'Đồ thể thao'),
	(8, NULL, 'Sản phẩm từ các thương hiệu nổi tiếng', 'Thương hiệu nổi tiếng'),
	(9, 1, 'Áo thun nam các loại', 'Áo T-shirt Nam'),
	(10, 1, 'Áo polo nam thời trang', 'Áo Polo Nam'),
	(11, 1, 'Áo sơ mi nam công sở và thời trang', 'Áo sơ mi Nam'),
	(12, 1, 'Áo hoodie nam phong cách trẻ trung', 'Áo hoodie Nam'),
	(13, 1, 'Áo khoác nam các loại', 'Áo khoác Nam'),
	(14, 1, 'Quần jeans nam thời trang', 'Quần jeans Nam'),
	(15, 1, 'Quần short nam mùa hè', 'Quần short Nam'),
	(16, 1, 'Quần tây nam công sở', 'Quần tây Nam'),
	(17, 1, 'Đồ lót nam', 'Đồ lót Nam'),
	(18, 1, 'Đồ ngủ nam thoải mái', 'Đồ ngủ Nam'),
	(19, 1, 'Áo vest nam lịch lãm', 'Áo vest Nam'),
	(20, 2, 'Áo thun nữ các loại', 'Áo T-shirt Nữ'),
	(21, 2, 'Áo crop top nữ thời trang', 'Áo crop top'),
	(22, 2, 'Áo hoodie nữ phong cách trẻ trung', 'Áo hoodie Nữ'),
	(23, 2, 'Áo khoác nữ các loại', 'Áo khoác Nữ'),
	(24, 2, 'Váy ngắn nữ thời trang', 'Váy ngắn'),
	(25, 2, 'Váy dài nữ thanh lịch', 'Váy dài'),
	(26, 2, 'Quần jeans nữ thời trang', 'Quần jeans Nữ'),
	(27, 2, 'Quần legging nữ co dãn', 'Quần legging'),
	(28, 2, 'Quần short nữ mùa hè', 'Quần short Nữ'),
	(29, 2, 'Đồ lót nữ', 'Đồ lót Nữ'),
	(30, 2, 'Đồ ngủ nữ thoải mái', 'Đồ ngủ Nữ'),
	(31, 3, 'Trang phục cho bé trai từ 0-2 tuổi', 'Bé trai (0-2 tuổi)'),
	(32, 3, 'Trang phục cho bé gái từ 0-2 tuổi', 'Bé gái (0-2 tuổi)'),
	(33, 3, 'Trang phục cho trẻ em trai từ 3-14 tuổi', 'Trẻ em trai (3-14 tuổi)'),
	(34, 3, 'Trang phục cho trẻ em gái từ 3-14 tuổi', 'Trẻ em gái (3-14 tuổi)'),
	(35, 3, 'Trang phục cho thiếu niên từ 15-18 tuổi', 'Thiếu niên (15-18 tuổi)'),
	(36, 3, 'Đồ ngủ cho trẻ em', 'Đồ ngủ trẻ em'),
	(37, 3, 'Đồ lót cho trẻ em', 'Đồ lót trẻ em'),
	(38, 3, 'Đồng phục và trang phục học sinh', 'Trang phục học sinh'),
	(39, 4, 'Giày sneaker thể thao thời trang', 'Giày sneaker'),
	(40, 4, 'Giày chạy bộ chuyên dụng', 'Giày chạy bộ'),
	(41, 4, 'Giày tập gym và fitness', 'Giày tập gym'),
	(42, 4, 'Giày bóng đá chuyên dụng', 'Giày bóng đá'),
	(43, 4, 'Giày tennis chuyên dụng', 'Giày tennis'),
	(44, 4, 'Giày cao gót nữ thời trang', 'Giày cao gót'),
	(45, 4, 'Giày búp bê nữ thanh lịch', 'Giày búp bê'),
	(46, 4, 'Giày boot nam nữ', 'Giày boot'),
	(47, 4, 'Dép các loại', 'Dép'),
	(48, 4, 'Giày tây nam công sở', 'Giày tây'),
	(49, 4, 'Giày lười thoải mái', 'Giày lười'),
	(50, 5, 'Túi xách tay nữ thời trang', 'Túi xách tay'),
	(51, 5, 'Túi đeo chéo nam nữ', 'Túi đeo chéo'),
	(52, 5, 'Túi tote đa năng', 'Túi tote'),
	(53, 5, 'Túi clutch nữ sang trọng', 'Túi clutch'),
	(54, 5, 'Balo đựng laptop công sở', 'Balo laptop'),
	(55, 5, 'Balo du lịch đa năng', 'Balo du lịch'),
	(56, 5, 'Balo cho học sinh sinh viên', 'Balo học sinh'),
	(57, 5, 'Túi đựng đồ thể thao', 'Túi thể thao'),
	(58, 5, 'Ví nam các loại', 'Ví nam'),
	(59, 5, 'Ví nữ thời trang', 'Ví nữ'),
	(60, 5, 'Vali du lịch các size', 'Vali'),
	(61, 6, 'Trang sức nam nữ', 'Trang sức'),
	(62, 6, 'Kính mát thời trang', 'Kính mát'),
	(63, 6, 'Kính cận và gọng kính', 'Kính cận'),
	(64, 6, 'Nón các loại', 'Nón'),
	(65, 6, 'Khăn thời trang', 'Khăn'),
	(66, 6, 'Thắt lưng nam nữ', 'Thắt lưng'),
	(67, 6, 'Găng tay thời trang', 'Găng tay'),
	(68, 6, 'Tất vớ nam nữ', 'Tất vớ'),
	(69, 6, 'Cà vạt nam công sở', 'Cà vạt'),
	(70, 6, 'Kẹp tóc và phụ kiện tóc', 'Kẹp tóc'),
	(71, 6, 'Khuyên tai thời trang', 'Khuyên tai'),
	(72, 7, 'Áo thể thao nam nữ', 'Áo thể thao'),
	(73, 7, 'Quần thể thao nam nữ', 'Quần thể thao'),
	(74, 7, 'Trang phục tập gym', 'Đồ tập gym'),
	(75, 7, 'Trang phục tập yoga', 'Đồ yoga'),
	(76, 7, 'Đồ bơi nam nữ', 'Đồ bơi'),
	(77, 7, 'Trang phục chạy bộ', 'Đồ chạy bộ'),
	(78, 7, 'Trang phục bóng đá', 'Đồ bóng đá'),
	(79, 7, 'Trang phục tennis', 'Đồ tennis'),
	(80, 7, 'Trang phục bóng rổ', 'Đồ basketball'),
	(81, 7, 'Băng đô thể thao', 'Băng đô'),
	(82, 7, 'Khăn thể thao', 'Khăn thể thao'),
	(83, 8, 'Sản phẩm thương hiệu Nike', 'Nike'),
	(84, 8, 'Sản phẩm thương hiệu Adidas', 'Adidas'),
	(85, 8, 'Sản phẩm thương hiệu Puma', 'Puma'),
	(86, 8, 'Sản phẩm thương hiệu Zara', 'Zara'),
	(87, 8, 'Sản phẩm thương hiệu Coolmate', 'Coolmate'),
	(88, 8, 'Sản phẩm thương hiệu Yame', 'Yame'),
	(89, 8, 'Sản phẩm thương hiệu Calvin Klein', 'Calvin Klein'),
	(90, 8, 'Sản phẩm thương hiệu Tommy Hilfiger', 'Tommy Hilfiger'),
	(91, 8, 'Sản phẩm thương hiệu Polo Ralph Lauren', 'Polo Ralph Lauren'),
	(92, 8, 'Sản phẩm thương hiệu Lacoste', 'Lacoste'),
	(93, 8, 'Sản phẩm thương hiệu Converse', 'Converse');

-- Dumping structure for table defaultdb.colors
CREATE TABLE IF NOT EXISTS `colors` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` text DEFAULT NULL,
  `hex_code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.colors: ~15 rows (approximately)
INSERT INTO `colors` (`id`, `description`, `hex_code`, `name`) VALUES
	(1, 'Màu đỏ tươi sáng', NULL, 'Đỏ'),
	(2, 'Màu xanh dương đậm', NULL, 'Xanh dương'),
	(3, 'Màu xanh lá cây tự nhiên', NULL, 'Xanh lá'),
	(4, 'Màu đen cổ điển', NULL, 'Đen'),
	(5, 'Màu trắng tinh khiết', NULL, 'Trắng'),
	(6, 'Màu xám trung tính', NULL, 'Xám'),
	(7, 'Màu hồng nhẹ nhàng', NULL, 'Hồng'),
	(8, 'Màu vàng tươi sáng', NULL, 'Vàng'),
	(9, 'Màu nâu đất tự nhiên', NULL, 'Nâu'),
	(10, 'Màu tím thời trang', NULL, 'Tím'),
	(11, 'Màu cam năng động', NULL, 'Cam'),
	(12, 'Màu be nhẹ nhàng', NULL, 'Be'),
	(13, 'Màu xanh navy lịch lãm', NULL, 'Xanh navy'),
	(14, 'Màu xanh mint tươi mát', NULL, 'Xanh mint'),
	(15, 'Màu hồng pastel dịu dàng', NULL, 'Hồng pastel');

-- Dumping structure for table defaultdb.confirmation_tokens
CREATE TABLE IF NOT EXISTS `confirmation_tokens` (
  `confirmed_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `expires_at` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhpuw37a1pqxfb6ya1nv5lm4ga` (`user_id`),
  CONSTRAINT `FKhpuw37a1pqxfb6ya1nv5lm4ga` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.confirmation_tokens: ~0 rows (approximately)

-- Dumping structure for table defaultdb.discounts
CREATE TABLE IF NOT EXISTS `discounts` (
  `value` double DEFAULT NULL,
  `end_date` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `start_date` datetime(6) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `discount_type` enum('FIXED','PERCENT') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.discounts: ~100 rows (approximately)
INSERT INTO `discounts` (`value`, `end_date`, `id`, `start_date`, `name`, `discount_type`) VALUES
	(1, '3025-01-01 00:00:00.000000', 1, '2025-01-01 00:00:00.000000', 'Giảm giá 1%', 'PERCENT'),
	(2, '3025-01-01 00:00:00.000000', 2, '2025-01-01 00:00:00.000000', 'Giảm giá 2%', 'PERCENT'),
	(3, '3025-01-01 00:00:00.000000', 3, '2025-01-01 00:00:00.000000', 'Giảm giá 3%', 'PERCENT'),
	(4, '3025-01-01 00:00:00.000000', 4, '2025-01-01 00:00:00.000000', 'Giảm giá 4%', 'PERCENT'),
	(5, '3025-01-01 00:00:00.000000', 5, '2025-01-01 00:00:00.000000', 'Giảm giá 5%', 'PERCENT'),
	(6, '3025-01-01 00:00:00.000000', 6, '2025-01-01 00:00:00.000000', 'Giảm giá 6%', 'PERCENT'),
	(7, '3025-01-01 00:00:00.000000', 7, '2025-01-01 00:00:00.000000', 'Giảm giá 7%', 'PERCENT'),
	(8, '3025-01-01 00:00:00.000000', 8, '2025-01-01 00:00:00.000000', 'Giảm giá 8%', 'PERCENT'),
	(9, '3025-01-01 00:00:00.000000', 9, '2025-01-01 00:00:00.000000', 'Giảm giá 9%', 'PERCENT'),
	(10, '3025-01-01 00:00:00.000000', 10, '2025-01-01 00:00:00.000000', 'Giảm giá 10%', 'PERCENT'),
	(11, '3025-01-01 00:00:00.000000', 11, '2025-01-01 00:00:00.000000', 'Giảm giá 11%', 'PERCENT'),
	(12, '3025-01-01 00:00:00.000000', 12, '2025-01-01 00:00:00.000000', 'Giảm giá 12%', 'PERCENT'),
	(13, '3025-01-01 00:00:00.000000', 13, '2025-01-01 00:00:00.000000', 'Giảm giá 13%', 'PERCENT'),
	(14, '3025-01-01 00:00:00.000000', 14, '2025-01-01 00:00:00.000000', 'Giảm giá 14%', 'PERCENT'),
	(15, '3025-01-01 00:00:00.000000', 15, '2025-01-01 00:00:00.000000', 'Giảm giá 15%', 'PERCENT'),
	(16, '3025-01-01 00:00:00.000000', 16, '2025-01-01 00:00:00.000000', 'Giảm giá 16%', 'PERCENT'),
	(17, '3025-01-01 00:00:00.000000', 17, '2025-01-01 00:00:00.000000', 'Giảm giá 17%', 'PERCENT'),
	(18, '3025-01-01 00:00:00.000000', 18, '2025-01-01 00:00:00.000000', 'Giảm giá 18%', 'PERCENT'),
	(19, '3025-01-01 00:00:00.000000', 19, '2025-01-01 00:00:00.000000', 'Giảm giá 19%', 'PERCENT'),
	(20, '3025-01-01 00:00:00.000000', 20, '2025-01-01 00:00:00.000000', 'Giảm giá 20%', 'PERCENT'),
	(21, '3025-01-01 00:00:00.000000', 21, '2025-01-01 00:00:00.000000', 'Giảm giá 21%', 'PERCENT'),
	(22, '3025-01-01 00:00:00.000000', 22, '2025-01-01 00:00:00.000000', 'Giảm giá 22%', 'PERCENT'),
	(23, '3025-01-01 00:00:00.000000', 23, '2025-01-01 00:00:00.000000', 'Giảm giá 23%', 'PERCENT'),
	(24, '3025-01-01 00:00:00.000000', 24, '2025-01-01 00:00:00.000000', 'Giảm giá 24%', 'PERCENT'),
	(25, '3025-01-01 00:00:00.000000', 25, '2025-01-01 00:00:00.000000', 'Giảm giá 25%', 'PERCENT'),
	(26, '3025-01-01 00:00:00.000000', 26, '2025-01-01 00:00:00.000000', 'Giảm giá 26%', 'PERCENT'),
	(27, '3025-01-01 00:00:00.000000', 27, '2025-01-01 00:00:00.000000', 'Giảm giá 27%', 'PERCENT'),
	(28, '3025-01-01 00:00:00.000000', 28, '2025-01-01 00:00:00.000000', 'Giảm giá 28%', 'PERCENT'),
	(29, '3025-01-01 00:00:00.000000', 29, '2025-01-01 00:00:00.000000', 'Giảm giá 29%', 'PERCENT'),
	(30, '3025-01-01 00:00:00.000000', 30, '2025-01-01 00:00:00.000000', 'Giảm giá 30%', 'PERCENT'),
	(31, '3025-01-01 00:00:00.000000', 31, '2025-01-01 00:00:00.000000', 'Giảm giá 31%', 'PERCENT'),
	(32, '3025-01-01 00:00:00.000000', 32, '2025-01-01 00:00:00.000000', 'Giảm giá 32%', 'PERCENT'),
	(33, '3025-01-01 00:00:00.000000', 33, '2025-01-01 00:00:00.000000', 'Giảm giá 33%', 'PERCENT'),
	(34, '3025-01-01 00:00:00.000000', 34, '2025-01-01 00:00:00.000000', 'Giảm giá 34%', 'PERCENT'),
	(35, '3025-01-01 00:00:00.000000', 35, '2025-01-01 00:00:00.000000', 'Giảm giá 35%', 'PERCENT'),
	(36, '3025-01-01 00:00:00.000000', 36, '2025-01-01 00:00:00.000000', 'Giảm giá 36%', 'PERCENT'),
	(37, '3025-01-01 00:00:00.000000', 37, '2025-01-01 00:00:00.000000', 'Giảm giá 37%', 'PERCENT'),
	(38, '3025-01-01 00:00:00.000000', 38, '2025-01-01 00:00:00.000000', 'Giảm giá 38%', 'PERCENT'),
	(39, '3025-01-01 00:00:00.000000', 39, '2025-01-01 00:00:00.000000', 'Giảm giá 39%', 'PERCENT'),
	(40, '3025-01-01 00:00:00.000000', 40, '2025-01-01 00:00:00.000000', 'Giảm giá 40%', 'PERCENT'),
	(41, '3025-01-01 00:00:00.000000', 41, '2025-01-01 00:00:00.000000', 'Giảm giá 41%', 'PERCENT'),
	(42, '3025-01-01 00:00:00.000000', 42, '2025-01-01 00:00:00.000000', 'Giảm giá 42%', 'PERCENT'),
	(43, '3025-01-01 00:00:00.000000', 43, '2025-01-01 00:00:00.000000', 'Giảm giá 43%', 'PERCENT'),
	(44, '3025-01-01 00:00:00.000000', 44, '2025-01-01 00:00:00.000000', 'Giảm giá 44%', 'PERCENT'),
	(45, '3025-01-01 00:00:00.000000', 45, '2025-01-01 00:00:00.000000', 'Giảm giá 45%', 'PERCENT'),
	(46, '3025-01-01 00:00:00.000000', 46, '2025-01-01 00:00:00.000000', 'Giảm giá 46%', 'PERCENT'),
	(47, '3025-01-01 00:00:00.000000', 47, '2025-01-01 00:00:00.000000', 'Giảm giá 47%', 'PERCENT'),
	(48, '3025-01-01 00:00:00.000000', 48, '2025-01-01 00:00:00.000000', 'Giảm giá 48%', 'PERCENT'),
	(49, '3025-01-01 00:00:00.000000', 49, '2025-01-01 00:00:00.000000', 'Giảm giá 49%', 'PERCENT'),
	(50, '3025-01-01 00:00:00.000000', 50, '2025-01-01 00:00:00.000000', 'Giảm giá 50%', 'PERCENT'),
	(51, '3025-01-01 00:00:00.000000', 51, '2025-01-01 00:00:00.000000', 'Giảm giá 51%', 'PERCENT'),
	(52, '3025-01-01 00:00:00.000000', 52, '2025-01-01 00:00:00.000000', 'Giảm giá 52%', 'PERCENT'),
	(53, '3025-01-01 00:00:00.000000', 53, '2025-01-01 00:00:00.000000', 'Giảm giá 53%', 'PERCENT'),
	(54, '3025-01-01 00:00:00.000000', 54, '2025-01-01 00:00:00.000000', 'Giảm giá 54%', 'PERCENT'),
	(55, '3025-01-01 00:00:00.000000', 55, '2025-01-01 00:00:00.000000', 'Giảm giá 55%', 'PERCENT'),
	(56, '3025-01-01 00:00:00.000000', 56, '2025-01-01 00:00:00.000000', 'Giảm giá 56%', 'PERCENT'),
	(57, '3025-01-01 00:00:00.000000', 57, '2025-01-01 00:00:00.000000', 'Giảm giá 57%', 'PERCENT'),
	(58, '3025-01-01 00:00:00.000000', 58, '2025-01-01 00:00:00.000000', 'Giảm giá 58%', 'PERCENT'),
	(59, '3025-01-01 00:00:00.000000', 59, '2025-01-01 00:00:00.000000', 'Giảm giá 59%', 'PERCENT'),
	(60, '3025-01-01 00:00:00.000000', 60, '2025-01-01 00:00:00.000000', 'Giảm giá 60%', 'PERCENT'),
	(61, '3025-01-01 00:00:00.000000', 61, '2025-01-01 00:00:00.000000', 'Giảm giá 61%', 'PERCENT'),
	(62, '3025-01-01 00:00:00.000000', 62, '2025-01-01 00:00:00.000000', 'Giảm giá 62%', 'PERCENT'),
	(63, '3025-01-01 00:00:00.000000', 63, '2025-01-01 00:00:00.000000', 'Giảm giá 63%', 'PERCENT'),
	(64, '3025-01-01 00:00:00.000000', 64, '2025-01-01 00:00:00.000000', 'Giảm giá 64%', 'PERCENT'),
	(65, '3025-01-01 00:00:00.000000', 65, '2025-01-01 00:00:00.000000', 'Giảm giá 65%', 'PERCENT'),
	(66, '3025-01-01 00:00:00.000000', 66, '2025-01-01 00:00:00.000000', 'Giảm giá 66%', 'PERCENT'),
	(67, '3025-01-01 00:00:00.000000', 67, '2025-01-01 00:00:00.000000', 'Giảm giá 67%', 'PERCENT'),
	(68, '3025-01-01 00:00:00.000000', 68, '2025-01-01 00:00:00.000000', 'Giảm giá 68%', 'PERCENT'),
	(69, '3025-01-01 00:00:00.000000', 69, '2025-01-01 00:00:00.000000', 'Giảm giá 69%', 'PERCENT'),
	(70, '3025-01-01 00:00:00.000000', 70, '2025-01-01 00:00:00.000000', 'Giảm giá 70%', 'PERCENT'),
	(71, '3025-01-01 00:00:00.000000', 71, '2025-01-01 00:00:00.000000', 'Giảm giá 71%', 'PERCENT'),
	(72, '3025-01-01 00:00:00.000000', 72, '2025-01-01 00:00:00.000000', 'Giảm giá 72%', 'PERCENT'),
	(73, '3025-01-01 00:00:00.000000', 73, '2025-01-01 00:00:00.000000', 'Giảm giá 73%', 'PERCENT'),
	(74, '3025-01-01 00:00:00.000000', 74, '2025-01-01 00:00:00.000000', 'Giảm giá 74%', 'PERCENT'),
	(75, '3025-01-01 00:00:00.000000', 75, '2025-01-01 00:00:00.000000', 'Giảm giá 75%', 'PERCENT'),
	(76, '3025-01-01 00:00:00.000000', 76, '2025-01-01 00:00:00.000000', 'Giảm giá 76%', 'PERCENT'),
	(77, '3025-01-01 00:00:00.000000', 77, '2025-01-01 00:00:00.000000', 'Giảm giá 77%', 'PERCENT'),
	(78, '3025-01-01 00:00:00.000000', 78, '2025-01-01 00:00:00.000000', 'Giảm giá 78%', 'PERCENT'),
	(79, '3025-01-01 00:00:00.000000', 79, '2025-01-01 00:00:00.000000', 'Giảm giá 79%', 'PERCENT'),
	(80, '3025-01-01 00:00:00.000000', 80, '2025-01-01 00:00:00.000000', 'Giảm giá 80%', 'PERCENT'),
	(81, '3025-01-01 00:00:00.000000', 81, '2025-01-01 00:00:00.000000', 'Giảm giá 81%', 'PERCENT'),
	(82, '3025-01-01 00:00:00.000000', 82, '2025-01-01 00:00:00.000000', 'Giảm giá 82%', 'PERCENT'),
	(83, '3025-01-01 00:00:00.000000', 83, '2025-01-01 00:00:00.000000', 'Giảm giá 83%', 'PERCENT'),
	(84, '3025-01-01 00:00:00.000000', 84, '2025-01-01 00:00:00.000000', 'Giảm giá 84%', 'PERCENT'),
	(85, '3025-01-01 00:00:00.000000', 85, '2025-01-01 00:00:00.000000', 'Giảm giá 85%', 'PERCENT'),
	(86, '3025-01-01 00:00:00.000000', 86, '2025-01-01 00:00:00.000000', 'Giảm giá 86%', 'PERCENT'),
	(87, '3025-01-01 00:00:00.000000', 87, '2025-01-01 00:00:00.000000', 'Giảm giá 87%', 'PERCENT'),
	(88, '3025-01-01 00:00:00.000000', 88, '2025-01-01 00:00:00.000000', 'Giảm giá 88%', 'PERCENT'),
	(89, '3025-01-01 00:00:00.000000', 89, '2025-01-01 00:00:00.000000', 'Giảm giá 89%', 'PERCENT'),
	(90, '3025-01-01 00:00:00.000000', 90, '2025-01-01 00:00:00.000000', 'Giảm giá 90%', 'PERCENT'),
	(91, '3025-01-01 00:00:00.000000', 91, '2025-01-01 00:00:00.000000', 'Giảm giá 91%', 'PERCENT'),
	(92, '3025-01-01 00:00:00.000000', 92, '2025-01-01 00:00:00.000000', 'Giảm giá 92%', 'PERCENT'),
	(93, '3025-01-01 00:00:00.000000', 93, '2025-01-01 00:00:00.000000', 'Giảm giá 93%', 'PERCENT'),
	(94, '3025-01-01 00:00:00.000000', 94, '2025-01-01 00:00:00.000000', 'Giảm giá 94%', 'PERCENT'),
	(95, '3025-01-01 00:00:00.000000', 95, '2025-01-01 00:00:00.000000', 'Giảm giá 95%', 'PERCENT'),
	(96, '3025-01-01 00:00:00.000000', 96, '2025-01-01 00:00:00.000000', 'Giảm giá 96%', 'PERCENT'),
	(97, '3025-01-01 00:00:00.000000', 97, '2025-01-01 00:00:00.000000', 'Giảm giá 97%', 'PERCENT'),
	(98, '3025-01-01 00:00:00.000000', 98, '2025-01-01 00:00:00.000000', 'Giảm giá 98%', 'PERCENT'),
	(99, '3025-01-01 00:00:00.000000', 99, '2025-01-01 00:00:00.000000', 'Giảm giá 99%', 'PERCENT'),
	(100, '3025-01-01 00:00:00.000000', 100, '2025-01-01 00:00:00.000000', 'Giảm giá 100%', 'PERCENT');

-- Dumping structure for table defaultdb.favorites
CREATE TABLE IF NOT EXISTS `favorites` (
  `created_date` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6sgu5npe8ug4o42bf9j71x20c` (`product_id`),
  KEY `FKk7du8b8ewipawnnpg76d55fus` (`user_id`),
  CONSTRAINT `FK6sgu5npe8ug4o42bf9j71x20c` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKk7du8b8ewipawnnpg76d55fus` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.favorites: ~3 rows (approximately)
INSERT INTO `favorites` (`created_date`, `id`, `product_id`, `user_id`) VALUES
	('2025-10-13 13:44:14.000000', 1, 2, 1),
	('2025-10-13 13:44:31.000000', 2, 2, 2),
	('2025-10-13 13:44:51.000000', 3, 1, 2);

-- Dumping structure for table defaultdb.invalidated_tokens
CREATE TABLE IF NOT EXISTS `invalidated_tokens` (
  `expiry_time` datetime(6) DEFAULT NULL,
  `id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.invalidated_tokens: ~0 rows (approximately)

-- Dumping structure for table defaultdb.message_contents
CREATE TABLE IF NOT EXISTS `message_contents` (
  `data_sent` datetime(6) DEFAULT NULL,
  `username` bigint(20) DEFAULT NULL,
  `id` binary(16) NOT NULL,
  `message_room_id` binary(16) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `message_type` enum('TEXT') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhwknvqniikr1f80xllac0ofu4` (`message_room_id`),
  KEY `FKruo03pn16aordcagyp71iocu0` (`username`),
  CONSTRAINT `FKhwknvqniikr1f80xllac0ofu4` FOREIGN KEY (`message_room_id`) REFERENCES `message_rooms` (`id`),
  CONSTRAINT `FKruo03pn16aordcagyp71iocu0` FOREIGN KEY (`username`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.message_contents: ~0 rows (approximately)

-- Dumping structure for table defaultdb.message_rooms
CREATE TABLE IF NOT EXISTS `message_rooms` (
  `created_by` bigint(20) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `id` binary(16) NOT NULL,
  `imageurl` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqx1mx0ar5i0ue2l29hv2sh4ci` (`created_by`),
  CONSTRAINT `FKqx1mx0ar5i0ue2l29hv2sh4ci` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.message_rooms: ~0 rows (approximately)

-- Dumping structure for table defaultdb.message_room_members
CREATE TABLE IF NOT EXISTS `message_room_members` (
  `is_admin` bit(1) DEFAULT NULL,
  `last_seen` datetime(6) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  `message_room_id` binary(16) NOT NULL,
  PRIMARY KEY (`user_id`,`message_room_id`),
  KEY `FKkmucsp2p7f3ysmjxjuwwugc33` (`message_room_id`),
  CONSTRAINT `FKj69b70dun7co988qpsnc2tlbx` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKkmucsp2p7f3ysmjxjuwwugc33` FOREIGN KEY (`message_room_id`) REFERENCES `message_rooms` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.message_room_members: ~0 rows (approximately)

-- Dumping structure for table defaultdb.notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `is_read` bit(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `read_at` datetime(6) DEFAULT NULL,
  `reference_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  `message` text DEFAULT NULL,
  `reference_type` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `type` enum('CALENDAR_CANCELLED','CALENDAR_CREATED','CALENDAR_REMINDER','CALENDAR_UPDATED','ORDER_CANCELLED','ORDER_COMPLETED','ORDER_CREATED','ORDER_STATUS_CHANGED','PRODUCT_ADDED','PRODUCT_BACK_IN_STOCK','PRODUCT_OUT_OF_STOCK','PRODUCT_UPDATED','PROMOTION_ADDED','PROMOTION_ENDING_SOON','SYSTEM_ANNOUNCEMENT') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9y21adhxn0ayjhfocscqox7bh` (`user_id`),
  CONSTRAINT `FK9y21adhxn0ayjhfocscqox7bh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.notifications: ~0 rows (approximately)

-- Dumping structure for table defaultdb.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `discount_amount` decimal(38,2) DEFAULT NULL,
  `final_amount` decimal(38,2) NOT NULL,
  `total_amount` decimal(38,2) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `order_status` enum('CANCELED','COMPLETED','PENDING','PROCESSING') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`),
  CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.orders: ~1 rows (approximately)
INSERT INTO `orders` (`discount_amount`, `final_amount`, `total_amount`, `created_at`, `id`, `updated_at`, `user_id`, `order_status`) VALUES
	(0.00, 450000.00, 450000.00, '2025-10-13 13:27:49.000000', 1, '2025-10-13 13:27:51.000000', 2, 'COMPLETED');

-- Dumping structure for table defaultdb.order_details
CREATE TABLE IF NOT EXISTS `order_details` (
  `price` decimal(15,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total_price` decimal(15,2) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjyu2qbqt8gnvno9oe9j2s2ldk` (`order_id`),
  KEY `FKlhox716g0hiu9cqla9l7r9p3r` (`product_id`),
  CONSTRAINT `FKjyu2qbqt8gnvno9oe9j2s2ldk` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FKlhox716g0hiu9cqla9l7r9p3r` FOREIGN KEY (`product_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.order_details: ~1 rows (approximately)
INSERT INTO `order_details` (`price`, `quantity`, `total_price`, `id`, `order_id`, `product_id`) VALUES
	(450000.00, 1, 450000.00, 1, 1, 16);

-- Dumping structure for table defaultdb.payments
CREATE TABLE IF NOT EXISTS `payments` (
  `amount` decimal(15,2) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) NOT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `method` enum('COD','CREDIT_CARD','MOMO','PAYPAL','VNPAY') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK8vo36cen604as7etdfwmyjsxt` (`order_id`),
  CONSTRAINT `FK81gagumt0r8y3rmudcgpbk42l` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.payments: ~1 rows (approximately)
INSERT INTO `payments` (`amount`, `id`, `order_id`, `paid_at`, `transaction_id`, `method`) VALUES
	(450000.00, 1, 1, NULL, NULL, 'COD');

-- Dumping structure for table defaultdb.permissions
CREATE TABLE IF NOT EXISTS `permissions` (
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.permissions: ~0 rows (approximately)

-- Dumping structure for table defaultdb.products
CREATE TABLE IF NOT EXISTS `products` (
  `base_price` double DEFAULT NULL,
  `brand_id` bigint(20) DEFAULT NULL,
  `category_id` bigint(20) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','OUT_OF_STOCK') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKa3a4mpsfdf4d2y6r8ra3sc8mv` (`brand_id`),
  KEY `FKog2rp4qthbtt2lfyhfo32lsw9` (`category_id`),
  CONSTRAINT `FKa3a4mpsfdf4d2y6r8ra3sc8mv` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`),
  CONSTRAINT `FKog2rp4qthbtt2lfyhfo32lsw9` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.products: ~26 rows (approximately)
INSERT INTO `products` (`base_price`, `brand_id`, `category_id`, `created_at`, `id`, `updated_at`, `description`, `name`, `status`) VALUES
	(450000, 1, 9, '2025-10-13 13:20:30.000000', 1, '2025-10-13 13:21:07.000000', 'Áo thun nam Nike công nghệ Dri-FIT thấm hút mồ hôi tốt', 'Áo T-shirt Nike Dri-FIT', 'ACTIVE'),
	(420000, 2, 9, '2025-10-13 13:20:31.000000', 2, '2025-10-13 13:21:08.000000', 'Áo thun nam Adidas cổ điển với 3 sọc truyền thống', 'Áo T-shirt Adidas 3-Stripes', 'ACTIVE'),
	(299000, 7, 9, '2025-10-13 13:20:32.000000', 3, '2025-10-13 13:21:09.000000', 'Áo thun nam Coolmate chất liệu cotton cao cấp', 'Áo T-shirt Coolmate Premium', 'ACTIVE'),
	(250000, 15, 9, '2025-10-13 13:20:33.000000', 4, '2025-10-13 13:21:10.000000', 'Áo thun nam phong cách tối giản, chất liệu mềm mại', 'Áo T-shirt Local Brand Minimalist', 'ACTIVE'),
	(1200000, 12, 10, '2025-10-13 13:20:34.000000', 5, '2025-10-13 13:21:11.000000', 'Áo polo nam Lacoste cổ điển với logo cá sấu', 'Áo Polo Lacoste Classic', 'ACTIVE'),
	(1500000, 11, 10, '2025-10-13 13:20:35.000000', 6, '2025-10-13 13:21:12.000000', 'Áo polo nam Ralph Lauren chất liệu pique cotton', 'Áo Polo Ralph Lauren', 'ACTIVE'),
	(490000, 6, 10, '2025-10-13 13:20:36.000000', 7, '2025-10-13 13:21:14.000000', 'Áo polo nam Uniqlo công nghệ Dry thấm hút tốt', 'Áo Polo Uniqlo Dry Pique', 'ACTIVE'),
	(599000, 15, 14, '2025-10-13 13:20:37.000000', 8, '2025-10-13 13:21:15.000000', 'Quần jeans nam form slim fit thời trang', 'Quần Jeans Slim Fit', 'ACTIVE'),
	(549000, 15, 14, '2025-10-13 13:20:38.000000', 9, '2025-10-13 13:21:16.000000', 'Quần jeans nam form straight cổ điển', 'Quần Jeans Straight Fit', 'ACTIVE'),
	(699000, 15, 14, '2025-10-13 13:20:40.000000', 10, '2025-10-13 13:21:16.000000', 'Quần jeans nam rách gối phong cách street style', 'Quần Jeans Ripped', 'ACTIVE'),
	(2500000, 1, 32, '2025-10-13 13:20:41.000000', 11, '2025-10-13 13:21:17.000000', 'Giày sneaker Nike Air Force 1 trắng cổ điển', 'Nike Air Force 1', 'ACTIVE'),
	(2200000, 2, 32, '2025-10-13 13:20:42.000000', 12, '2025-10-13 13:21:18.000000', 'Giày sneaker Adidas Stan Smith xanh lá iconic', 'Adidas Stan Smith', 'ACTIVE'),
	(1500000, 13, 32, '2025-10-13 13:20:43.000000', 13, '2025-10-13 13:21:19.000000', 'Giày sneaker Converse cổ thấp đen trắng', 'Converse Chuck Taylor All Star', 'ACTIVE'),
	(1800000, 14, 32, '2025-10-13 13:20:44.000000', 14, '2025-10-13 13:21:20.000000', 'Giày sneaker Vans Old Skool với sidestripe đặc trưng', 'Vans Old Skool', 'ACTIVE'),
	(199000, 8, 20, '2025-10-13 13:20:46.000000', 15, '2025-10-13 13:21:21.000000', 'Áo thun nữ basic nhiều màu sắc', 'Áo T-shirt Nữ Basic', 'ACTIVE'),
	(399000, 4, 24, '2025-10-13 13:20:49.000000', 16, '2025-10-13 13:21:22.000000', 'Váy midi nữ họa tiết hoa nhí dịu dàng', 'Váy Midi Hoa Nhí', 'ACTIVE'),
	(499000, 5, 26, '2025-10-13 13:20:51.000000', 17, '2025-10-13 13:21:24.000000', 'Quần jeans nữ form skinny ôm dáng', 'Quần Jeans Skinny Nữ', 'ACTIVE'),
	(799000, 4, 23, '2025-10-13 13:20:52.000000', 18, '2025-10-13 13:21:25.000000', 'Áo khoác blazer nữ công sở thanh lịch', 'Áo Khoác Blazer Nữ', 'ACTIVE'),
	(150000, 15, 31, '2025-10-13 13:20:53.000000', 19, '2025-10-13 13:21:26.000000', 'Áo thun trẻ em họa tiết hoạt hình đáng yêu', 'Áo T-shirt Trẻ Em', 'ACTIVE'),
	(120000, 15, 31, '2025-10-13 13:20:54.000000', 20, '2025-10-13 13:21:27.000000', 'Quần short trẻ em chất liệu cotton thoáng mát', 'Quần Short Trẻ Em', 'ACTIVE'),
	(699000, 15, 49, '2025-10-13 13:20:55.000000', 21, '2025-10-13 13:21:28.000000', 'Balo laptop chống nước, ngăn chứa nhiều', 'Balo Laptop 15 inch', 'ACTIVE'),
	(399000, 15, 44, '2025-10-13 13:20:56.000000', 22, '2025-10-13 13:21:29.000000', 'Túi xách tay nữ da PU cao cấp', 'Túi Xách Tay Nữ', 'ACTIVE'),
	(899000, 15, 50, '2025-10-13 13:20:58.000000', 23, '2025-10-13 13:21:30.000000', 'Balo du lịch 30 lít đa năng', 'Balo Du Lịch 30L', 'ACTIVE'),
	(299000, 15, 58, '2025-10-13 13:20:59.000000', 24, '2025-10-13 13:21:33.000000', 'Nón snapback thêu logo thời trang', 'Nón Snapback', 'ACTIVE'),
	(449000, 15, 60, '2025-10-13 13:21:03.000000', 25, '2025-10-13 13:21:34.000000', 'Thắt lưng nam da thật mặt khóa inox', 'Thắt Lưng Da Nam', 'ACTIVE'),
	(199000, 15, 56, '2025-10-13 13:21:05.000000', 26, '2025-10-13 13:21:35.000000', 'Kính mát chống tia UV hiệu quả', 'Kính Mát UV400', 'ACTIVE');

-- Dumping structure for table defaultdb.product_discounts
CREATE TABLE IF NOT EXISTS `product_discounts` (
  `discount_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  PRIMARY KEY (`discount_id`,`product_id`),
  KEY `FK569m0j2bdds7b29fmo0i9jmvl` (`product_id`),
  CONSTRAINT `FK569m0j2bdds7b29fmo0i9jmvl` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKe9dwb270kgeg654tlm792m16e` FOREIGN KEY (`discount_id`) REFERENCES `discounts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.product_discounts: ~27 rows (approximately)
INSERT INTO `product_discounts` (`discount_id`, `product_id`) VALUES
	(1, 1),
	(2, 2),
	(3, 3),
	(4, 4),
	(2, 5),
	(2, 6),
	(2, 7),
	(2, 8),
	(2, 9),
	(2, 10),
	(3, 11),
	(7, 12),
	(7, 13),
	(7, 14),
	(4, 15),
	(4, 16),
	(2, 17),
	(4, 17),
	(4, 18),
	(3, 19),
	(3, 20),
	(5, 21),
	(5, 22),
	(5, 23),
	(6, 24),
	(6, 25),
	(6, 26);

-- Dumping structure for table defaultdb.product_images
CREATE TABLE IF NOT EXISTS `product_images` (
  `display_order` int(11) DEFAULT NULL,
  `is_main` bit(1) DEFAULT NULL,
  `is_primary` bit(1) DEFAULT NULL,
  `sort_order` int(11) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqnq71xsohugpqwf3c9gxmsuy` (`product_id`),
  CONSTRAINT `FKqnq71xsohugpqwf3c9gxmsuy` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.product_images: ~54 rows (approximately)
INSERT INTO `product_images` (`display_order`, `is_main`, `is_primary`, `sort_order`, `id`, `product_id`, `image_url`) VALUES
	(NULL, b'1', NULL, 0, 1, 1, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 2, 1, 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 2, 3, 1, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 4, 2, 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 5, 2, 'https://images.unsplash.com/photo-1583743814966-8936f37f4d74?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 6, 3, 'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 7, 3, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 8, 4, 'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 9, 4, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 10, 5, 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 11, 5, 'https://images.unsplash.com/photo-1607344645866-009c7d0dce97?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 12, 6, 'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 13, 6, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 14, 7, 'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 15, 7, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 16, 8, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 17, 8, 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 18, 9, 'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 19, 9, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 20, 10, 'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 21, 10, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 22, 11, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 23, 11, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 2, 24, 11, 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 3, 25, 11, 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 26, 12, 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 27, 12, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 2, 28, 12, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 29, 13, 'https://images.unsplash.com/photo-1494955464529-790512c65305?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 30, 13, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 31, 14, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 32, 14, 'https://images.unsplash.com/photo-1520256862855-398228c41684?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 33, 15, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 34, 15, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 35, 16, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 36, 16, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 37, 17, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 38, 17, 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 39, 18, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 40, 18, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 41, 19, 'https://images.unsplash.com/photo-1503944168440-4c421a582519?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 42, 19, 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 43, 21, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 44, 21, 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 45, 22, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 46, 22, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 47, 23, 'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 48, 23, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 49, 24, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 50, 24, 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 51, 25, 'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 52, 25, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop'),
	(NULL, b'1', NULL, 0, 53, 26, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop'),
	(NULL, b'0', NULL, 1, 54, 26, 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&h=800&fit=crop');

-- Dumping structure for table defaultdb.product_variants
CREATE TABLE IF NOT EXISTS `product_variants` (
  `price` double DEFAULT NULL,
  `stock_quantity` int(11) DEFAULT NULL,
  `color_id` bigint(20) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) DEFAULT NULL,
  `size_id` bigint(20) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `material` varchar(255) DEFAULT NULL,
  `sku` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKq935p2d1pbjm39n0063ghnfgn` (`sku`),
  KEY `FKnps1p21p470pq59fdj0ddwnrs` (`color_id`),
  KEY `FKosqitn4s405cynmhb87lkvuau` (`product_id`),
  KEY `FKt7j608wes333gojuoh0f8l488` (`size_id`),
  CONSTRAINT `FKnps1p21p470pq59fdj0ddwnrs` FOREIGN KEY (`color_id`) REFERENCES `colors` (`id`),
  CONSTRAINT `FKosqitn4s405cynmhb87lkvuau` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKt7j608wes333gojuoh0f8l488` FOREIGN KEY (`size_id`) REFERENCES `sizes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.product_variants: ~66 rows (approximately)
INSERT INTO `product_variants` (`price`, `stock_quantity`, `color_id`, `id`, `product_id`, `size_id`, `image_url`, `material`, `sku`) VALUES
	(450000, 60, 4, 1, 1, 3, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop', 'Cotton Dri-FIT', 'NIKE-TS-BLK-M'),
	(450000, 50, 4, 2, 1, 4, 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&h=800&fit=crop', 'Cotton Dri-FIT', 'NIKE-TS-BLK-L'),
	(450000, 55, 5, 3, 1, 3, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=800&fit=crop', 'Cotton Dri-FIT', 'NIKE-TS-WHT-M'),
	(450000, 45, 5, 4, 1, 4, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=800&fit=crop', 'Cotton Dri-FIT', 'NIKE-TS-WHT-L'),
	(420000, 70, 4, 5, 2, 3, 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&h=800&fit=crop', '100% Cotton', 'ADIDAS-TS-BLK-M'),
	(420000, 65, 4, 6, 2, 4, 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&h=800&fit=crop', '100% Cotton', 'ADIDAS-TS-BLK-L'),
	(420000, 50, 13, 7, 2, 3, 'https://images.unsplash.com/photo-1583743814966-8936f37f4d74?w=800&h=800&fit=crop', '100% Cotton', 'ADIDAS-TS-NAVY-M'),
	(420000, 40, 13, 8, 2, 4, 'https://images.unsplash.com/photo-1583743814966-8936f37f4d74?w=800&h=800&fit=crop', '100% Cotton', 'ADIDAS-TS-NAVY-L'),
	(299000, 120, 4, 9, 3, 3, 'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&h=800&fit=crop', '100% Cotton Premium', 'CM-TS-BLK-M'),
	(299000, 110, 4, 10, 3, 4, 'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&h=800&fit=crop', '100% Cotton Premium', 'CM-TS-BLK-L'),
	(299000, 100, 5, 11, 3, 3, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop', '100% Cotton Premium', 'CM-TS-WHT-M'),
	(299000, 90, 6, 12, 3, 4, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop', '100% Cotton Premium', 'CM-TS-GRY-L'),
	(250000, 80, 12, 13, 4, 3, 'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&h=800&fit=crop', 'Cotton mềm', 'LOCAL-TS-BEI-M'),
	(250000, 70, 12, 14, 4, 4, 'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&h=800&fit=crop', 'Cotton mềm', 'LOCAL-TS-BEI-L'),
	(250000, 90, 4, 15, 4, 3, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop', 'Cotton mềm', 'LOCAL-TS-BLK-M'),
	(1200000, 40, 5, 16, 5, 3, 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&h=800&fit=crop', 'Pique Cotton', 'LACOSTE-PO-WHT-M'),
	(1200000, 35, 5, 17, 5, 4, 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&h=800&fit=crop', 'Pique Cotton', 'LACOSTE-PO-WHT-L'),
	(1200000, 30, 13, 18, 5, 3, 'https://images.unsplash.com/photo-1607344645866-009c7d0dce97?w=800&h=800&fit=crop', 'Pique Cotton', 'LACOSTE-PO-NAVY-M'),
	(1500000, 30, 4, 19, 6, 3, 'https://images.unsplash.com/photo-1607344645866-009c7d0dce97?w=800&h=800&fit=crop', 'Pique Cotton', 'RL-PO-BLK-M'),
	(1500000, 25, 4, 20, 6, 4, 'https://images.unsplash.com/photo-1607344645866-009c7d0dce97?w=800&h=800&fit=crop', 'Pique Cotton', 'RL-PO-BLK-L'),
	(1500000, 20, 1, 21, 6, 3, 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&h=800&fit=crop', 'Pique Cotton', 'RL-PO-RED-M'),
	(490000, 80, 6, 22, 7, 4, 'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&h=800&fit=crop', 'Cotton Pique Dry', 'UNIQLO-PO-GRY-L'),
	(490000, 70, 6, 23, 7, 5, 'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&h=800&fit=crop', 'Cotton Pique Dry', 'UNIQLO-PO-GRY-XL'),
	(490000, 90, 5, 24, 7, 4, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop', 'Cotton Pique Dry', 'UNIQLO-PO-WHT-L'),
	(599000, 50, 2, 25, 8, 3, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop', '98% Cotton, 2% Elastane', 'JEAN-SLIM-BLUE-M'),
	(599000, 45, 2, 26, 8, 4, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop', '98% Cotton, 2% Elastane', 'JEAN-SLIM-BLUE-L'),
	(599000, 40, 4, 27, 8, 3, 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&h=800&fit=crop', '98% Cotton, 2% Elastane', 'JEAN-SLIM-BLK-M'),
	(549000, 60, 2, 28, 9, 4, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop', '100% Cotton Denim', 'JEAN-STR-BLUE-L'),
	(549000, 55, 2, 29, 9, 5, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop', '100% Cotton Denim', 'JEAN-STR-BLUE-XL'),
	(699000, 30, 2, 30, 10, 3, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop', 'Denim', 'JEAN-RIP-BLUE-M'),
	(699000, 25, 2, 31, 10, 4, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop', 'Denim', 'JEAN-RIP-BLUE-L'),
	(2500000, 30, 5, 32, 11, 11, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop', 'Da synthetic', 'NIKE-AF1-WHT-40'),
	(2500000, 28, 5, 33, 11, 12, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop', 'Da synthetic', 'NIKE-AF1-WHT-41'),
	(2500000, 22, 5, 34, 11, 13, 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&h=800&fit=crop', 'Da synthetic', 'NIKE-AF1-WHT-42'),
	(2500000, 18, 4, 35, 11, 12, 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=800&fit=crop', 'Da synthetic', 'NIKE-AF1-BLK-41'),
	(2200000, 25, 3, 36, 12, 11, 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&h=800&fit=crop', 'Da thật', 'ADIDAS-SS-GRN-40'),
	(2200000, 20, 3, 37, 12, 12, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop', 'Da thật', 'ADIDAS-SS-GRN-41'),
	(2200000, 18, 3, 38, 12, 13, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop', 'Da thật', 'ADIDAS-SS-GRN-42'),
	(1500000, 40, 4, 39, 13, 11, 'https://images.unsplash.com/photo-1494955464529-790512c65305?w=800&h=800&fit=crop', 'Vải Canvas', 'CONV-CTAS-BLK-40'),
	(1500000, 35, 4, 40, 13, 12, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&h=800&fit=crop', 'Vải Canvas', 'CONV-CTAS-BLK-41'),
	(1500000, 38, 5, 41, 13, 11, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&h=800&fit=crop', 'Vải Canvas', 'CONV-CTAS-WHT-40'),
	(1800000, 45, 4, 42, 14, 12, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=800&h=800&fit=crop', 'Vải Canvas & Da lộn', 'VANS-OS-BLK-41'),
	(1800000, 40, 4, 43, 14, 13, 'https://images.unsplash.com/photo-1520256862855-398228c41684?w=800&h=800&fit=crop', 'Vải Canvas & Da lộn', 'VANS-OS-BLK-42'),
	(199000, 100, 5, 44, 15, 2, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop', 'Cotton', 'YAME-TSW-WHT-S'),
	(199000, 110, 5, 45, 15, 3, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop', 'Cotton', 'YAME-TSW-WHT-M'),
	(199000, 80, 7, 46, 15, 2, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=800&fit=crop', 'Cotton', 'YAME-TSW-PNK-S'),
	(199000, 85, 7, 47, 15, 3, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=800&fit=crop', 'Cotton', 'YAME-TSW-PNK-M'),
	(399000, 50, 8, 48, 16, 2, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop', 'Vải voan', 'ZARA-DRESS-YLW-S'),
	(399000, 45, 8, 49, 16, 3, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop', 'Vải voan', 'ZARA-DRESS-YLW-M'),
	(499000, 60, 2, 50, 17, 2, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=800&fit=crop', 'Denim co giãn', 'HM-JEANW-BLUE-S'),
	(499000, 55, 2, 51, 17, 3, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=800&fit=crop', 'Denim co giãn', 'HM-JEANW-BLUE-M'),
	(799000, 40, 4, 52, 18, 3, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop', 'Vải Kate', 'ZARA-BLAZER-BLK-M'),
	(799000, 35, 12, 53, 18, 3, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop', 'Vải Kate', 'ZARA-BLAZER-BEI-M'),
	(150000, 70, 1, 54, 19, 2, 'https://images.unsplash.com/photo-1503944168440-4c421a582519?w=800&h=800&fit=crop', '100% Cotton', 'LOCAL-TSK-RED-S'),
	(150000, 65, 2, 55, 19, 2, 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&h=800&fit=crop', '100% Cotton', 'LOCAL-TSK-BLUE-S'),
	(120000, 80, 6, 56, 20, 3, 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&h=800&fit=crop', 'Cotton thun', 'LOCAL-SHORTK-GRY-M'),
	(699000, 50, 4, 57, 21, 8, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop', 'Vải Polyester chống nước', 'LOCAL-BP-LAP-BLK'),
	(699000, 40, 6, 58, 21, 8, 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&h=800&fit=crop', 'Vải Polyester chống nước', 'LOCAL-BP-LAP-GRY'),
	(399000, 60, 9, 59, 22, 8, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop', 'Da PU cao cấp', 'LOCAL-BAG-BRW'),
	(399000, 70, 4, 60, 22, 8, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop', 'Da PU cao cấp', 'LOCAL-BAG-BLK'),
	(899000, 30, 13, 61, 23, 8, 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&h=800&fit=crop', 'Vải dù', 'LOCAL-BP-TRV-NAVY'),
	(299000, 100, 4, 62, 24, 8, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop', 'Vải Kaki', 'LOCAL-CAP-BLK'),
	(299000, 80, 1, 63, 24, 8, 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&h=800&fit=crop', 'Vải Kaki', 'LOCAL-CAP-RED'),
	(449000, 70, 9, 64, 25, 8, 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&h=800&fit=crop', 'Da thật', 'LOCAL-BELT-BRW'),
	(449000, 90, 4, 65, 25, 8, 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&h=800&fit=crop', 'Da thật', 'LOCAL-BELT-BLK'),
	(199000, 150, 4, 66, 26, 8, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop', 'Nhựa Acetate', 'LOCAL-GLASS-BLK');

-- Dumping structure for table defaultdb.refresh_tokens
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `expiry_date` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKghpmfn23vmxfu3spu3lfg4r2d` (`token`),
  KEY `FK1lih5y2npsf8u5o3vhdb9y0os` (`user_id`),
  CONSTRAINT `FK1lih5y2npsf8u5o3vhdb9y0os` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.refresh_tokens: ~0 rows (approximately)

-- Dumping structure for table defaultdb.reset_password_tokens
CREATE TABLE IF NOT EXISTS `reset_password_tokens` (
  `created_at` datetime(6) DEFAULT NULL,
  `expiry_date` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKt6mqh6nkd63pwf41gqycq83hv` (`token`),
  KEY `FKnwk79win0k7k6tlb6imjninfu` (`user_id`),
  CONSTRAINT `FKnwk79win0k7k6tlb6imjninfu` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.reset_password_tokens: ~0 rows (approximately)

-- Dumping structure for table defaultdb.reviews
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) DEFAULT NULL,
  `rating` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpl51cejpw4gy5swfar8br9ngi` (`product_id`),
  KEY `FKcgy7qjc1r99dp117y9en6lxye` (`user_id`),
  CONSTRAINT `FKcgy7qjc1r99dp117y9en6lxye` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKpl51cejpw4gy5swfar8br9ngi` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.reviews: ~12 rows (approximately)
INSERT INTO `reviews` (`id`, `product_id`, `rating`, `user_id`, `comment`) VALUES
	(1, 11, 5, 1, 'Giày rất đẹp và chất lượng, đi rất êm chân. Giao hàng nhanh!'),
	(2, 11, 4, 2, 'Giày đẹp nhưng hơi chật, nên lên size. Nhìn chung ok.'),
	(3, 1, 5, 2, 'Áo đẹp, chất liệu mềm mại, thấm hút mồ hôi tốt'),
	(4, 1, 4, 1, 'Form áo vừa, màu đẹp. Giá hơi cao nhưng chất lượng xứng đáng'),
	(5, 12, 5, 1, 'Giày kinh điển, đi được nhiều năm vẫn đẹp'),
	(6, 12, 4, 2, 'Đẹp và bền, nhưng cần thời gian break-in'),
	(7, 16, 5, 2, 'Váy đẹp lắm, chất vải mềm mại, họa tiết xinh xắn'),
	(8, 16, 4, 1, 'Đẹp nhưng hơi dài với mình. Chất lượng ok'),
	(9, 3, 4, 1, 'Áo đẹp, giá hợp lý. Chất liệu cotton thoáng mát'),
	(10, 3, 5, 2, 'Local brand nhưng chất lượng không thua kém gì hàng ngoại'),
	(11, 20, 5, 2, 'Balo rộng rãi, nhiều ngăn tiện lợi. Chất liệu chống nước tốt'),
	(12, 20, 4, 1, 'Đẹp và tiện dụng, phù hợp đi làm');

-- Dumping structure for table defaultdb.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `description` varchar(255) DEFAULT NULL,
  `name` enum('ADMIN','CUSTOMER','STAFF') NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.roles: ~3 rows (approximately)
INSERT INTO `roles` (`description`, `name`) VALUES
	('Administrator role', 'ADMIN'),
	('Customer role', 'CUSTOMER'),
	('Staff role', 'STAFF');

-- Dumping structure for table defaultdb.roles_permissions
CREATE TABLE IF NOT EXISTS `roles_permissions` (
  `permissions_name` varchar(255) NOT NULL,
  `role_name` enum('ADMIN','CUSTOMER','STAFF') NOT NULL,
  PRIMARY KEY (`permissions_name`,`role_name`),
  KEY `FK6nw4jrj1tuu04j9rk7xwfssd6` (`role_name`),
  CONSTRAINT `FK6nw4jrj1tuu04j9rk7xwfssd6` FOREIGN KEY (`role_name`) REFERENCES `roles` (`name`),
  CONSTRAINT `FK9u1xpvjxbdnkca024o6fyr7uu` FOREIGN KEY (`permissions_name`) REFERENCES `permissions` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.roles_permissions: ~0 rows (approximately)

-- Dumping structure for table defaultdb.shippings
CREATE TABLE IF NOT EXISTS `shippings` (
  `delivered_at` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) NOT NULL,
  `shipped_at` datetime(6) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `receiver_name` varchar(255) DEFAULT NULL,
  `receiver_phone` varchar(255) DEFAULT NULL,
  `tracking_code` varchar(255) DEFAULT NULL,
  `ward` varchar(255) DEFAULT NULL,
  `method` enum('GHN','GHTK','GRABEXPRESS','OTHER','SHOPEEEXPRESS','VIETTEL') DEFAULT NULL,
  `status` enum('DELIVERED','FAILED','PENDING','SHIPPING') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKtu4d98vdobypyhhq3d7am3qo` (`order_id`),
  CONSTRAINT `FK8bxet17ivvhhma7tid6k0gr8o` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.shippings: ~1 rows (approximately)
INSERT INTO `shippings` (`delivered_at`, `id`, `order_id`, `shipped_at`, `address`, `city`, `district`, `receiver_name`, `receiver_phone`, `tracking_code`, `ward`, `method`, `status`) VALUES
	(NULL, 1, 1, NULL, 'Phòng, Lô, Chung cư, Đường', 'Thành phố Hồ Chí Minh', 'Quận', 'Nguyễn', '0912345678', NULL, 'Phường', 'GHTK', 'PENDING');

-- Dumping structure for table defaultdb.sizes
CREATE TABLE IF NOT EXISTS `sizes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` text DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.sizes: ~15 rows (approximately)
INSERT INTO `sizes` (`id`, `description`, `name`) VALUES
	(1, 'Extra Small - Rất nhỏ', 'XS'),
	(2, 'Small - Nhỏ', 'S'),
	(3, 'Medium - Vừa', 'M'),
	(4, 'Large - Lớn', 'L'),
	(5, 'Extra Large - Rất lớn', 'XL'),
	(6, 'Double Extra Large - Cực lớn', 'XXL'),
	(7, '3XL - Cực kỳ lớn', 'XXXL'),
	(8, 'Một size phù hợp nhiều dáng người', 'Free Size'),
	(9, 'Size giày 38', '38'),
	(10, 'Size giày 39', '39'),
	(11, 'Size giày 40', '40'),
	(12, 'Size giày 41', '41'),
	(13, 'Size giày 42', '42'),
	(14, 'Size giày 43', '43'),
	(15, 'Size giày 44', '44');

-- Dumping structure for table defaultdb.users
CREATE TABLE IF NOT EXISTS `users` (
  `date_of_birth` date DEFAULT NULL,
  `enabled` bit(1) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `last_login` datetime(6) DEFAULT NULL,
  `updated_date` datetime(6) DEFAULT NULL,
  `avatar_url` varchar(300) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('DISABLED','OFFLINE','ONLINE') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UK9q63snka3mdh91as4io72espi` (`phone_number`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.users: ~2 rows (approximately)
INSERT INTO `users` (`date_of_birth`, `enabled`, `is_active`, `created_date`, `id`, `last_login`, `updated_date`, `avatar_url`, `address`, `email`, `full_name`, `password`, `phone_number`, `username`, `status`) VALUES
	(NULL, b'1', b'1', '2025-10-13 13:14:29.537000', 1, NULL, '2025-10-13 13:14:29.537000', NULL, NULL, 'danghiemnguyen@gmail.com', NULL, '$2a$10$UFKXBw5ZUlov8RoDoYoTQ.tUs3ph6f78bIIaXoXBZb.7VZ/zmxMtC', NULL, 'admin', NULL),
	(NULL, b'1', b'1', '2025-10-13 13:14:29.639000', 2, NULL, '2025-10-13 13:14:29.639000', NULL, NULL, 'danguym.12.12.2k3@gmail.com', NULL, '$2a$10$qqPY2nbSsmIrr1asMjVz9eFEwoBYk42rwGPuSBnG/7nzGCM.RvvZW', NULL, 'danguym', NULL);

-- Dumping structure for table defaultdb.users_roles
CREATE TABLE IF NOT EXISTS `users_roles` (
  `user_id` bigint(20) NOT NULL,
  `roles_name` enum('ADMIN','CUSTOMER','STAFF') NOT NULL,
  PRIMARY KEY (`user_id`,`roles_name`),
  KEY `FKmi9sfx618v14gm89cyw408hqu` (`roles_name`),
  CONSTRAINT `FK2o0jvgh89lemvvo17cbqvdxaa` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKmi9sfx618v14gm89cyw408hqu` FOREIGN KEY (`roles_name`) REFERENCES `roles` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.users_roles: ~2 rows (approximately)
INSERT INTO `users_roles` (`user_id`, `roles_name`) VALUES
	(1, 'ADMIN'),
	(2, 'CUSTOMER');

-- Dumping structure for table defaultdb.user_vouchers
CREATE TABLE IF NOT EXISTS `user_vouchers` (
  `usage_count` int(11) NOT NULL,
  `acquired_at` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `voucher_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK90ahc2var0yrghyxr9tapdokg` (`user_id`),
  KEY `FK40ig7khk2v79rbqaj98mf1g2q` (`voucher_id`),
  CONSTRAINT `FK40ig7khk2v79rbqaj98mf1g2q` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`),
  CONSTRAINT `FK90ahc2var0yrghyxr9tapdokg` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.user_vouchers: ~0 rows (approximately)

-- Dumping structure for table defaultdb.vouchers
CREATE TABLE IF NOT EXISTS `vouchers` (
  `active` bit(1) DEFAULT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `max_discount_value` decimal(38,2) DEFAULT NULL,
  `min_value_order` decimal(38,2) DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `usage_per_user` int(11) DEFAULT NULL,
  `end_date` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `start_date` datetime(6) DEFAULT NULL,
  `code` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `discount_type` enum('FIXED','PERCENT') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK30ftp2biebbvpik8e49wlmady` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table defaultdb.vouchers: ~0 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
