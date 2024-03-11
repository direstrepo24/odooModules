# Copyright 2018 Stanislav Krotov <https://it-projects.info/team/ufaks>
# Copyright 2019 Eugene Molotov <https://it-projects.info/team/molotov>
# Copyright 2019 Ivan Yelizariev <https://it-projects.info/team/yelizariev>
# License MIT (https://opensource.org/licenses/MIT).
{
    "name": "S3 backing up 2",
    "summary": "Yet another backup tool, but with sexy graphs 2",
    "category": "Backup",
    "images": ["images/odoo-backup.sh.jpg"],
    "version": "14.0.1.0.2",
    "author": "IT-Projects LLC",
    "support": "apps@itpp.dev",
    "website": "https://apps.odoo.com/apps/modules/14.0/odoo_backup_sh/",
    "license": "Other OSI approved licence",  # MIT
    "depends": ["iap", "mail", "web"],
    "external_dependencies": {
        "python": ["boto3", "botocore", "pretty_bad_protocol"],
        "bin": [],
    },
    "data": [
        "security/security_groups.xml",
        "security/security.xml",
        "security/ir.model.access.csv",
        "views/odoo_backup_sh_views.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "odoo_backup_sh/static/lib/fontawesome/css/brands.css",
            "odoo_backup_sh/static/lib/fontawesome/css/extract.css",
            "odoo_backup_sh/static/src/scss/dashboard.scss",
            "odoo_backup_sh/static/src/js/dashboard.js",
            "odoo_backup_sh/static/src/xml/dashboard.xml"
        ],
    },
    "qweb": ["static/src/xml/dashboard.xml"],
    "demo": ["demo/tour_views.xml", "demo/demo.xml"],
    "post_load": None,
    "pre_init_hook": None,
    "post_init_hook": None,
    "auto_install": False,
    "installable": True,
    "application": True,
    "uninstall_hook": "uninstall_hook",
}

