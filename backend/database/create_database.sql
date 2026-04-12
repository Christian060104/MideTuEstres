-- Base de datos para MideTuEstres - Instituto Tecnológico de Tehuacán
-- Versión: 1.0
-- Autor: Departamento de Bienestar Estudiantil

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS midetu_estres 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE midetu_estres;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    carrera VARCHAR(50) NOT NULL,
    semestre INT NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255) NULL,
    reset_token VARCHAR(255) NULL,
    reset_expires DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login DATETIME NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    
    INDEX idx_email (email),
    INDEX idx_matricula (matricula),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Tabla de mediciones de estrés
CREATE TABLE IF NOT EXISTS stress_measurements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    score INT NOT NULL,
    level ENUM('bajo', 'moderado', 'alto') NOT NULL,
    answers JSON NOT NULL,
    measurement_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_score (score),
    INDEX idx_level (level),
    INDEX idx_measurement_date (measurement_date),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Tabla de seguimiento y estadísticas
CREATE TABLE IF NOT EXISTS user_statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_measurements INT DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0.00,
    latest_score INT NULL,
    improvement_percentage DECIMAL(5,2) DEFAULT 0.00,
    first_measurement_date DATE NULL,
    last_measurement_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_stats (user_id),
    INDEX idx_average_score (average_score),
    INDEX idx_improvement (improvement_percentage)
) ENGINE=InnoDB;

-- Tabla de recursos educativos
CREATE TABLE IF NOT EXISTS resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    type ENUM('video', 'article', 'exercise', 'audio') NOT NULL,
    category ENUM('relajacion', 'tiempo', 'motivacion', 'tecnicas', 'consejos') NOT NULL,
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500) NULL,
    duration_minutes INT NULL,
    difficulty ENUM('principiante', 'intermedio', 'avanzado') DEFAULT 'principiante',
    is_active BOOLEAN DEFAULT TRUE,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_category (category),
    INDEX idx_difficulty (difficulty),
    INDEX idx_is_active (is_active),
    INDEX idx_view_count (view_count)
) ENGINE=InnoDB;

-- Tabla de progreso de usuarios en recursos
CREATE TABLE IF NOT EXISTS user_resource_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    resource_id INT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completion_percentage INT DEFAULT 0,
    last_accessed TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_resource (user_id, resource_id),
    INDEX idx_user_id (user_id),
    INDEX idx_resource_id (resource_id),
    INDEX idx_completed (completed)
) ENGINE=InnoDB;

-- Tabla de sesiones de usuario (para manejo de sesiones seguro)
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB;

-- Tabla de logs de actividad (para auditoría)
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Insertar datos iniciales para recursos educativos
INSERT INTO resources (title, description, type, category, url, thumbnail_url, duration_minutes, difficulty) VALUES
('Técnicas de Respiración Profunda', 'Aprende ejercicios de respiración para reducir el estrés inmediatamente', 'video', 'relajacion', '/videos/respiracion.mp4', '/images/respiracion.jpg', 15, 'principiante'),
('Gestión del Tiempo para Estudiantes', 'Estrategias efectivas para organizar tu tiempo de estudio', 'video', 'tiempo', '/videos/gestion_tiempo.mp4', '/images/gestion_tiempo.jpg', 20, 'principiante'),
('Meditación Guiada para Estudiantes', 'Sesión de meditación de 10 minutos para calmar la mente', 'audio', 'relajacion', '/audio/meditacion.mp3', '/images/meditacion.jpg', 10, 'principiante'),
('Técnicas de Estudio Efectivas', 'Métodos probados para mejorar tu rendimiento académico', 'article', 'tecnicas', '/articles/tecnicas_estudio.html', '/images/tecnicas.jpg', 15, 'intermedio'),
('Motivación Académica Duradera', 'Cómo mantener la motivación durante todo el semestre', 'video', 'motivacion', '/videos/motivacion.mp4', '/images/motivacion.jpg', 25, 'principiante'),
('Ejercicios de Relajación Rápida', 'Técnicas de 2 minutos para reducir el estrés en clase', 'exercise', 'relajacion', '/exercises/relajacion_rapida.html', '/images/relajacion_rapida.jpg', 5, 'principiante');

-- Crear vista para estadísticas generales
CREATE OR REPLACE VIEW general_statistics AS
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_users_30_days,
    COUNT(CASE WHEN last_login >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as active_users_7_days,
    AVG(CASE WHEN status = 'active' THEN 1 ELSE 0 END) * 100 as active_percentage
FROM users;

-- Crear vista para estadísticas de estrés
CREATE OR REPLACE VIEW stress_statistics AS
SELECT 
    COUNT(*) as total_measurements,
    AVG(score) as average_score,
    COUNT(CASE WHEN level = 'alto' THEN 1 END) as high_stress_count,
    COUNT(CASE WHEN level = 'moderado' THEN 1 END) as moderate_stress_count,
    COUNT(CASE WHEN level = 'bajo' THEN 1 END) as low_stress_count,
    DATE(created_at) as measurement_date
FROM stress_measurements 
GROUP BY DATE(created_at)
ORDER BY measurement_date DESC;

-- Procedimiento almacenado para actualizar estadísticas de usuario
DELIMITER //
CREATE PROCEDURE UpdateUserStatistics(IN p_user_id INT)
BEGIN
    DECLARE v_total_measurements INT DEFAULT 0;
    DECLARE v_average_score DECIMAL(5,2) DEFAULT 0.00;
    DECLARE v_latest_score INT NULL;
    DECLARE v_improvement_percentage DECIMAL(5,2) DEFAULT 0.00;
    DECLARE v_first_date DATE NULL;
    DECLARE v_last_date DATE NULL;
    
    -- Calcular estadísticas
    SELECT 
        COUNT(*),
        AVG(score),
        MAX(score),
        MIN(measurement_date),
        MAX(measurement_date)
    INTO 
        v_total_measurements,
        v_average_score,
        v_latest_score,
        v_first_date,
        v_last_date
    FROM stress_measurements 
    WHERE user_id = p_user_id;
    
    -- Calcular mejora porcentual
    IF v_total_measurements >= 2 THEN
        SELECT 
            ROUND(((MIN(score) - MAX(score)) / MIN(score)) * 100, 2)
        INTO v_improvement_percentage
        FROM stress_measurements 
        WHERE user_id = p_user_id;
    END IF;
    
    -- Actualizar o insertar estadísticas
    INSERT INTO user_statistics (
        user_id, 
        total_measurements, 
        average_score, 
        latest_score, 
        improvement_percentage,
        first_measurement_date,
        last_measurement_date
    ) VALUES (
        p_user_id, 
        v_total_measurements, 
        v_average_score, 
        v_latest_score, 
        v_improvement_percentage,
        v_first_date,
        v_last_date
    ) ON DUPLICATE KEY UPDATE
        total_measurements = VALUES(total_measurements),
        average_score = VALUES(average_score),
        latest_score = VALUES(latest_score),
        improvement_percentage = VALUES(improvement_percentage),
        first_measurement_date = VALUES(first_measurement_date),
        last_measurement_date = VALUES(last_measurement_date),
        updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Trigger para actualizar estadísticas automáticamente
DELIMITER //
CREATE TRIGGER after_stress_measurement_insert
AFTER INSERT ON stress_measurements
FOR EACH ROW
BEGIN
    CALL UpdateUserStatistics(NEW.user_id);
END //
DELIMITER ;

-- Crear usuario administrador por defecto (contraseña: admin123)
-- NOTA: Cambiar esta contraseña en producción
INSERT INTO users (name, email, matricula, carrera, semestre, password_hash, status) VALUES 
('Administrador', 'admin@tehuacan.tecnm.mx', 'ADMIN001', 'Sistemas', 10, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active');

-- Mostrar mensaje de éxito
SELECT 'Base de datos MideTuEstres creada exitosamente' as message;
