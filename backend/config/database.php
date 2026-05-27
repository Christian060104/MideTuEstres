<?php

/**
 * Configuración de la base de datos para MideTuEstres
 * Instituto Tecnológico de Tehuacán
 */

class Database
{
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $port;
    private $charset = 'utf8mb4';
    private $conn;

    public function __construct()
    {
        // Variables de entorno de Railway
        $this->host = getenv('MYSQLHOST');
        $this->username = getenv('MYSQLUSER');
        $this->password = getenv('MYSQLPASSWORD');
        $this->db_name = getenv('MYSQLDATABASE');
        $this->port = getenv('MYSQLPORT');
    }

    /**
     * Obtener conexión a la base de datos
     */
    public function getConnection()
    {
        $this->conn = null;

        try {

            $dsn = "mysql:host=" . $this->host .
                ";port=" . $this->port .
                ";dbname=" . $this->db_name .
                ";charset=" . $this->charset;

            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
            ];

            $this->conn = new PDO(
                $dsn,
                $this->username,
                $this->password,
                $options
            );

            return $this->conn;
        } catch (PDOException $exception) {

            error_log("Error de conexión: " . $exception->getMessage());

            throw new Exception("Error al conectar con la base de datos");
        }
    }

    /**
     * Cerrar conexión
     */
    public function closeConnection()
    {
        $this->conn = null;
    }

    /**
     * Iniciar transacción
     */
    public function beginTransaction()
    {
        return $this->conn->beginTransaction();
    }

    /**
     * Confirmar transacción
     */
    public function commit()
    {
        return $this->conn->commit();
    }

    /**
     * Revertir transacción
     */
    public function rollBack()
    {
        return $this->conn->rollBack();
    }

    /**
     * Obtener último ID insertado
     */
    public function lastInsertId()
    {
        return $this->conn->lastInsertId();
    }

    /**
     * Ejecutar consulta preparada
     */
    public function executeQuery($sql, $params = [])
    {
        try {

            $stmt = $this->conn->prepare($sql);
            $stmt->execute($params);

            return $stmt;
        } catch (PDOException $exception) {

            error_log("Error en consulta: " . $exception->getMessage());

            throw new Exception("Error al ejecutar consulta");
        }
    }

    /**
     * Obtener múltiples registros
     */
    public function fetchAll($sql, $params = [])
    {
        $stmt = $this->executeQuery($sql, $params);

        return $stmt->fetchAll();
    }

    /**
     * Obtener un solo registro
     */
    public function fetchOne($sql, $params = [])
    {
        $stmt = $this->executeQuery($sql, $params);

        return $stmt->fetch();
    }

    /**
     * Insertar registro
     */
    public function insert($table, $data)
    {
        $columns = implode(', ', array_keys($data));

        $placeholders = implode(', ', array_fill(0, count($data), '?'));

        $sql = "INSERT INTO $table ($columns) VALUES ($placeholders)";

        $this->executeQuery($sql, array_values($data));

        return $this->lastInsertId();
    }

    /**
     * Actualizar registro
     */
    public function update($table, $data, $where, $whereParams = [])
    {
        $setClause = [];

        $params = [];

        foreach ($data as $column => $value) {

            $setClause[] = "$column = ?";

            $params[] = $value;
        }

        $setClause = implode(', ', $setClause);

        $sql = "UPDATE $table SET $setClause WHERE $where";

        $params = array_merge($params, $whereParams);

        $stmt = $this->executeQuery($sql, $params);

        return $stmt->rowCount();
    }

    /**
     * Eliminar registro
     */
    public function delete($table, $where, $params = [])
    {
        $sql = "DELETE FROM $table WHERE $where";

        $stmt = $this->executeQuery($sql, $params);

        return $stmt->rowCount();
    }

    /**
     * Verificar si existe un registro
     */
    public function exists($table, $where, $params = [])
    {
        $sql = "SELECT COUNT(*) as count FROM $table WHERE $where";

        $result = $this->fetchOne($sql, $params);

        return $result['count'] > 0;
    }
}

/**
 * Función para obtener instancia de la base de datos
 */
function getDB()
{
    static $db = null;

    if ($db === null) {

        $db = new Database();

        $db->getConnection();
    }

    return $db;
}

/**
 * Configuración adicional
 */
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'midetu_estres_secret_key_2024');

define('JWT_EXPIRE_TIME', 3600 * 24 * 7);

define('PASSWORD_MIN_LENGTH', 8);

define('MAX_LOGIN_ATTEMPTS', 5);

define('LOGIN_ATTEMPT_TIMEOUT', 900);

/**
 * Configuración para correos institucionales
 */
define('ALLOWED_DOMAINS', ['tehuacan.tecnm.mx']);

/**
 * Configuración de seguridad
 */
define('BCRYPT_COST', 12);

define('SESSION_TIMEOUT', 3600 * 8);

define('REQUIRE_EMAIL_VERIFICATION', false);
