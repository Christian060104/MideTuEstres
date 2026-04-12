<?php
/**
 * Servidor de desarrollo local para MideTuEstres
 * Instituto Tecnológico de Tehuacán
 */

// Habilitar errores para desarrollo
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configurar headers CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

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
    
    // Enrutamiento básico
    switch ($uri) {
        case '/api/auth':
        case '/api/auth.php':
            require_once 'api/auth.php';
            break;
            
        case '/api/measurements':
        case '/api/measurements.php':
            require_once 'api/measurements.php';
            break;
            
        case '/':
        case '':
            // Página de bienvenida
            echo json_encode([
                'success' => true,
                'message' => 'Backend MideTuEstres funcionando',
                'endpoints' => [
                    'POST /api/auth.php?action=register' => 'Registrar usuario',
                    'POST /api/auth.php?action=login' => 'Iniciar sesión',
                    'POST /api/measurements.php?action=create' => 'Crear medición',
                    'GET /api/measurements.php?action=list' => 'Obtener mediciones'
                ]
            ]);
            break;
            
        default:
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Endpoint no encontrado',
                'available_endpoints' => [
                    '/api/auth.php',
                    '/api/measurements.php'
                ]
            ]);
    }
}

// Ejecutar el enrutador
routeRequest();
?>
