
{
    'name': 'Hide Powered By Odoo',
    'version': '17.0',
    'category': '',
    'author': 'Doyenhub Software Solutions',
    'sequence': -200,
    'summary': """ Hide Powered By Odoo login screen, 
            This module modifies the functionality of emails to remove the Odoo branding.
            With this module it is possible to hide the two promotional link in the Portal purchase invoice view.            
            Hide Powered By Odoo On Settings.""",
        
    'description': """
                Hide Powered By Odoo login screen, 
            This module modifies the functionality of emails to remove the Odoo branding.
            With this module it is possible to hide the two promotional link in the Portal purchase invoice view.            
            Hide Powered By Odoo On Settings.
                    """,
    'depends': ['web','portal','auth_signup','mail','base_setup', 'base','sale'],
    'data': [
         'views/login_templates.xml',
           
    ],
    'images': [
        'static/description/screen.png'
    ],
    'demo': [],
    'application': True,
    'installable': True,
    'auto_install': False,
    'assets': {},
    'license': 'LGPL-3',
}
