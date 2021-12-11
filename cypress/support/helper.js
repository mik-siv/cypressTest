import cart from "../pages/cart";
import inventory from "../pages/inventory";

const Faker = require('faker');

const helper = {
    genRandomNumber: (min, max) => {
        return Faker.datatype.number({min: min, max: max});
    },

    genFirstName: () => {
        return Faker.name.firstName()
    },

    genLastName: () => {
        return Faker.name.lastName()
    },

    genPostIndex: () => {
        return Faker.address.zipCode()
    },

    getPriceNum: (price) => {
        return Number(price.replace('$', ''))
    },

    checkItemDetails: (name, descr, price, quantity, index) => {
        cy.get(cart.cartItem).eq(index).then(function (item) {
            cy.wrap(item).find(inventory.itemLabel).should('contain.text', name)
            cy.wrap(item).find(inventory.itemDescription).should('contain.text', descr)
            cy.wrap(item).find(inventory.priceTag).should('contain.text', price)
            cy.wrap(item).find(cart.itemQuantity).should('contain.text', quantity)
        })
    }
}

export default {...helper}