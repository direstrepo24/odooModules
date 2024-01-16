odoo.define('pos_warehouse_restrict.CustomWarehousePopup', function (require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');
    const { useState, useRef } = owl;

    class CustomWarehousePopup extends PosComponent {
        constructor() {
            super(...arguments);
            //this.warehouseSelectRef = useRef('warehouseSelect');
            this.state = useState({
                selectedId: this.props.list && this.props.list.length > 0 ? this.props.list[0].id : null
            });
            
            
        }

        selectWarehouse(event) {
            this.state.selectedId = parseInt(event.target.value);
        }

        getPayload() {
            const selected = this.props.list.find((item) => this.state.selectedId === item.id);
            return selected && selected.item;
        }

        confirm() {

              console.log('Confirm button pressed, closing popup with:', this.getPayload());
            this.props.resolve({ confirmed: true, payload: this.getPayload() });
             this.trigger('close-popup');
     
 
        }

        cancel() {
      
            
            console.log('Cancel button pressed, closing popup');
            
            this.trigger('close-popup');
           
        }
    }

    CustomWarehousePopup.template = 'CustomWarehousePopup';
    Registries.Component.add(CustomWarehousePopup);

    return CustomWarehousePopup;
});




