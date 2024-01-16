odoo.define('pos_widget_override.override', function (require) {
    'use strict';
    const useState = owl.hooks;
    const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
    const Registries = require('point_of_sale.Registries');
    const useAutoFocusToLast = require('point_of_sale.custom_hooks');
    const Orderline = require('point_of_sale.Orderline');
    var core = require('web.core');
    var _t = core._t;
      const WidgetsOverride = (Orderline) =>
          class extends Orderline {
            spaceClickProduct(event) {
                if (event.which === 32) {
                    this._onClickProductWrapper(this.props.product);
                } else {
                    super.spaceClickProduct(event);
                }
            }
              selectLine()  {
                  var self = this;
                  const line = this.props.line;
                  const { confirmed } =  this.showPopup('ConfirmPopup', {
                           title: this.env._t(line.product.display_name),
                           body: _.str.sprintf(this.env._t('Price : %s - invoice_policy : %s'), line.product.lst_price,
                           line.product.invoice_policy),
                   });
              }
       };
      Registries.Component.extend(Orderline, WidgetsOverride);
     return Orderline;
    });



































  

