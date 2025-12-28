# Временный README для SSL сертификатов
# Для продакшена поместите сюда ваши SSL сертификаты:
# - cert.pem (публичный сертификат)
# - key.pem (приватный ключ)

# Для тестирования можно сгенерировать self-signed сертификат:
# openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
#   -keyout key.pem -out cert.pem \
#   -subj "/C=RU/ST=Moscow/L=Moscow/O=911/CN=localhost"

