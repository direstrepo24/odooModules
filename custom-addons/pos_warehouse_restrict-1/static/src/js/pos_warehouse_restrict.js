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
                
                const dest_warehouse = await this.rpc({
                    model: 'stock.warehouse',
                    method: 'search_read',
                    args: [[['id', '=', warehouse_id]], ['lot_stock_id']],
                });
                
                const dest_location_id = dest_warehouse[0].lot_stock_id[0];
                console.log("Destino yo", dest_location_id);

            
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
                    return { allowed: true, stock: userWarehouse.quantity, other_warehouses: otherWarehouses, dest_location_id:dest_location_id };
                } else {
                    return { allowed: false, stock: 0, other_warehouses: otherWarehouses, dest_location_id:dest_location_id };
                }
            }

            async create_transfer(product, source_location_id, dest_location_id, warehouse) {
               // const dest_location_id = this.env.pos.config.current_user_warehouse_id[0];
                console.log("ubicacion del producto", source_location_id)
                 console.log("Destino yo en trnasfer", dest_location_id);
                    try {
            // buscar el picking_type_id para la transferencia interna correspondiente al almacén del usuario
                const picking_type_id = await this.rpc({
                    model: 'stock.picking.type',
                    method: 'search',
                    args: [[['warehouse_id', '=', source_location_id], ['name', '=', 'Transferencias Internas']]],
                });
            
               let pickingTypeIdToUse;
                if (!picking_type_id.length) {
                    // no se encontró un tipo de picking para transferencias internas en este almacén
                    // usar el picking_type_id por defecto
                    console.log('No se encontró un tipo de picking para transferencias internas en este almacén. Usando el tipo de picking por defecto.');
                    pickingTypeIdToUse = 12;  // el ID del tipo de picking por defecto
                } else {
                    pickingTypeIdToUse = picking_type_id[0];  // usar el picking_type_id que encontramos
                }
                // crear la transferencia en estado borrador
                const picking_id = await this.rpc({
                    model: 'stock.picking',
                    method: 'create',
                    args: [{
                        location_id: source_location_id,
                        location_dest_id: dest_location_id,
                        picking_type_id: pickingTypeIdToUse,  // usar el picking_type_id que encontramos,
                        state: 'draft', // estado borrador
                    }],
                });
            
                console.log('Picking created: ', picking_id);
            
                // crear las líneas de movimiento
                await this.rpc({
                    model: 'stock.move',
                    method: 'create',
                    args: [{
                        name: product.display_name,
                        product_id: product.id,
                        product_uom_qty: 1,
                        product_uom: product.uom_id[0],
                        location_id: source_location_id,
                        location_dest_id: dest_location_id,
                        picking_id: picking_id,
                    }],
                });
                
                // Enviar un mensaje al canal #general channel
                
                // Enviar un mensaje al canal #general channel
                const message = `Solicitud de transferencia de producto: ${product.display_name} desde ${warehouse}.`;
                await this.notify_general_channel(message);
                    } catch (error) {
                console.error('Ocurrió un error al crear la transferencia:', error);
        
                // Mostrar un mensaje de error al usuario
                Gui.showPopup("ErrorPopup", {
                    title: this.env._t('Error al crear la transferencia'),
                    body: this.env._t('Ocurrió un error al crear la transferencia. Por favor, intenta de nuevo más tarde.'),
                    });
                }
            
            }
            
     async notify_general_channel(message) {
        // Buscar el canal #general channel
        const channel_id = await this.rpc({
            model: 'mail.channel',
            method: 'search',
            args: [[['name', '=', 'general']]],
        });
    
        // Si el canal no existe, mostrar un error y salir
        if (!channel_id.length) {
            console.error('No se encontró el canal #general channel. No se envió el mensaje.');
            return;
        }
    
        // Publicar el mensaje en el canal
        await this.rpc({
            model: 'mail.message',
            method: 'create',
            args: [{
                body: message,
                model: 'mail.channel',
                res_id: channel_id[0],
            }],
        }); 
        
      
        
    }

    async notify_warehouse_users(warehouse_id, message) {
    // Buscar los usuarios que están asignados al almacén
    const user_ids = await this.rpc({
        model: 'res.users',
        method: 'search',
        args: [[['warehouse_id', '=', warehouse_id]]],
    });

    // Si no hay usuarios, mostrar un error y salir
    if (!user_ids.length) {
        console.error('No hay usuarios asignados a este almacén. No se envió el mensaje.');
        return;
    }

        // Crear una notificación de correo para cada usuario
        for (let i = 0; i < user_ids.length; i++) {
            await this.rpc({
                model: 'mail.notification',
                method: 'create',
                args: [{
                    body: message,
                    res_partner_id: user_ids[i],
                    notification_type: 'inbox',
                }],
            });
        }
}



            async _clickProduct(event) {
                const product = event.detail;

                const { allowed, stock,other_warehouses, dest_location_id } = await this.is_product_allowed(product);

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
                        const warehouseOptions = other_warehouses.map((warehouse, index) => {
                            return {
                                id: warehouse.location_id,
                                label: `${warehouse.warehouse_name} (${warehouse.quantity})`,
                                isSelected: index === 0,
                                item: warehouse,
                            };
                        });
                
                        console.log('Warehouse options:', warehouseOptions);
                                        
                        const { confirmed, payload } = await this.showPopup('SelectionPopup', {
                            title: this.env._t('En otra ubicación'),
                            body: this.env._t('Producto está en otro almacén, elija el almacén de donde desea solicitarlo:'),
                            list: warehouseOptions,
                        });
                
                        if (confirmed) {
                            console.log("payload",payload)
                            console.log("location_id",payload.location_id)
                            const source_location_id = payload.location_id;
                            const warehouse=payload.warehouse_name
                              console.log("nombre de quien solicita",warehouse)
                              
                            
                            // Crear la transferencia aquí con source_location_id y user_location_id
                            this.create_transfer(product, source_location_id, dest_location_id,warehouse);
                                                 
                            Gui.showPopup("ConfirmPopup", {
                                title: this.env._t('Solicitud pendiente'),
                                body: this.env._t('Se envió correctamente la solicitud, la sucursal que tiene el producto debe aprobar'),
                            });
                        }
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

























