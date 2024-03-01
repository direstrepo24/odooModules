{
    "name": "POS Warehouse Restrict",
    "version": "17.0",
    "category": "Custom",
    "autor":"Didier Restrepo",
    "summary": "Restrict users to sell products from their assigned warehouse",
    "depends": ["base", "stock", "sale", "point_of_sale", "web", "hr", "account", "product"],
    "data": [
        "security/pos_warehouse_restrict_security.xml",
        'security/record_rules.xml',
        "views/pos_config_views.xml",
        "views/user_view.xml"
    ],
    "application": False,
    "assets": {
        "point_of_sale.assets": [
            "pos_warehouse_restrict/static/src/js/pos_warehouse_restrict.js",
            "pos_warehouse_restrict/static/src/js/custom_popup.js",
            "pos_warehouse_restrict/static/src/xml/custom_popup.xml"
        ],
    },
     "installable": True,
     "auto_install":False,
     
}