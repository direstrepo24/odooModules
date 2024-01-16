from odoo import fields, models

class PosConfig(models.Model):
    _inherit = "pos.config"

    restrict_to_assigned_warehouse = fields.Boolean(
        string="Restrict to Assigned Warehouse",
        help="If enabled, users can only sell products from their assigned warehouse.",
    )
    current_user_warehouse_id = fields.Many2one(
        "stock.warehouse",
        string="Current User Warehouse",
        compute="_compute_current_user_warehouse_id",
        store=False,
    )

    def _compute_current_user_warehouse_id(self):
        for record in self:
            record.current_user_warehouse_id = self.env.user.warehouse_id
    

class ResUsers(models.Model):
    _inherit = "res.users"

    warehouse_id = fields.Many2one("stock.warehouse", string="Assigned Warehouse", required=False)
