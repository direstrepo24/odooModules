odoo.define('pos_warehouse_restrict.pos_warehouse_restrict', function (require) {
    'use strict';

    const { Gui } = require('point_of_sale.Gui');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const Registries = require('point_of_sale.Registries');
    const CustomWarehousePopup = require('pos_warehouse_restrict.CustomWarehousePopup');

    const WidgetsOverride = (ProductScreen) =>
        class extends ProductScreen {
            async is_product_allowed(product) {
                const warehouse_id = this.env.pos.config.current_user_warehouse_id[0];

                 const stockQuant = await this.rpc({
                    model: 'stock.quant',
                    method: 'search_read',
                    args: [[['product_id', '=', product.id], ['quantity', '>', 0]]],
                });
            
                const warehouses = stockQuant.map(quant => {
                    return {
                        warehouse_id: quant.warehouse_id[0],
                        warehouse_name: quant.warehouse_id[1],
                        location_id: quant.location_id[0],
                        quantity: quant.quantity,
                    };
                });
            
                const userWarehouse = warehouses.find(warehouse => warehouse.warehouse_id === warehouse_id);
                const otherWarehouses = warehouses.filter(warehouse => warehouse.warehouse_id !== warehouse_id);
            
                if (userWarehouse) {
                    return { allowed: true, stock: userWarehouse.quantity, other_warehouses: otherWarehouses };
                } else {
                    return { allowed: false, stock: 0, other_warehouses: otherWarehouses };
                }
            }

            async create_transfer(product, source_location_id) {
                const dest_location_id = this.env.pos.config.current_user_warehouse_id[0];
                console.log("ubicacion del producto", source_location_id)
                // crear la transferencia en estado borrador
                const picking_id = await this.rpc({
                    model: 'stock.picking',
                    method: 'create',
                    args: [{
                        location_id: source_location_id,
                        location_dest_id: dest_location_id,
                        move_lines: [{
                            name: product.display_name,
                            product_id: product.id,
                            product_uom_qty: 1,
                            product_uom: product.uom_id[0],
                        }],
                        state: 'draft', // estado borrador
                    }],
                });

                console.log('Picking created: ', picking_id);

                // mostrar un popup de confirmación
                Gui.showPopup("ConfirmPopup", {
                    title: this.env._t('Transferencia solicitada'),
                    body: this.env._t('La transferencia ha sido solicitada exitosamente.'),
                });
            }

            async _clickProduct(event) {
                const product = event.detail;

                const { allowed, stock,other_warehouses } = await this.is_product_allowed(product);

                if (allowed) {
                    if (stock > 0) {
                        await super._clickProduct(event);
                    } else {
                        console.log('Product stock is 0');
                        Gui.showPopup("ConfirmPopup", {
                            title: this.env._t('Stock agotado'),
                            body: this.env._t('Producto agotado, puede solicitarlo al admin'),
                        });
                    }
                } else {
                    console.log('Product not allowed for this warehouse');
                     
                    if (other_warehouses.length > 0) {
                        const warehouseOptionsPrueba = other_warehouses
                            .map(warehouse => `<option value="${warehouse.location_id}">${warehouse.warehouse_name} (${warehouse.quantity})</option>`)
                            .join('');
                            
 /*                       const warehouseOptions = other_warehouses.map(warehouse => {
                            return {
                                id: warehouse.location_id,
                                name: `${warehouse.warehouse_name} (${warehouse.quantity})`,
                                isSelected: false, // Este valor puede cambiar según tus necesidades.
                                item: warehouse,
                            };
                        });    */
                        const warehouseOptions = other_warehouses.map((warehouse, index) => {
                        return {
                            id: index,
                            name: `${warehouse.warehouse_name} (${warehouse.quantity})`,
                            item: warehouse,
                            isSelected: index === 0,
                        };
                    });
                        console.log('OPTIONS warehouse prueba', warehouseOptionsPrueba);
                        console.log('Optios to array 3', warehouseOptions);
                            this.showPopup('CustomWarehousePopup', {
                            title: this.env._t('En otra ubicación'),
                            body: this.env._t('Producto está en otro almacén, elija el almacén de donde desea solicitarlo:'),
                            list: warehouseOptions,
                            confirmText: this.env._t('confirm'),
                            cancelText: this.env._t('cancel'),
                        }).then(({ confirmed, payload }) => {
                             console.log('Popup closed, confirmed:', confirmed, 'payload:', payload);
                            if (confirmed) {
                                const source_location_id = payload.location_id;
                                // Crear la transferencia aquí con source_location_id y user_location_id
                               // this.create_transfer(product, source_location_id);
                                // ...
                                 const url = `/web#action=stock.action_picking_tree_all&model=stock.picking&warehouse_id=${payload.warehouse_id}`;
                                 window.open(url, '_blank');
                                 Gui.showPopup("ConfirmPopup", {
                                    title: this.env._t('Solicitud pendiente'),
                                    body: this.env._t('Realice solicitud desde su almacen al almacen que tiene el producto.',url),
                                });
                            }
                        });
                    } else {
                        Gui.showPopup("ErrorPopup", {
                            title: this.env._t('Producto no encontrado'),
                            body: this.env._t('El producto seleccionado no se encuentra en ningún almacén.'),
                        });
                    }
                   
                }
            }
        };

    Registries.Component.extend(ProductScreen, WidgetsOverride);

    return ProductScreen;
});

























