FROM php:8.3-cli

WORKDIR /app


# Instalar dependencias
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Instalar extensiones PHP
RUN docker-php-ext-install \
    pdo_mysql \
    mysqli \
    mbstring \
    xml \
    zip \
    bcmath

# Copiar proyecto
COPY . .

# Exponer puerto Railway
EXPOSE 80

# Iniciar servidor PHP
CMD php -S 0.0.0.0:80 -t frontend
