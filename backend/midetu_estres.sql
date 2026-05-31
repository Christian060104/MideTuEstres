-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: midetu_estres
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` varchar(50) NOT NULL,
  `description` text,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
INSERT INTO `activity_logs` VALUES (2,NULL,'user_registered','Usuario registrado: L22360885@tehuacan.tecnm.mx','192.168.65.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-13 04:40:01'),(3,NULL,'user_login','Inicio de sesión: l22360885@tehuacan.tecnm.mx','192.168.65.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-13 04:40:21'),(4,3,'user_registered','Usuario registrado: L22361010@tehuacan.tecnm.mx','192.168.65.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-13 04:48:40'),(5,3,'user_login','Inicio de sesión: l22361010@tehuacan.tecnm.mx','192.168.65.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-13 04:48:53'),(6,4,'user_registered','Usuario registrado: L22360885@tehuacan.tecnm.mx','192.168.65.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-15 22:48:44'),(7,4,'user_login','Inicio de sesión: l22360885@tehuacan.tecnm.mx','192.168.65.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-15 22:49:02'),(8,4,'user_login','Inicio de sesión: l22360885@tehuacan.tecnm.mx','192.168.65.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-15 23:23:06'),(9,4,'user_login','Inicio de sesión: l22360885@tehuacan.tecnm.mx','192.168.65.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-15 23:27:50'),(10,4,'user_login','Inicio de sesión: l22360885@tehuacan.tecnm.mx','192.168.65.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-15 23:51:21'),(11,4,'measurement_created','Nueva medición: 5 puntos (bajo)','192.168.65.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-15 23:51:37'),(12,4,'user_login','Inicio de sesión: l22360885@tehuacan.tecnm.mx','192.168.65.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-19 04:10:42'),(13,4,'measurement_created','Nueva medición: 7 puntos (bajo)','192.168.65.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-19 04:10:59');
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `general_statistics`
--

DROP TABLE IF EXISTS `general_statistics`;
/*!50001 DROP VIEW IF EXISTS `general_statistics`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `general_statistics` AS SELECT 
 1 AS `total_users`,
 1 AS `new_users_30_days`,
 1 AS `active_users_7_days`,
 1 AS `active_percentage`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `resources`
--

DROP TABLE IF EXISTS `resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resources` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `type` enum('video','article','exercise','audio') NOT NULL,
  `category` enum('relajacion','tiempo','motivacion','tecnicas','consejos') NOT NULL,
  `url` varchar(500) NOT NULL,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `duration_minutes` int DEFAULT NULL,
  `difficulty` enum('principiante','intermedio','avanzado') DEFAULT 'principiante',
  `is_active` tinyint(1) DEFAULT '1',
  `view_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_category` (`category`),
  KEY `idx_difficulty` (`difficulty`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_view_count` (`view_count`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resources`
--

LOCK TABLES `resources` WRITE;
/*!40000 ALTER TABLE `resources` DISABLE KEYS */;
INSERT INTO `resources` VALUES (1,'TÃ©cnicas de RespiraciÃ³n Profunda','Aprende ejercicios de respiraciÃ³n para reducir el estrÃ©s inmediatamente','video','relajacion','/videos/respiracion.mp4','/images/respiracion.jpg',15,'principiante',1,0,'2026-05-12 13:52:09','2026-05-12 13:52:09'),(2,'GestiÃ³n del Tiempo para Estudiantes','Estrategias efectivas para organizar tu tiempo de estudio','video','tiempo','/videos/gestion_tiempo.mp4','/images/gestion_tiempo.jpg',20,'principiante',1,0,'2026-05-12 13:52:09','2026-05-12 13:52:09'),(3,'MeditaciÃ³n Guiada para Estudiantes','SesiÃ³n de meditaciÃ³n de 10 minutos para calmar la mente','audio','relajacion','/audio/meditacion.mp3','/images/meditacion.jpg',10,'principiante',1,0,'2026-05-12 13:52:09','2026-05-12 13:52:09'),(4,'TÃ©cnicas de Estudio Efectivas','MÃ©todos probados para mejorar tu rendimiento acadÃ©mico','article','tecnicas','/articles/tecnicas_estudio.html','/images/tecnicas.jpg',15,'intermedio',1,0,'2026-05-12 13:52:09','2026-05-12 13:52:09'),(5,'MotivaciÃ³n AcadÃ©mica Duradera','CÃ³mo mantener la motivaciÃ³n durante todo el semestre','video','motivacion','/videos/motivacion.mp4','/images/motivacion.jpg',25,'principiante',1,0,'2026-05-12 13:52:09','2026-05-12 13:52:09'),(6,'Ejercicios de RelajaciÃ³n RÃ¡pida','TÃ©cnicas de 2 minutos para reducir el estrÃ©s en clase','exercise','relajacion','/exercises/relajacion_rapida.html','/images/relajacion_rapida.jpg',5,'principiante',1,0,'2026-05-12 13:52:09','2026-05-12 13:52:09');
/*!40000 ALTER TABLE `resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stress_measurements`
--

DROP TABLE IF EXISTS `stress_measurements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stress_measurements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `score` int NOT NULL,
  `level` enum('bajo','moderado','alto') NOT NULL,
  `answers` json NOT NULL,
  `measurement_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_score` (`score`),
  KEY `idx_level` (`level`),
  KEY `idx_measurement_date` (`measurement_date`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `stress_measurements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stress_measurements`
--

LOCK TABLES `stress_measurements` WRITE;
/*!40000 ALTER TABLE `stress_measurements` DISABLE KEYS */;
INSERT INTO `stress_measurements` VALUES (1,4,5,'bajo','{\"q1\": 1, \"q2\": 1, \"q3\": 1, \"q4\": 1, \"q5\": 1}','2026-05-15','2026-05-15 23:51:37','2026-05-15 23:51:37'),(2,4,7,'bajo','{\"q1\": 1, \"q2\": 1, \"q3\": 1, \"q4\": 2, \"q5\": 2}','2026-05-19','2026-05-19 04:10:59','2026-05-19 04:10:59');
/*!40000 ALTER TABLE `stress_measurements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `stress_statistics`
--

DROP TABLE IF EXISTS `stress_statistics`;
/*!50001 DROP VIEW IF EXISTS `stress_statistics`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `stress_statistics` AS SELECT 
 1 AS `total_measurements`,
 1 AS `average_score`,
 1 AS `high_stress_count`,
 1 AS `moderate_stress_count`,
 1 AS `low_stress_count`,
 1 AS `measurement_date`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `user_resource_progress`
--

DROP TABLE IF EXISTS `user_resource_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_resource_progress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `resource_id` int NOT NULL,
  `completed` tinyint(1) DEFAULT '0',
  `completion_percentage` int DEFAULT '0',
  `last_accessed` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_resource` (`user_id`,`resource_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_resource_id` (`resource_id`),
  KEY `idx_completed` (`completed`),
  CONSTRAINT `user_resource_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_resource_progress_ibfk_2` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_resource_progress`
--

LOCK TABLES `user_resource_progress` WRITE;
/*!40000 ALTER TABLE `user_resource_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_resource_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_sessions`
--

DROP TABLE IF EXISTS `user_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_token` (`session_token`),
  KEY `idx_session_token` (`session_token`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_expires_at` (`expires_at`),
  CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sessions`
--

LOCK TABLES `user_sessions` WRITE;
/*!40000 ALTER TABLE `user_sessions` DISABLE KEYS */;
INSERT INTO `user_sessions` VALUES (2,3,'dbd6a38a45dbdb15e178777fb4a9cde1f0b22988e1523d34fa17fe4589dc636d','2026-05-13 12:48:53','192.168.65.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-13 04:48:53'),(3,4,'4fe277e036d168d702609df85499f879755da1fa5dde48b23d1bd147783a1a76','2026-05-16 06:49:02','192.168.65.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-15 22:49:02'),(4,4,'9e08364d2fd297fb3171070e5bb50befbc4449c2f3d9295884b73fc286fbcd45','2026-05-16 07:23:06','192.168.65.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-15 23:23:06'),(5,4,'976aa83e6385a9cdf17ec427333ed5a96634c90f61b2b9d6c7db0ff9b2ec4279','2026-05-16 07:27:50','192.168.65.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-15 23:27:50'),(6,4,'c03999c7a82e33f9e4c7bb311f50bc533f0d8970bcfda3feac3e2416f847273e','2026-05-16 07:51:21','192.168.65.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-15 23:51:21'),(7,4,'fae491cc8ef9228a61f18f99debf55202cf30d6fb702aa680b4e2b3c318c7821','2026-05-19 12:10:42','192.168.65.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-19 04:10:42');
/*!40000 ALTER TABLE `user_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_statistics`
--

DROP TABLE IF EXISTS `user_statistics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_statistics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_measurements` int DEFAULT '0',
  `average_score` decimal(5,2) DEFAULT '0.00',
  `latest_score` int DEFAULT NULL,
  `improvement_percentage` decimal(5,2) DEFAULT '0.00',
  `first_measurement_date` date DEFAULT NULL,
  `last_measurement_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_stats` (`user_id`),
  KEY `idx_average_score` (`average_score`),
  KEY `idx_improvement` (`improvement_percentage`),
  CONSTRAINT `user_statistics_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_statistics`
--

LOCK TABLES `user_statistics` WRITE;
/*!40000 ALTER TABLE `user_statistics` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_statistics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `matricula` varchar(20) NOT NULL,
  `carrera` varchar(50) NOT NULL,
  `semestre` int NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email_verified` tinyint(1) DEFAULT '0',
  `verification_token` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_expires` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` datetime DEFAULT NULL,
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `matricula` (`matricula`),
  KEY `idx_email` (`email`),
  KEY `idx_matricula` (`matricula`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'Amayrani Michel Vazquez Torres','l22361010@tehuacan.tecnm.mx','22361010','ing-sistemas',8,'$2y$12$JHphF.IdRDrlutQaQR1MLe5uMVuH1KHUJdE.QDEQMdXURZ.YuMGzm',1,NULL,NULL,NULL,'2026-05-13 04:48:40','2026-05-13 04:48:53','2026-05-13 04:48:53','active'),(4,'Christian Campos Cortes','l22360885@tehuacan.tecnm.mx','22360885','ing-sistemas',8,'$2y$12$AY1jh.8F7Viv/C7Au7/wAu.WB5tT.Awdkd6LG5qTD5LiEc0SUBiRa',1,NULL,NULL,NULL,'2026-05-15 22:48:44','2026-05-19 04:10:42','2026-05-19 04:10:42','active');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `general_statistics`
--

/*!50001 DROP VIEW IF EXISTS `general_statistics`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `general_statistics` AS select count(0) AS `total_users`,count((case when (`users`.`created_at` >= (now() - interval 30 day)) then 1 end)) AS `new_users_30_days`,count((case when (`users`.`last_login` >= (now() - interval 7 day)) then 1 end)) AS `active_users_7_days`,(avg((case when (`users`.`status` = 'active') then 1 else 0 end)) * 100) AS `active_percentage` from `users` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `stress_statistics`
--

/*!50001 DROP VIEW IF EXISTS `stress_statistics`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `stress_statistics` AS select count(0) AS `total_measurements`,avg(`stress_measurements`.`score`) AS `average_score`,count((case when (`stress_measurements`.`level` = 'alto') then 1 end)) AS `high_stress_count`,count((case when (`stress_measurements`.`level` = 'moderado') then 1 end)) AS `moderate_stress_count`,count((case when (`stress_measurements`.`level` = 'bajo') then 1 end)) AS `low_stress_count`,cast(`stress_measurements`.`created_at` as date) AS `measurement_date` from `stress_measurements` group by cast(`stress_measurements`.`created_at` as date) order by `measurement_date` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-31  0:19:27
