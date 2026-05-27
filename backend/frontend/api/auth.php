<?php

/**
 * API de Autenticación para MideTuEstres
 * Instituto Tecnológico de Tehuacán
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../config/database.php';

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class AuthAPI
{
    private $db;

    public function __construct()
    {
        $this->db = getDB();
    }

    /**
     * Registrar nuevo usuario
     */
    public function register($data)
    {
        try {
            // Validar datos requeridos
            $required_fields = ['name', 'email', 'matricula', 'carrera', 'semestre', 'password'];
            foreach ($required_fields as $field) {
                if (empty($data[$field])) {
                    throw new Exception("El campo $field es requerido");
                }
            }

            // Validar formato de email
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                throw new Exception("El formato del correo electrónico es inválido");
            }

            // Validar dominio institucional
            $email_parts = explode('@', $data['email']);
            if (count($email_parts) !== 2 || !in_array($email_parts[1], ALLOWED_DOMAINS)) {
                throw new Exception("Solo se permiten correos institucionales (@tehuacan.tecnm.mx)");
            }

            // Validar contraseña
            if (strlen($data['password']) < PASSWORD_MIN_LENGTH) {
                throw new Exception("La contraseña debe tener al menos " . PASSWORD_MIN_LENGTH . " caracteres");
            }

            // Validar matrícula
            if (!preg_match('/^[0-9]{8,10}$/', $data['matricula'])) {
                throw new Exception("La matrícula debe tener entre 8 y 10 dígitos");
            }

            // Verificar si el email ya existe
            if ($this->db->exists('users', 'email = ?', [$data['email']])) {
                throw new Exception("El correo electrónico ya está registrado");
            }

            // Verificar si la matrícula ya existe
            if ($this->db->exists('users', 'matricula = ?', [$data['matricula']])) {
                throw new Exception("La matrícula ya está registrada");
            }

            // Encriptar contraseña
            $password_hash = password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => BCRYPT_COST]);

            // Insertar usuario
            $user_data = [
                'name' => trim($data['name']),
                'email' => strtolower(trim($data['email'])),
                'matricula' => trim($data['matricula']),
                'carrera' => $data['carrera'],
                'semestre' => (int)$data['semestre'],
                'password_hash' => $password_hash,
                'email_verified' => REQUIRE_EMAIL_VERIFICATION ? 0 : 1
            ];

            $user_id = $this->db->insert('users', $user_data);

            // Si se requiere verificación de email, enviar token
            if (REQUIRE_EMAIL_VERIFICATION) {
                $token = bin2hex(random_bytes(32));
                $this->db->update(
                    'users',
                    ['verification_token' => $token],
                    'id = ?',
                    [$user_id]
                );

                // Aquí iría el envío de correo electrónico
                // sendVerificationEmail($data['email'], $token);
            }

            // Registrar actividad
            $this->logActivity($user_id, 'user_registered', "Usuario registrado: {$data['email']}");

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Usuario registrado exitosamente',
                'user_id' => $user_id,
                'requires_verification' => REQUIRE_EMAIL_VERIFICATION
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Iniciar sesión
     */
    public function login($data)
    {
        try {
            // Validar datos requeridos
            if (empty($data['email']) || empty($data['password'])) {
                throw new Exception("Email y contraseña son requeridos");
            }

            // Buscar usuario por email
            $user = $this->db->fetchOne(
                "SELECT id, name, email, matricula, carrera, semestre, password_hash, status, email_verified 
                 FROM users WHERE email = ?",
                [strtolower(trim($data['email']))]
            );

            if (!$user) {
                throw new Exception("Credenciales inválidas");
            }

            // Verificar estado del usuario
            if ($user['status'] !== 'active') {
                throw new Exception("La cuenta está suspendida o inactiva");
            }

            // Verificar email si es requerido
            if (REQUIRE_EMAIL_VERIFICATION && !$user['email_verified']) {
                throw new Exception("Debes verificar tu correo electrónico antes de iniciar sesión");
            }

            // Verificar contraseña
            if (!password_verify($data['password'], $user['password_hash'])) {
                throw new Exception("Credenciales inválidas");
            }

            // Generar token de sesión
            $session_token = bin2hex(random_bytes(32));
            $expires_at = date('Y-m-d H:i:s', time() + SESSION_TIMEOUT);

            // Guardar sesión
            $this->db->insert('user_sessions', [
                'user_id' => $user['id'],
                'session_token' => $session_token,
                'expires_at' => $expires_at,
                'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null
            ]);

            // Actualizar último login
            $this->db->update(
                'users',
                ['last_login' => date('Y-m-d H:i:s')],
                'id = ?',
                [$user['id']]
            );

            // Registrar actividad
            $this->logActivity($user['id'], 'user_login', "Inicio de sesión: {$user['email']}");

            // Preparar respuesta
            unset($user['password_hash']);

            echo json_encode([
                'success' => true,
                'message' => 'Inicio de sesión exitoso',
                'user' => $user,
                'token' => $session_token,
                'expires_at' => $expires_at
            ]);
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Cerrar sesión
     */
    public function logout($token)
    {
        try {
            if (empty($token)) {
                throw new Exception("Token de sesión requerido");
            }

            // Eliminar sesión
            $deleted = $this->db->delete('user_sessions', 'session_token = ?', [$token]);

            if ($deleted > 0) {
                // Registrar actividad
                $this->logActivity(null, 'user_logout', "Cierre de sesión");

                echo json_encode([
                    'success' => true,
                    'message' => 'Sesión cerrada exitosamente'
                ]);
            } else {
                throw new Exception("Sesión no encontrada");
            }
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Verificar token de sesión
     */
    public function verifyToken($token)
    {
        try {
            if (empty($token)) {
                throw new Exception("Token requerido");
            }

            // Buscar sesión válida
            $session = $this->db->fetchOne(
                "SELECT s.user_id, s.expires_at, u.name, u.email, u.matricula, u.carrera, u.semestre
                 FROM user_sessions s
                 JOIN users u ON s.user_id = u.id
                 WHERE s.session_token = ? AND s.expires_at > NOW() AND u.status = 'active'",
                [$token]
            );

            if (!$session) {
                throw new Exception("Token inválido o expirado");
            }

            echo json_encode([
                'success' => true,
                'user' => $session
            ]);
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Cambiar contraseña
     */
    public function changePassword($data, $user_id)
    {
        try {
            // Validar datos requeridos
            if (empty($data['current_password']) || empty($data['new_password'])) {
                throw new Exception("Contraseña actual y nueva son requeridas");
            }

            // Validar nueva contraseña
            if (strlen($data['new_password']) < PASSWORD_MIN_LENGTH) {
                throw new Exception("La nueva contraseña debe tener al menos " . PASSWORD_MIN_LENGTH . " caracteres");
            }

            // Obtener usuario
            $user = $this->db->fetchOne(
                "SELECT password_hash FROM users WHERE id = ?",
                [$user_id]
            );

            if (!$user) {
                throw new Exception("Usuario no encontrado");
            }

            // Verificar contraseña actual
            if (!password_verify($data['current_password'], $user['password_hash'])) {
                throw new Exception("La contraseña actual es incorrecta");
            }

            // Encriptar nueva contraseña
            $new_password_hash = password_hash($data['new_password'], PASSWORD_BCRYPT, ['cost' => BCRYPT_COST]);

            // Actualizar contraseña
            $this->db->update(
                'users',
                ['password_hash' => $new_password_hash],
                'id = ?',
                [$user_id]
            );

            // Eliminar todas las sesiones excepto la actual
            $current_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
            $this->db->delete('user_sessions', 'user_id = ? AND session_token != ?', [$user_id, $current_token]);

            // Registrar actividad
            $this->logActivity($user_id, 'password_changed', "Contraseña cambiada");

            echo json_encode([
                'success' => true,
                'message' => 'Contraseña cambiada exitosamente'
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Registrar actividad en el log
     */
    private function logActivity($user_id, $action, $description)
    {
        $this->db->insert('activity_logs', [
            'user_id' => $user_id,
            'action' => $action,
            'description' => $description,
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null
        ]);
    }
}

// Procesar solicitudes
$auth = new AuthAPI();

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
            break;
        }

        $action = $_GET['action'] ?? '';

        switch ($action) {
            case 'register':
                $auth->register($data);
                break;
            case 'login':
                $auth->login($data);
                break;
            case 'logout':
                $token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                $auth->logout($token);
                break;
            case 'change_password':
                // Verificar token primero
                $token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                $db = getDB();
                $session = $db->fetchOne("SELECT user_id FROM user_sessions WHERE session_token = ? AND expires_at > NOW()", [$token]);
                if ($session) {
                    $auth->changePassword($data, $session['user_id']);
                } else {
                    http_response_code(401);
                    echo json_encode(['success' => false, 'message' => 'No autorizado']);
                }
                break;
            default:
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Acción no encontrada']);
        }
        break;

    case 'GET':
        $action = $_GET['action'] ?? '';

        switch ($action) {
            case 'verify':
                $token = $_GET['token'] ?? '';
                $auth->verifyToken($token);
                break;
            default:
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Acción no encontrada']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
