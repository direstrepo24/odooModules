from odoo import fields,api,_, models

class StockPicking(models.Model):
    _inherit = "stock.picking"

    @api.onchange('location_id')
    def _onchange_location_id(self):
        for record in self:
            if self.env.user.restrict_warehouse_transfer and record.location_id:
                user_warehouse_locations = self.env['stock.location'].search([
                    ('id', 'child_of', self.env.user.warehouse_id.view_location_id.id)
                ])
                if record.location_id not in user_warehouse_locations:
                    record.location_id = False
                    return {
                        'warning': {
                            'title': _("Localización invalida"),
                            'message': _("Usted solo puede hacer transferencias desde su sucursal asignada, seleccione 'nombreSucursal/Existencias'."),
                        },
                    }


class ResUsers(models.Model):
    _inherit = 'res.users'

    restrict_warehouse_transfer = fields.Boolean(string='Solo transferir desde mi Sucursal', default=False)

    @api.model
    def _compute_user_has_restrict_warehouse_transfer(self):
        return self.restrict_warehouse_transfer

    user_has_restrict_warehouse_transfer = fields.Boolean(compute='_compute_user_has_restrict_warehouse_transfer')
