{
    "name": "Transfers Warehouse Restrict",
    "version": "17.0",
    "category": "Custom",
    "autor":"Didier Restrepo",
    "license": "AGPL-3",
    "summary": "Restrict users to transfer products from their assigned warehouse(1)",
    "depends": ["pos_warehouse_restrict"],
    "data": [
        "security/transfer_warehouse_restrict_security.xml",
        "views/res_user_view.xml",
        'views/stock_picking_views.xml',
    ],
    "application": False,
    "assets": {
        "point_of_sale.assets": [
            #"pos_warehouse_restrict/static/src/js/pos_warehouse_restrict.js",
            #"pos_warehouse_restrict/static/src/js/custom_popup.js",
            #"pos_warehouse_restrict/static/src/xml/custom_popup.xml"
        ],
    },
     "installable": True,
     "auto_install":False,
     
}