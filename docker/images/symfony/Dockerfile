FROM php:8.1-fpm

LABEL version="2.0"
LABEL maintainer="Jean-Baptiste Theroulde"
LABEL description="Crossover News API"

# Packages recommandés pour l'exploitation de symfony
# Install extensions proposées par php-ext
RUN apt-get update \
  && apt-get install -y git \
  libzip-dev \
  unzip \
  libicu-dev \
  libfreetype6-dev \
  libjpeg62-turbo-dev \
  libpng-dev \
  curl \
  wget \
  && docker-php-ext-configure gd --with-freetype --with-jpeg \
  && docker-php-ext-install -j$(nproc) \
  zip \
  intl \
  opcache \
  gd \
  mysqli pdo pdo_mysql

# Configuration de pecl derrière un proxy si requis
RUN test -z "${http_proxy}" || pear config-set http_proxy ${http_proxy}

# Install extensions proposées par pecl (mais pas par php-ext)
# Activation extensions
RUN pecl install xdebug \
  && pecl install apcu \
  && pecl install  mongodb-1.15.0 \
  && docker-php-ext-enable \
  zip \
  intl \
  opcache \
  gd \
  mysqli pdo pdo_mysql \
  xdebug \
  apcu \
  mongodb

# Installation de composer
WORKDIR /tmp
RUN curl https://composer.github.io/installer.sig > req_checksum \
  && curl https://getcomposer.org/installer > composer-setup.php \
  && php -r "echo hash_file('sha384', 'composer-setup.php');" > act_checksum \
  && cmp req_checksum act_checksum \
  && php composer-setup.php --quiet --install-dir=/usr/local/bin --filename=composer \
  && echo "Composer installed OK" \
  && rm req_checksum act_checksum composer-setup.php

# Installation de Symfony
RUN curl -1sLf 'https://dl.cloudsmith.io/public/symfony/stable/setup.deb.sh' | bash
RUN apt install symfony-cli

# Nettoyage
RUN rm -rf /var/lib/apt/lists/*

# going back
WORKDIR /var/www/html
