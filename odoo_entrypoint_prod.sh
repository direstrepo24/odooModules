#!/bin/bash

set -e

# Define el valor predeterminado para la variable PGHOST si no está establecido
if [ -z "$PGHOST" ]; then
    export PGHOST=db-prod
fi

# Sincroniza los datos de Odoo desde el entorno de desarrollo al entorno de producción
#./sync_data.sh

# Sincroniza la base de datos desde el entorno de desarrollo al entorno de producción
#./sync_db.sh

# Comprueba si la base de datos está inicializada
DB_INITIALIZED=$(psql -h $PGHOST -p $PGPORT -U $PGUSER -W $PGPASSWORD -lqt | cut -d \| -f 1 | grep -wq $PGDATABASE && echo "yes" || echo "no")

# Si la base de datos no está inicializada, fuerza la inicialización con `-i base`
if [ "$DB_INITIALIZED" == "no" ]; then
    exec "$@" -i base
else
    exec odoo --config=/etc/odoo/odoo.conf --xmlrpc-port=${ODOO_PORT_PROD}
fi
