# =========================
# Node build stage
# =========================
FROM node:22-alpine AS node_builder

WORKDIR /var/www/html

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# =========================
# PHP + Nginx stage
# =========================
FROM php:8.4-fpm-bookworm

WORKDIR /var/www/html

# System packages
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    curl \
    nginx \
    libzip-dev \
    libpq-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libicu-dev \
    libonig-dev \
    libxml2-dev \
    default-mysql-client \
    && rm -rf /var/lib/apt/lists/*


# PHP Extensions
RUN docker-php-ext-configure gd \
    --with-freetype \
    --with-jpeg

RUN docker-php-ext-install \
    pdo_mysql \
    mysqli \
    pdo_pgsql \
    pgsql \
    zip \
    intl \
    gd \
    bcmath \
    exif \
    opcache


# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer


# Copy application
COPY . .


# Install PHP dependencies
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --prefer-dist


# Copy built frontend assets
COPY --from=node_builder /var/www/html/public/build ./public/build


# Nginx config
COPY docker/nginx/render.conf /etc/nginx/sites-available/default


# Startup script
COPY docker/start.sh /usr/local/bin/start.sh

RUN chmod +x /usr/local/bin/start.sh


# Laravel permissions
RUN mkdir -p storage/framework/views \
    storage/framework/cache \
    storage/framework/sessions \
    bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache


CMD ["/usr/local/bin/start.sh"]