{
    "name": "PoS Product Quick Info",
    "version": "17.0",
    "summary": "Display product info by one click in Point of Sale",
    "author": "Cetmix, Odoo Community Association (OCA)",
    "category": "Point Of Sale",
    "license": "AGPL-3",
    "depends": ["point_of_sale"],
    "website": "https://github.com/OCA/pos",
    "maintainers": ["GabbasovDinar", "CetmixGitDrone"],
    "data": ["views/res_config_settings_view.xml"],
    "assets": {
        "point_of_sale.assets": [
            "pos_product_quick_info/static/src/css/pos.css",
            "pos_product_quick_info/static/src/js/Screens/ProductScreen/ProductItem.js",
            "pos_product_quick_info/static/src/xml/Screens/ProductScreen/ProductItem.xml",
        ],
    },
    "installable": True,
    "auto_install":False,
}
