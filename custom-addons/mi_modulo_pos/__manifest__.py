{
    'name': 'Mi Modulo POS',
    'version': '1.0',
    'category': 'Point of Sale 1',
    'summary': 'Personalización del Punto de Venta',
    'depends': ['base', 'point_of_sale', 'web'],
    'data': [
    ],
    'assets': {
        'point_of_sale.assets': [
          ('prepend', 'mi_modulo_pos/static/src/js/pos_ext.js'), 
          ('prepend', 'mi_modulo_pos/static/src/css/pos_ext.css'),
          ('prepend', 'mi_modulo_pos/static/src/xml/pos_ext.xml'),
        ],
    },
    'installable': True,
    'application': True,
}


