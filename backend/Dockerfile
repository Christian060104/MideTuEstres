FROM php:8.0-apache

# Establecer el directorio de trabajo
WORKDIR /var/www/html


# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Instalar extensiones de PHP necesarias
RUN docker-php-ext-install \
    pdo_mysql \
    mysqli \
    mbstring \
    xml \
    zip \
    bcmath

# Habilitar mod_rewrite de Apache
RUN a2enmod rewrite
RUN a2dismod mpm_event
RUN a2dismod mpm_worker
RUN a2enmod mpm_prefork
# Configurar PHP
RUN echo "memory_limit = 256M" >> /usr/local/etc/php/conf.ini
RUN echo "upload_max_filesize = 64M" >> /usr/local/etc/php/conf.ini
RUN echo "post_max_size = 64M" >> /usr/local/etc/php/conf.ini
RUN echo "max_execution_time = 300" >> /usr/local/etc/php/conf.ini

# Configurar Apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Copiar archivos de la aplicación
COPY . /var/www/html/

# Establecer permisos
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

# Exponer puerto 80
EXPOSE 80

# Comando de inicio
CMD ["apache2-foreground"]
