import re
from lxml import etree, html
from odoo import api, models

class MailRenderMixin(models.AbstractModel):
    _inherit = "mail.render.mixin"

    def remove_href_odoo(
        self, value, remove_parent=True, remove_before=False, to_keep=None
    ):
        if len(value) < 20:
            return value
        # value can be bytes type; ensure we get a proper string
        if type(value) is bytes:
            value = value.decode()
        has_odoo_link = re.search(r"<a\s(.*)odoo\.com", value, flags=re.IGNORECASE)
        if has_odoo_link:
            # We don't want to change what was explicitly added in the message body,
            # so we will only change what is before and after it.
            if to_keep:
                value = value.replace(to_keep, "<body_msg></body_msg>")
            tree = html.fromstring(value)
            odoo_anchors = tree.xpath('//a[contains(@href,"odoo.com")]')
            for elem in odoo_anchors:
                parent = elem.getparent()
                previous = elem.getprevious()
                if remove_before and not remove_parent and previous is not None:
                    # remove 'using' that is before <a and after </span>
                    previous.tail = ""
                if remove_parent and len(parent.getparent()):
                    # anchor <a href odoo has a parent powered by that must be removed
                    parent.getparent().remove(parent)
                else:
                    if parent.tag == "td":  # also here can be powered by
                        parent.getparent().remove(parent)
                    else:
                        parent.remove(elem)
            value = etree.tostring(
                tree, pretty_print=True, method="html", encoding="unicode"
            )
            if to_keep:
                value = value.replace("<body_msg></body_msg>", to_keep)
        return value

    @api.model
    def _render_template(
        self,
        template_src,
        model,
        res_ids,
        engine="inline_template",
        add_context=None,
        options=None,
        post_process=False,
    ):
       
        orginal_rendered = super()._render_template(
            template_src,
            model,
            res_ids,
            engine=engine,
            add_context=add_context,
            post_process=post_process,
        )

        for key in res_ids:
            orginal_rendered[key] = self.remove_href_odoo(orginal_rendered[key])

        return orginal_rendered

    def _replace_local_links(self, html, base_url=None):
        message = super()._replace_local_links(html)
        message = re.sub(
            r"""(Powered by\s(.*)Odoo</a>)""", "<div>&nbsp;</div>", message
        )
        return message
