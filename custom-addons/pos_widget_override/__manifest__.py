{
    'name': 'mi pos_widget_override',
    'version': '17.0',
    'category': 'Point of Sale 2',
    'summary': 'Personalización del Punto de Venta order Line',
    'depends': ['base', 'point_of_sale', 'web'],
    'data': [
    ],
    'assets': {
        'point_of_sale.assets': [
          ('prepend', 'pos_widget_override/static/src/js/override.js'), 
  
        ],
    },
    'installable': True,
    'application': True,
}


