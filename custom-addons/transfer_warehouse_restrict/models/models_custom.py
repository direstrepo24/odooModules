from odoo import fields,api,_, models

class StockPicking(models.Model):
    _inherit = "stock.picking"

    @api.onchange('location_id')
    def _check_user_warehouse(self):
        if self.env.user.restrict_warehouse_transfer and self.location_id:
            user_warehouse_locations = self.env['stock.location'].search([
                ('id', 'child_of', self.env.user.warehouse_id.view_location_id.id)
            ])
            if self.location_id not in user_warehouse_locations:
                self.location_id = False
                return {
                    'warning': {
                        'title': _("Localización invalida"),
                        'message': _("Usted solo puede hacer transferencias desde su sucursal asignada, seleccione 'nombreSucursal/Existencias'."),
                    },
                }

class ResUsers(models.Model):
    _inherit = 'res.users'

    restrict_warehouse_transfer = fields.Boolean(string='Solo transferir desde mi Sucursal', default=False)
