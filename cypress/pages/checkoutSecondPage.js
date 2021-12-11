import inventory from "./inventory";
import checkout from "./checkout";

const checkTwo = {
    burgerMenu: inventory.burgerMenu,
    logo: inventory.logo,
    header: inventory.header,
    cart: inventory.cart,
    title: inventory.title,
    footerRobot: inventory.footerRobot,
    footer: inventory.footer,
    twitterLink: inventory.twitterLink,
    linkedinLink: inventory.linkedinLink,
    facebookLink: inventory.facebookLink,
    itemDescription: inventory.itemDescription,
    itemLabel: inventory.itemLabel,
    priceTag: inventory.priceTag,
    cancelBtn: checkout.cancelBtn,
    summaryLabel: '.summary_info_label',
    summaryValue: '.summary_value_label',
    subtotal: '.summary_subtotal_label',
    tax: '.summary_tax_label',
    total: '.summary_total_label',
    finishBtn: '#finish',
}

export default {...checkTwo}