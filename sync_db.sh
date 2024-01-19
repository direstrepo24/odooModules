#!/bin/bash
# Carga las variables de entorno
source .env

# Configuración de la base de datos de desarrollo
DEV_DB_HOST=db #172.24.0.2
DEV_DB_PORT=5432
DEV_DB_NAME=${POSTGRES_DB_DEV}
DEV_DB_USER=${POSTGRES_USER_DEV}

# Configuración de la base de datos de producción
PROD_DB_HOST=db-prod #172.24.0.4
PROD_DB_PORT=5432
PROD_DB_NAME=${POSTGRES_DB_PROD}
PROD_DB_USER=${POSTGRES_USER_PROD}

# Establece las contraseñas de las bases de datos como variables de entorno
export PGPASSWORD=${POSTGRES_PASSWORD_DEV}

echo "Iniciando el volcado de la base de datos de desarrollo..."

# Crea un volcado de la base de datos de desarrollo
pg_dump -h ${DEV_DB_HOST} -p ${DEV_DB_PORT} -U ${DEV_DB_USER} -w -F t -b -v -f /tmp/dev_db_dump.tar ${DEV_DB_NAME}

echo "Volcado de la base de datos de desarrollo completado."

echo "Iniciando la restauración en la base de datos de producción..."

# Cambia la contraseña para la base de datos de producción
export PGPASSWORD=${POSTGRES_PASSWORD_PROD}

# Restaura el volcado en la base de datos de producción
pg_restore -h ${PROD_DB_HOST} -p ${PROD_DB_PORT} -U ${PROD_DB_USER} -w -d ${PROD_DB_NAME} -v -O -F t -C -c /tmp/dev_db_dump.tar

echo "Restauración en la base de datos de producción completada."

# Limpia el archivo de volcado
rm /tmp/dev_db_dump.tar

# Elimina las variables de entorno de las contraseñas
unset PGPASSWORD





