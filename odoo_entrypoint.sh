#!/bin/bash

set -e


# Asegúrate de que las variables de entorno estén configuradas
if [ -z "$PGHOST" ]; then
    export PGHOST=db
fi

if [ -z "$PGUSER" ]; then
    export PGUSER=${POSTGRES_USER_DEV}
fi

if [ -z "$PGPASSWORD" ]; then
    export PGPASSWORD=${POSTGRES_PASSWORD_DEV}
fi


# Comprueba si la base de datos está inicializada
#DB_INITIALIZED=$(psql -h $PGHOST -p $PGPORT -U $PGUSER -W $PGPASSWORD -lqt | cut -d \| -f 1 | grep -wq $PGDATABASE && echo "yes" || echo "no")
#DB_INITIALIZED=$(psql -h $PGHOST -p $PGPORT -U $PGUSER -W $PGPASSWORD -lqt | cut -d \| -f 1 | grep -wq $PGDATABASE && echo "yes" || echo "no")
DB_INITIALIZED=$(psql -h $PGHOST -p $PGPORT -U $PGUSER -lqt | grep -qw $PGDATABASE && echo "yes" || echo "no")

# Si la base de datos no está inicializada, fuerza la inicialización con `-i base`
if [ "$DB_INITIALIZED" == "no" ]; then
    exec "$@" -i base
else
    exec odoo --config=/etc/odoo/odoo.conf --xmlrpc-port=${ODOO_PORT_DEV}
fi




