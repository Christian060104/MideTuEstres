<?php
/**
 * Index principal - MideTuEstres Backend
 * Instituto Tecnológico de Tehuacán
 * Punto de entrada principal para la API
 */

// Habilitar errores para desarrollo
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configurar headers CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Función para enrutar solicitudes
function routeRequest() {
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Quitar el prefijo /backend si existe
    $uri = str_replace('/backend', '', $uri);
    
    // Logging para debugging
    error_log("Request: $method $uri");
    
    // Enrutamiento mejorado
    switch ($uri) {
        // Rutas de autenticación
        case '/api/auth':
        case '/api/auth/':
        case '/api/auth.php':
            require_once 'api/auth.php';
            break;
            
        // Rutas de mediciones
        case '/api/measurements':
        case '/api/measurements/':
        case '/api/measurements.php':
            require_once 'api/measurements.php';
            break;
            
        // Ruta principal - API Info
        case '/':
        case '':
        case '/index':
        case '/index.php':
            echo json_encode([
                'success' => true,
                'message' => 'MideTuEstres Backend API',
                'version' => '1.0.0',
                'status' => 'active',
                'timestamp' => date('Y-m-d H:i:s'),
                'endpoints' => [
                    'authentication' => [
                        'POST /api/auth.php?action=register' => 'Registrar nuevo usuario',
                        'POST /api/auth.php?action=login' => 'Iniciar sesión',
                        'POST /api/auth.php?action=logout' => 'Cerrar sesión',
                        'GET /api/auth.php?action=profile' => 'Obtener perfil de usuario'
                    ],
                    'measurements' => [
                        'POST /api/measurements.php?action=create' => 'Crear nueva medición',
                        'GET /api/measurements.php?action=list' => 'Listar mediciones del usuario',
                        'GET /api/measurements.php?action=get&id={id}' => 'Obtener medición específica',
                        'PUT /api/measurements.php?action=update&id={id}' => 'Actualizar medición',
                        'DELETE /api/measurements.php?action=delete&id={id}' => 'Eliminar medición'
                    ]
                ],
                'documentation' => [
                    'method' => 'POST para todas las acciones',
                    'format' => 'JSON',
                    'auth_required' => 'La mayoría de endpoints requieren token JWT'
                ]
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            break;
            
        // Health check endpoint
        case '/health':
        case '/health.php':
            echo json_encode([
                'success' => true,
                'status' => 'healthy',
                'timestamp' => date('Y-m-d H:i:s'),
                'services' => [
                    'database' => 'connected', // TODO: Implementar verificación real
                    'api' => 'running'
                ]
            ]);
            break;
            
        // Endpoint no encontrado
        default:
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'error' => 'Endpoint no encontrado',
                'message' => "La ruta '$uri' no está disponible",
                'available_endpoints' => [
                    '/' => 'Información de la API',
                    '/health' => 'Verificación de estado',
                    '/api/auth.php' => 'Autenticación',
                    '/api/measurements.php' => 'Mediciones de estrés'
                ],
                'timestamp' => date('Y-m-d H:i:s')
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}

// Ejecutar el enrutador
routeRequest();
?>
