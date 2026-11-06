# PHP production image
FROM php:8.4-fpm AS php

ENV PHP_OPCACHE_ENABLE=1
ENV PHP_OPCACHE_ENABLE_CLI=1
ENV PHP_OPCACHE_VALIDATE_TIMESTAMP=1
ENV PHP_OPCACHE_REVALIDATE_FREQ=0

RUN apt-get update && apt-get install -y \
    unzip \
    libpq-dev \
    libcurl4-gnutls-dev \
    nginx \
    libonig-dev \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

RUN docker-php-ext-install mysqli pdo pdo_mysql bcmath curl opcache mbstring

RUN docker-php-ext-install pdo_pgsql pgsql

RUN pecl install redis \
    && docker-php-ext-enable redis

COPY --from=composer:2.3.5 /usr/bin/composer /usr/bin/composer

COPY ./docker/php/php.ini /usr/local/etc/php/php.ini
COPY ./docker/php/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf
COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf

WORKDIR /var/www

COPY --chown=www-data:www-data . .

RUN npm install && npm run build

RUN mkdir -p /var/www/storage/framework/cache \
    /var/www/storage/framework/testing \
    /var/www/storage/framework/sessions \
    /var/www/storage/framework/views

RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap

RUN chmod -R 755 /var/www/storage /var/www/bootstrap

RUN usermod --uid 1000 www-data \
    && groupmod --gid 1001 www-data

ENTRYPOINT ["docker/entrypoint.sh"]