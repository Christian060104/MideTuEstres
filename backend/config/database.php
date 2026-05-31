<?php

/**
 * Configuración de la base de datos para MideTuEstres
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

        // ===== RAILWAY =====
        if (getenv('MYSQLHOST')) {

            $this->host = getenv('MYSQLHOST');
            $this->db_name = getenv('MYSQLDATABASE');
            $this->username = getenv('MYSQLUSER');
            $this->password = getenv('MYSQLPASSWORD');
            $this->port = getenv('MYSQLPORT') ?: 3306;
        } else {

            // ===== LOCAL =====
            $this->host = 'localhost';
            $this->db_name = 'midetu_estres';
            $this->username = 'root';
            $this->password = '';
            $this->port = 3306;
        }
    }

    /**
     * Obtener conexión
     */
    public function getConnection()
    {
        $this->conn = null;

        try {

            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->db_name};charset={$this->charset}";

            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
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
     * Ejecutar consulta
     */
    public function executeQuery($sql, $params = [])
    {
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);

        return $stmt;
    }

    /**
     * Obtener múltiples registros
     */
    public function fetchAll($sql, $params = [])
    {
        return $this->executeQuery($sql, $params)->fetchAll();
    }

    /**
     * Obtener un registro
     */
    public function fetchOne($sql, $params = [])
    {
        return $this->executeQuery($sql, $params)->fetch();
    }

    /**
     * Insertar
     */
    public function insert($table, $data)
    {
        $columns = implode(', ', array_keys($data));

        $placeholders = implode(', ', array_fill(0, count($data), '?'));

        $sql = "INSERT INTO $table ($columns) VALUES ($placeholders)";

        $this->executeQuery($sql, array_values($data));

        return $this->conn->lastInsertId();
    }

    /**
     * Actualizar
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
     * Eliminar
     */
    public function delete($table, $where, $params = [])
    {
        $sql = "DELETE FROM $table WHERE $where";

        $stmt = $this->executeQuery($sql, $params);

        return $stmt->rowCount();
    }

    /**
     * Verificar existencia
     */
    public function exists($table, $where, $params = [])
    {
        $sql = "SELECT COUNT(*) as count FROM $table WHERE $where";

        $result = $this->fetchOne($sql, $params);

        return $result['count'] > 0;
    }
}

/**
 * Obtener instancia DB
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

define('PASSWORD_MIN_LENGTH', 8);

define('ALLOWED_DOMAINS', ['tehuacan.tecnm.mx']);

define('BCRYPT_COST', 12);

define('SESSION_TIMEOUT', 3600 * 8);

define('REQUIRE_EMAIL_VERIFICATION', false);
