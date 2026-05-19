FROM php:8.0-apache

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install \
    pdo_mysql \
    mysqli \
    mbstring \
    xml \
    zip \
    bcmath

RUN a2enmod rewrite

RUN echo "memory_limit = 256M" >> /usr/local/etc/php/conf.d/custom.ini
RUN echo "upload_max_filesize = 64M" >> /usr/local/etc/php/conf.d/custom.ini
RUN echo "post_max_size = 64M" >> /usr/local/etc/php/conf.d/custom.ini
RUN echo "max_execution_time = 300" >> /usr/local/etc/php/conf.d/custom.ini

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

COPY . /var/www/html/

# CAMBIAR DOCUMENT ROOT A FRONTEND
RUN sed -i 's!/var/www/html!/var/www/html/frontend!g' /etc/apache2/sites-available/000-default.conf
RUN sed -i 's!/var/www/html!/var/www/html/frontend!g' /etc/apache2/apache2.conf

RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]