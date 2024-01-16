odoo.define('mi_modulo_pos.pos_ext', function(require) {
    'use strict';

    const { Gui } = require('point_of_sale.Gui');
    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const { useListener } = require("@web/core/utils/hooks");
    const Registries = require('point_of_sale.Registries');
    
    const models = require('point_of_sale.models');

 

    class MiBotonPersonalizado extends PosComponent {
        setup() {
            super.setup();
            useListener('click', this.onClick);
        }
        async onClick() {
            console.log('Botón personalizado presionado');
           
            const currentUser = this.env.pos.user;
            const warehouseId = this.env.pos.config.current_user_warehouse_id[0];
            console.log('currentUser');
            console.log(currentUser);
            console.log(warehouseId);
            const producwarehouseid= product.warehouse_id[0];
            console.log('producwarehouseid',producwarehouseid);
            const routeid=   models.Product.fields.push(['route_ids']);
            const stocklocation=models.User.fields.push(['stock_location_ids']);    

            console.log("routeid",routeid);
            console.log("stocklocation",stocklocation);
            const { confirmed} = await
                this.showPopup("ConfirmPopup", {
                      title: this.env._t('Title of the Popup?'),
                      body: this.env._t('Body of the popup'),
                  });
        }
    }
    MiBotonPersonalizado.template = 'mi_modulo_pos.MiBotonPersonalizado';

    ProductScreen.addControlButton({
        component: MiBotonPersonalizado,
        condition: function() {
            return this.env.pos;
        },
    });

    Registries.Component.add(MiBotonPersonalizado);

    return MiBotonPersonalizado;
});



































  

