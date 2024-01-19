#!/bin/bash
set -e

# Nombres de los contenedores de desarrollo y producción
DEV_CONTAINER=odoo_dev
PROD_CONTAINER=odoo_prod

# Rutas de los directorios de datos en los contenedores
DATA_DIR=/var/lib/odoo

# Crea un archivo comprimido a partir de los datos en el volumen de desarrollo
echo "Creando un archivo comprimido de los datos en el volumen de desarrollo..."
docker exec -t $DEV_CONTAINER tar czf /tmp/data.tar.gz -C $DATA_DIR .

# Copia el archivo comprimido desde el contenedor de desarrollo al host
echo "Copiando el archivo comprimido al host..."
docker cp $DEV_CONTAINER:/tmp/data.tar.gz ./data.tar.gz

# Copia el archivo comprimido desde el host al contenedor de producción
echo "Copiando el archivo comprimido al contenedor de producción..."
docker cp ./data.tar.gz $PROD_CONTAINER:/tmp/data.tar.gz

# Restaura los datos en el volumen de producción a partir del archivo comprimido
echo "Restaurando los datos en el volumen de producción..."
docker exec -t $PROD_CONTAINER tar xzf /tmp/data.tar.gz -C $DATA_DIR --overwrite

# Limpia los archivos temporales
echo "Limpiando archivos temporales..."
docker exec -u 0 -t $DEV_CONTAINER chmod 777 /tmp/data.tar.gz || true
docker exec -u 0 -t $DEV_CONTAINER rm -f /tmp/data.tar.gz || true
docker exec -u 0 -t $PROD_CONTAINER chmod 777 /tmp/data.tar.gz || true
docker exec -u 0 -t $PROD_CONTAINER rm -f /tmp/data.tar.gz || true
rm -f ./data.tar.gz

echo "Sincronización completada."



