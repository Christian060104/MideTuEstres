# MideTuEstres - Instituto Tecnológico de Tehuacán

Aplicación web para medir, registrar y dar seguimiento al estrés académico de los estudiantes del Instituto Tecnológico de Tehuacán.

## Problemática

El estrés académico provocado por sobrecarga de tareas, exámenes y presión por rendimiento escolar es un problema significativo en el Instituto Tecnológico de Tehuacán. Actualmente no existe una aplicación web institucional que permita medir, registrar y dar seguimiento al estrés emocional de los estudiantes.

## Solución

MideTuEstres es una aplicación web que permite a los estudiantes:
- Registrarse con correo institucional
- Medir su nivel de estrés mediante cuestionarios validados
- Hacer seguimiento histórico de sus mediciones
- Acceder a recursos educativos y videos motivacionales

## Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Diseño responsive y moderno
- **JavaScript ES6+**: Lógica de la aplicación
- **Font Awesome**: Iconos
- **Google Fonts**: Tipografía (Roboto)

### Backend (Planificado)
- **PHP**: Lógica del servidor
- **MySQL**: Base de datos relacional
- **Docker**: Contenerización del backend

## Características Principales

### 1. Sistema de Registro
- Validación de correo institucional (@tehuacan.tecnm.mx)
- Formulario completo con datos académicos
- Almacenamiento local (temporal hasta implementar backend)

### 2. Medición de Estrés
- Cuestionario de 5 preguntas validado
- Sistema de puntuación (1-4 puntos por pregunta)
- Clasificación en tres niveles:
  - **Bajo** (5-8 puntos)
  - **Moderado** (9-14 puntos)
  - **Alto** (15-20 puntos)

### 3. Seguimiento y Estadísticas
- Historial completo de mediciones
- Gráficos de progreso
- Estadísticas personales (promedio, mejora, etc.)

### 4. Recursos Educativos
- Videos de técnicas de relajación
- Guías de gestión del tiempo
- Contenido motivacional
- Recomendaciones personalizadas según nivel de estrés

## Estructura del Proyecto

```
MideTuEstres/
|-- index.html          # Página principal
|-- styles.css          # Estilos CSS
|-- script.js           # Lógica JavaScript
|-- README.md           # Documentación
|-- backend/            # (Planificado)
|   |-- php/
|   |-- sql/
|   |-- docker/
```

## Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para recursos externos)

### Pasos para usar la aplicación:

1. **Clonar o descargar el proyecto**
   ```bash
   git clone <repository-url>
   cd MideTuEstres
   ```

2. **Abrir la aplicación**
   - Abre `index.html` en tu navegador web
   - O usa un servidor local para mejor experiencia:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (con http-server)
     npx http-server
     ```

3. **Registrarse**
   - Haz clic en "Registrarse"
   - Completa el formulario con tus datos
   - Usa tu correo institucional (@tehuacan.tecnm.mx)

4. **Medir tu estrés**
   - Inicia sesión
   - Ve a la sección "Medición"
   - Responde el cuestionario sinceramente
   - Revisa tus resultados y recomendaciones

5. **Seguimiento**
   - Revisa tu historial en "Seguimiento"
   - Observa tus tendencias y progreso

## Sistema de Puntuación

El cuestionario evalúa 5 áreas clave del estrés académico:

1. **Carga de tareas**: Percepción sobre la cantidad de trabajo académico
2. **Ansiedad ante exámenes**: Nivel de nerviosismo antes de evaluaciones
3. **Calidad del sueño**: Impacto del estrés en el descanso
4. **Vida social**: Efecto de la presión académica en relaciones sociales
5. **Capacidad de manejo**: Percepción de control sobre las responsabilidades

### Interpretación de Resultados

- **5-8 puntos (Bajo)**: Buen manejo del estrés
- **9-14 puntos (Moderado)**: Estrés manejable pero requiere atención
- **15-20 puntos (Alto)**: Estrés elevado, necesita intervención

## Almacenamiento de Datos

### Actual (Frontend)
- **LocalStorage**: Almacenamiento temporal en el navegador
- **JSON**: Formato de datos estructurados
- **Exportación**: Posibilidad de exportar datos en formato JSON

### Planificado (Backend)
- **MySQL**: Base de datos relacional segura
- **PHP**: API REST para gestión de datos
- **Docker**: Contenerización para despliegue fácil

## Funcionalidades Técnicas

### Responsive Design
- Diseño adaptativo para móviles, tablets y desktop
- Breakpoints en 768px y 480px
- Optimización táctil para dispositivos móviles

### Accesibilidad
- Etiquetas semánticas HTML5
- Navegación por teclado
- Contraste de colores adecuado
- Estructura clara para lectores de pantalla

### Seguridad
- Validación de correos institucionales
- Almacenamiento seguro de contraseñas (planificado)
- Protección contra XSS básica
- Validación de datos del lado del cliente

## Desarrollo Futuro

### Backend Integration
```php
// Ejemplo de API planificada
POST /api/auth/login
POST /api/auth/register
GET /api/measurements
POST /api/measurements
GET /api/user/stats
```

### Base de Datos MySQL
```sql
-- Estructura planificada
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    matricula VARCHAR(20) UNIQUE,
    carrera VARCHAR(50),
    semestre INT,
    password_hash VARCHAR(255),
    created_at TIMESTAMP
);

CREATE TABLE measurements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    score INT,
    answers JSON,
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Docker Configuration
```dockerfile
# Ejemplo de configuración planificada
FROM php:8.0-apache
COPY . /var/www/html/
EXPOSE 80
```

## Contribución

Para contribuir al proyecto:

1. Fork del repositorio
2. Crear rama de características (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

Este proyecto es propiedad del Instituto Tecnológico de Tehuacán.

## Contacto

- **Departamento de Bienestar Estudiantil**
- **Correo**: contacto@tehuacan.tecnm.mx
- **Ubicación**: Instituto Tecnológico de Tehuacán

---

**Nota**: Esta es la versión frontend del proyecto. La integración con backend PHP y MySQL está en desarrollo.
