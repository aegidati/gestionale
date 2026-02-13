#!/bin/bash
set -e

mkdir -p /home/data

python manage.py migrate --noinput

gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 2
