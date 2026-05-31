<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

/**
 * API de Mediciones de Estrés para MideTuEstres
 * Instituto Tecnológico de Tehuacán
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../../config/database.php';

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class MeasurementsAPI
{
    private $db;

    public function __construct()
    {
        $this->db = getDB();
    }

    /**
     * Verificar autenticación del usuario
     */
    public function authenticate()
    {

        $headers = getallheaders();

        $token = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (empty($token)) {
            throw new Exception("Token de autenticación requerido");
        }

        $session = $this->db->fetchOne(
            "SELECT user_id FROM user_sessions WHERE session_token = ? AND expires_at > NOW()",
            [$token]
        );

        if (!$session) {
            throw new Exception("Token inválido o expirado");
        }

        return $session['user_id'];
    }

    /**
     * Crear nueva medición de estrés
     */
    public function createMeasurement($data, $user_id)
    {
        try {
            // Validar datos requeridos
            $required_fields = ['q1', 'q2', 'q3', 'q4', 'q5'];
            foreach ($required_fields as $field) {
                if (!isset($data[$field]) || empty($data[$field])) {
                    throw new Exception("La pregunta $field es requerida");
                }
            }

            // Validar rango de respuestas
            foreach ($required_fields as $field) {
                $value = (int)$data[$field];
                if ($value < 1 || $value > 4) {
                    throw new Exception("La respuesta a $field debe estar entre 1 y 4");
                }
            }

            // Calcular puntuación total
            $total_score = array_sum(array_map(function ($field) use ($data) {
                return (int)$data[$field];
            }, $required_fields));

            // Determinar nivel de estrés
            if ($total_score <= 8) {
                $level = 'bajo';
            } elseif ($total_score <= 14) {
                $level = 'moderado';
            } else {
                $level = 'alto';
            }

            // Preparar datos de respuestas
            $answers = [
                'q1' => (int)$data['q1'],
                'q2' => (int)$data['q2'],
                'q3' => (int)$data['q3'],
                'q4' => (int)$data['q4'],
                'q5' => (int)$data['q5']
            ];

            // Insertar medición
            $measurement_data = [
                'user_id' => $user_id,
                'score' => $total_score,
                'level' => $level,
                'answers' => json_encode($answers),
                'measurement_date' => date('Y-m-d')
            ];

            $measurement_id = $this->db->insert('stress_measurements', $measurement_data);

            // Registrar actividad
            $this->logActivity($user_id, 'measurement_created', "Nueva medición: $total_score puntos ($level)");

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Medición registrada exitosamente',
                'measurement_id' => $measurement_id,
                'score' => $total_score,
                'level' => $level
            ]);
        } catch (Exception $e) {

            error_log("CREATE ERROR: " . $e->getMessage());

            http_response_code(400);

            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Obtener mediciones del usuario
     */
    public function getMeasurements($user_id, $limit = 50, $offset = 0)
    {
        try {
            $measurements = $this->db->fetchAll(
                "SELECT id, score, level, answers, measurement_date, created_at
                 FROM stress_measurements 
                 WHERE user_id = ? 
                 ORDER BY created_at DESC 
                 LIMIT ? OFFSET ?",
                [$user_id, $limit, $offset]
            );

            // Decodificar JSON de respuestas
            foreach ($measurements as &$measurement) {
                $measurement['answers'] = json_decode($measurement['answers'], true);
            }

            echo json_encode([
                'success' => true,
                'measurements' => $measurements,
                'total' => count($measurements)
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error al obtener mediciones'
            ]);
        }
    }

    /**
     * Obtener estadísticas del usuario
     */
    public function getUserStatistics($user_id)
    {
        try {
            // Obtener estadísticas básicas
            $stats = $this->db->fetchOne(
                "SELECT * FROM user_statistics WHERE user_id = ?",
                [$user_id]
            );

            if (!$stats) {
                // Si no hay estadísticas, calcularlas
                $this->calculateUserStatistics($user_id);
                $stats = $this->db->fetchOne(
                    "SELECT * FROM user_statistics WHERE user_id = ?",
                    [$user_id]
                );
            }

            // Obtener últimas mediciones
            $recent_measurements = $this->db->fetchAll(
                "SELECT score, level, measurement_date 
                 FROM stress_measurements 
                 WHERE user_id = ? 
                 ORDER BY created_at DESC 
                 LIMIT 10",
                [$user_id]
            );

            // Obtener distribución por nivel
            $level_distribution = $this->db->fetchAll(
                "SELECT level, COUNT(*) as count 
                 FROM stress_measurements 
                 WHERE user_id = ? 
                 GROUP BY level",
                [$user_id]
            );

            echo json_encode([
                'success' => true,
                'statistics' => $stats,
                'recent_measurements' => $recent_measurements,
                'level_distribution' => $level_distribution
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error al obtener estadísticas'
            ]);
        }
    }

    /**
     * Obtener recomendaciones basadas en el nivel de estrés
     */
    public function getRecommendations($score)
    {
        try {
            $recommendations = [];

            if ($score <= 8) {
                $recommendations = [
                    [
                        'title' => 'Mantén tus hábitos saludables',
                        'description' => 'Continúa con tu rutina de ejercicio y alimentación balanceada.',
                        'priority' => 'medium'
                    ],
                    [
                        'title' => 'Comparte tus estrategias',
                        'description' => 'Ayuda a tus compañeros compartiendo lo que funciona para ti.',
                        'priority' => 'low'
                    ],
                    [
                        'title' => 'Monitoreo regular',
                        'description' => 'Sigue midiendo tu estrés regularmente para mantener el control.',
                        'priority' => 'high'
                    ]
                ];
            } elseif ($score <= 14) {
                $recommendations = [
                    [
                        'title' => 'Técnicas de respiración',
                        'description' => 'Practica respiración profunda 5 minutos al día.',
                        'priority' => 'high'
                    ],
                    [
                        'title' => 'Establece horarios',
                        'description' => 'Crea un horario de estudio con pausas regulares.',
                        'priority' => 'high'
                    ],
                    [
                        'title' => 'Pausas activas',
                        'description' => 'Descansa 10 minutos cada 50 minutos de estudio.',
                        'priority' => 'medium'
                    ],
                    [
                        'title' => 'Habla con alguien',
                        'description' => 'Comparte tus preocupaciones con amigos o familiares.',
                        'priority' => 'medium'
                    ],
                    [
                        'title' => 'Ejercicio ligero',
                        'description' => 'Realiza caminatas cortas o estiramientos diarios.',
                        'priority' => 'low'
                    ]
                ];
            } else {
                $recommendations = [
                    [
                        'title' => 'Busca apoyo profesional',
                        'description' => 'Acude al departamento de bienestar estudiantil.',
                        'priority' => 'high'
                    ],
                    [
                        'title' => 'Meditación diaria',
                        'description' => 'Practica meditación de 10-15 minutos todos los días.',
                        'priority' => 'high'
                    ],
                    [
                        'title' => 'Revisa tu carga académica',
                        'description' => 'Considera ajustar tus materias si es posible.',
                        'priority' => 'high'
                    ],
                    [
                        'title' => 'Prioriza el sueño',
                        'description' => 'Asegúrate de dormir 7-8 horas diarias.',
                        'priority' => 'medium'
                    ],
                    [
                        'title' => 'Alimentación saludable',
                        'description' => 'Evita cafeína y alimentos procesados.',
                        'priority' => 'medium'
                    ],
                    [
                        'title' => 'Establece límites',
                        'description' => 'Define horarios claros entre estudio y descanso.',
                        'priority' => 'medium'
                    ]
                ];
            }

            echo json_encode([
                'success' => true,
                'recommendations' => $recommendations,
                'score' => $score
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error al obtener recomendaciones'
            ]);
        }
    }

    /**
     * Eliminar una medición
     */
    public function deleteMeasurement($measurement_id, $user_id)
    {
        try {
            // Verificar que la medición pertenezca al usuario
            $measurement = $this->db->fetchOne(
                "SELECT id FROM stress_measurements WHERE id = ? AND user_id = ?",
                [$measurement_id, $user_id]
            );

            if (!$measurement) {
                throw new Exception("Medición no encontrada");
            }

            // Eliminar medición
            $deleted = $this->db->delete('stress_measurements', 'id = ? AND user_id = ?', [$measurement_id, $user_id]);

            if ($deleted > 0) {
                // Recalcular estadísticas
                $this->calculateUserStatistics($user_id);

                // Registrar actividad
                $this->logActivity($user_id, 'measurement_deleted', "Medición eliminada: $measurement_id");

                echo json_encode([
                    'success' => true,
                    'message' => 'Medición eliminada exitosamente'
                ]);
            } else {
                throw new Exception("No se pudo eliminar la medición");
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
     * Calcular estadísticas de usuario
     */
    private function calculateUserStatistics($user_id)
    {
        return true;
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
$measurements = new MeasurementsAPI();

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        try {
            $user_id = $measurements->authenticate();
            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data) {
                throw new Exception('Datos inválidos');
            }

            $action = $_GET['action'] ?? 'create';

            switch ($action) {
                case 'create':
                    $measurements->createMeasurement($data, $user_id);
                    break;
                default:
                    throw new Exception('Acción no encontrada');
            }
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'GET':
        try {
            $user_id = $measurements->authenticate();
            $action = $_GET['action'] ?? 'list';

            switch ($action) {
                case 'list':
                    $limit = (int)($_GET['limit'] ?? 50);
                    $offset = (int)($_GET['offset'] ?? 0);
                    $measurements->getMeasurements($user_id, $limit, $offset);
                    break;
                case 'statistics':
                    $measurements->getUserStatistics($user_id);
                    break;
                case 'recommendations':
                    $score = (int)($_GET['score'] ?? 10);
                    $measurements->getRecommendations($score);
                    break;
                default:
                    throw new Exception('Acción no encontrada');
            }
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        try {
            $user_id = $measurements->authenticate();
            $measurement_id = $_GET['id'] ?? '';

            if (empty($measurement_id)) {
                throw new Exception('ID de medición requerido');
            }

            $measurements->deleteMeasurement($measurement_id, $user_id);
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
