/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for tmdt
CREATE DATABASE IF NOT EXISTS `tmdt` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `tmdt`;

-- Dumping structure for table tmdt.category
CREATE TABLE IF NOT EXISTS `category` (
  `CategoryID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`CategoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tmdt.category: ~6 rows (approximately)
INSERT IGNORE INTO `category` (`CategoryID`, `Name`, `description`) VALUES
	(1, 'IELTS', 'International English Language Testing System courses'),
	(2, 'Business English', 'Professional English for workplace communication'),
	(3, 'Kids English', 'English courses designed for children'),
	(4, 'Conversation', 'Conversational English and speaking practice'),
	(5, 'Grammar', 'English grammar fundamentals and advanced topics'),
	(6, 'General English', 'Comprehensive English language learning');

-- Dumping structure for table tmdt.course
CREATE TABLE IF NOT EXISTS `course` (
  `courseid` int(11) NOT NULL AUTO_INCREMENT,
  `categoryid` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `price` double DEFAULT NULL,
  `rating` double DEFAULT NULL,
  `sellerid` int(11) DEFAULT NULL,
  `status` bit(1) DEFAULT NULL,
  PRIMARY KEY (`courseid`),
  KEY `FK_course_category` (`categoryid`),
  KEY `FK_course_users` (`sellerid`),
  CONSTRAINT `FK_course_category` FOREIGN KEY (`categoryid`) REFERENCES `category` (`CategoryID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_course_users` FOREIGN KEY (`sellerid`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tmdt.course: ~15 rows (approximately)
INSERT IGNORE INTO `course` (`courseid`, `categoryid`, `description`, `name`, `price`, `rating`, `sellerid`, `status`) VALUES
	(1, 1, 'Master each IELTS skill with expert tips. Comprehensive preparation for all four skills: listening, reading, writing, and speaking.', 'IELTS 7.0+ Intensive Course', 199.99, 4.8, 1, b'1'),
	(2, 1, 'Improve your TOEIC score in 30 days with focused practice and strategies.', 'TOEIC Listening & Reading Pro', 149.99, 4.7, 3, b'1'),
	(3, 5, 'Learn English grammar from zero to hero with clear explanations and practical exercises.', 'English Grammar Bootcamp', 89.99, 4.7, 4, b'1'),
	(4, 2, 'Communicate professionally in the workplace with confidence and clarity.', 'Business English for Meetings', 129.99, 4.6, 1, b'1'),
	(5, 1, 'Advanced IELTS preparation for students targeting band 8+. Includes mock tests and personalized feedback.', 'IELTS Academic Writing Mastery', 249.99, 4.9, 2, b'1'),
	(6, 2, 'Master business presentations and public speaking in English.', 'Business Presentation Skills', 179.99, 4.5, 3, b'1'),
	(7, 3, 'Fun and interactive English lessons for children aged 4-8. Games, songs, and stories.', 'English for Kids - Beginner', 79.99, 4.9, 1, b'1'),
	(8, 3, 'Advanced English course for children aged 9-12 with reading and writing focus.', 'English for Kids - Advanced', 99.99, 4.8, 2, b'1'),
	(9, 4, 'Improve your English conversation skills for daily life and travel situations.', 'Everyday English Conversation', 69.99, 4.4, 4, b'1'),
	(10, 4, 'Advanced conversation practice with native speakers and cultural insights.', 'Advanced English Speaking', 119.99, 4.6, 3, b'1'),
	(11, 5, 'Master English tenses, sentence structure, and advanced grammar rules.', 'Complete Grammar Guide', 59.99, 4.5, 1, b'1'),
	(12, 6, 'Comprehensive English course covering all skills for intermediate learners.', 'General English Intermediate', 139.99, 4.7, 2, b'1'),
	(13, 6, 'Advanced English course for upper-intermediate to advanced learners.', 'General English Advanced', 169.99, 4.8, 4, b'1'),
	(14, 2, 'English for international business, negotiations, and professional communication.', 'International Business English', 199.99, 4.7, 3, b'1'),
	(15, 4, 'Practice English pronunciation and accent reduction with expert guidance.', 'Pronunciation & Accent Training', 89.99, 4.3, 1, b'1');

-- Dumping structure for table tmdt.coursedetail
CREATE TABLE IF NOT EXISTS `coursedetail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `duration` int(11) DEFAULT NULL,
  `episode_number` int(11) DEFAULT NULL,
  `is_preview` bit(1) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `courseid` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_coursedetail_course` (`course_id`) USING BTREE,
  CONSTRAINT `FKthsgs79olf7laaprmy6qqydb4` FOREIGN KEY (`course_id`) REFERENCES `course` (`courseid`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tmdt.coursedetail: ~9 rows (approximately)
INSERT IGNORE INTO `coursedetail` (`id`, `duration`, `episode_number`, `is_preview`, `link`, `course_id`, `courseid`, `name`) VALUES
	(1, 15, 1, b'1', 'https://www.youtube.com/embed/xNRJwmlRBNU?si=Uoyi6kzsoDLtvVZ9', 1, NULL, '1. Intro to TOEIC'),
	(2, 22, 2, b'0', 'https://www.youtube.com/embed/5MgBikgcWnY', 1, NULL, 'Part 4: Lectures'),
	(3, 19, 3, b'0', 'https://www.youtube.com/embed/C0DPdy98e4c', 1, NULL, 'TOEIC Vocabulary'),
	(4, 12, 1, b'1', 'https://www.youtube.com/embed/hTvJoYnpeRQ', 2, NULL, 'Part 1: Photos'),
	(5, 20, 2, b'0', 'https://www.youtube.com/embed/-GR52szEdAg', 2, NULL, 'Part 5: Grammar'),
	(6, 10, 1, b'1', 'https://www.youtube.com/embed/HZQb34t9BzE', 3, NULL, 'Part 2: Q&A'),
	(7, 15, 2, b'0', 'https://www.youtube.com/embed/bJzb-RuUcMU', 3, NULL, 'Part 6: Fill Blanks'),
	(8, 17, 1, b'1', 'https://www.youtube.com/embed/ZVznzY7EjuY', 4, NULL, 'Part 3: Talks'),
	(9, 25, 2, b'0', 'https://www.youtube.com/embed/QH2-TGUlwu4', 4, NULL, 'Part 7: Reading');

-- Dumping structure for table tmdt.course_ratings
CREATE TABLE IF NOT EXISTS `course_ratings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tmdt.course_ratings: ~2 rows (approximately)
INSERT IGNORE INTO `course_ratings` (`id`, `course_id`, `created_at`, `rating`, `user_id`) VALUES
	(1, 1, NULL, 4, 4),
	(2, 2, NULL, 5, 4);

-- Dumping structure for table tmdt.favorite
CREATE TABLE IF NOT EXISTS `favorite` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_course` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKm6fwp0ekfhkebulnggy3qa1xo` (`id_course`),
  KEY `FKe8hnatflq4vaedin0dlkbjp2l` (`id_user`),
  CONSTRAINT `FKe8hnatflq4vaedin0dlkbjp2l` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`),
  CONSTRAINT `FKm6fwp0ekfhkebulnggy3qa1xo` FOREIGN KEY (`id_course`) REFERENCES `course` (`courseid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tmdt.favorite: ~2 rows (approximately)
INSERT IGNORE INTO `favorite` (`id`, `id_course`, `id_user`) VALUES
	(1, 1, 1),
	(2, 2, 1);

-- Dumping structure for table tmdt.invalidated_token
CREATE TABLE IF NOT EXISTS `invalidated_token` (
  `id` varchar(255) NOT NULL,
  `expiry_time` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tmdt.invalidated_token: ~8 rows (approximately)
INSERT IGNORE INTO `invalidated_token` (`id`, `expiry_time`) VALUES
	('29b56587-d913-4b25-a989-c0193efd9dbf', '2025-06-17 20:37:16.000000'),
	('2fc24027-43bc-414b-b66d-c9d335a41977', '2025-06-18 12:50:50.000000'),
	('af73a0b7-45d3-46cf-aa7a-ba1861d3bed0', '2025-06-18 21:40:07.000000'),
	('b785b178-8c2b-4803-81c6-5eadf5631d25', '2025-06-21 17:55:19.000000'),
	('c1a8419d-f520-4351-ac66-488c090308b3', '2025-06-21 17:17:59.000000'),
	('e5a7f971-871e-46d9-ae76-89da1ba7ecd6', '2025-06-17 20:41:51.000000'),
	('eb628ac3-d740-496b-b7cd-e85876c1b9cf', '2025-06-18 14:27:43.000000'),
	('f3412550-80d7-4585-a058-dd3e3a8e098a', '2025-06-18 22:13:42.000000');

-- Dumping structure for table tmdt.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_course` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmbmh1nnks3isuyeuw7grhix56` (`id_course`),
  KEY `FKtb6jdc061vu6ydv1445lrigtb` (`id_user`),
  CONSTRAINT `FKmbmh1nnks3isuyeuw7grhix56` FOREIGN KEY (`id_course`) REFERENCES `course` (`courseid`),
  CONSTRAINT `FKtb6jdc061vu6ydv1445lrigtb` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tmdt.orders: ~4 rows (approximately)
INSERT IGNORE INTO `orders` (`id`, `id_course`, `id_user`) VALUES
	(1, 1, 4),
	(2, 2, 4),
	(3, 3, 4),
	(4, 4, 4);

-- Dumping structure for table tmdt.report
CREATE TABLE IF NOT EXISTS `report` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `category` varchar(255) DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `detail` varchar(255) DEFAULT NULL,
  `priority` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKcol89iwig6opdvt9vhy6kpjcr` (`course_id`),
  KEY `FKq50wsn94sc3mi90gtidk0k34a` (`user_id`),
  CONSTRAINT `FKcol89iwig6opdvt9vhy6kpjcr` FOREIGN KEY (`course_id`) REFERENCES `course` (`courseid`),
  CONSTRAINT `FKq50wsn94sc3mi90gtidk0k34a` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tmdt.report: ~2 rows (approximately)
INSERT IGNORE INTO `report` (`id`, `category`, `date`, `detail`, `priority`, `status`, `subject`, `course_id`, `user_id`) VALUES
	(1, 'Video', '2025-06-18 12:31:09.000000', 'Bài 3 bị lỗi 404', 'High', 'pending', 'Không xem được video', 1, 4),
	(2, 'Video', '2025-06-18 12:57:12.000000', 'Bài 3 bị lỗi 404', 'High', 'pending', 'Không xem được video', 1, 4),
	(3, 'Payment Issue', '2025-06-18 13:45:20.000000', 'qqqq', 'high', 'pending', 'Test', 3, 4);

-- Dumping structure for table tmdt.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tmdt.roles: ~3 rows (approximately)
INSERT IGNORE INTO `roles` (`name`, `description`) VALUES
	('ADMIN', 'Admin role'),
	('SELLER', 'Seller role'),
	('USER', 'User role');

-- Dumping structure for table tmdt.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `certificate` varchar(255) DEFAULT NULL,
  `gender` varchar(45) DEFAULT NULL,
  `introduce` varchar(225) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tmdt.users: ~4 rows (approximately)
INSERT IGNORE INTO `users` (`id`, `active`, `avatar`, `email`, `fullname`, `password`, `phone`, `username`, `certificate`, `gender`, `introduce`) VALUES
	(1, b'0', 'https://media.them.us/photos/66d08156698a9d7d109eaf13/4:3/w_900,h_675,c_limit/english-teacher.jpg', 'tamle7723@gmail.com', 'Tâm Lê', '$2a$10$UW74OxRZgZpJ5QhjgY37Iucd6KN4jQL9whcqOJobxo0P3eEod2.aS', '0911281672', 'admin', 'ielts 8.0,Toeic 900', 'Male', 'Tôi là giáo viên tiếng Anh với chứng chỉ IELTS 8.0 và TOEIC 900, có nhiều kinh nghiệm trong việc giảng dạy luyện thi và giao tiếp cho học viên ở nhiều trình độ khác nhau. Phương pháp giảng dạy của tôi tập trung vào tư duy'),
	(2, b'1', NULL, 'thuho@121mple.com', 'Nguyen', '$2a$10$93Uf2ab1kEs1cc9UB6.pd.i6D9YNwFPejpteRpTg..dkAcmB9KR.K', '0911281672', 'thao duvy', 'TOEIC 1000', 'Female', '"Tôi là giáo viên tiếng Anh với chứng chỉ TOEIC 1000/990, có kinh nghiệm giảng dạy và luyện thi TOEIC hiệu quả cho nhiều đối tượng học viên."'),
	(3, b'1', NULL, 'quoc@gmail.com', 'Thao Tran', '$2a$10$SDYIb.mG4WT6IOcWwBPXXOX7sqo2LVNzyqK9ns3YE7lTSXeRxJJFS', '0911281672', 'quocthai261', 'ILET 8.0', 'Male', '"Tôi là giáo viên tiếng Anh với chứng chỉ TOEIC 1000/990, có kinh nghiệm giảng dạy và luyện thi TOEIC hiệu quả cho nhiều đối tượng học viên."'),
	(4, b'1', NULL, 'quoc2612003@gmail.com', 'Quốc Thái', '$2a$10$.Ztr.3pfAvySVVXjQi8IPeXy73plvp1c2Gm12LV3fgjZ4NiuKIO5y', '0879582604', 'quoc@gmail.com', NULL, NULL, NULL);

-- Dumping structure for table tmdt.users_roles
CREATE TABLE IF NOT EXISTS `users_roles` (
  `user_id` int(11) NOT NULL,
  `roles_name` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`,`roles_name`),
  KEY `FKmi9sfx618v14gm89cyw408hqu` (`roles_name`),
  CONSTRAINT `FK2o0jvgh89lemvvo17cbqvdxaa` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKmi9sfx618v14gm89cyw408hqu` FOREIGN KEY (`roles_name`) REFERENCES `roles` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tmdt.users_roles: ~4 rows (approximately)
INSERT IGNORE INTO `users_roles` (`user_id`, `roles_name`) VALUES
	(1, 'ADMIN'),
	(2, 'SELLER'),
	(3, 'USER'),
	(4, 'ADMIN');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */; 