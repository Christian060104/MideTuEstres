# Backend - MideTuEstres

Backend en PHP con MySQL para la aplicación MideTuEstres del Instituto Tecnológico de Tehuacán.

## 🏗️ Arquitectura

### **Base de Datos (MySQL)**
- **Usuarios**: Gestión de estudiantes con autenticación segura
- **Mediciones**: Registro y seguimiento de niveles de estrés
- **Estadísticas**: Cálculo automático de progreso
- **Recursos**: Material educativo y videos motivacionales
- **Sesiones**: Manejo seguro de sesiones de usuario
- **Logs**: Auditoría de actividades

### **API REST (PHP)**
- **Autenticación**: Registro, login, logout, cambio de contraseña
- **Mediciones**: CRUD de mediciones de estrés
- **Estadísticas**: Generación de reportes y progreso
- **Recomendaciones**: Sistema inteligente de sugerencias

## 🚀 Instalación con Docker

### **Requisitos**
- Docker y Docker Compose instalados
- Puerto 8080 disponible (Apache)
- Puerto 3306 disponible (MySQL)
- Puerto 8081 disponible (phpMyAdmin - opcional)

### **Pasos de Instalación**

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd MideTuEstres/backend
   ```

2. **Iniciar los contenedores**
   ```bash
   docker-compose up -d
   ```

3. **Esperar a que los servicios estén listos**
   - Apache: http://localhost:8080
   - phpMyAdmin: http://localhost:8081
   - MySQL: localhost:3306

4. **Verificar la base de datos**
   - Accede a phpMyAdmin: http://localhost:8081
   - Usuario: root, Contraseña: rootpassword
   - La base de datos se crea automáticamente

## 📁 Estructura de Archivos

```
backend/
├── api/
│   ├── auth.php           # API de autenticación
│   └── measurements.php   # API de mediciones
├── config/
│   └── database.php       # Configuración de BD
├── database/
│   └── create_database.sql # Script de creación
├── docker-compose.yml      # Configuración Docker
├── Dockerfile            # Imagen Apache+PHP
└── README.md            # Este archivo
```

## 🔧 Configuración

### **Variables de Entorno**
```bash
DOCKER_ENV=true
DB_HOST=mysql
DB_USER=midetu_user
DB_PASSWORD=midetu_password
DB_NAME=midetu_estres
APP_ENV=development
JWT_SECRET=midetu_estres_jwt_secret_key_2024
```

### **Seguridad**
- **Contraseñas**: Encriptadas con bcrypt (costo 12)
- **Sesiones**: Tokens aleatorios con expiración
- **Validación**: Correos institucionales obligatorios
- **Logs**: Auditoría completa de actividades

## 📡 Endpoints de la API

### **Autenticación (`/api/auth.php`)**

#### **POST /api/auth.php?action=register**
```json
{
    "name": "Juan Pérez",
    "email": "juan.perez@tehuacan.tecnm.mx",
    "matricula": "20201234",
    "carrera": "ing-sistemas",
    "semestre": "5",
    "password": "contraseña123"
}
```

#### **POST /api/auth.php?action=login**
```json
{
    "email": "juan.perez@tehuacan.tecnm.mx",
    "password": "contraseña123"
}
```

#### **POST /api/auth.php?action=logout**
Headers: `Authorization: <token>`

#### **GET /api/auth.php?action=verify&token=<token>**

### **Mediciones (`/api/measurements.php`)**

#### **POST /api/measurements.php?action=create**
Headers: `Authorization: <token>`
```json
{
    "q1": "2",
    "q2": "3",
    "q3": "2",
    "q4": "3",
    "q5": "2"
}
```

#### **GET /api/measurements.php?action=list**
Headers: `Authorization: <token>`
Parámetros: `limit=50&offset=0`

#### **GET /api/measurements.php?action=statistics**
Headers: `Authorization: <token>`

#### **GET /api/measurements.php?action=recommendations&score=12**
Headers: `Authorization: <token>`

## 🗄️ Base de Datos

### **Tablas Principales**

#### **users**
- Almacena información de estudiantes
- Validación de correos institucionales
- Manejo de estados (active/inactive/suspended)

#### **stress_measurements**
- Registro de mediciones de estrés
- Almacenamiento de respuestas en JSON
- Cálculo automático de nivel (bajo/moderado/alto)

#### **user_statistics**
- Estadísticas calculadas automáticamente
- Promedios y tendencias
- Porcentajes de mejora

#### **resources**
- Material educativo y videos
- Categorización por tipo y dificultad
- Contador de visualizaciones

### **Procedimientos Almacenados**
- `UpdateUserStatistics`: Actualización automática de estadísticas
- Triggers para mantener consistencia de datos

## 🔒 Seguridad Implementada

### **Autenticación**
- bcrypt para contraseñas (costo 12)
- Tokens de sesión aleatorios (32 bytes)
- Expiración de sesiones (8 horas)
- Validación de dominios institucionales

### **API Security**
- CORS configurado
- Validación de entrada de datos
- Prevención de inyección SQL (prepared statements)
- Logs de auditoría

### **Datos Sensibles**
- Sin almacenamiento de contraseñas en texto plano
- Tokens de verificación de email
- Reset seguro de contraseñas

## 📊 Estadísticas y Reportes

### **Métricas Calculadas**
- Puntuación promedio por usuario
- Porcentaje de mejora
- Distribución por nivel de estrés
- Tendencias temporales

### **Vistas de Base de Datos**
- `general_statistics`: Estadísticas generales del sistema
- `stress_statistics`: Estadísticas de estrés por fecha

## 🐛 Debug y Desarrollo

### **Modo Desarrollo**
```bash
APP_ENV=development
```
- Muestra errores detallados
- Logs extensos
- Deshabilita verificación de email

### **Logs**
- Apache: `/var/log/apache2/`
- PHP: Configurado para errores en pantalla
- Aplicación: Tabla `activity_logs`

## 🚀 Despliegue en Producción

### **Cambios Recomendados**
1. **Cambiar contraseñas por defecto**
2. **Habilitar verificación de email**
3. **Configurar HTTPS**
4. **Limitar CORS a dominios específicos**
5. **Configurar backups automáticos**

### **Variables de Producción**
```bash
APP_ENV=production
REQUIRE_EMAIL_VERIFICATION=true
JWT_SECRET=<secreto_único_y_largo>
```

## 🔄 Actualización del Sistema

### **Migraciones**
- Los scripts SQL son idempotentes
- Procedimientos almacenados para actualizaciones
- Backups automáticos recomendados

### **Versionado**
- Control de versiones en base de datos
- Compatibilidad con versiones anteriores
- Rollback automático en caso de error

## 📞 Soporte

### **Contacto**
- **Departamento de Bienestar Estudiantil**
- **Email**: contacto@tehuacan.tecnm.mx
- **Issues**: GitHub del proyecto

### **Documentación Adicional**
- API REST completa
- Diagrama de base de datos
- Guía de integración con frontend

---

**Nota**: Este backend está diseñado para integrarse con el frontend existente y puede escalarse fácilmente para soportar más funcionalidades.
