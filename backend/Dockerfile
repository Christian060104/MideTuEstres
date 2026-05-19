FROM php:8.0-apache

WORKDIR /var/www/html

# Instalar dependencias
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Extensiones PHP
RUN docker-php-ext-install \
    pdo_mysql \
    mysqli \
    mbstring \
    xml \
    zip \
    bcmath

# SOLO habilitar rewrite
RUN a2enmod rewrite

# Eliminar MPM duplicados
RUN rm -f /etc/apache2/mods-enabled/mpm_event.load
RUN rm -f /etc/apache2/mods-enabled/mpm_worker.load

# Asegurar prefork
RUN ln -s /etc/apache2/mods-available/mpm_prefork.load /etc/apache2/mods-enabled/mpm_prefork.load
RUN ln -s /etc/apache2/mods-available/mpm_prefork.conf /etc/apache2/mods-enabled/mpm_prefork.conf

# Configuración PHP
RUN echo "memory_limit = 256M" >> /usr/local/etc/php/conf.ini
RUN echo "upload_max_filesize = 64M" >> /usr/local/etc/php/conf.ini
RUN echo "post_max_size = 64M" >> /usr/local/etc/php/conf.ini
RUN echo "max_execution_time = 300" >> /usr/local/etc/php/conf.ini

# Apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Copiar proyecto
COPY . /var/www/html/

# Permisos
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]